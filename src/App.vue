<script setup lang="ts">
import MainCanvas from "@/components/MainCanvas.vue";
import Toolbar from "@/components/Toolbar.vue";
import {ref, onMounted, computed} from "vue";
import {
  type DateValue,
  getLocalTimeZone,
  today,
  CalendarDate,
} from '@internationalized/date'
import axios from "axios";
import {
  CombData,
  Language,
  ValidWord,
  WordCountData,
  DateToString,
  DateFromString,
  GetLocalStorageId,
  LocalGameProgressSave, FeedbackType
} from '@/utils.ts'
import GuessFeedback from "@/components/GuessFeedback.vue";

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

const allChars = computed<string[]>( () => {
  if(comb.value !== null) {
    return comb.value.outer_chars.concat(comb.value.center_char);
  } else {
    return [];
  }
});

const today_var: CalendarDate = today(getLocalTimeZone())
const selected_date = ref<DateValue>()
selected_date.value = today_var;

const isTodaysGame = computed<boolean>(() => {
  if(selected_date.value === undefined){
    console.error('selected_date is undefined. This should not happen.');
    return false;
  }
  const local_selected_date = DateToString(selected_date.value);
  const local_today_date = DateToString(today(getLocalTimeZone()));
  return local_selected_date === local_today_date
})

const selected_language_code = ref<string>(languages.value[0].code);

const feedback_type = ref<FeedbackType>();
const feedback_guess = ref<string>();
const feedback_points = ref<number>();
const feedback_valid_char_set = ref<string>();
const show_feedback = ref<boolean>(false);
const current_game_given_up = ref<boolean>(false);

function giveGuessFeedback(guess: string, points: number, valid_char_set: string, feedback_type_in: FeedbackType) {
  feedback_type.value = feedback_type_in;
  feedback_guess.value = guess;
  feedback_points.value = points;
  feedback_valid_char_set.value = valid_char_set;
  show_feedback.value = true;
  setTimeout(() => {
    show_feedback.value = false;
  }, 2000);
}

