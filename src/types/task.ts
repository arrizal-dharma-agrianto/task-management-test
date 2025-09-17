export interface Task {
  id: string
  title: string
  desc: string
  priority: 'low' | 'medium' | 'high'
  assignee: string
  due_date: string
  created_at: string
  updated_at: string
}
