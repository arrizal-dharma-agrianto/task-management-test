<template>
  <q-page padding>
    <div v-if="task">
      <h4>{{ task.title }}</h4>
      <p>{{ task.desc }}</p>
      <q-badge :color="task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'">
        {{ task.priority }}
      </q-badge>
      <div>Assigned to: {{ task.assignee }}</div>
      <div>Due: {{ task.due_date }}</div>
      <div>Status: {{ task.status }}</div>
    </div>
    <div v-else>
      <q-banner dense class="bg-red text-white">Task not found</q-banner>
    </div>
  </q-page>
</template>
<script lang="ts">
import { useRoute } from 'vue-router';
import { mockTasks } from 'src/data/task';
import type { Task } from 'src/types/task';
import { computed } from 'vue';

export default {
  name: 'TaskDetailPage',
  setup() {
    const route = useRoute();
    const taskId = route.params.id as string;
    const task = computed<Task | undefined>(() =>
      mockTasks.find((t) => t.id === taskId)
    )

    return { task }
  }
}
</script>
