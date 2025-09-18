<template>
  <div class="column q-gutter-md">
    <div
      v-for="p in data"
      :key="p.name"
      class="row items-center no-wrap"
    >
      <div class="col-2 text-caption">{{ p.name }}</div>
      <div class="col-8">
        <div class="bg-grey-3 rounded-borders" style="height: 12px;">
          <div
            :class="p.color"
            style="height: 12px; border-radius: 4px;"
            :style="{ width: ((p.count / total) * 100) + '%' }"
          />
        </div>
      </div>
      <div class="col-2 text-caption text-right">{{ p.count }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: { name: string; count: number; color: string }[];
  total: number;
}>();
</script>
