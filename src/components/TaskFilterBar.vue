<template>
  <div class="row items-center">
    <q-btn
      class="q-ml-sm"
      icon="filter_list"
      flat
      @click="showFilter = !showFilter"
    />

    <template v-if="showFilter">
      <q-input
        class="q-ml-sm"
        filled
        borderless
        dense
        debounce="300"
        v-model="localSearch"
        placeholder="Search"
      >
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-input
        class="q-ml-sm"
        filled
        dense
        v-model="localAssignee"
        placeholder="Assignee"
      >
        <template v-slot:append>
          <q-icon name="person" />
        </template>
      </q-input>

      <q-input
        class="q-ml-sm"
        filled
        dense
        v-model="localDueDate"
        placeholder="Pick a date"
        readonly
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy transition-show="scale" transition-hide="scale">
              <q-date v-model="localDueDate" mask="YYYY-MM-DD" />
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  search: string
  assignee: string
  dueDate: string
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:assignee', value: string): void
  (e: 'update:dueDate', value: string): void
}>()

const showFilter = ref(false)

const localSearch = ref(props.search)
const localAssignee = ref(props.assignee)
const localDueDate = ref(props.dueDate)

watch(localSearch, (val) => emit('update:search', val))
watch(localAssignee, (val) => emit('update:assignee', val))
watch(localDueDate, (val) => emit('update:dueDate', val))
</script>
