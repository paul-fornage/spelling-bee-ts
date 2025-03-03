<script setup lang="ts">

import { CombData } from '@/utils.ts'
import {onMounted, onUnmounted} from "vue";

const props = defineProps<CombData>()
const emit = defineEmits(['cellClicked']);

const handleClick = (char: string, event: MouseEvent) => {
  emit('cellClicked', char);

  // Apply the click animation
  const target = event.currentTarget as SVGElement;
  target.classList.add('clicked');

  setTimeout(() => {
    target.classList.remove('clicked');
  }, 100); // Duration should match the animation duration
};

function handleKeyPress(event: KeyboardEvent) {
  if (event.key.length === 1) {
    const target_id: string = 'cell-' + event.key.toUpperCase();
    const target = document.getElementById(target_id);
    if (target) {
      target.classList.add('clicked');

      setTimeout(() => {
        target.classList.remove('clicked');
      }, 100); // Duration should match the animation duration
    }
  }
}

function handleDblClick(event: MouseEvent) {
  event.preventDefault(); // Prevent text selection
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

</script>

<template>
  <div class="svg-container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid meet" class="svg-comb">
      <g class="center-cell" @click="handleClick(props.center_char, $event)" :id="'cell-' + props.center_char" @dblclick="handleDblClick($event)">
        <path d="M500.000000,671.502863C500.000000,671.502863 351.474164,585.751431 351.474164,585.751431 C351.474164,585.751431 351.474164,414.248569 351.474164,414.248569 C351.474164,414.248569 500.000000,328.497137 500.000000,328.497137 C500.000000,328.497137 648.525836,414.248569 648.525836,414.248569 C648.525836,414.248569 648.525836,585.751431 648.525836,585.751431 C648.525836,585.751431 500.000000,671.502863 500.000000,671.502863 Z" stroke="#000000" stroke-width="8"/>
        <text x="50%" y="50%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.center_char}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[0], $event)" :id="'cell-' + props.outer_chars[0]" @dblclick="handleDblClick($event)">
        <path d="M351.474164,414.248569C351.474164,414.248569 202.948328,328.497137 202.948328,328.497137 C202.948328,328.497137 202.948328,156.994274 202.948328,156.994274 C202.948328,156.994274 351.474164,71.242843 351.474164,71.242843 C351.474164,71.242843 500.000000,156.994274 500.000000,156.994274 C500.000000,156.994274 500.000000,328.497137 500.000000,328.497137 C500.000000,328.497137 351.474164,414.248569 351.474164,414.248569 Z" stroke="#000000" stroke-width="8"/>
        <text x="35.1474163906%" y="24.2745705648%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[0]}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[1], $event)" :id="'cell-' + props.outer_chars[1]" @dblclick="handleDblClick($event)">
        <path d="M648.525836,414.248569C648.525836,414.248569 500.000000,328.497137 500.000000,328.497137 C500.000000,328.497137 500.000000,156.994274 500.000000,156.994274 C500.000000,156.994274 648.525836,71.242843 648.525836,71.242843 C648.525836,71.242843 797.051672,156.994274 797.051672,156.994274 C797.051672,156.994274 797.051672,328.497137 797.051672,328.497137 C797.051672,328.497137 648.525836,414.248569 648.525836,414.248569 Z" stroke="#000000" stroke-width="8"/>
        <text x="64.852583609%" y="24.2745705648%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[1]}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[2], $event)" :id="'cell-' + props.outer_chars[2]" @dblclick="handleDblClick($event)">
        <path d="M797.051672,671.502863C797.051672,671.502863 648.525836,585.751431 648.525836,585.751431 C648.525836,585.751431 648.525836,414.248569 648.525836,414.248569 C648.525836,414.248569 797.051672,328.497137 797.051672,328.497137 C797.051672,328.497137 945.577508,414.248569 945.577508,414.248569 C945.577508,414.248569 945.577508,585.751431 945.577508,585.751431 C945.577508,585.751431 797.051672,671.502863 797.051672,671.502863 Z" stroke="#000000" stroke-width="8"/>
        <text x="79.7051672188%" y="50%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[2]}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[3], $event)" :id="'cell-' + props.outer_chars[3]" @dblclick="handleDblClick($event)">
        <path d="M648.525836,928.757157C648.525836,928.757157 500.000000,843.005726 500.000000,843.005726 C500.000000,843.005726 500.000000,671.502863 500.000000,671.502863 C500.000000,671.502863 648.525836,585.751431 648.525836,585.751431 C648.525836,585.751431 797.051672,671.502863 797.051672,671.502863 C797.051672,671.502863 797.051672,843.005726 797.051672,843.005726 C797.051672,843.005726 648.525836,928.757157 648.525836,928.757157 Z" stroke="#000000" stroke-width="8"/>
        <text x="64.852583609%" y="75.7254294352%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[3]}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[4], $event)" :id="'cell-' + props.outer_chars[4]" @dblclick="handleDblClick($event)">
        <path d="M351.474164,928.757157C351.474164,928.757157 202.948328,843.005726 202.948328,843.005726 C202.948328,843.005726 202.948328,671.502863 202.948328,671.502863 C202.948328,671.502863 351.474164,585.751431 351.474164,585.751431 C351.474164,585.751431 500.000000,671.502863 500.000000,671.502863 C500.000000,671.502863 500.000000,843.005726 500.000000,843.005726 C500.000000,843.005726 351.474164,928.757157 351.474164,928.757157 Z" stroke="#000000" stroke-width="8"/>
        <text x="35.1474163906%" y="75.7254294352%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[4]}}
        </text>
      </g>
      <g class="outer-cell" @click="handleClick(props.outer_chars[5], $event)" :id="'cell-' + props.outer_chars[5]" @dblclick="handleDblClick($event)">
        <path d="M202.948328,671.502863C202.948328,671.502863 54.422492,585.751431 54.422492,585.751431 C54.422492,585.751431 54.422492,414.248569 54.422492,414.248569 C54.422492,414.248569 202.948328,328.497137 202.948328,328.497137 C202.948328,328.497137 351.474164,414.248569 351.474164,414.248569 C351.474164,414.248569 351.474164,585.751431 351.474164,585.751431 C351.474164,585.751431 202.948328,671.502863 202.948328,671.502863 Z" stroke="#000000" stroke-width="8"/>
        <text x="20.2948327812%" y="50%" class="cell-letter" dominant-baseline="middle" text-anchor="middle">
          {{props.outer_chars[5]}}
        </text>
      </g>
    </svg>
  </div>

</template>

<style scoped>
.cell-letter{
  display: block;
  font-size: 1000%; /* Yes, that says 1,000 */
  fill: #000000;
  user-select: none;
}

.svg-container {
  height: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 60vh;
  width: 100%;
  max-height: 100%;
  margin: auto;
  flex: 8;
}



.clicked {
  animation: fadeToDark 0.1s forwards;
}

@keyframes fadeToDark {
  0% {

  }
  50% {
    fill: #7a4500; /* Darker color for the click effect */
  }
  100% {

  }
}


.center-cell{
  fill: #e8590c;
}
.outer-cell{
  fill: #f08c00;
}

@media (orientation: landscape){
  .center-cell:hover{
    fill: #aa4007;
    cursor: pointer;
  }
  .outer-cell:hover{
    fill: #aa6400;
    cursor: pointer;
  }
}

</style>
