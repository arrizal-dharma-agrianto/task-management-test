<template>
  <q-page padding>
    <q-table
      title="Task List"
      :rows="tasks"
      :columns="columns"
      row-key="id"
      flat
      bordered
      @row-click="goToDetail"
    >
      <template v-slot:top-right>
        <q-btn color="primary" label="Add Task" @click="newTask = true" />
        <NewTaskDialog v-model="newTask" @create-task="createTask" />
      </template>
    </q-table>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
import type { QTableColumn } from 'quasar'
import { useRouter } from 'vue-router'
import NewTaskDialog from 'src/components/NewTaskDialog.vue'
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';

export default defineComponent({
  name: 'TaskPage',
  components: { NewTaskDialog },
  setup() {
    const router = useRouter()
    const taskStore = useTaskStore()

    const tasks = computed(() => taskStore.tasks)

    const columns: QTableColumn[] = [
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      { name: 'desc', label: 'Description', field: 'desc', align: 'left' },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'center' },
      { name: 'assignee', label: 'Assignee', field: 'assignee', align: 'center' },
      { name: 'due_date', label: 'Due Date', field: 'due_date', align: 'center' },
    ]

    const newTask = ref(false)

    function createTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      taskStore.addTask(payload)
      console.log('📌 All tasks in store:', taskStore.tasks)
    }

    async function goToDetail(_evt: unknown, row: Task) {
      try {
        await router.push({ name: 'task-detail', params: { id: row.id } })
      } catch (err) {
        console.error(err)
      }
    }

    return { tasks, columns, goToDetail, newTask, createTask }
  },
})
</script>