function handleGuess(newGuess: string) {

  if(comb.value === null) {
    console.error('comb is null. There are bigger problems if this happens.');
    return;
  }

  if(newGuess.length < 4) { // NOT_LONG_ENOUGH check
    giveGuessFeedback(
        newGuess,
        0,
        allChars.value.join(''),
        FeedbackType.NOT_LONG_ENOUGH
    );
    return;
  }

  if(!newGuess.includes(comb.value.center_char)) {
    giveGuessFeedback(
        newGuess,
        0,
        allChars.value.join(''),
        FeedbackType.MISSING_CENTER_CHAR
    );
    return;
  }

  for(const char of newGuess) { // INVALID_CHAR check
    if(!allChars.value.includes(char)) {
      giveGuessFeedback(
          newGuess,
          0,
          allChars.value.join(''),
          FeedbackType.INVALID_CHAR
      );
      return;
    }
  }

  const matchingWord = valid_words.value.find(word => word.word === newGuess);
  if (matchingWord) {
    if(matchingWord.is_found) {
      giveGuessFeedback(
          newGuess,
          0,
          allChars.value.join(''),
          FeedbackType.ALREADY_FOUND
      );
      return;
    }
    matchingWord.is_found = true;

    if(matchingWord.is_panagram) {
      giveGuessFeedback(
          newGuess,
          matchingWord.point_value,
          allChars.value.join(''),
          FeedbackType.PANAGRAM
      );
    } else {
      giveGuessFeedback(
          newGuess,
          matchingWord.point_value,
          allChars.value.join(''),
          FeedbackType.CORRECT
      );
    }


    if(selected_date.value === undefined){
      return // this is literally impossible,
      // the var is declared and assigned on consecutive lines, but the IDE is bitching
    }
    const date_string: string = DateToString(selected_date.value);
    const game_id = GetLocalStorageId(date_string, selected_language_code.value);
    const saved_games = localStorage.getItem('games');
    if(saved_games == null){
      console.log("tried to handle guess but games was not initialized");
      return;
    }
    let parsedGames: LocalGameProgressSave[] = JSON.parse(saved_games);
    const current_game = parsedGames.find(game => game.id === game_id);
    if(current_game === undefined){
      console.log("tried to handle guess but current game was not found in local storage");
      return;
    }
    if(current_game.found_words.find(word => word === newGuess) !== undefined){
      console.log("tried to handle guess but word was already found");
      return;
    }
    current_game.found_words.push(newGuess);
    localStorage.setItem('games', JSON.stringify(parsedGames));
    handleFoundWordsCalc();
  } else {
    giveGuessFeedback(
        newGuess,
        0,
        allChars.value.join(''),
        FeedbackType.NOT_VALID_WORD
    );
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

function handleDateChange(new_date: DateValue) {
  selected_date.value = new_date;
  loadDailyGame(selected_date.value, selected_language_code.value);
}

const loadDailyGame = async (date: DateValue, lang_code: string) => {
  try {
    console.log('Fetching comb data for lang:', lang_code);
    const date_str = DateToString(date);
    const response = await axios.get(`//abeille-dorthographe-api.fornage.org/api/${lang_code}/dailygame/${date_str}`);
    comb.value = response.data['comb'];
    // console.log(
    //     'Fetched comb data:',
    //     comb.value
    // );
    valid_words.value = response.data['valid_words'];
    total_words.value = response.data['total_words'];
    total_points.value = response.data['total_points'];
    const raw_date: string = response.data['date'];  // example: `2024-12-02`
    selected_date.value = DateFromString(raw_date);

    loadSavedGuesses(lang_code, selected_date.value);
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

function loadSavedGuesses(lang_code: string, date: DateValue) {
  const date_string: string = DateToString(date);
  const game_id = GetLocalStorageId(date_string, lang_code);
  const saved_games = localStorage.getItem('games');
  if(!saved_games) {
    console.error('Failed to find saved games object. Skipping applying saved progress.');
    return;
  }
  // current game should be of type `LocalGameProgressSave`
  const parsedGames: LocalGameProgressSave[] = JSON.parse(saved_games);
  const current_game = parsedGames.find((game: LocalGameProgressSave) => game.id === game_id);
  if(current_game){
    try {
      let is_given_up: boolean|undefined = current_game.given_up;

      if(is_given_up === undefined) {
        is_given_up = false;
      }

      console.log(
          'from game save is_given_up:',
          is_given_up
      );
      current_game_given_up.value = is_given_up;
    } catch (error) {
      console.log(
          'Failed to parse is_given_up from saved game. Skipping and continuing with load.\n',
          error)
    }

    try {
      const found_words: string[] = current_game.found_words;

      for (const saved_word of found_words) {
        const matchingWord = valid_words.value.find(word => word.word === saved_word);
        if (matchingWord) {
          matchingWord.is_found = true;
        } else {
          console.error('Saved word does not exist in valid words. Skipping this word. Saved word:', saved_word);
          return;
        }
      }
      handleFoundWordsCalc();

    } catch (error) {
      console.error('Failed to parse saved game. Skipping applying saved progress.\n', error);
      return;
    }
  } else {
    const new_games_save: LocalGameProgressSave[] = parsedGames.concat({id: game_id, found_words: [], given_up: false});
    localStorage.setItem('games', JSON.stringify(new_games_save));
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

    if(selected_date.value === undefined){
      return // this is literally impossible,
      // the var is declared and assigned on consecutive lines, but the IDE is bitching
    }
    await loadDailyGame(selected_date.value, selected_language_code.value);
  } catch (error) {
    console.error('Failed to fetch languages data:', error);
    throw error;
  }
});

function handleLangChangeSave(lang_code: string) {
  console.log('handleLangChangeSave:', lang_code);
  selected_language_code.value = lang_code;
  if(selected_date.value === undefined){
    return // this is literally impossible,
    // the var is declared and assigned on consecutive lines, but the IDE is bitching
  }
  loadDailyGame(selected_date.value, lang_code);
  localStorage.setItem('lang_code', lang_code);
}

function handleGiveUp() {
  if(selected_date.value === undefined || selected_language_code.value === undefined){
    return
  }

  current_game_given_up.value = true;

  const date_string: string = DateToString(selected_date.value);
  const game_id = GetLocalStorageId(date_string, selected_language_code.value);
  const saved_games = localStorage.getItem('games');
  if(!saved_games) {
    console.error('Failed to find saved games object. Skipping applying given_up');
    return;
  }
  // current game should be of type `LocalGameProgressSave`
  const parsedGames: LocalGameProgressSave[] = JSON.parse(saved_games);
  const current_game = parsedGames.find((game: LocalGameProgressSave) => game.id === game_id);
  if(current_game){
    current_game.given_up = true;
    localStorage.setItem('games', JSON.stringify(parsedGames));
  }
}

</script>

<template>
  <div class="toolbar">
    <Toolbar
        :languages="languages"
        @changeLang="handleLangChangeSave"
        :selected_language_code="selected_language_code"
        :date="selected_date"
        @changeDate="handleDateChange"
    />
  </div>
  <GuessFeedback
      v-if="show_feedback"
      :guess="feedback_guess"
      :points="feedback_points"
      :valid-char-set="feedback_valid_char_set"
      :feedback-type="feedback_type"
      class="guess-feedback-overlay"
  />
  <div class="main-canvas">
    <MainCanvas
        @newGuess="handleGuess"
        @giveUp="handleGiveUp"
        :showHiddenWords="current_game_given_up"
        :combData="comb"
        :validWords="valid_words"
        :wordCountData="wordCountData"
        :showHiddenButton="!isTodaysGame"
    />
  </div>
</template>

<style scoped>

.guess-feedback-overlay {
  position: absolute; /* or fixed */
  z-index: 1000; /* or any number higher than other z-indexes */
  top: calc(max(5vh, 4rem) + 1rem); /* Adjust as necessary */
  width: 20rem; /* Adjust width */
  height: 7rem; /* Adjust height */
  left: 50%; /* Start positioning from the middle of the x-axis */
  transform: translateX(-50%);
}

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

@media (orientation: portrait) {
  .main-canvas {
    flex-direction: column;
  }
}

</style>