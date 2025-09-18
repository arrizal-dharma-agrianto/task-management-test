import type { Task } from 'src/types/task'
import { generateDummyTasks } from '../seeder/task-dummy'

const STORAGE_KEY = 'task-data'

export const taskService = {
  getAll(): Task[] {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Task[]) : []
  },

  saveAll(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  },

  seedDummy(count = 20): Task[] {
    const tasks = generateDummyTasks(count)
    this.saveAll(tasks)
    return tasks
  },

  add(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>, nextId: number): Task {
    const now = new Date().toISOString()
    const newTask: Task = {
      ...payload,
      id: String(nextId),
      created_at: now,
      updated_at: now,
      is_complete: false,
    }
    const tasks = this.getAll()
    tasks.push(newTask)
    this.saveAll(tasks)
    return newTask
  },

  update(id: string, payload: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>): Task | null {
    const tasks = this.getAll()
    const idx = tasks.findIndex((t) => t.id === id)
    if (idx !== -1) {
      tasks[idx] = {
        ...tasks[idx],
        ...payload,
        updated_at: new Date().toISOString(),
      } as Task
      this.saveAll(tasks)
      return tasks[idx]
    }
    return null
  },

  delete(id: string): boolean {
    const tasks = this.getAll()
    const newTasks = tasks.filter((t) => t.id !== id)
    if (newTasks.length !== tasks.length) {
      this.saveAll(newTasks)
      return true
    }
    return false
  },

  clear(): void {
    this.saveAll([])
  },
}
