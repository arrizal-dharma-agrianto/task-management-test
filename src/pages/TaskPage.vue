<template>
  <q-page padding>
    <q-table title="Task List" :rows="tasks" :columns="columns" row-key="id" flat bordered @row-click="goToDetail"/>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { mockTasks } from 'src/data/task';
import type { Task } from 'src/types/task';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'TaskPage',
  setup() {
    const router = useRouter()
    const tasks = ref<Task[]>(mockTasks);

    const columns: QTableColumn[] = [
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      { name: 'desc', label: 'Description', field: 'desc', align: 'left' },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'center' },
      { name: 'assignee', label: 'Assignee', field: 'assignee', align: 'center' },
      { name: 'due_date', label: 'Due Date', field: 'due_date', align: 'center' },
      { name: 'status', label: 'Status', field: 'status', align: 'center' },
    ];
    async function goToDetail(_evt: unknown, row: Task) {
      try {
        await router.push({ name: 'task-detail', params: { id: row.id } })
      } catch (err) {
        console.error(err)
      }
    }
    return { tasks, columns, goToDetail };
  },
});
</script>
