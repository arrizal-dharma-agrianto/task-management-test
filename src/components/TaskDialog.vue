<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card flat class="task-dialog-card" style="width: 100%; max-width: 520px">
      <q-card-section class="q-pb-sm">
        <div class="text-subtitle1 text-weight-medium">
          {{ initialTask ? 'Edit Task' : 'Add Task' }}
        </div>
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="confirm">
        <q-card-section class="q-pt-none">
          <div class="q-gutter-md">
            <q-input
              v-model="title"
              label="Title"
              filled
              autofocus
              lazy-rules
              :rules="[(val) => !!val || '*Required']"
            />
            <q-input
              v-model="desc"
              label="Description"
              filled
              lazy-rules
              :rules="[(val) => !!val || '*Required']"
            />
            <q-input
              v-model="assignee"
              label="Assignee"
              filled
              lazy-rules
              :rules="[(val) => !!val || '*Required']"
            />
            <q-select
              v-model="priority"
              :options="priorityOptions"
              label="Priority"
              emit-value
              map-options
              filled
              lazy-rules
              :rules="[(val) => !!val || '*Required']"
            />
            <q-input
              v-model="due_date"
              type="date"
              label="Due Date"
              filled
              lazy-rules
              :rules="[(val) => !!val || '*Required']"
            />
            <q-checkbox v-if="initialTask" v-model="is_complete" label="Mark as complete" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pt-none q-gutter-sm">
          <q-btn outline color="primary" label="Cancel" @click="close" />
          <q-btn
            unelevated
            color="primary"
            label="Confirm"
            type="submit"
            :loading="loading"
            :disable="loading"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { Task } from 'src/types/task';
import type { PropType } from 'vue';
// import { useQuasar } from 'quasar';
import { useNotify } from 'src/composables/useNotify';

export default defineComponent({
  name: 'NewTaskDialog',
  props: {
    modelValue: { type: Boolean, required: true },
    initialTask: {
      type: Object as PropType<Task | null>,
      default: null,
    },
  },
  emits: ['update:modelValue', 'create-task', 'update-task'],
  setup(props, { emit }) {
    const { success, error } = useNotify();
    const formRef = ref();

    const title = ref('');
    const desc = ref('');
    const assignee = ref('');
    const priority = ref<'low' | 'medium' | 'high'>('low');
    const due_date = ref('');
    const is_complete = ref(false);
    const loading = ref(false);
    const priorityOptions = [
      { label: 'Low', value: 'low' },
      { label: 'Medium', value: 'medium' },
      { label: 'High', value: 'high' },
    ];

    watch(
      () => props.initialTask,
      (task) => {
        if (task) {
          title.value = task.title;
          desc.value = task.desc;
          assignee.value = task.assignee;
          priority.value = task.priority;
          due_date.value = task.due_date;
          is_complete.value = task.is_complete;
        }
      },
      { immediate: true },
    );

    watch(
      () => props.modelValue,
      (val) => {
        if (val && !props.initialTask) {
          resetForm();
        }
      },
    );

    function resetForm() {
      title.value = '';
      desc.value = '';
      assignee.value = '';
      priority.value = 'low';
      due_date.value = '';
      is_complete.value = false;
    }

    function close() {
      emit('update:modelValue', false);
    }

    async function confirm() {
      const valid = await formRef.value.validate();
      if (!valid) {
        error('Please fill all required fields');
        return;
      }

      loading.value = true;
      try {
        const payload = {
          title: title.value,
          desc: desc.value,
          assignee: assignee.value,
          priority: priority.value,
          due_date: due_date.value,
          is_complete: is_complete.value,
        };

        if (props.initialTask) {
          emit('update-task', payload);
          success(`Task "${payload.title}" updated successfully! You can now start working on it!`);
        } else {
          emit('create-task', payload);
          success(`Task "${payload.title}" created successfully! You can now start working on it!`);
        }

        close();
        resetForm();
      } catch {
        error('Failed to save task');
      } finally {
        loading.value = false;
      }
    }

    return {
      title,
      desc,
      assignee,
      priority,
      due_date,
      is_complete,
      close,
      confirm,
      formRef,
      loading,
      priorityOptions,
    };
  },
});
</script>
<style scoped>
.task-dialog-card {
  border-radius: 14px;
  background: var(--q-background, #ffffff);
}

/* Subtle label and helper colors are handled by Quasar theme; keep customizations minimal */

/* Ensure checkbox aligns with inputs spacing */
.q-checkbox {
  margin-top: 2px;
}

@media (max-width: 600px) {
  .task-dialog-card {
    border-radius: 12px;
  }
}
</style>
