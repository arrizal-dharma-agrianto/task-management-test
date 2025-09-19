<template>
  <q-badge
    :color="status ? 'green' : 'grey'"
    outline
    class="text-bold row items-center q-px-sm q-py-xs"
  >
    <q-icon
      :name="status ? 'check_circle' : 'schedule'"
      size="14px"
      class="q-mr-xs"
    />
    {{ status ? 'Complete' : 'Incomplete' }}
  </q-badge>
</template>


<script setup lang="ts">
defineProps<{ status: boolean }>()
</script>
