export interface Task {
  id: string
  title: string
  desc: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  due_date: string
  status: 'todo' | 'in-progress' | 'done'
  created_at: string
  updated_at: string
}
