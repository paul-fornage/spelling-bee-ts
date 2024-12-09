<script setup lang="ts">
import MainCanvas from "@/components/MainCanvas.vue";
import Toolbar from "@/components/Toolbar.vue";
import {ref, onMounted, computed} from "vue";
import {
  type DateValue,
  CalendarDate,
} from '@internationalized/date'
import axios from "axios";
import {CombData, Language, ValidWord, WordCountData} from '@/interfaces.ts'


const local_dark_mode = localStorage.getItem('dark');
if(local_dark_mode) {
  if(localStorage.getItem('dark') === 'true') {
    document.documentElement.classList.add('dark');
  }
} else {
  document.documentElement.classList.add('dark');
  localStorage.setItem('dark', 'true');
}

let comb = ref<CombData|null>(null)
const languages = ref<Language[]>([{name: 'English', code: 'en', letter_set: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', flag_emoji: '🇺🇸'}])
const valid_words = ref<ValidWord[]>([
  {
    point_value: 0,
    word: "",
    is_found: false,
    is_panagram: false,
  }
])
const total_words = ref<number>(0);
const total_points = ref<number>(0);
const found_points = ref<number>(0);
const found_words = ref<number>(0);

const wordCountData = computed<WordCountData>(() => {
  return {
    points_found: found_points.value,
    words_found: found_words.value,
    max_points: total_points.value,
    max_words: total_words.value,
  }
});

const selected_date = ref<DateValue>()
const selected_language_code = ref<string>(languages.value[0].code);

function handleGuess(newGuess: string) {
  const matchingWord = valid_words.value.find(word => word.word === newGuess);
  if (matchingWord) {
    matchingWord.is_found = true;
    handleFoundWordsCalc();
  }
}
if(!localStorage.getItem('games')) { // if no games array exist (presumeably local user), create the empty array
  localStorage.setItem('games', JSON.stringify([]));
}

function handleFoundWordsCalc() {
  found_words.value = valid_words.value.filter(word => word.is_found).length;
  found_points.value = valid_words.value.filter(word => word.is_found).reduce((acc, word) => acc + word.point_value, 0);
  // console.log(
  //     'Found words:',
  //     found_words.value,
  //     'Found points:',
  //     found_points.value
  // );
}

const loadTodayDailyGame = async (lang_code: string) => {
  try {
    console.log('Fetching comb data for lang:', lang_code);

    const response = await axios.get(`//abeille-dorthographe-api.fornage.org/api/${lang_code}/dailygame/today`);
    comb.value = response.data['comb'];
    // console.log(
    //     'Fetched comb data:',
    //     comb.value
    // );
    valid_words.value = response.data['valid_words'];
    total_words.value = response.data['total_words'];
    total_points.value = response.data['total_points'];
    const raw_date: string = response.data['date'];  // example: `2024-12-02`
    const split_date: string[] = raw_date.split('-');
    const year: number = parseInt(split_date[0])
    const month: number = parseInt(split_date[1])
    const day: number = parseInt(split_date[2])
    selected_date.value = new CalendarDate(year, month, day);
    // console.log(
    //     'Fetched valid_words:',
    //     valid_words.value,
    // );
    // console.log(
    //     'Fetched total_words:',
    //     total_words.value,
    // );
    // console.log(
    //     'Fetched total_points:',
    //     total_points.value,
    // );
    // console.log(
    //     'Fetched selected_date:',
    //     selected_date.value,
    // );
    handleFoundWordsCalc();
  } catch (error) {
    console.error('Failed to fetch comb data:', error);
  }
}

onMounted(async () => {
  try {
    const response = await axios.get('//abeille-dorthographe-api.fornage.org/api/langs');
    languages.value = response.data;

    const local_store_lang = localStorage.getItem('lang_code');

    console.log(
        'Local store lang:',
        local_store_lang
    );

    if(local_store_lang !== null) {
      selected_language_code.value = local_store_lang
      console.log('selected_language_code getting set to:', local_store_lang);
    } else {
      selected_language_code.value = languages.value[1].code;
      localStorage.setItem('lang_code', selected_language_code.value);
    }


    await loadTodayDailyGame(selected_language_code.value);
  } catch (error) {
    console.error('Failed to fetch languages data:', error);
    throw error;
  }
});

function handleLangChangeSave(lang_code: string) {
  console.log('handleLangChangeSave:', lang_code);
  selected_language_code.value = lang_code;
  loadTodayDailyGame(lang_code);
  localStorage.setItem('lang_code', lang_code);
}

</script>

<template>
  <div class="toolbar">
    <Toolbar
        :languages="languages"
        @changeLang="handleLangChangeSave"
        :selected_language_code="selected_language_code"
        :date="selected_date"
    />
  </div>
  <div class="main-canvas">
    <MainCanvas
        @newGuess="handleGuess"
        :combData="comb"
        :validWords="valid_words"
        :wordCountData="wordCountData"
    />
  </div>
</template>

<style scoped>

.toolbar {
  height: max(5vh, 4rem);
  margin: 0;
  padding: 0;
}

.main-canvas {
  width: 100%;
  height: calc(100vh - max(5vh, 4rem) - 4vh);
  display: flex;
  margin: 2vh 0;
}
</style>