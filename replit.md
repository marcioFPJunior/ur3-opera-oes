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
- **Márcio** - Admin user with password (680527). Has access to Admin Panel (`/admin`) for add/delete/clear records
- **Anderson** - Regular operator, no password required

## Key Files
- `shared/schema.ts` - Database schema (operations table) + Zod validation schemas
- `server/db.ts` - PostgreSQL connection via `pg` Pool + `drizzle-orm/node-postgres`
- `server/storage.ts` - DatabaseStorage class with CRUD + update operations
- `server/routes.ts` - API routes (GET/POST/PATCH/DELETE /api/operations)
- `client/src/lib/store.tsx` - React context with API calls + 3-second polling
- `client/src/pages/` - All page components

## API Endpoints
- `GET /api/operations` - List all operations (ordered by date DESC)
- `GET /api/operations/category/:category` - Filter by category
- `POST /api/operations` - Create new operation
- `PATCH /api/operations/:id` - Update operation (e.g. LCQ status)
- `DELETE /api/operations/:id` - Delete single operation
- `DELETE /api/operations` - Clear all operations

## Operations
1. **Recebimento** - 4-step form: Motorista/Placa → Type (UR3/Tanque) → Product → Quantidade + Status LCQ
2. **Expedição** - 2-step form: Product → Quantity
3. **Transbordo** - Solvents only (Aguarrás, Hexano, Xileno)

## Status LCQ
- Field on Recebimento operations: "Aguardando LCQ", "Liberado LCQ", "Não se aplica"
- Default: "Aguardando LCQ"
- Can be updated from historical view or admin panel
- Helps track laboratory approval delays for incoming trucks

## Design
- Industrial blue (#0f4c81), white background, Roboto font
- Large touch-friendly buttons for mobile use
- Admin panel with yellow accent theme
- LCQ badges: yellow (Aguardando), green (Liberado), gray (Não se aplica)
