# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server with HMR (Vite)
npm run build      # Type-check (tsc -b) then build
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

There is no test framework configured.

To set admin role for a user, run the Node.js admin script:
```bash
node admin.cjs
```

## Architecture

**Stack**: React 19 + TypeScript (strict) + Vite, Firebase (Firestore, Auth, Storage), TanStack Router (file-based), Zustand (state), MUI v7, React Hook Form + Zod.

This is a **client-only SPA** — no backend server. All data lives in Firebase.

### Domain-Driven Structure

Code is organized by business domains under `src/domains/`, each self-contained with its own `components/`, `services/`, `stores/`, and `types/`:

- `auth/` — login, register, Firebase Auth, user session
- `pizza/` — product catalog fetched from Firestore `pizza/` collection
- `cart/` — cart state synced to `users/{uid}/cart` subcollection
- `profile/` — user info and order history from `users/{uid}/orders` subcollection
- `admin/` — order management with cursor-based pagination, add new pizzas
- `chat/` — support ticket system between users and admins (see Chat System below)
- `configurator/` — interactive 3D pizza builder (see Configurator below)

`src/pages/` contains thin wrappers that compose domain components.  
`src/shared/` contains the Header, Drawer, Firebase init (`firebase.ts`), and utility functions.

### Routing

TanStack Router with **file-based routing** under `src/app/routes/`. Route tree is auto-generated into `routeTree.gen.ts` — do not edit that file manually.

- `_authenticated/` layout — renders Header, guards via `beforeLoad` (redirects to `/login` if not authenticated)
- `_notauthenticated/` layout — redirects to `/home` if already authenticated
- `_authenticated/_admin/` — admin-only route (checks `role === 'Admin'`)
- Underscore-prefixed folders are layout routes with no URL segment

### State Management

Each domain has one Zustand store using the middleware stack: `persist > devtools > combine`.

Only `user` and `isAuthenticated` are persisted to localStorage. `isLoading` is never persisted.

Auth initialization happens in `App.tsx` via `useAuthStore().initAuth()`, which subscribes to Firebase `onAuthStateChanged`.

### Data Flow

**Component → Store action → Service → Firebase → Store `set()` → re-render**

Services are singleton class instances (e.g., `export const authService = new AuthService()`).

### Firestore Schema

```
users/{uid}
  cart/{cartItemId}       — CartItem (name, price, quantity, settings.size, settings.dough)
  orders/{orderId}        — HistoryOrder (items, totalPrice, orderDate, status)

pizza/{pizzaId}           — GoodItemInterface (title, content, price[], sizes[], dough[], img)
```

Order statuses: `'cooking'` → `'ready'` → `'in_delivery'` → `'delivered'`

```
chats/{chatId}            — Chat (userId, username, userEmail, subject, status, createdAt, lastMessage, lastMessageAt, unreadByAdmin, unreadByUser)
  messages/{messageId}   — ChatMessage (text, senderId, senderRole, createdAt)
```

Chat statuses: `'open'` → `'closed'` (admin closes the ticket)

### Cart Deduplication

Cart items are grouped by a derived key:
```typescript
const pizzaId = `${item.name}.${settings?.size}.${settings?.dough}`;
```
Same pizza + same size + same dough merges into one cart entry.

### Admin Pagination

Uses **cursor-based pagination** (`startAfter` / `endBefore`) — not offset-based. The admin store maintains an array of page cursors for bidirectional navigation.

### Chat System

Support tickets live in `src/domains/chat/`. Structure mirrors other domains:

- `types/chat.types.ts` — `Chat`, `ChatMessage`, `ChatState`
- `services/chatService.ts` — Firestore operations (singleton `chatService`)
- `stores/chatStore.ts` — Zustand store (`useChatStore`), **no persist**
- `hooks/useUserChat.ts` — custom hook encapsulating user-side effects
- `components/user-chat/UserChatDrawer.tsx` — Drawer for users (list / new / chat views)
- `components/admin-chat/AdminChatPanel.tsx` — admin panel (left: open chats list, right: messages)
- `components/admin-chat/ChatList.tsx` — left sidebar component (reused in admin panel)
- `components/admin-chat/ChatMessageThread.tsx` — messages + input + close button
- `components/shared/MessageBubble.tsx` — shared message bubble (used by both user and admin)
- `components/shared/ChatInput.tsx` — shared text input with send button (owns its own `text` state)

