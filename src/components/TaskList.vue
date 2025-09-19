<template>
  <div>
    <q-list bordered separator>
      <q-item v-for="task in tasks" :key="task.id">
        <TaskCard :task="task" />
      </q-item>
    </q-list>
    <div v-if="!tasks.length" class="text-grey text-center q-pa-md">
      No tasks available
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Task } from 'src/types/task';
import TaskCard from './TaskCard.vue';

defineProps<{ tasks: Task[] }>();
</script>
