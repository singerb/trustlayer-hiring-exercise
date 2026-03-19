# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Monorepo with two separate projects: a GraphQL backend and a React frontend for an event feedback application. A shared GraphQL schema lives at `schemas/schema.graphql`.

## Commands

All commands must be run from the appropriate subdirectory (`frontend/` or `backend/`).

### Frontend (`cd frontend`)
```
yarn dev          # Dev server (port 5174)
yarn build        # Production build
yarn typecheck    # tsc --build (uses project references)
yarn lint         # ESLint
yarn format       # Prettier
yarn codegen      # Generate GraphQL types from schema
```

### Backend (`cd backend`)
```
yarn start        # Dev server with hot reload via nodemon + tsx
yarn typecheck    # tsc --noEmit
yarn lint         # ESLint
yarn format       # Prettier
yarn codegen      # Generate resolver types from schema
yarn migrate      # Run Knex migrations
yarn seed         # Run Knex seeds
```

## Architecture

### Request Flow
- **Queries/mutations**: Frontend Apollo Client → HTTP `localhost:4000` → Apollo Server → Knex → SQLite (`dev.sqlite3`)
- **Subscriptions**: Frontend Apollo Client → WebSocket `localhost:4001` → graphql-ws server → PubSub (in-memory)
- The two server ports (4000/4001) are separate standalone servers defined in `backend/src/index.ts`

### Frontend Structure
- **Routing**: React Router v7 framework mode with file-based routes under `app/routes/`. Route files use `$` for params (e.g., `events.$id.tsx`).
- **Apollo setup**: Client configured in `app/root.tsx` using `split()` to route subscriptions to the WebSocket link and queries/mutations to the HTTP link.
- **Generated types**: `src/generated/graphql.ts` — do not edit manually; regenerate with `yarn codegen`.
- **Components**: `src/components/` has ShadCN UI components (`card.tsx`) and custom ones (`StarRating.tsx`). The `lib/utils.ts` exports `cn()` for Tailwind class merging.

### Backend Structure
- **Single file**: All resolvers, server setup, and PubSub live in `src/index.ts`.
- **Database**: `src/db.ts` exports the Knex instance. Migrations and seeds are TypeScript files run via `tsx`.
- **Real-time**: `addFeedback` mutation publishes to `FEEDBACK_ADDED.{eventId}` PubSub channel. The subscription resolver uses `withFilter` for server-side rating filtering.
- **Naming**: DB columns are `snake_case` (`user_name`, `event_id`); GraphQL/TypeScript uses `camelCase`. Conversion happens in field resolvers.
- **Generated types**: `src/generated/graphql.ts` — resolvers are typed against this; do not edit manually.

### Type Generation (Codegen)
Both projects use `@graphql-codegen/cli` pointed at `schemas/schema.graphql`:
- **Frontend** (`codegen.ts`): Generates typed document nodes for operations defined in `src/` and `app/`.
- **Backend** (`codegen.ts`): Generates resolver type signatures.
- After schema changes, run `yarn codegen` in **both** projects.

### TypeScript Notes
- **Frontend `tsconfig.app.json`**: Uses `moduleResolution: bundler` and `rootDirs: [".", "./.react-router/types"]` — the latter is required for React Router's generated route types to resolve correctly.
- **Backend `tsconfig.json`**: Uses `moduleResolution: nodenext`; run scripts via `tsx` (not `ts-node`).
- **Prettier**: Configured with `useTabs: true` in both projects.
