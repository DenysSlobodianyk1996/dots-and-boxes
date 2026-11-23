<template>
  <!-- a screen inside the app shell (App.vue): it scrolls on its own in <main>, and the footer,
       when there is one, stays below it at the bottom of the screen (MB-11, FT-1) -->
  <div class="flex min-h-0 flex-1 flex-col">
    <!-- -mx-2/-mt-2 with the padding reach the shell's padding, so focus rings near the edge aren't
         clipped by the scroll area and the scrollbar sits at the edge; px-column centers the
         content in the column the header lines up with (MB-12) -->
    <main class="-mx-2 -mt-2 min-h-0 flex-1 overflow-y-auto overscroll-contain px-column py-2">
      <slot />
    </main>
    <!-- outside <main>, so it stays the page's contentinfo landmark -->
    <slot name="footer" />
  </div>
</template>
