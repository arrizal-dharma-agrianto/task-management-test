<template>
  <q-page padding>
    <!-- Header -->
    <div class="row items-center justify-between q-mb-md">
      <div class="row items-center q-mb-md q-ml-md">
        <q-checkbox v-model="selectAll" @update:model-value="toggleSelectAll" />
        <div class="text-h6">TASK ({{ tasks.length }})</div>
      </div>
      <div class="row items-center">
        <q-btn color="primary" label="+ New Task" @click="newTask = true" flat rounded />
        <TaskFilterBar
          v-model:search="filter"
          v-model:assignee="assigneeFilter"
          v-model:dueDate="dueDateFilter"
          aria-label="Task filter bar"
        />
      </div>
    </div>

    <!-- Bulk Actions -->
    <div v-if="selectedIds.length > 0" class="row items-center q-gutter-sm q-mb-md">
      <q-btn color="positive" label="Mark Complete" @click="markSelected(true)" />
      <q-btn color="grey" label="Mark Incomplete" @click="markSelected(false)" />
      <q-btn color="negative" label="Bulk Delete" @click="bulkDeleteDialog = true" />
    </div>

    <!-- Task List -->
    <div v-if="pagedTasks.length > 0" class="column q-gutter-md">
      <q-card
        v-for="task in pagedTasks"
        :key="task.id"
        class="q-pa-md cursor-pointer"
        flat
        bordered
        style="border-radius: 12px"
        @click="goToDetail(task.id)"
      >
        <div class="row items-center justify-between">
          <div class="row items-start">
            <q-checkbox v-model="selectedIds" :val="task.id" size="md" class="q-mr-md" />
            <div class="row items-start q-gutter-sm justify-between">
              <div>
                <div style="font-size: 18px" class="text-subtitle1">{{ task.title }}</div>
                <div
                  style="font-size: 14px; margin-top: 8px"
                  class="text-caption text-negative row items-center"
                >
                  <!-- User -->
                  <q-icon name="person" size="14px" class="q-mr-xs text-blue" />
                  <span class="text-blue">{{ task.assignee }}</span>

                  <!-- Due date -->
                  <q-icon
                    name="event"
                    size="14px"
                    class="q-ml-md q-mr-xs"
                    :class="[
                      task.is_complete
                        ? 'text-positive'
                        : new Date(task.due_date) < new Date()
                          ? 'text-negative'
                          : 'text-positive',
                    ]"
                  />
                  <span
                    :class="[
                      task.is_complete
                        ? 'text-positive'
                        : new Date(task.due_date) < new Date()
                          ? 'text-negative'
                          : 'text-positive',
                    ]"
                  >
                    {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right: Priority & Status -->
          <div class="row items-center q-gutter-sm">
            <PriorityBadge :priority="task.priority" />
            <TaskBadge :status="task.is_complete" />
            <!-- Action Menu -->
            <q-btn icon="more_vert" @click.stop flat round dense>
              <q-menu auto-close>
                <q-list style="min-width: 150px">
                  <q-item clickable v-ripple @click="editTask(task)">
                    <q-icon size="14px" name="edit" color="primary q-mt-sm q-mr-sm" />
                    <q-item-section class="text-primary">Edit</q-item-section>
                  </q-item>

                  <q-item clickable v-ripple @click="askDelete(task)">
                    <q-icon size="14px" name="delete" color="negative q-mt-sm q-mr-sm" />
                    <q-item-section class="text-negative">Delete</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
        </div>
      </q-card>
    </div>

    <!-- Empty State -->
    <div v-else class="flex flex-center text-grey-7 q-my-xl">
      <q-icon name="inbox" size="md" class="q-mr-sm" />
      <span>No tasks found</span>
    </div>

    <!-- Pagination -->
    <div v-if="tasks.length > pageSize" class="row justify-center q-mt-lg">
      <q-pagination
        v-model="page"
        :max="maxPage"
        max-pages="5"
        boundary-numbers
        direction-links
        color="primary"
      />
    </div>

    <!-- Dialogs -->
    <NewTaskDialog v-model="newTask" @create-task="createTask" />
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
    <ConfirmDialog
      v-model="bulkDeleteDialog"
      title="Delete Tasks"
      message="Are you sure you want to delete the selected tasks?"
      confirmLabel="Delete"
      cancelLabel="Cancel"
      color="negative"
      icon="warning"
      @confirm="confirmBulkDelete"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskStore } from 'stores/task-store';
