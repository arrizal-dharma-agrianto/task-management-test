# Task Management Dashboard

A **task management dashboard** built using **Quasar Framework**, **Vue 3 (Composition API)**, **TypeScript**, and **Pinia** for state management.
The app provides a modern UI for managing tasks with features like task overview, statistics, recent activities, filtering, bulk actions, and persistence via local storage.

---

## 🚀 Setup

### Prerequisites

* Node.js 18+
* Yarn or npm

### Installation

```bash
# Clone repo
git clone <your-repo-url>
cd <your-repo-name>

# Install dependencies
yarn install # or npm install

# Run dev server
quasar dev

# Build for production
quasar build
```

---

## 🏗️ Architecture

### Tech Stack

* **Vue 3 (Composition API)** – Core framework
* **TypeScript** – Type safety
* **Quasar Framework** – UI components and layouts
* **Pinia** – Store management for tasks
* **LocalStorage** – Persistence for tasks

### Project Structure (Relevant Parts)

```
src/
 ├─ pages/
 │   ├─ IndexPage.vue     # Dashboard (stats, charts, activities)
 │   └─ TaskPage.vue      # Task list, filtering, bulk actions
 ├─ components/
 │   ├─ DashboardWidget.vue
 │   ├─ TaskDialog.vue
 │   ├─ ConfirmDialog.vue
 │   ├─ TaskFilterBar.vue
 │   ├─ PriorityBadge.vue
 │   ├─ TaskBadge.vue
 │   └─ charts/
 │       ├─ PieChart.vue
 │       └─ PriorityChart.vue
 ├─ stores/
 │   └─ task-store.ts     # Pinia store for tasks
 └─ types/
     └─ task.ts           # Type definitions for Task
```

---

## 📖 Code Breakdown

### 1. `IndexPage.vue` (Dashboard)

* Displays **task statistics** (total, completed, pending, overdue).
* Uses **charts** (`PieChart`, `PriorityChart`) for visual insights.
* Shows **recent activities** (task created, completed, overdue, updated).
* Provides **Add Task button** with `NewTaskDialog`.
* Uses `computed` values to derive:

    * Task counts (completed, pending, overdue).
    * Priority distribution.
    * Recent activities from `taskStore`.

**Key decisions:**

* **Accessibility**: `aria-labels` and roles for screen readers.
* **AsyncComponent**: Lazy-load charts (`PieChart`) to optimize load time.
* **Simulated loading**: Adds UX-friendly loading state with a delay.

---

### 2. `TaskPage.vue` (Task List & Management)

* Displays paginated **task list** with filters.
* Allows **bulk actions**:

    * Mark tasks complete/incomplete
    * Delete tasks (with confirmation dialogs)
* Provides **task CRUD**:

    * Create task (`NewTaskDialog`)
    * Edit task (`NewTaskDialog` with pre-filled data)
    * Delete task (`ConfirmDialog`)
* Supports **filters**:

    * Search
    * Assignee filter
    * Due date filter
* Uses **check-all checkbox** for bulk selection.
* Navigation to **Task Detail** via `goToDetail`.

**Key decisions:**

* **Computed filtering** instead of mutating state → keeps `taskStore` source of truth clean.
* **Pagination**: Implemented client-side with `q-pagination`.
* **Notifications**: Used `useNotify` composable for consistent feedback.
* **Dialogs are reusable components** (`ConfirmDialog`, `TaskDialog`) → improves maintainability.

---

## 🧩 State Management (Pinia)

`task-store.ts` (not shown here) manages:

* Task CRUD operations (`addTask`, `editTask`, `deleteTask`).
* Persistence to `localStorage`.
* Reactive store used across pages.

---

## 💡 Design Decisions

* **Separation of concerns**: Pages only orchestrate data; logic centralized in store and composables.
* **Reusability**: Widgets (e.g., `DashboardWidget`, `TaskDialog`, `ConfirmDialog`) are generic.
* **Accessibility first**: Roles and aria-labels on interactive elements.
* **Optimized UX**: Simulated loading, empty states, consistent dialogs.

---

## ✅ Features

* Dashboard with statistics, charts, and recent activity.
* Task management (CRUD).
* Filtering and pagination.
* Bulk actions with confirmation.
* Persistent local storage.
* Responsive and accessible UI.

# ⏱️ Time Tracking - 20 Hours

| Area                               | Hours | Notes                                                                                                                                                                                                                                                                                           |
| ---------------------------------- | ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Initial setup and planning**     | 2h    | Bootstrapped project with Quasar + Vue 3. Defined folder structure (Atomic Design-ish). Setup linting, Prettier, ESLint, and naming conventions. Planned abstractions but postponed over-engineering.                                                                                           |
| **Core functionality development** | 6h    | **Task CRUD (3h):** LocalStorage persistence, `taskService` abstraction, bulk ops. <br> **State Management (1h):** Composable store, fixed reactivity issues. <br> **Dashboard & Activity (2h):** Cards for priorities & activity log, balanced data density vs readability.                    |
| **UI/UX implementation**           | 4h    | Applied Quasar components, responsive tables, dialogs. Added confirmations for destructive actions. Iterated heavily on spacing, alignment, and typography. Ensured accessibility (ARIA, roles).                                                                 |
| **Data layer and abstractions**    | 2h    | Built `taskService` as single entry for CRUD. Designed to swap LocalStorage → API with minimal changes. Strong typing with `Task` interface. Centralized utilities for DRY code.                                                                                                                |
| **Polish**                         | 5h    | **Refactor:** Split into reusable components (`TaskForm`, `TaskCard`, `ConfirmDialog`). <br> **Service layer:** All flows through `taskService` for future API migration. <br> **Redesign:** Iterated dashboard layout multiple times, struggled with visual hierarchy. This phase was longest. |
| **Documentation**                  | 1h    | README with setup, project goals, and time log. Explained design decisions and folder structure. Noted abstraction strategy for future contributors.                                                                                                                                            |

---

### ✅ Summary

* Total: **20 hours**
* Longest phase: **Polish (5h)** → heavy refactor, redesign, and preparing service layer.
* Core features solid and maintainable, future API migration already supported.
* Key lesson: **UI design takes longer when your creative sense isn’t cooperating.**

