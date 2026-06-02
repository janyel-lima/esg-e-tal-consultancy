<template>
  <section id="research" class="relative overflow-hidden py-16 md:py-24 bg-[#FAFAF8] dark:bg-[#07111E] text-[#0D1B2E] dark:text-[#E8EFF6] transition-colors duration-300">
    <!-- Customizable Background Image -->
    <div 
      v-if="customBg"
      class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none"
      :class="store.darkMode ? 'opacity-25' : 'opacity-15'"
      :style="{ backgroundImage: `url(${customBg})` }"
    ></div>

    <!-- Radiant Violet Aura -->
    <div class="absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_50%_at_8%_82%,rgba(139,92,246,0.08),transparent_60%)]"></div>

    <div class="relative z-10 max-w-[1440px] mx-auto px-4 md:px-10">
      <!-- Section Headers -->
      <span class="text-xs font-bold tracking-widest uppercase text-[#8B5CF6] block mb-2">
        {{ store.texts.research.title }}
      </span>
      <h2 
        class="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4"
        :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
      >
        {{ store.texts.research.title }}
      </h2>
      <div class="w-10 h-0.5 bg-[#8B5CF6] rounded-full mb-10"></div>

      <!-- Main Slider Wrapper of Mini-A4 Cards -->
      <div class="overflow-hidden w-full relative">
        <div 
          class="flex gap-6 transition-transform duration-500 ease-out" 
          :style="{ transform: `translateX(calc(-${activeIndex} * (100% + 24px) / ${itemsPerPage}))` }"
        >
          <!-- Unified dynamic loop for active items -->
          <div 
            v-for="(node, idx) in activeResearchCards" 
            :key="node.id"
            class="shrink-0 transition-transform duration-300 rounded-2xl flex flex-col justify-between h-full bg-white dark:bg-white/5 border border-neutral-200 dark:border-white/10 hover:border-[#8B5CF6]/30 shadow-sm dark:shadow-md min-h-[500px]"
            :style="{ width: `calc(100% / ${itemsPerPage} - ${(24 * (itemsPerPage - 1)) / itemsPerPage}px)` }"
          >
            <!-- Graphic Image Banner -->
            <div class="relative h-[180px] w-full shrink-0 overflow-hidden rounded-t-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <img 
                v-if="node.imgUrl"
                :src="node.imgUrl" 
                :alt="node.headline" 
                class="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div v-else class="flex flex-col items-center gap-2 text-neutral-400 dark:text-white/20">
                <i class="fa-solid fa-microscope text-3xl"></i>
                <span class="text-[10px] tracking-widest uppercase font-semibold">
                  {{ store.lang === 'pt' ? 'Estação de Pesquisa' : 'Research Station' }}
                </span>
              </div>
              <div class="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]"></span>
                <span class="text-[9px] font-bold uppercase tracking-wider text-white/80">
                  {{ node.isFeatured ? (store.lang === 'pt' ? 'Artigo em Destaque' : 'Featured Article') : (store.lang === 'pt' ? 'Pesquisa' : 'Research') }}
                </span>
              </div>
            </div>

            <!-- Card Body Content -->
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <!-- Badges block -->
                <div class="flex flex-wrap items-center gap-2 mb-2">
                  <!-- Calendar date -->
                  <div class="flex items-center gap-1.5 text-xs text-[#8B5CF6] font-semibold">
                    <i class="fa-regular fa-calendar-days text-[11px]"></i>
                    <span>{{ node.date }}</span>
                  </div>

                  <!-- Customizable badge style -->
                  <div 
                    v-if="node.customBadgeText"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wide"
                    :class="getBadgeStyles(node.customBadgeColor)"
                  >
                    <i class="fa-solid fa-tag"></i>
                    <span>{{ node.customBadgeText }}</span>
                  </div>
                </div>

                <h3 
                  class="font-display font-bold text-base md:text-lg mb-2 leading-snug line-clamp-3"
                  :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
                >
                  {{ node.headline }}
                </h3>

                <p 
                  v-if="node.author" 
                  class="text-xs italic mb-4 line-clamp-2"
                  :class="store.darkMode ? 'text-neutral-400' : 'text-[#3D5470]'"
                >
                  {{ node.author }}
                </p>

                <!-- Collapse description -->
                <div 
                  class="overflow-hidden transition-all duration-300"
                  :style="{ maxHeight: dynamicExpanded[node.id] ? '350px' : '72px' }"
                >
                  <p 
                    class="text-xs leading-relaxed mb-3"
                    :class="store.darkMode ? 'text-neutral-300' : 'text-[#3D5470]'"
                  >
                    {{ node.body }}
                  </p>
                  <p 
                    v-if="node.body2" 
                    class="text-xs leading-relaxed mt-2 font-light"
                    :class="store.darkMode ? 'text-neutral-400' : 'text-[#6B8299]'"
                  >
                    {{ node.body2 }}
                  </p>
                </div>

                <!-- Custom Customizable Fields lists -->
                <div v-if="node.customFields && node.customFields.length > 0" class="mt-4 pt-3 border-t border-dashed border-neutral-200/10 dark:border-white/5 space-y-1.5">
                  <div v-for="(field, fIdx) in node.customFields" :key="fIdx" class="flex justify-between items-center text-[10px] leading-relaxed">
                    <span class="text-neutral-400 font-bold uppercase tracking-wider text-[8px]">
                      {{ store.lang === 'pt' ? field.label.pt : field.label.en }}:
                    </span>
                    <span class="font-semibold text-right" :class="store.darkMode ? 'text-white' : 'text-slate-800'">
                      {{ store.lang === 'pt' ? field.value.pt : field.value.en }}
                    </span>
                  </div>
                </div>

                <!-- Expander Button -->
                <button 
                  @click="toggleDynamicExpand(node.id)"
                  class="inline-flex items-center gap-1 mt-3 px-0 py-1 text-[11px] font-bold text-[#8B5CF6] hover:text-[#a78bfa] hover:gap-1.5 transition-all text-left bg-transparent border-none cursor-pointer"
                >
                  <span>{{ dynamicExpanded[node.id] 
                    ? (store.lang === 'pt' ? 'Ler menos' : 'Read less') 
                    : (store.lang === 'pt' ? 'Ler mais' : 'Read more') }}</span>
                  <i class="fa-solid fa-chevron-down transition-transform duration-300" :class="{ 'rotate-180': dynamicExpanded[node.id] }"></i>
                </button>
              </div>

              <!-- Action ctaUrl if provided -->
              <div v-if="node.ctaUrl" class="mt-6 pt-4 border-t border-neutral-200 dark:border-white/5">
                <a 
                  :href="node.ctaUrl" 
                  target="_blank" 
                  rel="noopener"
                  class="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#8B5CF6] hover:bg-[#7D3AED] text-white text-xs font-bold rounded-full shadow-md shadow-[#8B5CF6]/25 transition-all duration-300"
                >
                  <i class="fa-solid fa-file-pdf"></i>
                  <span>{{ node.ctaText || (store.lang === 'pt' ? 'Acessar Artigo' : 'Access Publication') }}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Slider controller indicators -->
      <div class="flex items-center gap-4 mt-8">
        <button 
          @click="prevSlide" 
          :disabled="activeIndex === 0"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-neutral-200 dark:border-white/15 bg-white dark:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          aria-label="Previous"
        >
          <i class="fa-solid fa-chevron-left text-xs"></i>
        </button>

        <div class="flex gap-1.5 items-center">
          <button 
            v-for="i in totalDots" 
            :key="i"
            @click="goToSlide(i - 1)"
            class="h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer"
            :class="activeIndex === (i - 1) ? 'w-[22px] bg-[#8B5CF6]' : 'w-1.5 bg-neutral-200 dark:bg-white/20'"
            :aria-label="`Go to slide ${i}`"
          ></button>
        </div>

        <button 
          @click="nextSlide" 
          :disabled="activeIndex >= maxIndex"
          class="w-9 h-9 rounded-full flex items-center justify-center border border-neutral-200 dark:border-white/15 bg-white dark:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:border-[#8B5CF6] hover:text-[#8B5CF6] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
          aria-label="Next"
        >
          <i class="fa-solid fa-chevron-right text-xs"></i>
        </button>
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

