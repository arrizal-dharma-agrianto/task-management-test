<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="text-h4 text-weight-bold">Task Management Dashboard</div>
      <div class="text-subtitle2 text-grey">Overview of your tasks and productivity insights</div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-3" v-for="stat in statsData" :key="stat.label">
        <DashboardWidget :title="stat.label" :loading="loading">
          <div class="row items-center justify-between">
            <div :class="stat.color + ' text-h6 text-weight-bold'">{{ stat.value }}</div>
            <q-avatar :color="stat.bg" size="40px">
              <q-icon :name="stat.icon" color="white" />
            </q-avatar>
          </div>
        </DashboardWidget>
      </div>
    </div>

    <DashboardWidget title="Quick Actions">
      <q-card-actions align="around">
        <q-btn color="primary" icon="add" label="Add Task" @click="newTask = true" />
        <q-btn
          color="positive"
          icon="done_all"
          label="Bulk Complete"
          @click="bulkCompleteDialog = true"
        />
        <q-btn
          color="negative"
          icon="delete_sweep"
          label="Bulk Delete"
          @click="bulkDeleteDialog = true"
        />
        <q-btn color="grey-8" icon="filter_alt" label="Filter & Search" @click="toggleFilters" />
      </q-card-actions>
    </DashboardWidget>
    <ConfirmBulkDialog
      v-model="bulkCompleteDialog"
      title="Mark ALL tasks as completed?"
      message="This will mark every task as completed. Are you sure?"
      confirm-label="Confirm"
      cancel-label="Cancel"
      color="positive"
      icon="done_all"
      @confirm="confirmBulkComplete"
    />

    <ConfirmBulkDialog
      v-model="bulkDeleteDialog"
      title="Delete ALL tasks permanently?"
      message="This action cannot be undone. Continue?"
      confirm-label="Delete"
      cancel-label="Cancel"
      color="negative"
      icon="warning"
      @confirm="confirmBulkDelete"
    />
    <div class="row q-col-gutter-md q-mt-md">
      <div class="col-12">
        <PieChart />
      </div>
      <div class="col-12 col-md-4">
        <DashboardWidget title="Tasks by Priority" :loading="loading">
          <PriorityChart :data="priorityData" :total="totalTasks" />
        </DashboardWidget>
      </div>
      <div class="col-12 col-md-4">
        <DashboardWidget title="Task Statistics" :loading="loading">
          <div class="text-subtitle1">Total: {{ totalTasks }}</div>
          <div class="text-positive">Completed: {{ completedTasks }}</div>
          <div class="text-warning">Pending: {{ pendingTasks }}</div>
          <div class="text-negative">Overdue: {{ overdueTasks }}</div>
        </DashboardWidget>
      </div>

      <div class="col-12 col-md-4">
        <DashboardWidget title="Recent Activity" :loading="loading">
          <TaskList :tasks="recentTasks" />
        </DashboardWidget>
      </div>
    </div>

    <q-card-section>
      <NewTaskDialog v-model="newTask" @create-task="createTask" />
    </q-card-section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import { useTaskStore } from 'stores/task-store';
import PriorityChart from 'components/charts/PriorityChart.vue';
import DashboardWidget from 'components/DashboardWidget.vue';
import TaskList from 'components/TaskList.vue';
import type { Task } from 'src/types/task';
import { taskService } from 'src/services/task-service';
import NewTaskDialog from 'components/TaskDialog.vue';
import ConfirmBulkDialog from 'components/ConfirmBulkDialog.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    NewTaskDialog,
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart.vue')),
    PriorityChart,
    DashboardWidget,
    TaskList,
    ConfirmBulkDialog
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
      // {
      //   label: 'Total',
      //   value: totalTasks.value,
      //   color: 'text-primary',
      //   bg: 'primary',
      //   icon: 'task',
      // },
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
      { label: 'High Priority', value: 5, color: 'text-purple', bg: 'purple', icon: 'bolt' },
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

    function createTask(payload: Task) {
      taskStore.addTask(payload);
    }

    function bulkComplete() {
      taskStore.tasks.forEach((t) => (t.is_complete = true));
      taskService.saveAll(taskStore.tasks);
    }

    function bulkDelete() {
      taskStore.tasks = [];
      taskService.saveAll(taskStore.tasks);
    }

    function confirmBulkComplete() {
      bulkComplete();
      bulkCompleteDialog.value = false;
    }

    function confirmBulkDelete() {
      bulkDelete();
      bulkDeleteDialog.value = false;
    }

    function toggleFilters() {
      console.log('Filter clicked');
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
      toggleFilters,
      statsData,
      loading,
      confirmBulkDelete,
      confirmBulkComplete,
      bulkCompleteDialog,
      bulkDeleteDialog,
    };
  },
});
</script>

<!-- - Ensure reusability of components (TaskCard, TaskForm, TaskList, DashboardWidget)-->
<!-- - Add service abstraction (future API-ready layer)-->
<!-- - Write documentation (README: setup + architecture + decisions)-->
<!-- - Add time tracking log (setup, core, UI/UX, polish, docs)-->
