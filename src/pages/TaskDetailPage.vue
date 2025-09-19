<template>
  <q-page padding role="main" aria-label="Task details page">
    <div v-if="task">
      <!-- Header with back and action buttons -->
      <div class="header-section q-mb-lg">
        <div class="row justify-between items-center">
          <q-btn
            flat
            icon="arrow_back"
            label="Back"
            color="dark"
            @click="$router.go(-1)"
            aria-label="Go back"
          />
          <div class="row q-gutter-sm">
            <q-btn
              outline
              :label="task.is_complete ? 'Completed' : 'Mark as Complete'"
              :color="task.is_complete ? 'grey' : 'positive'"
              :disable="task.is_complete"
              @click="markComplete"
              aria-label="Mark task as complete"
            />
            <q-btn
              outline
              label="Edit"
              color="primary"
              @click="editTask"
              aria-label="Edit this task"
            />
            <q-btn
              outline
              label="Delete"
              color="negative"
              @click="deleteTask"
              aria-label="Delete this task"
            />
          </div>
        </div>
      </div>

      <!-- Main content -->
      <q-card class="task-info-card q-pa-lg shadow-2 rounded-borders" role="article" :aria-label="`Task details for ${task.title}`">
        <div class="text-h5 text-weight-bold q-mb-lg">Task Information</div>
        <div class="row q-col-gutter-md">
          <!-- Left side -->
          <div class="col-7">
            <!-- Title -->
            <div class="q-mb-md" role="group" aria-label="Task title">
              <div class="text-caption text-grey">Title</div>
              <div class="text-body1 text-weight-medium">{{ task.title }}</div>
            </div>

            <!-- Assignee and Due Date -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6" role="group" aria-label="Task assignee">
                <div class="text-caption text-grey">Assign</div>
                <div class="text-body2">{{ task.assignee }}</div>
              </div>
              <div class="col-6" role="group" aria-label="Task due date">
                <div class="text-caption text-grey">Due Date</div>
                <div class="text-body2">{{ formatDate(task.due_date) }}</div>
              </div>
            </div>

            <!-- Description -->
            <div role="group" aria-label="Task description">
              <div class="text-caption text-grey">Description</div>
              <div class="text-body2">{{ task.desc }}</div>
            </div>
          </div>

          <!-- Right side -->
          <div class="col-5">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-6" role="group" aria-label="Task priority">
                <div class="text-caption text-grey">Priority</div>
                <q-badge
                  :color="task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'orange' : 'green'"
                  outline
                  class="q-mt-xs text-bold row items-center q-px-sm q-py-xs"
                  :aria-label="`Priority: ${task.priority}`"
                >
                  <!-- <q-icon
                    :name="task.priority === 'high' ? 'priority_high' : task.priority === 'medium' ? 'arrow_upward' : 'arrow_downward'"
                    size="16px"
                    class="q-mr-xs"
                  /> -->
                  {{ task.priority }}
                </q-badge>
              </div>

              <div class="col-6" role="group" aria-label="Task status">
                <div class="text-caption text-grey">Status</div>
                <q-badge
                  :color="task.is_complete ? 'green' : 'grey'"
                  outline
                  class="q-mt-xs text-bold row items-center q-px-sm q-py-xs"
                  :aria-label="`Status: ${task.is_complete ? 'Complete' : 'Incomplete'}`"
                >
                  <q-icon
                    :name="task.is_complete ? 'check_circle' : 'schedule'"
                    size="16px"
                    class="q-mr-xs"
                  />
                  {{ task.is_complete ? 'Complete' : 'Incomplete' }}
                </q-badge>
              </div>
            </div>

            <!-- Extra content (optional placeholder) -->
            <div class="additional-content">
              <q-card flat bordered class="q-pa-md" style="min-height: 200px">
                <div class="text-caption text-grey-6 text-center q-mt-lg">
                  Additional Information
                </div>
              </q-card>
            </div>
          </div>
        </div>
      </q-card>
    </div>

    <div v-else>
      <q-banner dense class="bg-red text-white">Task not found</q-banner>
    </div>
  </q-page>

  <NewTaskDialog
      v-model="editDialog"
      :initial-task="task"
      @update-task="updateTask"
    />

  <ConfirmDialog
      v-model="deleteDialog"
      title="Delete Task"
      message="Are you sure you want to delete this task?"
      confirmLabel="Delete"
      cancelLabel="Cancel"
      color="negative"
      icon="warning"
      @confirm="confirmDelete"
    />
</template>

<script lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, ref } from 'vue';
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';
import { useNotify } from "src/composables/useNotify";
import ConfirmDialog from "components/ConfirmDialog.vue";
import NewTaskDialog from "components/TaskDialog.vue";

export default {
  name: 'TaskDetailPage',
   components: {
    ConfirmDialog,
    NewTaskDialog
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const taskStore = useTaskStore();
    const { success } = useNotify();


    const deleteDialog = ref(false);
    const editDialog = ref(false);

    const taskId = route.params.id as string;
    const task = computed<Task | null>(() => {
      return taskStore.tasks.find((t) => t.id === taskId) ?? null;
    });

    const formatDate = (date: string) => {
      return new Date(date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    };

    const markComplete = () => {
       if (task.value) {
          taskStore.editTask(task.value.id, { ...task.value, is_complete: true });
          success(`Task marked as complete!`);
      }
    };

    const editTask = () => {
       if (task.value) {
        editDialog.value = true;
      }
    };

    function updateTask(payload: Omit<Task, "id" | "created_at" | "updated_at">) {
      if (task.value) {
        taskStore.editTask(task.value.id, payload);
        editDialog.value = false;
      }
    }

    const deleteTask = () => {
     deleteDialog.value = true;
    };

    function confirmDelete() {
      if (task.value) {
        const taskTitle = task.value.title
        taskStore.deleteTask(task.value.id);
        deleteDialog.value = false;
        success(`Task "${taskTitle}" deleted successfully!`);
        void router.push({ name: "task-list"});
      }
    }

    return {
      task,
      deleteDialog,
      editDialog,
      formatDate,
      markComplete,
      editTask,
      deleteTask,
      confirmDelete,
      updateTask
    };
  },
};
</script>

<style lang="scss" scoped>
.header-section {
  .q-btn {
    min-width: 120px;
  }
}

.task-info-card {
  border-radius: 12px;

  .additional-content {
    .q-card {
      border-radius: 8px;
      border: 1px solid #e0e0e0;
    }
  }
}

@media (max-width: 768px) {
  .header-section {
    .row {
      flex-direction: column;
      gap: 16px;

      .q-btn {
        min-width: auto;
      }
    }
  }

  .row.q-col-gutter-md {
    .col-7,
    .col-5 {
      width: 100%;
    }
  }
}
</style>
