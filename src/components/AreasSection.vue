<template>
  <section id="areas" class="relative overflow-hidden bg-[#F2EFE9] dark:bg-[#0C1825] py-16 md:py-24 transition-colors duration-300">
    <!-- Customizable Background Image -->
    <div 
      v-if="customBg"
      class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none"
      :class="store.darkMode ? 'opacity-25' : 'opacity-15'"
      :style="{ backgroundImage: `url(${customBg})` }"
    ></div>

    <div class="relative z-10 max-w-[1440px] mx-auto px-4 md:px-10">
      
      <!-- Section Header aligned Center -->
      <div class="text-center mb-12">
        <span class="text-xs font-bold tracking-widest uppercase text-[#10B981] block mb-2">{{ store.texts.areas.title }}</span>
        <h2 
          class="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight"
          :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
        >
          {{ store.texts.areas.title }}
        </h2>
        <div class="w-12 h-1 bg-[#10B981] rounded-full mx-auto mt-4"></div>
      </div>

      <!-- Action Fields Grid Layout (4 domains) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        <div 
          v-for="area in store.areas" 
          :key="area.key"
          @click="store.openAreaModal(area.key); store.trackEvent('section_' + area.key)"
          class="group bg-white dark:bg-[#0F1E30] border border-neutral-200/50 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 cursor-pointer transition-all duration-350 flex flex-col h-full"
        >
          <!-- Thin Dynamic Top Bar Accent -->
          <div class="h-1 shrink-0" :style="`background-color: ${area.color}`"></div>

          <!-- Thumbnail Image -->
          <div class="relative h-[150px] md:h-[160px] overflow-hidden shrink-0 bg-neutral-200 dark:bg-white/5">
            <img 
              :src="area.img" 
              :alt="area.name" 
              loading="lazy"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-black/10 dark:bg-black/20 group-hover:bg-transparent transition-all"></div>
          </div>

          <!-- Card Content Body -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <!-- Micro Colored Icon Frame -->
              <div 
                class="w-10 h-10 rounded-xl flex items-center justify-center text-sm mb-4 shrink-0 transition-transform group-hover:scale-105"
                :style="`background-color: ${area.colorSoft || 'rgba(16,185,129,0.1)'}; color: ${area.color}`"
              >
                <i :class="`fa-solid ${area.icon}`"></i>
              </div>

              <!-- Title -->
              <h3 
                class="font-display text-lg font-bold mb-3 leading-normal group-hover:text-[#10B981] transition-colors"
                :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
              >
                {{ area.name }}
              </h3>

              <!-- Clipped description paragraph -->
              <p 
                class="text-xs md:text-sm leading-relaxed mb-6 line-clamp-4"
                :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
              >
                {{ area.desc }}
              </p>
            </div>

            <!-- Footer Arrow Link -->
            <div 
              class="flex items-center gap-1 text-xs font-bold transition-all"
              :style="`color: ${area.color}`"
            >
              <span>{{ store.texts.areas.learnMore }}</span>
              <i class="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

const navItem = computed(() => (store.navbarItems || []).find(i => i.target === 'areas'));
const customBg = computed(() => navItem.value?.bgImageUrl || null);
</script>
