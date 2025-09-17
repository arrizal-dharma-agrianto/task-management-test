import { defineStore } from 'pinia';
import type { Task } from 'src/types/task';

export const useTaskStore = defineStore('task',{
  state:()=>({
    tasks:[] as Task[],
    filter:'all',
    nextId:0,
  }),
  getters: {
    // filteredTasks(state){
    //   if (state.filter === 'all') return state.tasks
    //   return state.tasks.filter((t)=>t.status === state.filter)
    // },
  },
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
      console.log('✅ Task added:', newTask)
    },
  }
})
