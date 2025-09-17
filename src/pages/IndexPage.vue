<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-12">
        <q-card>
          <q-card-section>
            <PieChart />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Task Statistics</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-subtitle1">Total: {{ totalTasks }}</div>
            <div class="text-positive">Completed: {{ completedTasks }}</div>
            <div class="text-negative">Pending: {{ pendingTasks }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Recent Activity</div>
          </q-card-section>
          <q-separator />
          <q-list bordered>
            <q-item v-for="task in recentTasks" :key="task.id">
              <q-item-section>
                <q-item-label>{{ task.title }}</q-item-label>
                <q-item-label caption>
                  Updated: {{ task.updated_at }}
                </q-item-label>
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

      <div class="col-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Quick Actions</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="around">
            <q-btn
              color="primary"
              icon="add"
              label="Add Task"
              @click="newTask = true"
            />
            <q-btn
              color="negative"
              icon="delete_sweep"
              label="Bulk Delete"
              @click="bulkDelete"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <NewTaskDialog v-model="newTask" @create-task="createTask" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted, defineAsyncComponent } from 'vue';
import { useTaskStore } from 'stores/task-store'
import TaskDialog from 'components/TaskDialog.vue'
import type { Task } from 'src/types/task';

export default defineComponent({
  name: 'IndexPage',
  components: {
    NewTaskDialog: TaskDialog,
    PieChart: defineAsyncComponent(() => import('components/charts/PieChart.vue'))
  },
  setup() {
    const taskStore = useTaskStore()
    const newTask = ref(false)

    onMounted(() => {
      taskStore.loadFromStorage()
    })

    const totalTasks = computed(() => taskStore.tasks.length)
    const completedTasks = computed(() =>
      taskStore.tasks.filter(t => t.is_complete).length
    )
    const pendingTasks = computed(() =>
      taskStore.tasks.filter(t => !t.is_complete).length
    )
    const recentTasks = computed(() =>
      [...taskStore.tasks]
        .sort(
          (a, b) =>
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )
        .slice(0, 5)
    )

    function createTask(payload: Task) {
      taskStore.addTask(payload)
    }

    function bulkDelete() {
      taskStore.clearTasks()
    }

    return {
      newTask,
      totalTasks,
      completedTasks,
      pendingTasks,
      recentTasks,
      createTask,
      bulkDelete,
    }
  },
})
</script>
