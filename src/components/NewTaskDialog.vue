<template>
  <q-dialog
    :model-value="modelValue"
    @update:model-value="val => $emit('update:modelValue', val)"
    persistent
  >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Add Task</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-input dense v-model="title" label="Title" autofocus />
        <q-input dense v-model="desc" label="Description" class="q-mt-sm" />
        <q-input dense v-model="assignee" label="Assignee" class="q-mt-sm" />
        <q-select
          dense
          v-model="priority"
          :options="['low','medium','high']"
          label="Priority"
          class="q-mt-sm"
        />
        <q-input
          dense
          v-model="due_date"
          type="date"
          label="Due Date"
          class="q-mt-sm"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn flat label="Cancel" @click="close" />
        <q-btn flat label="Confirm" @click="confirm" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'NewTaskDialog',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['update:modelValue', 'create-task'],
  setup(props, { emit }) {
    const title = ref('')
    const desc = ref('')
    const assignee = ref('')
    const priority = ref<'low' | 'medium' | 'high'>('low')
    const due_date = ref('')

    function close() {
      emit('update:modelValue', false)
    }

    function confirm() {
      emit('create-task', {
        title: title.value,
        desc: desc.value,
        assignee: assignee.value,
        priority: priority.value,
        due_date: due_date.value,
      })
      emit('update:modelValue', false)
      title.value = ''
      desc.value = ''
      assignee.value = ''
      priority.value = 'low'
      due_date.value = ''
    }

    return { title, desc, assignee, priority, due_date, close, confirm }
  },
})
</script>
