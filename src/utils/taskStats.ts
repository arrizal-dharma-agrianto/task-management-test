import type { Task } from 'src/types/task'

function normalizeDate(date: Date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getTaskStats(tasks: Task[]) {
  const today = normalizeDate(new Date())

  const total = tasks.length
  const completed = tasks.filter((t) => t.is_complete).length
  const overdue = tasks.filter((t) => {
    if (t.is_complete || !t.due_date) return false
    return normalizeDate(new Date(t.due_date)) < today
  }).length
  const pending = tasks.filter((t) => {
    if (t.is_complete || !t.due_date) return false
    return normalizeDate(new Date(t.due_date)) >= today
  }).length

  return {
    total,
    completed,
    overdue,
    pending,
  }
}
export function getPriorityStats(tasks: Task[]) {
  return [
    { name: 'High', count: tasks.filter(t => t.priority === 'high').length, color: 'bg-red' },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length, color: 'bg-yellow' },
    { name: 'Low', count: tasks.filter(t => t.priority === 'low').length, color: 'bg-green' },
  ]
}
