<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="(val) => $emit('update:modelValue', val)"
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">
          {{ initialTask ? 'Edit Task' : 'Add Task' }}
        </div>
      </q-card-section>

      <q-form ref="formRef" @submit.prevent="confirm">
        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="title"
            label="Title"
            autofocus
            :rules="[(val) => !!val || '*Required']"
          />
          <q-input
            dense
            v-model="desc"
            label="Description"
            class="q-mt-sm"
            :rules="[(val) => !!val || 'Description is required']"
          />
          <q-input
            dense
            v-model="assignee"
            label="Assignee"
            class="q-mt-sm"
            :rules="[(val) => !!val || 'Assignee is required']"
          />
          <q-select
            dense
            v-model="priority"
            :options="['low', 'medium', 'high']"
            label="Priority"
            class="q-mt-sm"
            :rules="[(val) => !!val || 'Priority is required']"
          />
          <q-input
            dense
            v-model="due_date"
            type="date"
            label="Due Date"
            class="q-mt-sm"
            :rules="[(val) => !!val || 'Due date is required']"
          />
          <q-checkbox
            v-if="initialTask"
            v-model="is_complete"
            label="Mark as complete"
            class="q-mt-sm"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" @click="close" />
          <q-btn flat label="Confirm" type="submit" :loading="loading" :disable="loading" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import type { Task } from 'src/types/task';
import type { PropType } from 'vue';
import { useQuasar } from 'quasar';

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
    const $q = useQuasar();
    const formRef = ref();

    const title = ref('');
    const desc = ref('');
    const assignee = ref('');
    const priority = ref<'low' | 'medium' | 'high'>('low');
    const due_date = ref('');
    const is_complete = ref(false);
    const loading = ref(false);

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
        $q.notify({ type: 'negative', message: 'Please fill all required fields' });
        return;
      }

      loading.value = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

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
        } else {
          emit('create-task', payload);
        }

        close();
        resetForm();
      } catch (err) {
        console.log(err);
        $q.notify({ type: 'negative', message: 'Failed to save task'});
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
    };
  },
});
</script>