import type { Task } from 'src/types/task';
import NewTaskDialog from 'components/TaskDialog.vue';
import ConfirmDialog from 'components/ConfirmDialog.vue';
import TaskFilterBar from 'components/TaskFilterBar.vue';
import PriorityBadge from 'components/PriorityBadge.vue';
import TaskBadge from 'components/TaskBadge.vue';
import { useNotify } from 'src/composables/useNotify';

export default defineComponent({
  name: 'TaskPage',
  components: {
    NewTaskDialog,
    ConfirmDialog,
    PriorityBadge,
    TaskFilterBar,
    TaskBadge,
  },
  setup() {
    const router = useRouter();
    const taskStore = useTaskStore();
    const { success } = useNotify();
    const filter = ref('');
    const show_filter = ref(false);
    const assigneeFilter = ref('');
    const dueDateFilter = ref('');
    const err = ref('');
    const loading = ref(true);

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

    // pagination
    const page = ref(1);
    const pageSize = 8;
    const maxPage = computed(() => Math.ceil(tasks.value.length / pageSize));

    const pagedTasks = computed(() => {
      const start = (page.value - 1) * pageSize;
      return tasks.value.slice(start, start + pageSize);
    });

    // checkbox selection
    const selectedIds = ref<string[]>([]);
    const selectedTasks = computed(() =>
      tasks.value.filter((t) => selectedIds.value.includes(String(t.id))),
    );
    const selectAll = ref(false);

    watch(pagedTasks, () => {
      // reset selectAll setiap ganti halaman
      selectAll.value = false;
      selectedIds.value = [];
    });

    function toggleSelectAll(val: boolean) {
      if (val) {
        selectedIds.value = pagedTasks.value.map((t) => String(t.id));
      } else {
        selectedIds.value = [];
      }
    }

    // dialogs
    const newTask = ref(false);
    const editDialog = ref(false);
    const deleteDialog = ref(false);
    const bulkDeleteDialog = ref(false);
    const selectedTask = ref<Task | null>(null);

    function createTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      taskStore.addTask(payload);
    }

    function updateTask(payload: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
      if (selectedTask.value) {
        taskStore.editTask(selectedTask.value.id, payload);
        editDialog.value = false;
      }
    }

    function openTaskMenu(task: Task) {
      selectedTask.value = task;
      editDialog.value = true;
    }

    function confirmDelete() {
      if (selectedTask.value) {
        taskStore.deleteTask(selectedTask.value.id);
        deleteDialog.value = false;
        success(`Task "${selectedTask.value.title}" deleted successfully!`);
      }
    }

    function markSelected(status: boolean) {
      selectedTasks.value.forEach((task) => {
        taskStore.editTask(task.id, { ...task, is_complete: status });
      });
      if (selectedTasks.value.length > 0) {
        success(
          `${selectedTasks.value.length} task(s) marked as ${
            status ? 'complete' : 'incomplete'
          }`
        );
      }
      selectedIds.value = [];
      selectAll.value = false;
    }

    function confirmBulkDelete() {
      selectedTasks.value.forEach((task) => {
        taskStore.deleteTask(task.id);
      });
      success(`${selectedTasks.value.length} tasks deleted!`);
      selectedIds.value = [];
      selectAll.value = false;
      bulkDeleteDialog.value = false;
    }

    function goToDetail(taskId: string) {
      void router.push({ name: 'task-detail', params: { id: String(taskId) } });
    }

    function editTask(task: Task) {
      selectedTask.value = task;
      editDialog.value = true;
    }

    function askDelete(task: Task) {
      selectedTask.value = task;
      deleteDialog.value = true;
    }

    function formatDate(date: string): string {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short', // Jan, Feb, Mar
        day: 'numeric',
      }).format(new Date(date));
    }

    return {
      tasks,
      page,
      pageSize,
      maxPage,
      pagedTasks,
      selectedIds,
      selectedTasks,
      selectAll,
      newTask,
      editDialog,
      deleteDialog,
      bulkDeleteDialog,
      selectedTask,
      filter,
      show_filter,
      assigneeFilter,
      dueDateFilter,
      createTask,
      updateTask,
      confirmDelete,
      confirmBulkDelete,
      markSelected,
      openTaskMenu,
      toggleSelectAll,
      goToDetail,
      editTask,
      askDelete,
      formatDate,
    };
  },
});
</script>
