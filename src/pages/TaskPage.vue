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
      :filter="filter"
      selection="multiple"
      v-model:selected="selected"
      :loading="loading"
      aria-label="Task list table"
      role="table"
    >
      <template v-slot:top-right>
        <div
          v-if="selected.length > 0"
          class="row items-center q-gutter-sm"
          role="toolbar"
          aria-label="Bulk actions for selected tasks"
        >
          <q-btn
            color="positive"
            label="Mark Complete"
            @click="markSelected(true)"
            aria-label="Mark selected tasks complete"
          />
          <q-btn
            color="grey"
            label="Mark Incomplete"
            @click="markSelected(false)"
            aria-label="Mark selected tasks incomplete"
          />
          <q-btn
            color="negative"
            label="Bulk Delete"
            @click="openBulkDeleteConfirm"
            aria-label="Delete selected tasks"
          />
        </div>
        <div v-else class="row items-center" aria-label="Task actions">
          <q-btn
            color="primary"
            label="Add Task"
            @click="newTask = true"
            aria-label="Add new task"
          />
          <NewTaskDialog v-model="newTask" @create-task="createTask" />

          <TaskFilterBar
            v-model:search="filter"
            v-model:assignee="assigneeFilter"
            v-model:dueDate="dueDateFilter"
            aria-label="Task filter bar"
          />
        </div>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-7 q-pa-md">
          <q-icon name="inbox" size="md" class="q-mr-sm" />
          <span>No tasks found</span>
        </div>
      </template>

      <template v-slot:body-cell-is_complete="props">
        <q-td :props="props" aria-label="Task completion status">
          <TaskBadge :status="props.row.is_complete" />
        </q-td>
      </template>

      <template v-slot:body-cell-priority="props">
        <q-td :props="props" aria-label="Task priority">
          <PriorityBadge :priority="props.row.priority" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" aria-label="Task actions">
          <TaskActions :row="props.row" @edit="openEditDialog" @delete="openDeleteConfirm" />
        </q-td>
      </template>
    </q-table>

    <NewTaskDialog
      v-model="editDialog"
      :initial-task="selectedTask"
      @update-task="updateTask"
      aria-label="Edit task dialog"
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
      aria-label="Delete task confirmation dialog"
    />
    <ConfirmDialog
      v-model="bulkDeleteDialog"
      title="Delete Tasks"
      message="Are you sure you want to delete the selected tasks?"
      confirmLabel="Delete"
      cancelLabel="Cancel"
      color="negative"
      icon="warning"
      @confirm="confirmBulkDelete"
      aria-label="Bulk delete confirmation dialog"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type {  QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import TaskDialog from 'components/TaskDialog.vue';
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';
import TaskFilterBar from 'components/TaskFilterBar.vue';
import TaskBadge from 'components/TaskBadge.vue';
import PriorityBadge from 'components/PriorityBadge.vue';
import TaskActions from 'components/TaskActions.vue';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import { useNotify } from 'src/composables/useNotify';

export default defineComponent({
  name: 'TaskPage',
  components: {
    NewTaskDialog: TaskDialog,
    TaskFilterBar,
    TaskBadge,
    ConfirmDialog,
    PriorityBadge,
    TaskActions,
  },
  setup() {
    const { success, error } = useNotify();
    const router = useRouter();
    const taskStore = useTaskStore();

    const filter = ref('');
    const show_filter = ref(false);
    const assigneeFilter = ref('');
    const dueDateFilter = ref('');
    const selected = ref<Task[]>([]);
    const bulkDeleteDialog = ref(false);

    const loading = ref(true);
    const err = ref<string | null>(null);

    onMounted(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        taskStore.loadFromStorage();
      } catch {
        err.value = 'Failed to load tasks. Please try again.';
      } finally {
        loading.value = false;
      }
    });

    const tasks = computed(() => {
      return taskStore.tasks.filter((t) => {
        const matchesSearch =
          !filter.value ||
          t.title.toLowerCase().includes(filter.value.toLowerCase()) ||
          t.desc.toLowerCase().includes(filter.value.toLowerCase()) ||
          t.assignee.toLowerCase().includes(filter.value.toLowerCase());

        const matchesAssignee =
          !assigneeFilter.value ||
          t.assignee.toLowerCase().includes(assigneeFilter.value.toLowerCase());

        const matchesDueDate = !dueDateFilter.value || t.due_date === dueDateFilter.value;

        return matchesSearch && matchesAssignee && matchesDueDate;
      });
    });

    const columns: QTableColumn[] = [
      { name: 'title', label: 'Title', field: 'title', align: 'left' },
      { name: 'desc', label: 'Description', field: 'desc', align: 'left' },
      { name: 'priority', label: 'Priority', field: 'priority', align: 'center' },
      { name: 'assignee', label: 'Assignee', field: 'assignee', align: 'center' },
      { name: 'due_date', label: 'Due Date', field: 'due_date', align: 'center' },
      { name: 'is_complete', label: 'Status', field: 'is_complete', align: 'center' },
      { name: 'actions', label: 'Actions', field: 'id', align: 'center' },
    ];

    const newTask = ref(false);
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const selectedTask = ref<Task | null>(null);

    function createTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      taskStore.addTask(payload);
    }

    function openEditDialog(task: Task) {
      selectedTask.value = { ...task };
      editDialog.value = true;
    }

    function updateTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      if (selectedTask.value) {
        taskStore.editTask(selectedTask.value.id, payload);
        editDialog.value = false;
      }
    }

    function openDeleteConfirm(task: Task) {
      selectedTask.value = task;
      deleteDialog.value = true;
    }

    function confirmDelete() {
      if (selectedTask.value) {
        taskStore.deleteTask(selectedTask.value.id);
        deleteDialog.value = false;

        success(`Task "${selectedTask.value.title}" deleted successfully!`);
      }
    }

    async function goToDetail(_evt: unknown, row: Task) {
      try {
        await router.push({ name: 'task-detail', params: { id: row.id } });
      } catch {
        err.value = 'Failed to navigate to task detail.';
        error('Failed to navigate to task detail.');
      }
    }

    function markSelected(status: boolean) {
      selected.value.forEach((task) => {
        taskStore.editTask(task.id, { ...task, is_complete: status });
      });
      selected.value = [];
    }

    function openBulkDeleteConfirm() {
      bulkDeleteDialog.value = true;
    }

    function confirmBulkDelete() {
      selected.value.forEach((task) => {
        taskStore.deleteTask(task.id);
      });

      success(`${selected.value.length} task deleted!`);

      selected.value = [];
      bulkDeleteDialog.value = false;
    }

    return {
      tasks,
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
      goToDetail,
      filter,
      show_filter,
      assigneeFilter,
      dueDateFilter,
      selected,
      markSelected,
      loading,
      bulkDeleteDialog,
      openBulkDeleteConfirm,
      confirmBulkDelete,
    };
  },
});
</script>
