#!/bin/bash

# Linear Design System Deployment Script
# Supports multiple deployment targets: nginx, apache, docker, vercel

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="linear-design-system"
DIST_DIR="dist"
NGINX_SITES_DIR="/etc/nginx/sites-available"
APACHE_SITES_DIR="/etc/apache2/sites-available"
WEB_ROOT="/var/www/$PROJECT_NAME"

# Functions
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

check_dependencies() {
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed"
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed"
        exit 1
    fi
}

build_application() {
    log_info "Building application for production..."
    
    if [ ! -f "package.json" ]; then
        log_error "package.json not found. Run this script from the project root."
        exit 1
    fi
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        log_info "Installing dependencies..."
        npm ci
    fi
    
    # Build the application
    npm run build
    
    if [ ! -d "$DIST_DIR" ]; then
        log_error "Build failed - $DIST_DIR directory not found"
        exit 1
    fi
    
    log_info "Build completed successfully"
}

deploy_nginx() {
    local domain=${1:-"localhost"}
    local api_server=${2:-"127.0.0.1:8080"}
    
    log_info "Deploying to Nginx..."
    log_info "Domain: $domain"
    log_info "API Server: $api_server"
    
    # Check if nginx is installed
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx is not installed"
        exit 1
    fi
    
    # Create web root directory
    sudo mkdir -p "$WEB_ROOT"
    
    # Copy built files
    log_info "Copying files to $WEB_ROOT..."
    sudo cp -r "$DIST_DIR"/* "$WEB_ROOT/"
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$WEB_ROOT"
    sudo chmod -R 755 "$WEB_ROOT"
    
    # Create nginx site configuration
    log_info "Creating Nginx configuration..."
    sudo tee "$NGINX_SITES_DIR/$PROJECT_NAME" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $domain;

    root $WEB_ROOT;
    index index.html;

    # Serve static files
    location / {
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        proxy_pass http://$api_server;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
}
EOF
    
    # Enable site
    sudo ln -sf "$NGINX_SITES_DIR/$PROJECT_NAME" "/etc/nginx/sites-enabled/"
    
    # Test nginx configuration
    if sudo nginx -t; then
        log_info "Nginx configuration is valid"
        sudo systemctl reload nginx
        log_info "Nginx reloaded successfully"
    else
        log_error "Nginx configuration is invalid"
        exit 1
    fi
    
    log_info "Deployment completed! Application available at: http://$domain"
}

deploy_apache() {
    local domain=${1:-"localhost"}
    local api_server=${2:-"127.0.0.1:8080"}
    
    log_info "Deploying to Apache..."
    log_info "Domain: $domain"
    log_info "API Server: $api_server"
    
    # Check if apache is installed
    if ! command -v apache2 &> /dev/null && ! command -v httpd &> /dev/null; then
        log_error "Apache is not installed"
        exit 1
    fi
    
    # Create web root directory
    sudo mkdir -p "$WEB_ROOT"
    
    # Copy built files
    log_info "Copying files to $WEB_ROOT..."
    sudo cp -r "$DIST_DIR"/* "$WEB_ROOT/"
    
    # Set proper permissions
    sudo chown -R www-data:www-data "$WEB_ROOT" 2>/dev/null || sudo chown -R apache:apache "$WEB_ROOT"
    sudo chmod -R 755 "$WEB_ROOT"
    
    # Create apache site configuration
    log_info "Creating Apache configuration..."
    sudo tee "$APACHE_SITES_DIR/$PROJECT_NAME.conf" > /dev/null <<EOF
<VirtualHost *:80>
    ServerName $domain
    DocumentRoot $WEB_ROOT

    <Directory "$WEB_ROOT">
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA fallback
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    # API proxy
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass /api/ http://$api_server/
    ProxyPassReverse /api/ http://$api_server/
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    
    # Cache static assets
    <LocationMatch "\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
        Header set Cache-Control "public, immutable"
    </LocationMatch>
</VirtualHost>
EOF
    
    # Enable required modules
    sudo a2enmod rewrite proxy proxy_http headers expires
    
    # Enable site
    sudo a2ensite "$PROJECT_NAME"
    
    # Test apache configuration
    if sudo apache2ctl configtest 2>/dev/null || sudo httpd -t; then
        log_info "Apache configuration is valid"
        sudo systemctl reload apache2 2>/dev/null || sudo systemctl reload httpd
        log_info "Apache reloaded successfully"
    else
        log_error "Apache configuration is invalid"
        exit 1
    fi
    
    log_info "Deployment completed! Application available at: http://$domain"
}

deploy_docker() {
    log_info "Building Docker image..."
    
    # Create Dockerfile if it doesn't exist
    if [ ! -f "Dockerfile" ]; then
        log_info "Creating Dockerfile..."
        cat > Dockerfile <<EOF
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Copy build files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
EOF
    fi
    
    # Create nginx.conf for container
    if [ ! -f "nginx.conf" ]; then
        log_info "Creating nginx.conf..."
        cat > nginx.conf <<EOF
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files \$uri \$uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://host.docker.internal:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    fi
    
    # Build Docker image
    docker build -t "$PROJECT_NAME:latest" .
    
    log_info "Docker image built successfully"
    log_info "To run the container:"
    log_info "  docker run -p 80:80 $PROJECT_NAME:latest"
}

show_help() {
    echo "Linear Design System Deployment Script"
    echo ""
    echo "Usage: $0 [TARGET] [OPTIONS]"
    echo ""
    echo "Targets:"
    echo "  nginx     Deploy to Nginx web server"
    echo "  apache    Deploy to Apache web server"
    echo "  docker    Build Docker image"
    echo "  build     Build application only"
    echo ""
    echo "Options:"
    echo "  -d, --domain DOMAIN     Domain name (default: localhost)"
    echo "  -a, --api-server HOST   API server address (default: 127.0.0.1:8080)"
    echo "  -h, --help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 build"
    echo "  $0 nginx"
    echo "  $0 nginx -d myapp.com -a 10.0.0.1:8080"
    echo "  $0 apache -d myapp.com"
    echo "  $0 docker"
}

# Parse command line arguments
TARGET=""
DOMAIN="localhost"
API_SERVER="127.0.0.1:8080"

while [[ $# -gt 0 ]]; do
    case $1 in
        nginx|apache|docker|build)
            TARGET="$1"
            shift
            ;;
        -d|--domain)
            DOMAIN="$2"
            shift 2
            ;;
        -a|--api-server)
            API_SERVER="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main execution
if [ -z "$TARGET" ]; then
    log_error "No target specified"
    show_help
    exit 1
fi

log_info "Starting deployment process..."
log_info "Target: $TARGET"

check_dependencies

case $TARGET in
    build)
        build_application
        ;;
    nginx)
        build_application
        deploy_nginx "$DOMAIN" "$API_SERVER"
        ;;
    apache)
        build_application
        deploy_apache "$DOMAIN" "$API_SERVER"
        ;;
    docker)
        deploy_docker
        ;;
    *)
        log_error "Invalid target: $TARGET"
        show_help
        exit 1
        ;;
esac

log_info "Deployment process completed successfully!"