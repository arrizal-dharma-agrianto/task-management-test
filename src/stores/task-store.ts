import { defineStore } from 'pinia'
import type { Task } from 'src/types/task'
import { taskService } from 'src/services/task-service'

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    filter: 'all',
    nextId: 0,
  }),
  actions: {
    loadFromStorage() {
      this.tasks = taskService.getAll()

      if (this.tasks.length === 0) {
        this.tasks = taskService.seedDummy(20)
      }

      this.nextId =
        this.tasks.reduce((max, t) => Math.max(max, Number(t.id)), 0) + 1
    },

    addTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      const newTask = taskService.add(payload, this.nextId++)
      this.tasks.push(newTask)
    },

    editTask(id: string, payload: Partial<Omit<Task, 'id' | 'created_at' | 'updated_at'>>) {
      const updated = taskService.update(id, payload)
      if (updated) {
        const idx = this.tasks.findIndex((t) => t.id === id)
        if (idx !== -1) this.tasks[idx] = updated
      }
    },

    deleteTask(id: string) {
      const ok = taskService.delete(id)
      if (ok) {
        this.tasks = this.tasks.filter((t) => t.id !== id)
      }
    },

    clearTasks() {
      taskService.clear()
      this.tasks = []
    },
  },
})
