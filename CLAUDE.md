# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack blog application with:
- **Backend**: Kotlin, Spring Boot 4.x, Spring Security 7.x (JWT), Spring Data JPA, PostgreSQL
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query

## Project Structure

```
blog/
├── backend/          # Spring Boot Kotlin application
│   └── src/main/kotlin/cn/arorms/blog/backend/
│       ├── config/   # Security, CORS configurations
│       ├── controllers/ # REST API endpoints
│       ├── services/   # Business logic
│       ├── repositories/ # JPA repositories
│       ├── entities/   # Database entities
│       ├── dto/        # Data transfer objects
│       ├── enums/      # Application enums
│       └── exception/  # Exception handling
└── frontend/         # React TypeScript application
    └── src/
        ├── api/      # HTTP client
        ├── components/ # Reusable components
        ├── features/   # Feature pages
        └── App.tsx     # Main routing
```

## Key Architectural Patterns

**Backend**:
- JWT-based authentication using Spring Security OAuth2 Resource Server
- RESTful API with public read-only endpoints and authenticated write endpoints
- JPA entities with Kotlin data classes, lazy loading for relations
- HTTP test files in `backend/src/test/http/` using VS Code REST client format

**Frontend**:
- React Router v7 for routing with ProtectedRoute for admin authorization
- TanStack Query for server state management (5-minute stale time)
- Axios with interceptors for automatic JWT token handling
- Markdown rendering with `react-markdown` and shiki-based highlighting

## Common Commands

**Backend**:
- `./gradlew bootRun` - Start Spring Boot dev server (port 8080)
- `./gradlew test` - Run tests
- HTTP tests: Use VS Code REST client with files in `backend/src/test/http/`

**Frontend**:
- `npm run dev` - Start Vite dev server (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

## Environment Configuration

**Backend** requires these environment variables:
- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_NAME` - Database name (default: blog_db)
- `DB_USERNAME` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET_KEY` - JWT signing key
- `JWT_EXPIRATION` - Token expiration in ms (default: 86400000)

## API Endpoints

**Public**:
- `GET /api/articles`, `/api/articles/published` - List articles
- `GET /api/articles/slug/{slug}` - Get article by slug
- `GET /api/articles/category/{id}` - Articles by category
- `GET /api/tags`, `/api/categories` - List tags/categories
- `GET /api/images/{id}` - Get image

**Protected** (requires Bearer JWT):
- `POST /api/auth/login`, `/api/auth/register` - Authentication
- `GET /api/auth/me` - Get current user
- All admin endpoints under `/api/admin/**`
