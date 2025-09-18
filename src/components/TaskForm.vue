<template>
  <q-form @submit.prevent="handleSubmit">
    <q-input v-model="form.title" label="Title" outlined dense />
    <q-input v-model="form.due_date" type="date" label="Due Date" outlined dense />
    <q-select
      v-model="form.priority"
      :options="['low', 'medium', 'high']"
      label="Priority"
      outlined dense
    />
    <div class="q-mt-md flex justify-end">
      <q-btn flat label="Cancel" color="grey" @click="$emit('cancel')" />
      <q-btn label="Save" color="primary" type="submit" />
    </div>
  </q-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import type { Task } from 'src/types/task';

const props = defineProps<{ modelValue?: Task }>();
const emit = defineEmits<{
  (e: 'save', task: Task): void;
  (e: 'cancel'): void;
}>();

const form = reactive<Task>({
  id: props.modelValue?.id ?? Date.now().toString(),
  title: props.modelValue?.title ?? '',
  desc: props.modelValue?.desc ?? '',
  priority: props.modelValue?.priority ?? 'low',
  assignee: props.modelValue?.assignee ?? '',
  due_date: props.modelValue?.due_date ?? '',
  created_at: props.modelValue?.created_at ?? new Date().toISOString(),
  updated_at: new Date().toISOString(),
  is_complete: props.modelValue?.is_complete ?? false,
});


function handleSubmit() {
  form.updated_at = new Date().toISOString();
  emit('save', { ...form });
}
</script>
