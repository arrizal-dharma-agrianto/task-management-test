<template>
  <div class="q-gutter-sm">
    <q-btn
      dense
      flat
      round
      icon="edit"
      color="primary"
      @click.stop="$emit('edit', row)"
    />
    <q-btn
      dense
      flat
      round
      icon="delete"
      color="negative"
      @click.stop="$emit('delete', row)"
    />
  </div>
</template>

<script setup lang="ts">

import type { Task } from 'src/types/task';

defineProps<{ row: Task }>()
defineEmits<{
  (e: 'edit', row: Task): void
  (e: 'delete', row: Task): void
}>()
</script>
