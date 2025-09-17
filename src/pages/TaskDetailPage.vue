<template>
  <q-page padding>
    <div v-if="task">
      <h4>{{ task.title }}</h4>
      <p>{{ task.desc }}</p>
      <q-badge
        :color="task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'"
      >
        {{ task.priority }}
      </q-badge>
      <div>Assigned to: {{ task.assignee }}</div>
      <div>Due: {{ task.due_date }}</div>
      <div>
        Status:
        <q-badge :color="task.is_complete ? 'green' : 'grey'">
          {{ task.is_complete ? 'Complete' : 'Incomplete' }}
        </q-badge>
      </div>
    </div>
    <div v-else>
      <q-banner dense class="bg-red text-white">Task not found</q-banner>
    </div>
  </q-page>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTaskStore } from 'stores/task-store'
import type { Task } from 'src/types/task'

export default {
  name: 'TaskDetailPage',
  setup() {
    const route = useRoute()
    const taskStore = useTaskStore()

    const taskId = route.params.id as string

    const task = computed<Task | null>(() => {
      return taskStore.showTask(taskId)
    })

    return { task }
  },
}
</script>
