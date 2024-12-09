<script setup lang="ts">
import Comb from "@/components/Comb.vue";
import { Button } from '@/components/ui/button'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import {
  Card,
  CardContent,
} from '@/components/ui/card'

import { Delete, CornerDownLeft} from 'lucide-vue-next';
import WordCount from "@/components/WordCount.vue";
import WordList from "@/components/ui/WordList.vue";

function onCellClicked(char: string) {
  console.log(`Character clicked: ${char}`);
  current_guess.value+=(char);
}

interface CombData {
  center_char: string;
  outer_chars: string[];
}

interface WordCountData {
  points_found: number,
  words_found: number,
  max_points: number,
  max_words: number,
}

interface ValidWord{
  word: string;
  point_value: number;
  is_found: boolean;
  is_panagram: boolean;
}

const DEFAULT_COMB_DATA = {
  center_char: " ",
  outer_chars: [" "," "," "," "," "," "],
}

const props = defineProps<{
  combData: CombData|null,
  validWords: ValidWord[]
  wordCountData: WordCountData,
}>();

const comb_data = ref<CombData>((() => {
  if (props.combData !== null) {
    return props.combData;
  } else {
    return DEFAULT_COMB_DATA;
  }
})());

const emits = defineEmits(['newGuess'])

watch(
    () => props.combData,
    (newCombData) => {
      if (newCombData !== null) {
        comb_data.value = newCombData;
        handleShuffle();
      }
    }
);

function handleShuffle() {
  comb_data.value.outer_chars = comb_data.value.outer_chars.sort(() => Math.random() - 0.5);
}

function handleDelete() {
  current_guess.value = current_guess.value.slice(0, -1);
}

const current_guess = ref<string>("");

function handleGuess() {
  console.log(`Guess: ${current_guess.value}`);
  emits('newGuess', current_guess.value);
  current_guess.value = "";
}

const handleKeyPress = (event: KeyboardEvent) => {
  console.log(`new keypress: ${event.key}`);
  if (event.key.length === 1) { // Ensures it's a character
    current_guess.value += event.key.toUpperCase();
  } else if (event.key === 'Backspace') {
    // Handle backspace to remove the last character
    handleDelete();
  } else if (event.key === 'Enter') {
    handleGuess();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

</script>

<template>
  <Card class="comb-card dark:bg-slate-900 bg-slate-100">
    <CardContent class="comb-card-content">
      <div class="guess-input flex w-full self-center items-center gap-1.5">
        <div class="dark:bg-slate-800 bg-slate-300 h-full w-full rounded-md border px-4  font-mono scaled-font">
          {{current_guess}}
        </div>
        <Button variant="destructive" class="h-full" @click="handleDelete">
          <Delete class="h-full w-auto"/>
        </Button>
        <Button class="dark:bg-slate-800 bg-slate-300 text-gray-800 dark:text-gray-200 h-full" variant="outline" @click="handleGuess">
          <CornerDownLeft/>
        </Button>
      </div>
      <Comb :center_char="comb_data.center_char" :outer_chars="comb_data.outer_chars" @cellClicked="onCellClicked"/>
      <div class="shuffle-input flex justify-center">
        <Button class="w-full dark:bg-slate-800 bg-slate-300" variant="outline" @click="handleShuffle">
          shuffle
        </Button>
      </div>
    </CardContent>
  </Card>
  <div class="right-cards">
    <Card class="score-card dark:bg-slate-900 bg-slate-100">
      <CardContent>
        <WordCount :wordCountData="props.wordCountData"/>
      </CardContent>
    </Card>
    <Card class="word-list-card dark:bg-slate-900 bg-slate-100 mt-2">
      <CardContent>
        <WordList :validWords="props.validWords"/>
      </CardContent>
    </Card>
  </div>

</template>

<style scoped>



.guess-input {
  margin: 1vh auto;
  height: clamp(3rem, 6vh, 10rem);
}

.scaled-font {
  font-size: 300%;
}

.right-cards {
  justify-self: right;
  justify-content: center;
  width: 30%;
  margin: auto;
  height: 80%;
}
.comb-card {
  justify-self: center;
  justify-content: center;
  margin: auto;
  width: 50vw;

  max-height: 100%;
  display: flex;
}
.comb-card-content {
  height: 100%;
  width: 100%;
}
.score-card {
  justify-content: center;
  height: 6rem
}

.word-list-card {
  flex: 5;
  height: calc(100% - 6rem);
}
</style>