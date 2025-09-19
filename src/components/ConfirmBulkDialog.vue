<template>
  <q-dialog v-model="internalValue" persistent>
    <q-card style="min-width: 320px">
      <q-card-section class="row items-center q-gutter-sm">
        <q-icon :name="icon" :color="color" size="md" />
        <div class="text-body1 text-weight-medium">{{ title }}</div>
      </q-card-section>

      <q-card-section class="text-body2 text-grey-8">
        {{ message }}
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          :label="cancelLabel"
          color="grey-7"
          v-close-popup
          @click="$emit('cancel')"
        />
        <q-btn
          flat
          :label="confirmLabel"
          :color="color"
          @click="onConfirm"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "ConfirmDialog",
  props: {
    modelValue: { type: Boolean, required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    confirmLabel: { type: String, default: "Confirm" },
    cancelLabel: { type: String, default: "Cancel" },
    color: { type: String, default: "primary" },
    icon: { type: String, default: "help_outline" },
  },
  emits: ["update:modelValue", "confirm", "cancel"],
  setup(props, { emit }) {
    const internalValue = ref(props.modelValue);

    watch(
      () => props.modelValue,
      (val) => (internalValue.value = val)
    );

    watch(internalValue, (val) => emit("update:modelValue", val));

    function onConfirm() {
      emit("confirm");
      internalValue.value = false;
    }

    return {
      internalValue,
      onConfirm,
    };
  },
});
</script>
