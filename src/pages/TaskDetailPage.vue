<template>
  <q-page padding>
    <div v-if="task">
      <q-card class="q-pa-md shadow-2 rounded-borders">
        <q-card-section>
          <div class="text-h5 text-weight-bold">{{ task.title }}</div>
          <div class="text-subtitle2 text-grey-7">{{ task.desc }}</div>
        </q-card-section>

        <q-separator spaced />

        <q-card-section class="row q-col-gutter-md">
          <div class="col-6">
            <div class="text-caption text-grey">Priority</div>
            <q-badge
              :color="task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'"
              class="q-mt-xs"
            >
              {{ task.priority }}
            </q-badge>
          </div>

          <div class="col-6">
            <div class="text-caption text-grey">Status</div>
            <q-badge
              :color="task.is_complete ? 'green' : 'grey'"
              class="q-mt-xs"
            >
              {{ task.is_complete ? 'Complete' : 'Incomplete' }}
            </q-badge>
          </div>

          <div class="col-6">
            <div class="text-caption text-grey">Assignee</div>
            <div class="text-body2">{{ task.assignee }}</div>
          </div>

          <div class="col-6">
            <div class="text-caption text-grey">Due Date</div>
            <div class="text-body2">{{ task.due_date }}</div>
          </div>
        </q-card-section>

        <q-separator spaced />

        <q-card-actions align="right">
          <q-btn color="primary" label="Edit Task" icon="edit" @click="console.log(task)" />
          <q-btn color="negative" label="Delete" icon="delete" flat @click="console.log(task)" />
        </q-card-actions>
      </q-card>
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
      return taskStore.tasks.find((t) => t.id === taskId) ?? null
    })

    return { task }
  },
}
</script>
