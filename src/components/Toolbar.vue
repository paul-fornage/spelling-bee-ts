<script setup lang="ts">
import {ref, computed, watch} from 'vue';

import { Button } from '@/components/ui/button'
import DateSelector from "@/components/DateSelector.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Switch } from '@/components/ui/switch'

import {Moon, Sun, Menu, Languages, CircleHelp} from 'lucide-vue-next';
import {Language} from '@/utils.ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {DateValue} from "@internationalized/date";
import DateSelectorMobile from "@/components/DateSelectorMobile.vue";

const isDark = ref<boolean>(document.documentElement.classList.contains('dark'));

const toggleTheme = () => {
  if (isDark.value) {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('dark', 'false');
  } else {
    document.documentElement.classList.add('dark');
    localStorage.setItem('dark', 'true');
  }
  isDark.value = !isDark.value;
};



const props = defineProps<{languages: Language[], selected_language_code: string, date: DateValue | undefined}>();
const emits = defineEmits(['changeLang', 'changeDate']);

watch(() => props.selected_language_code, (new_lang_code) => {
  selected_language.value = new_lang_code;
});

watch(() => props.date, (new_date) => {
  if(new_date !== undefined){
    selected_date.value = new_date;
    selected_date_temp.value = new_date;
  }
});

const selected_date = ref<DateValue>()
const date_select_open = ref(false)

const selected_language = ref<string>(props.selected_language_code);
const language_select_open = ref(false)

const selectedLanguageObject = computed(() => {
  return props.languages.find(lang => lang.code === selected_language.value);
});

const selectedLanguageEmoji = computed(() => {
  const lang_obj = props.languages.find(lang => lang.code === selected_language.value);
  if (lang_obj) {
    return lang_obj.flag_emoji;
  } else {
    return '';
  }
});

const selected_date_temp = ref<DateValue>();

function handleDateChangeTemp(newDate: DateValue) {
  selected_date_temp.value = newDate;
}

const handleDateChangeCommit = () => {
  date_select_open.value = false;
  selected_date.value = selected_date_temp.value;
  console.log("Saving date: " + selected_date.value);
  emits('changeDate', selected_date.value);
}


const handleDateChangeSave = (date: DateValue) => {
  date_select_open.value = false;
  selected_date.value = date
  console.log("Saving date: " + selected_date.value);
  emits('changeDate', selected_date.value);
}

const handleLangChangeSave = () => {
  language_select_open.value = false;
  console.log("Saving language: " + selected_language.value);
  emits('changeLang', selected_language.value);
}

</script>

<template>
  <div class="toolbar-root border border-gray-100 dark:border-gray-800 py-2">
    <div class="toolbar-section toolbar-section-left">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button class="toolbar-menu-button" variant="outline">
            <Menu />
            Menu
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100">
          <DropdownMenuItem>
            <div @click="toggleTheme">Toggle dark mode</div>
            <Switch :checked="isDark" @update:checked="toggleTheme" class="">
              <template #thumb>
                <div class="thumb-content">
                  <Moon v-if="isDark" class="size-3" />
                  <Sun v-else class="size-3" />
                </div>
              </template>
            </Switch>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem @select="language_select_open = true" class="cursor-pointer">
            Select language
            <Languages class="w-4 h-4 ml-1" />
            <Menu class="w-4 h-4 ml-1" />
          </DropdownMenuItem>
          <DropdownMenuSeparator class="mobile-only"/>
          <DropdownMenuItem @select="date_select_open = true" class="flex mobile-only cursor-pointer">
            Select date
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem class="flex">
            <a
                target="_blank"
                rel="noopener noreferrer"
                class="flex w-full h-full"
                href="https://paul.fornage.org/projects/spelling-bee-readme/"
            >
              About
              <CircleHelp class="w-4 h-4 justify-self-end ml-auto mr-1" />
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog v-model:open="language_select_open">
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select language</DialogTitle>
            <DialogDescription>
              Some languages aren't fully implemented, especially those with non-american alphabets as they appear in scrabble.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4 py-4">
            <Select v-model="selected_language">
              <SelectTrigger>
                <SelectValue :value="selectedLanguageObject?.name"/>
              </SelectTrigger>
              <SelectContent>
                <SelectGroup label="Language">
                  <SelectItem v-for="language in props.languages" :key="language.code" :value="language.code">
                    {{ language.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button @click="handleLangChangeSave">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog v-model:open="date_select_open">
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Select date</DialogTitle>
          </DialogHeader>
          <div class="grid gap-4 py-4 justify-center">
            <DateSelectorMobile :date="selected_date_temp" @changeDate="handleDateChangeTemp"/>
          </div>
          <DialogFooter>
            <Button @click="handleDateChangeCommit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    <div class="toolbar-section toolbar-section-center">
      <h2 class="text-xl font-bold">{{selectedLanguageEmoji}} Spelling Bee {{selectedLanguageEmoji}}</h2>
    </div>
    <div class="toolbar-section toolbar-section-right">
      <DateSelector :date="props.date" @changeDate="handleDateChangeSave"/>
    </div>
  </div>
</template>

<style>
.toolbar-root {
  display: flex;
  height: 100%;
  /* Ensures the toolbar takes the full width */
  width: 100%;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  border-bottom: 1px solid;
  flex: max-content;
}

.mobile-only{
  display: none;
}
@media (orientation: portrait) {
  .mobile-only{
    display: block;
  }
}

.thumb-content {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.toolbar-section-right {
  margin-left: auto;
  margin-right: 2vw;
  display: none;
}

@media (orientation: landscape) {
  .toolbar-section-right {
    display: block; /* Show in landscape mode */

  }
}

.toolbar-section-center {
  justify-self: center;
}

@media (orientation: portrait) {
  .toolbar-section-center {
    margin-right: 2rem;
    flex: max-content;
  }
}

.toolbar-section-left {
  margin-right: auto;
  margin-left: 2vw;
}

@media (orientation: portrait) {
  .toolbar-section-left {
    margin-right: 2rem;
    flex: 1;
  }
}

.toolbar-section {
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}

.toolbar-menu-button {
  width: 8em;
  justify-self: left;
}

</style>