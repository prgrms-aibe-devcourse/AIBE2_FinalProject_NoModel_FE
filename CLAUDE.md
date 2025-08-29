# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev       # Start development server on port 3000
npm run build     # Build for production to ./build directory
```

### Dependencies
```bash
npm install       # Install all dependencies
```

## Architecture

### Project Structure
This is a React + Vite application for an AI product advertisement image generation platform (NoModel AI). The application is written in TypeScript with shadcn/ui components.

### Core Components Organization

**Main Application Flow (`src/App.tsx`)**
- Multi-stage navigation system with `AppStage` type managing different views
- State management for user authentication, projects, models, and transactions
- Point-based economy system for model usage and creation

**Component Categories:**

1. **Page Components** (`src/components/`): Major views like LandingPage, LoginPage, ModelMarketplace, etc.
2. **Workflow Components** (`src/components/workflow/`): Image generation workflow stages
3. **UI Components** (`src/components/ui/`): Reusable shadcn/ui components built on Radix UI primitives

### Key Data Models

- `UserModel`: AI model definitions with metadata, pricing, and creator info
- `SelectedModel`: Selected model for image generation
- `GeneratedProject`: Generated image projects with settings and ratings
- `UserProfile`: User account with points, earnings, and subscription tier
- `PointTransaction`: Point economy transactions (earned/spent/bonus)
- `ModelReport`: Model reporting system for inappropriate content

### Styling System

The project uses CSS variables for theming defined in `src/index.css` with a comprehensive design token system including:
- Color schemes (primary, secondary, accent, destructive)
- Typography scales
- Spacing and sizing
- Border radius and shadows

### Path Aliases

The Vite config (`vite.config.ts`) defines an alias `@` → `./src` for cleaner imports.

### External Dependencies

- **UI Framework**: Radix UI components with shadcn/ui implementation
- **Forms**: react-hook-form
- **Icons**: lucide-react
- **Charts**: recharts
- **Carousel**: embla-carousel-react
- **Theme**: next-themes for dark mode support