const navItem = computed(() => (store.navbarItems || []).find(i => i.target === 'research'));
const customBg = computed(() => navItem.value?.bgImageUrl || null);

const dynamicExpanded = ref<Record<string, boolean>>({});

const activeIndex = ref(0);
const windowWidth = ref(window.innerWidth);

const itemsPerPage = computed(() => {
  if (windowWidth.value > 1024) return 3;
  if (windowWidth.value > 640) return 2;
  return 1;
});

const activeResearchCards = computed(() => {
  const isEn = store.lang === 'en';
  return store.sortedResearch
    .filter(node => node.visible !== false)
    .map(node => ({
      id: node.id,
      date: isEn ? (node.date?.en || node.date?.pt) : node.date?.pt,
      headline: isEn ? (node.headline?.en || node.headline?.pt) : node.headline?.pt,
      author: isEn ? (node.author?.en || node.author?.pt) : node.author?.pt,
      body: isEn ? (node.body?.en || node.body?.pt) : node.body?.pt,
      body2: node.body2 ? (isEn ? (node.body2?.en || node.body2?.pt) : node.body2?.pt) : '',
      imgUrl: node.imgUrl,
      ctaUrl: node.ctaUrl,
      ctaText: node.ctaText ? (isEn ? (node.ctaText?.en || node.ctaText?.pt) : node.ctaText?.pt) : '',
      isFeatured: node.isFeatured || false,
      customBadgeText: node.customBadgeText ? (isEn ? (node.customBadgeText.en || node.customBadgeText.pt) : node.customBadgeText.pt) : '',
      customBadgeColor: node.customBadgeColor || '',
      customFields: node.customFields || []
    }));
});

