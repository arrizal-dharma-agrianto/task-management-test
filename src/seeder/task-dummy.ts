import type { Task } from 'src/types/task'

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)] as T
}

export function generateDummyTasks(count: number): Task[] {
  const priorities: Task['priority'][] = ['low', 'medium', 'high']
  const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Evan']
  const now = new Date()

  return Array.from({ length: count }, (_, i) => {
    const due = new Date(now)
    due.setDate(due.getDate() + (i % 10))

    return {
      id: String(i + 1),
      title: `Task ${i + 1}`,
      desc: `This is a description for task ${i + 1}`,
      priority: randomChoice(priorities),
      assignee: randomChoice(assignees),
      due_date: due.toISOString().slice(0, 10),
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      is_complete: i % 5 === 0,
    }
  })
}
