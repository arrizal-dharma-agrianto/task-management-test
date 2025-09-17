import { defineStore } from 'pinia';
import type { Task } from 'src/types/task';

export const useTaskStore = defineStore('task',{
  state:()=>({
    tasks:[] as Task[],
    filter:'all',
    nextId:0,
  }),
  actions:{
    addTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      const now = new Date().toISOString()
      const newTask: Task = {
        ...payload,
        id: String(this.nextId++),
        created_at: now,
        updated_at: now,
      }
      this.tasks.push(newTask)
      console.log('Task added:', newTask)
    },
    showTask(id: string) {
      const task = this.tasks.find(t => t.id === id)
      if (task){
        console.log('Task found:', task)
        return task
      }
      console.log('Task not found')
      return null
    },
    editTask(id: string, payload: Partial<Omit<Task,'id' | 'created_at' | 'updated_at'>>){
      const task = this.showTask(id)
      if (task){
        Object.assign(task, payload)
        console.log('Task updated:', task)
      } else {
        console.log('Task not found')
      }
    },
    deleteTask(id: string) {
      const task = this.showTask(id)
      if (task) {
        this.tasks = this.tasks.filter(t => t.id !== id)
        console.log('Task deleted:', task)
      } else {
        console.log('Task not found')
      }
    }
  }
})
