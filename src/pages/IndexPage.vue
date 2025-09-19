<template>
  <q-page padding role="main" aria-label="Task management dashboard">
    <div class="q-mb-lg">
      <div class="text-h4 text-weight-bold">Task Management Dashboard</div>
      <div class="text-subtitle2 text-grey">Overview of your tasks and productivity insights</div>
    </div>
    <q-scroll-area style="height: 160px;" class="q-mb-md">
      <div
        class="row no-wrap q-col-gutter-md"
        style="padding-right: 1px; padding-left: 1px; padding-top: 1px"
        role="region"
        aria-label="Task statistics summary"
      >
        <div
          class="col-3"
          v-for="stat in statsData"
          :key="stat.label"
          tabindex="0"
          role="group"
          :aria-label="`${stat.label}: ${stat.value}`"
          style="min-width: 220px;"
        >
          <DashboardWidget :title="stat.label" :loading="loading" >
            <div class="row items-center justify-between">
              <div :class="stat.color + ' text-h6 text-weight-bold'">
                {{ stat.value }}
              </div>
              <q-avatar :color="stat.bg" size="40px" role="img" :aria-label="stat.label">
                <q-icon :name="stat.icon" color="white" />
              </q-avatar>
            </div>
          </DashboardWidget>
        </div>
      </div>
    </q-scroll-area>

    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12 col-md-8">
        <DashboardWidget
          title="Task Overview"
          :loading="loading"
          role="region"
          aria-label="Task distribution pie chart"
        >
          <PieChart :tasks="taskStore.tasks" />
        </DashboardWidget>

        <DashboardWidget
          title="Tasks by Priority"
          :loading="loading"
          role="region"
          aria-label="Tasks grouped by priority"
          class="q-mt-md"
        >
          <PriorityChart :data="priorityData" :total="totalTasks" />
        </DashboardWidget>
      </div>

      <div class="col-12 col-md-4">
        <DashboardWidget
          title="Recent Activity"
          :loading="loading"
          role="region"
          aria-label="Recent task activity"
          class="recent-activity"
        >
          <div class="" style="position: absolute; top: -50px; right: 14px">
            <q-btn
              color="primary"
              icon="add"
              @click="newTask = true"
              aria-label="Add new task"
              dense
              class="rounded-button"
            />
          </div>
          <div v-if="recentActivities.length" class="activity-scroll">
            <q-timeline dense>
              <q-timeline-entry
                v-for="(activity, i) in recentActivities"
                :key="i"
                :title="activity.action"
                :subtitle="activity.time"
                :color="activity.color"
                icon="event"
              >
                <div>{{ activity.desc }}</div>
              </q-timeline-entry>
            </q-timeline>
          </div>
          <div v-else class="text-grey text-subtitle2">No recent activities</div>
        </DashboardWidget>
      </div>
    </div>

    <q-card-section>
      <NewTaskDialog v-model="newTask" @create-task="createTask" aria-label="Add new task dialog" />
    </q-card-section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import { useTaskStore } from 'stores/task-store';
import PriorityChart from 'components/charts/PriorityChart.vue';
import DashboardWidget from 'components/DashboardWidget.vue';
import type { Task } from 'src/types/task';
import { taskService } from 'src/services/task-service';
import NewTaskDialog from 'components/TaskDialog.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    NewTaskDialog,
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart.vue')),
    PriorityChart,
    DashboardWidget,
  },
  setup() {
    const taskStore = useTaskStore();
    const newTask = ref(false);
    const bulkCompleteDialog = ref(false);
    const bulkDeleteDialog = ref(false);

    const loading = ref(true);

    onMounted(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        taskStore.loadFromStorage();
      } finally {
        loading.value = false;
      }
    });

    const statsData = computed(() => [
      {
        label: 'Total',
        value: totalTasks.value,
        color: 'text-primary',
        bg: 'primary',
        icon: 'task',
      },
      {
        label: 'Completed',
        value: completedTasks.value,
        color: 'text-positive',
        bg: 'positive',
        icon: 'check_circle',
      },
      {
        label: 'Pending',
        value: pendingTasks.value,
        color: 'text-warning',
        bg: 'warning',
        icon: 'schedule',
      },
      {
        label: 'Overdue',
        value: overdueTasks.value,
        color: 'text-negative',
        bg: 'negative',
        icon: 'error',
      },
    ]);
    const totalTasks = computed(() => taskStore.tasks.length);
    const completedTasks = computed(() => taskStore.tasks.filter((t) => t.is_complete).length);
    const pendingTasks = computed(() => taskStore.tasks.filter((t) => !t.is_complete).length);
    const overdueTasks = computed(() => {
      const now = new Date().toISOString().split('T')[0] ?? '';
      return taskStore.tasks.filter((t) => !t.is_complete && t.due_date < now).length;
    });

    const priorityData = computed(() => {
      return [
        {
          name: 'High',
          count: taskStore.tasks.filter((t) => t.priority === 'high').length,
          color: 'bg-red',
        },
        {
          name: 'Medium',
          count: taskStore.tasks.filter((t) => t.priority === 'medium').length,
          color: 'bg-yellow',
        },
        {
          name: 'Low',
          count: taskStore.tasks.filter((t) => t.priority === 'low').length,
          color: 'bg-green',
        },
      ];
    });

    const recentTasks = computed(() =>
      [...taskStore.tasks]
        .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        .slice(0, 5),
    );
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
            time: new Date(t.updated_at).toLocaleString(),
            desc: t.title,
            color,
          };
        }),
    );

    function createTask(payload: Task) {
      taskStore.addTask(payload);
    }

    function bulkDelete() {
      taskStore.tasks = [];
      taskService.saveAll(taskStore.tasks);
    }

    function confirmBulkDelete() {
      bulkDelete();
      bulkDeleteDialog.value = false;
    }

    return {
      newTask,
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
      priorityData,
      recentTasks,
      createTask,
      statsData,
      loading,
      confirmBulkDelete,
      bulkCompleteDialog,
      bulkDeleteDialog,
      recentActivities,
      taskStore,
    };
  },
});
</script>
<style scoped>
.activity-scroll {
  max-height: 505px;
  overflow-y: auto;
  padding-left: 8px;
}
.rounded-button{
  border-radius: 100%;
}
</style>
