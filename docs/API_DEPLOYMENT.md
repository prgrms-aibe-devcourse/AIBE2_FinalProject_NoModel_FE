# API Deployment Configuration

Production deployment configuration for Linear Design System with API proxy setup.

## Overview

The application is configured for seamless development-to-production deployment:

- **Development**: Direct proxy to `localhost:8080/api`
- **Production**: API proxy via reverse proxy server (Nginx/Apache/Cloudflare)

## Environment Configuration

### Development Environment

```bash
# .env.development
VITE_API_BASE_URL=/api
VITE_APP_ENV=development
VITE_API_TIMEOUT=10000
VITE_ENABLE_API_LOGGING=true
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=1000
```

**Vite Development Server:**
- Proxy `/api` requests to `http://localhost:8080`
- Hot module replacement enabled
- API request/response logging
- Error handling with detailed debugging

### Production Environment

```bash
# .env.production
VITE_API_BASE_URL=/api
VITE_APP_ENV=production
VITE_API_TIMEOUT=10000
VITE_ENABLE_API_LOGGING=false
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=2000
```

## Production Deployment Options

### Option 1: Nginx Reverse Proxy (Recommended)

```nginx
# /etc/nginx/sites-available/linear-design-system
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;

    # Serve static files
    location / {
        root /var/www/linear-design-system/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
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
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}

# HTTPS redirect
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;

    # SSL configuration
    ssl_certificate /path/to/ssl/certificate.pem;
    ssl_certificate_key /path/to/ssl/private.key;
    ssl_session_timeout 1d;
    ssl_session_cache shared:MozTLS:10m;
    ssl_session_tickets off;

    # Modern configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Include the same location blocks as above
    # ... (same configuration as HTTP version)
}
```

### Option 2: Apache Virtual Host

```apache
# /etc/apache2/sites-available/linear-design-system.conf
<VirtualHost *:80>
    ServerName yourdomain.com
    DocumentRoot /var/www/linear-design-system/dist

    # Serve static files
    <Directory "/var/www/linear-design-system/dist">
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
    ProxyPass /api/ http://127.0.0.1:8080/
    ProxyPassReverse /api/ http://127.0.0.1:8080/
    
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
```

### Option 3: Cloudflare Workers (Edge Deployment)

```javascript
// cloudflare-worker.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // API proxy
    if (url.pathname.startsWith('/api/')) {
      const apiUrl = new URL(request.url);
      apiUrl.hostname = 'your-api-server.com';
      apiUrl.port = ''; // Remove port for production API
      
      const modifiedRequest = new Request(apiUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.body,
      });
      
      return fetch(modifiedRequest);
    }
    
    // Serve static files from R2 or origin
    return fetch(request);
  },
};
```

### Option 4: Vercel Deployment

```json
// vercel.json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-api-server.com/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "SAMEORIGIN"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

## Docker Deployment

### Multi-stage Dockerfile

```dockerfile
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

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    depends_on:
      - api
    networks:
      - linear-network

  api:
    image: your-api-server:latest
    ports:
      - "8080:8080"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    networks:
      - linear-network

networks:
  linear-network:
    driver: bridge
```

## Environment Variables

### Required Variables

```bash
# Application
VITE_API_BASE_URL=/api
VITE_APP_ENV=production
VITE_APP_NAME=Linear Design System
VITE_APP_VERSION=1.0.0

# API Configuration
VITE_API_TIMEOUT=10000
VITE_ENABLE_API_LOGGING=false
VITE_API_RETRY_ATTEMPTS=3
VITE_API_RETRY_DELAY=2000

# Feature Flags
VITE_FEATURE_DEBUG=false
VITE_FEATURE_ANALYTICS=true
```

### Optional Variables

```bash
# Authentication (if needed)
VITE_AUTH_ENABLED=true
VITE_AUTH_PROVIDER=oauth2

# CDN Configuration
VITE_CDN_URL=https://cdn.yourdomain.com

# Analytics
VITE_ANALYTICS_ID=GA_MEASUREMENT_ID
```

## Build and Deployment Commands

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
        env:
          VITE_API_BASE_URL: /api
          VITE_APP_ENV: production
      
      - name: Deploy to server
        run: |
          rsync -avz --delete dist/ user@server:/var/www/linear-design-system/
          ssh user@server 'sudo systemctl reload nginx'
```

## Performance Optimizations

### Build Optimizations

1. **Bundle Splitting**: Vendor libraries separated from application code
2. **Tree Shaking**: Unused code automatically removed
3. **Asset Optimization**: Images, fonts, and CSS optimized for production
4. **Compression**: Gzip compression enabled for all text assets

### Runtime Optimizations

1. **HTTP/2**: Multiplexed connections for faster loading
2. **CDN**: Static assets served from edge locations
3. **Caching**: Aggressive caching for static assets with cache busting
4. **Lazy Loading**: Components and routes loaded on demand

## Monitoring and Logging

### Application Monitoring

```javascript
// Add to main.tsx for production monitoring
if (import.meta.env.PROD) {
  // Error reporting
  window.addEventListener('error', (event) => {
    console.error('Application Error:', event.error);
    // Send to monitoring service
  });

  // Performance monitoring
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.entryType === 'navigation') {
        console.log('Page Load Time:', entry.loadEventEnd - entry.fetchStart);
      }
    }
  }).observe({ entryTypes: ['navigation'] });
}
```

### Nginx Access Logs

```nginx
# Enhanced logging format
log_format combined_realip '$remote_addr - $remote_user [$time_local] '
                          '"$request" $status $body_bytes_sent '
                          '"$http_referer" "$http_user_agent" '
                          '$request_time $upstream_response_time';

access_log /var/log/nginx/linear-design-system.access.log combined_realip;
error_log /var/log/nginx/linear-design-system.error.log warn;
```

## Security Considerations

### Content Security Policy

```nginx
# Strict CSP for production
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self' https://api.yourdomain.com;
  frame-ancestors 'none';
  base-uri 'none';
  object-src 'none';
" always;
```

### HTTPS Configuration

1. **SSL Certificates**: Use Let's Encrypt or commercial certificates
2. **HSTS**: HTTP Strict Transport Security enabled
3. **TLS 1.2+**: Only modern TLS versions allowed
4. **Perfect Forward Secrecy**: ECDHE ciphers preferred

## Troubleshooting

### Common Issues

1. **API CORS Errors**: Ensure API server allows origin domain
2. **Static Asset 404s**: Check build output and server configuration
3. **SPA Routing**: Ensure fallback to index.html for client-side routes
4. **Environment Variables**: Verify all required variables are set

### Debug Commands

```bash
# Test API connectivity
curl -I https://yourdomain.com/api/health

# Check nginx configuration
nginx -t

# Reload nginx without downtime
nginx -s reload

# Monitor access logs
tail -f /var/log/nginx/access.log
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] SSL certificates installed
- [ ] API server accessible
- [ ] Static files built and deployed
- [ ] Reverse proxy configured
- [ ] Security headers enabled
- [ ] Monitoring and logging setup
- [ ] Error handling tested
- [ ] Performance optimization enabled
- [ ] Backup and rollback plan ready

## Summary

This configuration provides a robust, scalable deployment architecture for the Linear Design System with:

- **Development**: Seamless API proxy for localhost development
- **Production**: Flexible deployment options (Nginx, Apache, Cloudflare, Vercel)
- **Security**: Modern security headers and HTTPS configuration
- **Performance**: Optimized builds with caching and compression
- **Monitoring**: Comprehensive logging and error tracking
- **Scalability**: Container-ready with Docker and orchestration support