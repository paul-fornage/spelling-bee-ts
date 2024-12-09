<script setup lang="ts">

import {ScrollArea} from "@/components/ui/scroll-area";
import { Star } from 'lucide-vue-next';
import { computed } from 'vue';
import { ValidWord } from '@/interfaces.ts'



const props = defineProps<{validWords: ValidWord[]}>();

const sortedWords = computed(() => {
  return [...props.validWords].sort((a, b) => {
    if (a.point_value !== b.point_value) {
      return b.point_value - a.point_value; // Sort by point value descending
    }
    return a.word.localeCompare(b.word); // Sort by word alphabetically
  });
});

</script>

<template>
  <ScrollArea class="w-full rounded-md border scroll-area">
    <div class="p-4">
      <h4 class="mb-4 text-lg font-medium leading-none text-center">
        Words found
      </h4>

      <div v-for="word in sortedWords" :key="word.word">
        <div class="text-lg flex border-t-2 border-dashed dark:border-slate-700 border-slate-300 py-1"
             v-if="word.is_found">
          <div class="text-lg word-item-text">
            {{ word.word }}
          </div>
          <div class="text-lg word-item-panagram" v-if="word.is_panagram">
            <Star class="text-yellow-500 h-6 w-6 pt-1"/>
          </div>
          <div class="text-lg word-item-points px-2">
            {{ word.point_value }}
          </div>
        </div>
      </div>
    </div>
  </ScrollArea>
</template>

<style scoped>

.scroll-area {
  height: calc(78vh - 12.5rem);
}

.word-item-text{
  flex: 2;
  justify-self: left;
}

.word-item-points{
  justify-self: right;
  text-align: right;
}
</style>