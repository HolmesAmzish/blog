# ARORMS Blog Frontend

A technical blog frontend built with React, TypeScript, Tailwind CSS, and Vite.

## Features

- **Technical Minimalism Design**: Clean, modern UI inspired by aino.agency
- **Glitch Loading Animation**: Character scrambling effect on page load
- **ECharts Tree Visualization**: Interactive archive tree for blog posts
- **React Query**: Efficient data fetching and caching
- **TypeScript**: Strict type safety throughout the codebase
- **Tailwind CSS**: Utility-first CSS framework

## Tech Stack

- React 19
- TypeScript 5
- Vite 7
- Tailwind CSS 4
- TanStack Query (React Query)
- React Router DOM
- Axios
- ECharts
- Lucide React (icons)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your API URL:
```
VITE_API_URL=http://localhost:8080/api
```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/           # API client and endpoints
├── components/    # React components
│   ├── layout/    # Layout components (Header, Footer)
│   └── ui/        # UI components (ArticleCard, LoadingScreen)
├── features/      # Feature pages
│   ├── article/   # Article list and detail pages
│   ├── archive/   # Archive page with ECharts tree
│   └── home/      # Home page
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── App.tsx        # Main app component
├── index.css      # Global styles
└── main.tsx       # Entry point
```

## Design System

### Colors
- Primary: `#0047FF` (Blue)
- Background: `#FFFFFF` (White)
- Text: `#000000` (Black)
- Secondary Text: `#6B7280` (Gray)

### Typography
- Headings: System font, bold, tight tracking
- Body: System font, normal weight
- Monospace: `ui-monospace`, `SFMono-Regular`, etc.

### Borders
- Hairline borders: `0.5px` width
- Standard borders: `1px` width

## API Integration

The frontend communicates with a Spring Boot backend API. All API calls are centralized in the `src/api/` directory using Axios.

## License

MIT
