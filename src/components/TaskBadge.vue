<template>
  <q-badge
    :color="status ? 'green' : 'grey'"
    :label="status ? 'Complete' : 'Incomplete'"
    outline
    class="text-bold"
  />
</template>

<script setup lang="ts">
defineProps<{ status: boolean }>()
</script>
