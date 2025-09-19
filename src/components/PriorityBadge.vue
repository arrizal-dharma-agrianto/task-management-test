<template>
  <q-badge
    :color="priorityColor"
    outline
    class="text-bold row items-center text-h7 q-px-sm q-py-xs"
  >
    <q-icon
      :name="priorityIcon"
      size="16px"
      class="q-mr-xs"
    />
    {{ priorityLabel }}
  </q-badge>
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

const priorityIcon = computed(() => {
  switch (props.priority?.toLowerCase()) {
    case 'high':
      return 'priority_high'
    case 'medium':
      return 'arrow_upward'
    case 'low':
      return 'arrow_downward'
    default:
      return 'help_outline'
  }
})

const priorityLabel = computed(() => {
  const p = props.priority?.toLowerCase()
  return p.charAt(0).toUpperCase() + p.slice(1) // capitalize
})
</script>
