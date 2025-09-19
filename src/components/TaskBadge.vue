<template>
  <q-badge
    :color="status ? 'green' : 'grey'"
    outline
    :class="status ? ' q-px-sm q-py-xs':''"
    class="text-bold row items-center text-h7"
  >
    <q-icon
      :name="status ? 'check_circle' : 'schedule'"
      size="16px"
      class="q-mr-xs"
    />
    {{ status ? 'Complete' : 'Incomplete' }}
  </q-badge>
</template>


<script setup lang="ts">
defineProps<{ status: boolean }>()
</script>
