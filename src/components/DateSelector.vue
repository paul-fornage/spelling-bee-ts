<script setup lang="ts">
import {Button} from "@/components/ui/button";

import { Calendar } from '@/components/ui/calendar'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import {
  DateFormatter,
  type DateValue,
  CalendarDate,
  today,
  getLocalTimeZone,
} from '@internationalized/date'
import { Calendar as CalendarIcon } from 'lucide-vue-next'
import { ref, watch } from 'vue'

const df = new DateFormatter('en-US', {
  dateStyle: 'long',
})

function handleChangeDate() {
  console.log(selected_date.value)
}

const props = defineProps<{ date: DateValue|undefined }>();

const selected_date = ref<DateValue>()
selected_date.value = props.date

watch(() => props.date, (newDate) => {
  selected_date.value = newDate;
});

</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
          variant="outline"
          :class="cn(
                'w-[280px] justify-start text-left font-normal',
                !selected_date && 'text-muted-foreground',
              )"
      >
        <CalendarIcon class="mr-2 h-4 w-4" />
        {{ selected_date ? df.format(selected_date.toDate(getLocalTimeZone())) : "Pick a date" }}
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <Calendar
          :disabled="true"
          v-model="selected_date"
          @update:modelValue="handleChangeDate"
          initial-focus
          :min-value="new CalendarDate(1900, 1, 1)"
          :max-value="today('GMT')"
      />
    </PopoverContent>
  </Popover>
</template>

<style scoped>

</style>