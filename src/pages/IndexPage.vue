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
        <q-btn
          color="primary"
          icon="add"
          label="Add Task"
          @click="newTask = true"
        />
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
        <q-btn
          color="grey-8"
          icon="filter_alt"
          label="Filter & Search"
          @click="toggleFilters"
        />
      </q-card-actions>
    </DashboardWidget>
    <q-dialog v-model="bulkCompleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="done_all" color="positive" size="md" class="q-mr-sm" />
          <span>Mark ALL tasks as completed?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Confirm"
            color="positive"
            @click="confirmBulkComplete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="bulkDeleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" size="md" class="q-mr-sm" />
          <span>Delete ALL tasks permanently?</span>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            @click="confirmBulkDelete"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="newTask">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Task</div>
        </q-card-section>
        <q-card-section>
          <TaskForm @save="createTask" @cancel="newTask = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
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

    <q-dialog v-model="newTask">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Add Task</div>
        </q-card-section>
        <q-card-section>
          <TaskForm @save="createTask" @cancel="newTask = false" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script lang="ts">
import { defineComponent, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import { useTaskStore } from 'stores/task-store';
import PriorityChart from 'components/charts/PriorityChart.vue';
import DashboardWidget from 'components/DashboardWidget.vue';
import TaskList from 'components/TaskList.vue';
import TaskForm from 'components/TaskForm.vue';
import type { Task } from 'src/types/task';
import { taskService } from 'src/services/task-service';

export default defineComponent({
  name: 'IndexPage',
  components: {
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart.vue')),
    PriorityChart,
    DashboardWidget,
    TaskList,
    TaskForm,
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
