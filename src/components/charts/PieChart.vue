<template>
  <ECharts :option="options" class="q-mt-md" autoresize style="height: 285px" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import ECharts from 'vue-echarts';
import { useTaskStore } from 'stores/task-store';

import { CanvasRenderer } from 'echarts/renderers';
import { PieChart as Pie } from 'echarts/charts';
import { use } from 'echarts/core';
import { LegendComponent, TooltipComponent } from 'echarts/components';

use([CanvasRenderer, Pie, TooltipComponent, LegendComponent]);

export default defineComponent({
  name: 'PieChart',
  components: {
    ECharts,
  },
  setup() {
    const taskStore = useTaskStore();

    const completedTasks = computed(() => taskStore.tasks.filter((t) => t.is_complete).length);
    const pendingTasks = computed(() => taskStore.tasks.filter((t) => !t.is_complete).length);

    const options = computed(() => ({
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)',
      },
      legend: {
        bottom: '5%',
        left: 'center',
      },
      series: [
        {
          name: 'Tasks',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '40%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 18, fontWeight: 'bold' } },
          labelLine: { show: false },
          data: [
            { value: completedTasks.value, name: 'Completed', itemStyle: { color: 'green' } },
            { value: pendingTasks.value, name: 'Pending', itemStyle: { color: 'red' } },
          ],
        },
      ],
    }));

    return { options };
  },
});
</script>

<style scoped></style>
