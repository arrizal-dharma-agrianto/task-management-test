<template>
  <q-page padding role="main" aria-label="Task details page">
    <div v-if="task">
      <!-- Header with back and action buttons -->
      <div class="row items-center justify-between q-mb-md">
        <div class="row justify-between items-start">
          <q-btn
            flat
            icon="arrow_back"
            label="Back"
            color="dark"
            @click="$router.go(-1)"
            aria-label="Go back"
          />
        </div>
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

      <!-- Main content -->
      <div class="row q-col-gutter-md">
        <div class="col-7">
          <q-card
            class="task-info-card q-pa-lg shadow-2 rounded-borders"
            role="article"
            style="height: 100%;"
            :aria-label="`Task details for ${task.title}`"
          >
            <div class="text-h5 text-weight-bold q-mb-lg">Task Information</div>
            <div class="row q-col-gutter-md">
              <!-- Left side -->
              <div class="col-7">
                <!-- Title -->
                <div class="q-mb-md" role="group" aria-label="Task title">
                  <div class="text-caption text-grey text-weight-bold">Title</div>
                  <div class="text-body1 text-weight-medium">{{ task.title }}</div>
                </div>

                <!-- Assignee and Due Date -->
                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-6" role="group" aria-label="Task assignee">
                    <div class="text-caption text-grey text-weight-bold">Assign</div>
                    <div class="text-body2">
                      <q-icon name="person" size="14px" class="q-mr-xs text-grey-7" />{{
                        task.assignee
                      }}
                    </div>
                  </div>
                  <div class="col-6" role="group" aria-label="Task due date">
                    <div class="text-caption text-grey text-weight-bold">Due Date</div>
                    <div class="text-body2">
                      <q-icon name="event" size="14px" class="q-ml-md q-mr-xs text-grey-7" />{{
                        formatDate(task.due_date)
                      }}
                    </div>
                  </div>
                </div>

                <div class="row q-col-gutter-md q-mb-md">
                  <div class="col-6" role="group" aria-label="Task priority">
                    <div class="text-caption text-grey text-weight-bold">Priority</div>
                    <q-badge
                      :color="
                        task.priority === 'high'
                          ? 'red'
                          : task.priority === 'medium'
                            ? 'orange'
                            : 'green'
                      "
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
                    <div class="text-caption text-grey text-weight-bold">Status</div>
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

                <!-- Description -->
              </div>
            </div>
            <div role="group" aria-label="Task description">
              <div class="text-caption text-grey text-weight-bold">Description</div>
              <div class="text-body2">{{ task.desc }}</div>
            </div>
          </q-card>
        </div>
        <!-- Right side -->
        <div class="col-5">
          <!-- Extra content (optional placeholder) -->
          <div class="additional-content">
            <DashboardWidget
              title="Recent Activity"
              :loading="loading"
              role="region"
              aria-label="Recent task activity"
              class="recent-activity"
            >
              <!-- <div class="text-caption text-grey text-weight-bold">Recent Activity</div> -->
              <div v-if="recentActivities.length" class="column">
                <q-card
                  v-for="(activity, i) in recentActivities"
                  :key="i"
                  flat
                  bordered
                  class="q-mb-sm q-pa-sm flex items-start"
                >
                  <q-icon
                    :name="
                      activity.action === 'Completed'
                        ? 'check_circle'
                        : activity.action === 'Overdue'
                          ? 'error'
                          : activity.action === 'Created'
                            ? 'add_circle'
                            : 'schedule'
                    "
                    :color="activity.color"
                    size="sm"
                    class="q-mt-xs"
                  />

                  <div class="col q-ml-md">
                    <div class="text-body2">
                      <span class="text-weight-bold">{{ activity.desc }}</span>
                      was {{ activity.action.toLowerCase() }}
                    </div>
                    <div class="text-caption text-grey text-weight-bold">
                      {{ activity.time }}
                    </div>
                  </div>
                </q-card>
              </div>

              <div v-else class="text-grey text-subtitle2">No recent activities</div>
            </DashboardWidget>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <q-banner dense class="bg-red text-white">Task not found</q-banner>
    </div>
  </q-page>

  <NewTaskDialog v-model="editDialog" :initial-task="task" @update-task="updateTask" />

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
import { useNotify } from 'src/composables/useNotify';
import { date } from 'quasar';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import NewTaskDialog from 'components/TaskDialog.vue';
import DashboardWidget from 'components/DashboardWidget.vue';

export default {
  name: 'TaskDetailPage',
  components: {
    ConfirmDialog,
    NewTaskDialog,
    DashboardWidget,
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const taskStore = useTaskStore();
    const { success } = useNotify();

    const deleteDialog = ref(false);
    const editDialog = ref(false);
    const loading = ref(false);

    const taskId = route.params.id as string;
    const task = computed<Task | null>(() => {
      return taskStore.tasks.find((t) => t.id === taskId) ?? null;
    });

    const recentActivities = computed(() =>
      [...taskStore.tasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5)
        .map((t) => {
          let action = 'Updated';
          let color = 'primary';
          if (!t.is_complete && new Date(t.due_date) < new Date()) {
            action = 'Overdue';
            color = 'negative';
          } else if (t.is_complete) {
            action = 'Completed';
            color = 'positive';
          } else if (t.created_at === t.updated_at) {
            action = 'Created';
            color = 'info';
          }
          return {
            action,
            time: date.formatDate(t.updated_at, 'MMM D, hh:mm A'),
            desc: t.title,
            color,
          };
        }),
    );

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

    function updateTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
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
        const taskTitle = task.value.title;
        taskStore.deleteTask(task.value.id);
        deleteDialog.value = false;
        success(`Task "${taskTitle}" deleted successfully!`);
        void router.push({ name: 'task-list' });
      }
    }

    return {
      task,
      deleteDialog,
      editDialog,
      loading,
      recentActivities,
      formatDate,
      markComplete,
      editTask,
      deleteTask,
      confirmDelete,
      updateTask,
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
