<script setup lang="ts">

import {CalendarDate, DateFormatter, type DateValue, getLocalTimeZone, today} from "@internationalized/date";
import {Calendar} from "@/components/ui/calendar";
import {ref, watch} from "vue";
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { cn } from '@/lib/utils'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

function handleChangeDate() {
  console.log(selected_date.value)
  emits('changeDate', selected_date.value);
}

const props = defineProps<{ date: DateValue|undefined }>();
const emits = defineEmits(['changeDate']);

const selected_date = ref<DateValue>()
selected_date.value = props.date

watch(() => props.date, (newDate) => {
  selected_date.value = newDate;
});
</script>

<template>
  <div
      :class="cn(
                ' text-left font-normal bg-slate-1000 rounded-md border flex',
                !selected_date && 'text-muted-foreground',
              )">
    <CalendarIcon class="m-2 h-4 w-4 place-self-center" />
    <div class="flex-1 m-2">
      {{ selected_date ? df.format(selected_date.toDate(getLocalTimeZone())) : "Pick a date" }}
    </div>

  </div>

  <Calendar
      class="bg-slate-900 rounded-md border"
      v-model="selected_date"
      @update:modelValue="handleChangeDate"
      initial-focus
      :min-value="new CalendarDate(2024, 12, 9)"
      :max-value="today('GMT')"
  />
</template>

<style scoped>

</style>