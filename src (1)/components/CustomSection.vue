<template>
  <section 
    :id="onlyBlocks ? undefined : section.target" 
    class="relative overflow-hidden transition-colors duration-400"
    :class="[
      onlyBlocks ? '' : 'py-16 md:py-24 border-b',
      onlyBlocks ? '' : (store.darkMode ? 'border-white/5' : 'border-[#0D1B2E]/5')
    ]"
  >
    <!-- Custom Background Image with ambient styles if provided -->
    <template v-if="!onlyBlocks">
      <div 
        v-if="bgUrl"
        class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none"
        :style="{ backgroundImage: `url(${bgUrl})` }"
      ></div>

      <div 
        v-else
        class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 opacity-20 pointer-events-none"
        :class="store.darkMode ? 'bg-slate-950/40' : 'bg-white/40'"
      ></div>

      <!-- Theme dual gradient overlay -->
      <div 
        class="absolute inset-0 z-10 transition-colors duration-400 pointer-events-none"
        :class="[
          bgUrl
            ? (store.darkMode 
                ? 'bg-gradient-to-br from-[#060D18]/91 via-[#0A1626]/87 to-[#060D18]/82' 
                : 'bg-gradient-to-br from-[#FAF8F5]/91 via-[#F2EDE7]/82 to-[#FAF8F5]/91')
            : (store.darkMode 
                ? 'bg-gradient-to-br from-[#060D18]/95 via-[#0A1626]/92 to-[#060D18]/90' 
                : 'bg-gradient-to-br from-[#FAF8F5] via-[#F2EDE7] to-[#FAF8F5]')
        ]"
      ></div>
    </template>

    <!-- Content module container -->
    <div 
      class="relative z-20 max-w-[1440px] mx-auto px-4 md:px-10"
      :class="onlyBlocks ? 'pb-16 md:pb-24' : ''"
    >
      <template v-if="!onlyBlocks">
        <span class="text-xs font-bold tracking-widest uppercase text-[#10B981] block mb-2">
          {{ labelText }}
        </span>
        
        <h2 
          class="font-display text-3xl font-extrabold tracking-tight mb-4"
          :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
        >
          {{ titleText }}
        </h2>
        <div class="w-10 h-0.5 bg-[#10B981] rounded-full mb-10"></div>

        <!-- Main body text layout -->
        <div class="max-w-4xl space-y-6">
          <p 
            v-if="bodyText"
            class="text-sm md:text-base leading-relaxed whitespace-pre-line"
            :class="store.darkMode ? 'text-slate-300' : 'text-[#2C3E52]'"
          >
            {{ bodyText }}
          </p>

          <!-- Fallback if no content text AND no blocks are set yet -->
          <div v-if="!bodyText && (!section.blocks || section.blocks.length === 0)" class="p-6 rounded-2xl border border-dashed text-center text-xs text-slate-500" :class="store.darkMode ? 'border-white/10' : 'border-slate-300/60'">
            Nenhum conteúdo cadastrado para a seção "{{ labelText }}". <br/>Use o Painel Admin para editar os textos ou adicionar blocos de componentes.
          </div>

          <!-- Custom CTA Link Button -->
          <div v-if="section.ctaUrl && ctaLabel" class="pt-4">
            <a 
              :href="section.ctaUrl"
              target="_blank"
              class="inline-flex items-center gap-2 px-6 py-3 font-semibold text-xs rounded-xl shadow-sm text-white bg-[#10B981] hover:bg-[#0D9488] transition-all"
            >
              <span>{{ ctaLabel }}</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </template>

      <!-- ─── INFINITE BLOCKS COMPENDIUM ─── -->
      <div v-if="section.blocks && section.blocks.length > 0" :class="onlyBlocks ? '' : 'mt-12'" class="space-y-16">
        <div 
          v-for="block in section.blocks" 
          :key="block.id"
          class="w-full relative py-2"
        >
          <!-- 1. TEXT PLAYGROUND BLOCK -->
          <div 
            v-if="block.type === 'text'" 
            :class="[
              block.alignment === 'center' ? 'text-center mx-auto' : block.alignment === 'right' ? 'text-right ml-auto' : 'text-left',
              'max-w-4xl space-y-3'
            ]"
          >
            <span v-if="getLangVal(block.subtitle)" class="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
              {{ getLangVal(block.subtitle) }}
            </span>
            <h3 v-if="getLangVal(block.title)" class="font-display text-2xl font-bold tracking-tight" :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'">
              {{ getLangVal(block.title) }}
            </h3>
            <p v-if="getLangVal(block.body)" class="text-sm md:text-base leading-relaxed whitespace-pre-line" :class="store.darkMode ? 'text-slate-300' : 'text-[#2C3E52]'">
              {{ getLangVal(block.body) }}
            </p>
          </div>

          <!-- 2. FEATURES GRID BLOCK -->
          <div v-else-if="block.type === 'features_grid'" class="space-y-6">
            <div class="max-w-3xl" v-if="getLangVal(block.title) || getLangVal(block.subtitle)">
              <span v-if="getLangVal(block.subtitle)" class="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                {{ getLangVal(block.subtitle) }}
              </span>
              <h3 v-if="getLangVal(block.title)" class="font-display text-xl font-bold" :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'">
                {{ getLangVal(block.title) }}
              </h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div 
                v-for="item in (block.items || [])" 
                :key="item.id"
                class="p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between"
                :class="store.darkMode 
                  ? 'bg-[#0E1B2C]/50 border-white/5 hover:border-white/10' 
                  : 'bg-white border-black/5 shadow-sm hover:shadow-md'"
              >
                <div>
                  <div 
                    v-if="item.icon" 
                    class="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform hover:scale-105"
                    :class="store.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/5 text-emerald-600'"
                  >
                    <i :class="[resolveIconClass(item.icon), 'text-base']"></i>
                  </div>

                  <h4 class="font-bold text-sm mb-1" :class="store.darkMode ? 'text-slate-100' : 'text-[#0D1B2E]'">
                    {{ getLangVal(item.title) }}
                  </h4>
                  <div v-if="getLangVal(item.subtitle)" class="text-[9px] font-black uppercase text-[#10B981] tracking-widest mb-2.5">
                    {{ getLangVal(item.subtitle) }}
                  </div>
                  <p class="text-xs leading-relaxed" :class="store.darkMode ? 'text-slate-400' : 'text-slate-600'">
                    {{ getLangVal(item.body) }}
                  </p>
                </div>

                <div v-if="item.ctaUrl && getLangVal(item.ctaText)" class="mt-4 pt-4 border-t" :class="store.darkMode ? 'border-white/5' : 'border-slate-100'">
                  <a 
                    :href="item.ctaUrl" 
                    target="_blank"
                    class="text-[11px] font-bold text-[#10B981] hover:text-[#059669] flex items-center gap-1"
                  >
                    <span>{{ getLangVal(item.ctaText) }}</span>
                    <i class="fa-solid fa-chevron-right text-[8px]"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- 3. ACCORDION / FAQ BLOCK -->
          <div v-else-if="block.type === 'accordion'" class="max-w-4xl space-y-6">
            <div v-if="getLangVal(block.title) || getLangVal(block.subtitle)">
              <span v-if="getLangVal(block.subtitle)" class="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                {{ getLangVal(block.subtitle) }}
              </span>
              <h3 v-if="getLangVal(block.title)" class="font-display text-xl font-bold" :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'">
                {{ getLangVal(block.title) }}
              </h3>
            </div>

            <div class="space-y-3">
              <div 
                v-for="(item, iIdx) in (block.items || [])" 
                :key="item.id"
                class="border rounded-xl overflow-hidden transition-colors duration-200"
                :class="store.darkMode ? 'bg-[#0E1B2C]/40 border-white/5' : 'bg-white border-black/5'"
              >
                <button 
                  @click="toggleAccordion(block.id, iIdx)"
                  class="w-full py-4 px-5 text-left font-bold text-xs flex items-center justify-between outline-none cursor-pointer border-none bg-transparent"
                  :class="store.darkMode ? 'text-slate-100 hover:text-white' : 'text-[#0D1B2E] hover:text-[#10B981]'"
                >
                  <span>{{ getLangVal(item.title) }}</span>
                  <i 
                    class="fa-solid fa-chevron-down text-[10px] transition-transform duration-300"
                    :class="{ 'rotate-180': isAccordionExpanded(block.id, iIdx) }"
                  ></i>
                </button>
                <div 
                  v-show="isAccordionExpanded(block.id, iIdx)"
                  class="px-5 pb-5 pt-1 text-xs leading-relaxed"
                  :class="store.darkMode ? 'text-slate-400' : 'text-slate-600'"
                >
                  {{ getLangVal(item.body) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 4. STATS COUNTERS GRID BLOCK -->
          <div v-else-if="block.type === 'stats'" class="space-y-6">
            <div class="max-w-3xl" v-if="getLangVal(block.title) || getLangVal(block.subtitle)">
              <span v-if="getLangVal(block.subtitle)" class="text-[10px] font-bold uppercase tracking-widest text-[#10B981]">
                {{ getLangVal(block.subtitle) }}
              </span>
              <h3 v-if="getLangVal(block.title)" class="font-display text-xl font-bold" :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'">
                {{ getLangVal(block.title) }}
              </h3>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div 
                v-for="item in (block.items || [])" 
                :key="item.id"
                class="p-6 rounded-2xl border text-center transition-all duration-355 hover:scale-103"
                :class="store.darkMode 
                  ? 'bg-gradient-to-br from-[#0C1525]/80 to-[#0A101C]/80 border-white/5' 
                  : 'bg-white border-black/5 shadow-sm'"
              >
                <!-- Optional icon display for stats metric -->
                <div 
                  v-if="item.icon" 
                  class="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3.5 transition-transform hover:scale-110"
                  :class="store.darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-500/5 text-emerald-600'"
                >
                  <i :class="[resolveIconClass(item.icon), 'text-sm']"></i>
                </div>
                <div class="text-2xl md:text-3xl font-extrabold tracking-tight text-[#10B981] mb-1 font-mono">
                  {{ item.value || '0' }}
                </div>
                <div class="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  {{ getLangVal(item.title) }}
                </div>
                <p v-if="getLangVal(item.body)" class="text-[10px] mt-1.5" :class="store.darkMode ? 'text-slate-400' : 'text-slate-600'">
                  {{ getLangVal(item.body) }}
                </p>
              </div>
            </div>
          </div>

          <!-- 5. POLISHED IMAGE ASSETS BLOCK -->
          <div v-else-if="block.type === 'image'" class="space-y-4">
            <div class="max-w-4xl rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative group">
              <img 
                v-if="block.bgImageUrl" 
                :src="block.bgImageUrl" 
                :alt="getLangVal(block.title) || 'Block cover'"
                class="w-full object-cover transition-transform duration-700 hover:scale-102"
                style="max-height: 480px;"
              />
              <div v-else class="h-64 bg-slate-900 border flex items-center justify-center text-xs text-slate-600">
                imagem em branco (URL não cadastrado)
              </div>
              <div 
                v-if="getLangVal(block.title) || getLangVal(block.body)"
                class="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-slate-950/90 via-slate-950/50 to-transparent text-white"
              >
                <h4 class="font-bold text-sm leading-tight mb-1">{{ getLangVal(block.title) }}</h4>
                <p class="text-xs text-slate-300 leading-relaxed">{{ getLangVal(block.body) }}</p>
              </div>
            </div>
          </div>

          <!-- 6. HIGH-CONTEST CTA BLOCK -->
          <div 
            v-else-if="block.type === 'cta'" 
            class="p-8 md:p-12 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
            :class="store.darkMode 
              ? 'bg-gradient-to-bl from-emerald-950/45 to-slate-950/80 border-emerald-500/20' 
              : 'bg-gradient-to-bl from-emerald-500/5 to-white border-emerald-500/20 shadow-sm'"
          >
            <div class="space-y-2 max-w-xl">
              <span v-if="getLangVal(block.subtitle)" class="text-[9px] font-bold uppercase tracking-widest text-[#10B981]">
                {{ getLangVal(block.subtitle) }}
              </span>
              <h3 class="font-display text-xl md:text-2xl font-bold tracking-tight" :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'">
                {{ getLangVal(block.title) || 'Interessado em saber mais?' }}
              </h3>
              <p v-if="getLangVal(block.body)" class="text-xs md:text-sm leading-relaxed" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">
                {{ getLangVal(block.body) }}
              </p>
            </div>

            <!-- Block CTA Trigger Items button -->
            <div v-if="block.items && block.items[0]" class="shrink-0 flex gap-3">
              <a 
                v-for="btn in (block.items || [])"
                :key="btn.id"
                :href="btn.ctaUrl || '#'"
                target="_blank"
                class="inline-flex items-center gap-2 px-5 py-3 font-bold text-xs rounded-xl shadow-sm text-white transition-all bg-[#10B981] hover:bg-[#0D9488]"
              >
                <span>{{ getLangVal(btn.title) || 'Ver Mais' }}</span>
                <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useEsgStore } from '../stores/esgStore';
import type { NavbarItem } from '../types';

const props = withDefaults(defineProps<{
  section: NavbarItem;
  onlyBlocks?: boolean;
}>(), {
  onlyBlocks: false
});

const store = useEsgStore();

// Localized computation variables for reactive display
const isEn = computed(() => store.lang === 'en');

const labelText = computed(() => {
  if (!props.section.label) return '';
  if (typeof props.section.label === 'string') return props.section.label;
  return isEn.value ? (props.section.label.en || props.section.label.pt) : props.section.label.pt;
});

const titleText = computed(() => {
  if (props.section.sectionTitle) {
    if (typeof props.section.sectionTitle === 'string') return props.section.sectionTitle;
    return isEn.value ? (props.section.sectionTitle.en || props.section.sectionTitle.pt) : props.section.sectionTitle.pt;
  }
  return labelText.value;
});

const bodyText = computed(() => {
  if (props.section.sectionBody) {
    if (typeof props.section.sectionBody === 'string') return props.section.sectionBody;
    return isEn.value ? (props.section.sectionBody.en || props.section.sectionBody.pt) : props.section.sectionBody.pt;
  }
  return '';
});

const ctaLabel = computed(() => {
  if (props.section.ctaText) {
    if (typeof props.section.ctaText === 'string') return props.section.ctaText;
    return isEn.value ? (props.section.ctaText.en || props.section.ctaText.pt) : props.section.ctaText.pt;
  }
  return '';
});

const bgUrl = computed(() => {
  return props.section.bgImageUrl || null;
});

// Helper getter function to parse localized string or objects Safely
const getLangVal = (obj: any) => {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return isEn.value ? (obj.en || obj.pt) : obj.pt;
};

// Robust FontAwesome icon parser and normalizer
const resolveIconClass = (iconStr: any) => {
  if (!iconStr || typeof iconStr !== 'string') return 'fa-solid fa-question';
  const trimmed = iconStr.trim();
  if (trimmed.startsWith('fa-solid ') || trimmed.startsWith('fa-regular ') || trimmed.startsWith('fa-brands ')) {
    return trimmed;
  }
  if (trimmed.startsWith('fa-')) {
    return `fa-solid ${trimmed}`;
  }
  return `fa-solid fa-${trimmed}`;
};

// Accordion collapse state tracking
const expandedAccordions = ref<Record<string, Record<number, boolean>>>({});

const toggleAccordion = (blockId: string, itemIdx: number) => {
  if (!expandedAccordions.value[blockId]) {
    expandedAccordions.value[blockId] = {};
  }
  expandedAccordions.value[blockId][itemIdx] = !expandedAccordions.value[blockId][itemIdx];
};

const isAccordionExpanded = (blockId: string, itemIdx: number) => {
  return !!expandedAccordions.value[blockId]?.[itemIdx];
};
</script>