const getBadgeStyles = (color: string) => {
  const list: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500',
    amber: 'bg-amber-500/10 border-amber-500/25 text-amber-500',
    indigo: 'bg-indigo-500/10 border-indigo-500/25 text-indigo-400',
    sky: 'bg-sky-500/10 border-sky-500/25 text-sky-400',
    rose: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    violet: 'bg-violet-500/10 border-violet-500/25 text-[#a78bfa]',
    blue: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
  };
  return list[color?.toLowerCase()] || 'bg-violet-500/10 border-violet-500/25 text-[#a78bfa]';
};

const totalCardsCount = computed(() => {
  return activeResearchCards.value.length;
});

const maxIndex = computed(() => {
  return Math.max(0, totalCardsCount.value - itemsPerPage.value);
});

const totalDots = computed(() => {
  return Math.max(1, totalCardsCount.value - itemsPerPage.value + 1);
});

const prevSlide = () => {
  if (activeIndex.value > 0) activeIndex.value--;
};

const nextSlide = () => {
  if (activeIndex.value < maxIndex.value) {
    activeIndex.value++;
  } else {
    activeIndex.value = 0;
  }
};

const goToSlide = (idx: number) => {
  activeIndex.value = Math.max(0, Math.min(maxIndex.value, idx));
};

const toggleDynamicExpand = (id: string) => {
  dynamicExpanded.value[id] = !dynamicExpanded.value[id];
};

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

watch(itemsPerPage, () => {
  activeIndex.value = Math.min(activeIndex.value, maxIndex.value);
});

onMounted(() => {
  window.addEventListener('resize', updateWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>
