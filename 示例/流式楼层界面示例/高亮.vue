<<<<<<< HEAD
﻿<template>
  <div v-if="html" v-html="html"></div>
  <slot v-else />
</template>

<script setup lang="ts">
=======
<template>
  <WordHighlighter :query="query" highlight-class="StreamingMessage--mark" :html-to-highlight="html">
    <slot />
  </WordHighlighter>
</template>

<script setup lang="ts">
import WordHighlighter from 'vue-word-highlighter';

>>>>>>> 821d0f7fc2e1ba1b9ee76aa4a9f6fc81238c4bfb
defineProps<{ query: string; html?: string }>();
</script>

<!-- 不能 scoped 因为酒馆自己有 mark 样式会影响到 -->
<style lang="scss">
.StreamingMessage--mark {
  background-color: color-mix(in srgb, var(--SmartThemeQuoteColor) 70%, transparent);
  color: var(--SmartThemeBodyColor);
}
</style>
