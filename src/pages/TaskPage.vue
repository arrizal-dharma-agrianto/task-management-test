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
      <template v-slot:body-cell-is_complete="props">
        <q-td :props="props">
          <q-badge
            :color="props.row.is_complete ? 'green' : 'grey'"
            :label="props.row.is_complete ? 'Complete' : 'Incomplete'"
          />
        </q-td>
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            dense
            flat
            round
            color="primary"
            icon="edit"
            @click.stop="openEditDialog(props.row)"
          />
          <q-btn
            dense
            flat
            round
            color="primary"
            icon="delete"
            @click.stop="openDeleteConfirm(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <NewTaskDialog
      v-model="editDialog"
      :initial-task="selectedTask"
      @update-task="updateTask"
    />

    <q-dialog v-model="deleteDialog">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="md" class="q-mr-sm" />
          <span>Are you sure you want to delete this task?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Delete" color="negative" @click="confirmDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar'
import { useRouter } from 'vue-router'
import TaskDialog from 'components/TaskDialog.vue'
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';

export default defineComponent({
  name: 'TaskPage',
  components: { NewTaskDialog: TaskDialog },
  setup() {
    const router = useRouter()
    const taskStore = useTaskStore()

    onMounted(() => {
      taskStore.loadFromStorage()
    })

    const tasks = computed(() => taskStore.tasks)

    const columns: QTableColumn[] = [
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      { name: 'desc', label: 'Description', field: 'desc', align: 'left' },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'center' },
      { name: 'assignee', label: 'Assignee', field: 'assignee', align: 'center' },
      { name: 'due_date', label: 'Due Date', field: 'due_date', align: 'center' },
      { name: 'is_complete', label: 'Status', field: 'is_complete', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'id', align: 'center' },
    ]

    const newTask = ref(false)
    const editDialog = ref(false)
    const deleteDialog = ref(false)
    const selectedTask = ref<Task | null>(null)

    function createTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      taskStore.addTask(payload)
      console.log('All tasks in store:', taskStore.tasks)
    }

    function openEditDialog(task: Task) {
      selectedTask.value = { ...task }
      editDialog.value = true
    }

    function updateTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      if (selectedTask.value) {
        taskStore.editTask(selectedTask.value.id, payload)
        editDialog.value = false
      }
    }

    function openDeleteConfirm(task: Task) {
      selectedTask.value = task
      deleteDialog.value = true
    }

    function confirmDelete() {
      if (selectedTask.value) {
        taskStore.deleteTask(selectedTask.value.id)
        deleteDialog.value = false
      }
    }
    async function goToDetail(_evt: unknown, row: Task) {
      try {
        await router.push({ name: 'task-detail', params: { id: row.id } })
      } catch (err) {
        console.error(err)
      }
    }

    return {     tasks,
      columns,
      newTask,
      editDialog,
      deleteDialog,
      selectedTask,
      createTask,
      openEditDialog,
      updateTask,
      openDeleteConfirm,
      confirmDelete,
      goToDetail
    }
  },
})
</script>
