# Task Board

A React 19 task management app with animated pin/unpin interactions, filtering, localStorage persistence, and API integration.

## Tech Stack

- **React 19** + TypeScript
- **Vite** (dev server & bundler)
- **Tailwind CSS v4** (styling)
- **Shadcn UI** (Button, Input, Skeleton)
- **Motion** (layout animations via PinList from Animate UI component library)
- **Vitest** + React Testing Library (tests)

## Getting Started

```bash
pnpm install
pnpm dev
```

## Running Tests

```bash
pnpm test   # Run all tests
```

## How It Works

1. On first load, tasks are fetched from [JSONPlaceholder](https://jsonplaceholder.typicode.com/todos?_limit=15) and stored in `localStorage`.
2. On other refreshes, tasks are restored from `localStorage` (no network request).
3. Tasks can be toggled between completed/incomplete by clicking the tasks.
4. New tasks can be added via the input form at the top.
5. Filter buttons let you view All, Completed, or Incomplete tasks.

## Things to add

- **Backend persistence** — Replace localStorage with a real database (e.g., via better-auth + Drizzle).
- **Drag-and-drop reordering** — Allow users to manually sort tasks.
- **Archiving tasks** — Add a way to archive tasks. Perhaps to a separate "Archived" tab.
