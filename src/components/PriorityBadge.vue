<template>
  <q-badge
    :color="priorityColor"
    :label="priority"
    outline
    class="text-bold"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ priority: string }>()

const priorityColor = computed(() => {
  switch (props.priority?.toLowerCase()) {
    case 'high':
      return 'red'
    case 'medium':
      return 'blue'
    case 'low':
      return 'grey'
    default:
      return 'grey'
  }
})
</script>
