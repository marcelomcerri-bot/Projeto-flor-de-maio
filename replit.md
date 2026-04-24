# Flor de Maio

Aplicativo de apoio à amamentação desenvolvido por acadêmicos de enfermagem da UFF.

## Architecture

- **Frontend**: React 19 + Vite + TailwindCSS v4 + Radix UI components
- **Backend**: Express server (TypeScript via tsx) with in-memory posts API
- **Dev server**: `server.ts` runs Express with Vite middleware on port 5000 (single fullstack port)
- **Routing**: wouter
- **Data fetching**: @tanstack/react-query

## Replit Setup

- Workflow `Start application` runs `npm run dev` and serves on port 5000 (webview).
- Vite is configured with `host: 0.0.0.0`, `port: 5000`, and `allowedHosts: true` so Replit's iframe proxy can reach the dev server.
- Backend Express runs on `0.0.0.0:5000` and uses Vite's middleware in dev; in production it serves the built `dist/` directory.

## Environment Variables

- `GEMINI_API_KEY` — optional, used by the app for Gemini AI calls (configured via Secrets).

## Deployment

Configured for VM deployment:
- Build: `npm run build`
- Run: `NODE_ENV=production tsx server.ts`
