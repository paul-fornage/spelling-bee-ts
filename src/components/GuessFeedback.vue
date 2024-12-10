<script setup lang="ts">

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { FeedbackType } from '@/utils.ts';
import { computed } from "vue";


const props = defineProps<{
    feedbackType: FeedbackType|undefined,
    guess: string|undefined,
    points: number|undefined,
    validCharSet: string|undefined
  }>();

const class_data = computed<string>( () => {
  switch(props.feedbackType) {
    case FeedbackType.PANAGRAM:
      return 'border-yellow-500';
    case FeedbackType.CORRECT:
      return 'dark:border-slate-700 border-slate-300';
  }
  return 'border-red-500';
})

const message_text = computed<string>( () => {
  if(props.feedbackType === undefined) {
    return '';
  }
  switch(props.feedbackType) {
    case FeedbackType.PANAGRAM:
      return 'Panagram! ⭐';
    case FeedbackType.CORRECT:
      return 'Nice!';
    case FeedbackType.ALREADY_FOUND:
      return 'Already found';
    case FeedbackType.INVALID_CHAR:
      return 'Invalid character';
    case FeedbackType.MISSING_CENTER_CHAR:
      return 'Missing center character';
    case FeedbackType.NOT_VALID_WORD:
      return 'Not a valid word';
    case FeedbackType.NOT_LONG_ENOUGH:
      return 'Not long enough';
  }
})

const charStyles = computed(() => {
  if (props.guess === undefined || props.validCharSet === undefined) {
    return [];
  }
  return props.guess.split('').map(char => ({
    char: char,
    className: props.validCharSet!.includes(char) ? 'text-normal' : 'text-red', // Non-null assertion
  }));
});

</script>

<template>
  <Card :class="class_data + ' flex-col gap-y-1 p-4'">
    <CardTitle class="text-center">
      {{message_text}}
    </CardTitle>
    <CardContent class="flex border-t m-2">
      <div class="font-mono font-bold flex-1 m-1">
            <span v-for="(item, index) in charStyles" :key="index" :class="item.className">
              {{ item.char }}
            </span>
      </div>
      <div class="font-mono flex-2 m-1">
            <span v-if="props.points !== undefined && props.points > 0">
              +{{ props.points }}
            </span>
      </div>
    </CardContent>
  </Card>
</template>

<style scoped>

.text-normal {
  color: inherit; /* or another default color you choose */
}

.text-red {
  color: red;
}

</style>