import type { Task } from 'src/types/task';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Setup project',
    desc: 'Inisialisasi project Vue + Quasar + Pinia',
    priority: 'high',
    assignee: 'Alice',
    due_date: '2025-09-20',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Design database schema',
    desc: 'Rancang tabel untuk task management',
    priority: 'medium',
    assignee: 'Bob',
    due_date: '2025-09-25',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Implement login',
    desc: 'Bikin halaman login dengan autentikasi JWT',
    priority: 'low',
    assignee: 'Charlie',
    due_date: '2025-09-30',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]
