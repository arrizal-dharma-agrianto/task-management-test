<template>
  <q-page padding role="main" aria-label="Task details page">
    <div v-if="task">
      <q-card
        class="q-pa-md shadow-2 rounded-borders"
        role="article"
        :aria-label="`Task details for ${task.title}`"
        tabindex="0"
      >
        <q-card-section>
          <div class="text-h5 text-weight-bold" role="heading" aria-level="1">{{ task.title }}</div>
          <div class="text-subtitle2 text-grey-7">{{ task.desc }}</div>
        </q-card-section>
        <q-separator spaced />
        <q-card-section class="row q-col-gutter-md">
          <div class="col-6" role="group" aria-label="Task priority">
            <div class="text-caption text-grey">Priority</div>
            <q-badge
              :color="
                task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'
              "
              class="q-mt-xs"
              :aria-label="`Priority: ${task.priority}`"
            >
              {{ task.priority }}
            </q-badge>
          </div>
          <div class="col-6" role="group" aria-label="Task status">
            <div class="text-caption text-grey">Status</div>
            <q-badge
              :color="task.is_complete ? 'green' : 'grey'"
              class="q-mt-xs"
              :aria-label="`Status: ${task.is_complete ? 'Complete' : 'Incomplete'}`"
            >
              {{ task.is_complete ? 'Complete' : 'Incomplete' }}
            </q-badge>
          </div>
          <div class="col-6" role="group" aria-label="Task assignee">
            <div class="text-caption text-grey">Assignee</div>
            <div class="text-body2">{{ task.assignee }}</div>
          </div>
          <div class="col-6" role="group" aria-label="Task due date">
            <div class="text-caption text-grey">Due Date</div>
            <div class="text-body2">{{ task.due_date }}</div>
          </div>
        </q-card-section>
        <q-separator spaced />
        <q-card-actions align="right" role="toolbar" aria-label="Task actions">
          <q-btn
            color="primary"
            label="Edit Task"
            icon="edit"
            @click="console.log(task)"
            aria-label="Edit this task"
          />
          <q-btn
            color="negative"
            label="Delete"
            icon="delete"
            flat
            @click="console.log(task)"
            aria-label="Delete this task"
          />
        </q-card-actions>
      </q-card>
    </div>
    <div v-else><q-banner dense class="bg-red text-white">Task not found</q-banner></div>
  </q-page>
</template>
<script lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';
export default {
  name: 'TaskDetailPage',
  setup() {
    const route = useRoute();
    const taskStore = useTaskStore();
    const taskId = route.params.id as string;
    const task = computed<Task | null>(() => {
      return taskStore.tasks.find((t) => t.id === taskId) ?? null;
    });
    return { task };
  },
};
</script>
