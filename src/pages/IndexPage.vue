<template>
  <q-page padding>
    <div class="q-mb-lg">
      <div class="text-h4 text-weight-bold">Task Management Dashboard</div>
      <div class="text-subtitle2 text-grey">Overview of your tasks and productivity insights</div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col">
        <q-card class="q-mb-lg relative-position">
          <q-inner-loading
            :showing="loading"
            class="absolute-full flex flex-center bg-white/70"
            style="z-index: 10"
          >
            <q-spinner color="primary" size="40px" />
          </q-inner-loading>

          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-3" v-for="stat in statsData" :key="stat.label">
                <q-card bordered flat>
                  <q-card-section>
                    <div class="row items-center justify-between">
                      <div>
                        <div class="text-caption text-grey-7">{{ stat.label }}</div>
                        <div :class="stat.color + ' text-h6 text-weight-bold'">
                          {{ stat.value }}
                        </div>
                      </div>
                      <q-avatar :color="stat.bg" size="40px">
                        <q-icon :name="stat.icon" color="white" />
                      </q-avatar>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <q-card class="q-mb-lg" bordered flat>
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Quick Actions</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="around">
            <q-btn color="primary" icon="add" label="Add Task" @click="newTask = true" />
            <q-btn color="positive" icon="done_all" label="Bulk Complete" @click="bulkComplete" />
            <q-btn color="negative" icon="delete_sweep" label="Bulk Delete" @click="bulkDelete" />
            <q-btn
              color="grey-8"
              icon="filter_alt"
              label="Filter & Search"
              @click="toggleFilters"
            />
          </q-card-actions>
        </q-card>
      </div>

      <div class="col-12">
        <PieChart />
      </div>

      <div class="col-12 col-md-4">
        <q-card class="relative-position">
          <q-inner-loading
            :showing="loading"
            class="absolute-full flex flex-center bg-white/70"
            style="z-index: 10"
          >
            <q-spinner color="primary" size="40px" />
          </q-inner-loading>

          <q-card-section>
            <div class="text-h6">Tasks by Priority</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <PriorityChart :data="priorityData" :total="totalTasks" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="relative-position">
          <q-inner-loading
            :showing="loading"
            class="absolute-full flex flex-center bg-white/70"
            style="z-index: 10"
          >
            <q-spinner color="primary" size="40px" />
          </q-inner-loading>

          <q-card-section>
            <div class="text-h6">Task Statistics</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1">Total: {{ totalTasks }}</div>
            <div class="text-positive">Completed: {{ completedTasks }}</div>
            <div class="text-warning">Pending: {{ pendingTasks }}</div>
            <div class="text-negative">Overdue: {{ overdueTasks }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card class="relative-position">
          <q-inner-loading
            :showing="loading"
            class="absolute-full flex flex-center bg-white/70"
            style="z-index: 10"
          >
            <q-spinner color="primary" size="40px" />
          </q-inner-loading>

          <q-card-section>
            <div class="text-h6">Recent Activity</div>
          </q-card-section>
          <q-separator />
          <q-list bordered>
            <q-item v-for="task in recentTasks" :key="task.id">
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
                <q-item-label caption> Updated: {{ task.updated_at }} </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-badge
                  :color="task.is_complete ? 'green' : 'grey'"
                  :label="task.is_complete ? 'Complete' : 'Pending'"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <NewTaskDialog v-model="newTask" @create-task="createTask" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import { useTaskStore } from 'stores/task-store';
import TaskDialog from 'components/TaskDialog.vue';
import PriorityChart from 'components/charts/PriorityChart.vue';
import type { Task } from 'src/types/task';
import { taskService } from 'src/services/task-service';

export default defineComponent({
  name: 'IndexPage',
  components: {
    NewTaskDialog: TaskDialog,
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart.vue')),
    PriorityChart,
  },
  setup() {
    const taskStore = useTaskStore();
    const newTask = ref(false);

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
      bulkDelete,
      bulkComplete,
      toggleFilters,
      statsData,
      loading,
    };
  },
});
</script>

<!-- - Ensure reusability of components (TaskCard, TaskForm, TaskList, DashboardWidget)-->
<!-- - Add service abstraction (future API-ready layer)-->
<!-- - Write documentation (README: setup + architecture + decisions)-->
<!-- - Add time tracking log (setup, core, UI/UX, polish, docs)-->
