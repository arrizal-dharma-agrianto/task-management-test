<template>
  <q-card bordered flat>
    <q-card-section>
      <div class="row items-center justify-between">
        <div>
          <div class="text-subtitle2">{{ task.title }}</div>
          <div class="text-caption text-grey">{{ task.due_date }}</div>
        </div>
        <q-badge
          :color="task.is_complete ? 'green' : 'orange'"
          :label="task.is_complete ? 'Complete' : 'Pending'"
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script lang="ts" setup>
import type { Task } from 'src/types/task';

defineProps<{ task: Task }>();
</script>