**User flow**: chat icon in Header (hidden for admins) → Drawer with ticket list → "Новый запрос" creates a ticket with a subject → messages in selected ticket.

**Admin flow**: "Чат с пользователями" tab in admin panel → sees only `status: 'open'` chats → can reply and close tickets. Closed tickets disappear from the list immediately.

**Real-time**: all lists and message threads use `onSnapshot` listeners. Unread badge in Header is driven by `subscribeUserChats` started in `Header.tsx` on mount.

**chatId** is auto-generated (not userId) — each user can have multiple tickets.

### Configurator

Interactive 3D pizza builder at `/configurator`. Lives in `src/domains/configurator/`. No Firebase — state is entirely local (Zustand, no persist).

- `types/configurator.types.ts` — `DoughVariant`, `SauceVariant`, `PizzaSize`, `IngredientKey`, price constants
- `stores/configuratorStore.ts` — Zustand store (`useConfiguratorStore`), `create + combine + devtools`, **no persist**
- `components/PizzaConfigurator.tsx` — layout: 3D canvas (65%) + control panel (35%), column on mobile
- `components/scene/PizzaScene.tsx` — `<Canvas>` with lights, `OrbitControls` (autoRotate, no pan), `TablePlatform`
- `components/scene/PizzaModel.tsx` — composes pizza layers; Y-stacking based on dough height + cheese height; whole group scaled by size
- `components/scene/PizzaBase.tsx` — dough cylinder (thin: h=0.08, traditional: h=0.15)
- `components/scene/PizzaSauce.tsx` — sauce layer, color by variant
- `components/scene/PizzaCheese.tsx` — cheese layer, height driven by `cheeseAmount` slider (0–100)
- `components/scene/ingredients/positioning.ts` — **phyllotaxis** (golden angle) generates 55 evenly-spread positions; distributed round-robin across all 6 ingredient types so each type is scattered across the whole pizza, not clustered
- `components/scene/ingredients/` — 6 ingredient components (Pepperoni, Mushrooms, Olives, Peppers, Tomatoes, Basil); each animates drop-in via `useFrame` exponential decay on mount
- `components/ui/ConfiguratorPanel.tsx` — MUI panel with price calculation; price = `BASE_PRICES[dough] × SIZE_MULTIPLIERS[size] + active ingredient prices`
- `components/ui/` — `DoughSelector`, `SauceSelector`, `CheeseSlider`, `IngredientsGrid`, `SizeSelector`

**3D stack**: React Three Fiber (`@react-three/fiber`) + Drei (`@react-three/drei`) + Three.js. All geometry is procedural — no `.glb`/`.obj` files. R3F JSX intrinsics (`<mesh>`, `<cylinderGeometry>`, etc.) require `/// <reference types="@react-three/fiber" />` in `src/vite-env.d.ts`.

**Animation pattern**: each ingredient component uses `useRef(2.0)` as initial Y-offset, `useFrame` lerps it to `0` via `1 - Math.exp(-8 * delta)` (frame-rate-independent). Group position = `yBase + yOffset`.

### User Roles

Roles (`'Admin'` | `'User'`) are stored in Firestore user documents. `admin.cjs` uses Firebase Admin SDK to set custom claims. Role is checked via `shared/utils/checkFirebaseRole.ts`.

## UI Components

The project uses **Material UI (MUI) v7** as the component library. Key packages:

- `@mui/material` — core components (Button, TextField, Dialog, Tabs, etc.)
- `@mui/icons-material` — icon set
- `@mui/x-data-grid` — data table used in the admin panel for order management

MUI uses **Emotion** (`@emotion/react`, `@emotion/styled`) for styling under the hood. Custom styling is done via the `sx` prop or `styled()`.

## Code Style

- Prettier: 140 char print width, 2-space indent, single quotes, trailing commas everywhere
- TypeScript strict mode — no unused vars/params
- ESLint flat config (`eslint.config.js`)
- UI error messages are in Russian
