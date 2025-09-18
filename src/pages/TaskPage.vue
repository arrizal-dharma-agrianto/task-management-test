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
    >
      <template v-slot:top-right>
        <div v-if="selected.length > 0" class="row items-center q-gutter-sm">
          <q-btn color="positive" label="Mark Complete" @click="markSelected(true)" />
          <q-btn color="grey" label="Mark Incomplete" @click="markSelected(false)" />
        </div>
        <div v-else class="row items-center">
          <q-btn color="primary" label="Add Task" @click="newTask = true" />
          <NewTaskDialog v-model="newTask" @create-task="createTask" />

          <TaskFilterBar
            v-model:search="filter"
            v-model:assignee="assigneeFilter"
            v-model:dueDate="dueDateFilter"
          />
        </div>
      </template>

      <template v-slot:no-data>
        <div class="full-width row flex-center text-grey-7 q-pa-md">
          <q-icon name="inbox" size="md" class="q-mr-sm" />
          <span>No tasks found</span>
        </div>
      </template>

      <template v-if="error" v-slot:top>
        <div class="bg-red-2 text-red-9 q-pa-sm q-mb-sm rounded-borders">
          <q-icon name="warning" class="q-mr-sm" />
          {{ error }}
        </div>
      </template>

      <template v-slot:body-cell-is_complete="props">
        <q-td :props="props">
          <TaskBadge :status="props.row.is_complete" />
        </q-td>
      </template>

      <template v-slot:body-cell-priority="props">
        <q-td :props="props">
          <PriorityBadge :priority="props.row.priority" />
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <TaskActions :row="props.row" @edit="openEditDialog" @delete="openDeleteConfirm" />
        </q-td>
      </template>
    </q-table>

    <NewTaskDialog v-model="editDialog" :initial-task="selectedTask" @update-task="updateTask" />

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
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useRouter } from 'vue-router';
import TaskDialog from 'components/TaskDialog.vue';
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';
import TaskFilterBar from 'components/TaskFilterBar.vue';
import TaskBadge from 'components/TaskBadge.vue';
import PriorityBadge from 'components/PriorityBadge.vue';
import TaskActions from 'components/TaskActions.vue';
import ConfirmDialog from 'components/ConfirmDialog.vue';

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
    const router = useRouter();
    const taskStore = useTaskStore();

    const filter = ref('');
    const show_filter = ref(false);
    const assigneeFilter = ref('');
    const dueDateFilter = ref('');
    const selected = ref<Task[]>([]);

    const loading = ref(true);
    const error = ref<string | null>(null);

    onMounted(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        taskStore.loadFromStorage();
      } catch (err) {
        error.value = 'Failed to load tasks. Please try again.';
        console.error(err);
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
      }
    }

    async function goToDetail(_evt: unknown, row: Task) {
      try {
        await router.push({ name: 'task-detail', params: { id: row.id } });
      } catch (err) {
        error.value = 'Failed to navigate to task detail.';
        console.error(err);
      }
    }

    function markSelected(status: boolean) {
      selected.value.forEach((task) => {
        taskStore.editTask(task.id, { ...task, is_complete: status });
      });
      selected.value = [];
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
      error,
    };
  },
});
</script>
