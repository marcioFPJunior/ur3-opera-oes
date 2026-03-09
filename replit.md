# UR3 - Sistema de Operações Logísticas

## Overview
Mobile-first PWA for industrial operators (Márcio and Anderson) at UR3 to log operations: Recebimento, Expedição, and Transbordo. Real-time data synchronization between both users' phones via shared PostgreSQL database.

## Architecture
- **Frontend**: React + Vite + TypeScript + TailwindCSS + shadcn/ui
- **Backend**: Express.js with API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend)
- **Sync**: Frontend polls `/api/operations` every 3 seconds for real-time updates

## Users
- **Márcio** - Admin user. Has access to Admin Panel (`/admin`) for add/delete/clear records
- **Anderson** - Regular operator

## Key Files
- `shared/schema.ts` - Database schema (operations table) + Zod validation schemas
- `server/db.ts` - PostgreSQL connection via `pg` Pool + `drizzle-orm/node-postgres`
- `server/storage.ts` - DatabaseStorage class with CRUD operations
- `server/routes.ts` - API routes (GET/POST/DELETE /api/operations)
- `client/src/lib/store.tsx` - React context with API calls + 3-second polling
- `client/src/pages/` - All page components

## API Endpoints
- `GET /api/operations` - List all operations (ordered by date DESC)
- `GET /api/operations/category/:category` - Filter by category
- `POST /api/operations` - Create new operation
- `DELETE /api/operations/:id` - Delete single operation
- `DELETE /api/operations` - Clear all operations

## Operations
1. **Recebimento** - 4-step form: Motorista/Placa → Type (UR3/Tanque) → Product → Quantidade
2. **Expedição** - 2-step form: Product → Quantity
3. **Transbordo** - Solvents only (Aguarrás, Hexano, Xileno)

## Design
- Industrial blue (#0f4c81), white background, Roboto font
- Large touch-friendly buttons for mobile use
- Admin panel with yellow accent theme
