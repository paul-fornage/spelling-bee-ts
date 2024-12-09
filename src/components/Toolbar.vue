<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted, watch} from 'vue';

import { Button } from '@/components/ui/button'
import DateSelector from "@/components/DateSelector.vue";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Switch } from '@/components/ui/switch'

import {Moon, Sun, Menu, Languages, CircleHelp} from 'lucide-vue-next';
import {Language} from '@/interfaces.ts'
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
const emits = defineEmits(['changeLang']);

watch(() => props.selected_language_code, (new_lang_code) => {
  selected_language.value = new_lang_code;
});

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
          <DropdownMenuItem @select="language_select_open = true" class="cursor-pointer">
            Select language
            <Languages class="w-4 h-4 ml-1" />
            <Menu class="w-4 h-4 ml-1" />
          </DropdownMenuItem>
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
    </div>
    <div class="toolbar-section justify-self-center">
      <h2 class="text-xl font-bold">{{selectedLanguageEmoji}} Spelling Bee {{selectedLanguageEmoji}}</h2>
    </div>
    <div class="toolbar-section toolbar-section-right">
      <DateSelector :date="props.date"/>
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
}

.toolbar-section-left {
  margin-right: auto;
  margin-left: 2vw;
}


.toolbar-section {
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
}

.toolbar-menu-button {
  width: 10vw;
  justify-self: left;
}
</style>