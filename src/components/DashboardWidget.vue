<template>
  <q-card class="relative-position">
    <q-inner-loading
      :showing="loading"
      class="absolute-full flex flex-center bg-white/70"
      style="z-index: 10"
    >
      <q-spinner color="primary" size="40px" />
    </q-inner-loading>

    <q-card-section>
      <div class="text-h6">{{ title }}</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <slot />
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
defineProps<{ title: string; loading?: boolean }>();
</script>
