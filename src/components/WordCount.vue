<script setup lang="ts">

import { WordCountData } from '@/utils.ts'
import {Button} from "@/components/ui/button";
import {computed} from "vue";

const props = defineProps<{wordCountData: WordCountData, showHiddenButton: boolean}>();

const emits = defineEmits(['showHiddenButtonClicked']);

const give_up_button_message = computed<string>(() => {
  return (props.showHiddenButton ? 'Permanently reveal answers' : 'Show hidden words (can\'t give up today\'s puzzle)')
})

</script>

<template>
  <div class="score-row flex border-b-2 border-dashed dark:border-slate-700 border-slate-300">
    <h1 class="score-row-title">
      Words Found:
    </h1>
    <h1 class="score-row-value">
      {{ props.wordCountData.words_found }} / {{ props.wordCountData.max_words }}
    </h1>
  </div>
  <div class="score-row flex border-b-2 border-dashed dark:border-slate-700 border-slate-300">
    <h1 class="score-row-title">
      Points:
    </h1>
    <h1 class="score-row-value">
      {{ props.wordCountData.points_found }} / {{ props.wordCountData.max_points }}
    </h1>
  </div>
  <div class="score-row flex border-b-2 border-dashed dark:border-slate-700 border-slate-300">
<!--      v-if="showHiddenButton"-->

    <Button
        :class="'w-full m-2 ' + (showHiddenButton ? '' : 'accent-muted cursor-not-allowed')"
        :disabled="!showHiddenButton"
        @click="emits('showHiddenButtonClicked')">
      {{give_up_button_message}}
    </Button>
  </div>
</template>

<style scoped>

.score-row-title{
  justify-self: left;
  text-align: left;
  margin: max(0.2vh, 0.1vw) auto max(0.2vh, 0.1vw) max(0.2vh, 0.1vw);
}

.score-row-value{
  justify-self: right;
  text-align: right;
  margin: auto max(0.2vh, 0.1vw) max(0.2vh, 0.1vw) max(0.2vh, 0.1vw);
}


</style>