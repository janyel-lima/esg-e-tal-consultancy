<template>
  <section id="about" class="relative overflow-hidden py-16 md:py-24 transition-all duration-300">
    <!-- Visual Background layout with dynamic overlays -->
    <div 
      class="absolute inset-0 bg-cover bg-center z-0"
      :style="{ backgroundImage: `url(${customBg || '/assets/hero_bg.jpg?v=2'})` }"
    ></div>

    <div 
      class="absolute inset-0 z-10 transition-colors duration-300"
      :style="store.darkMode 
        ? 'background: linear-gradient(135deg, rgba(8, 22, 35, 0.97), rgba(12, 24, 37, 0.95))' 
        : 'background: linear-gradient(135deg, rgba(250, 249, 246, 0.97), rgba(242, 239, 233, 0.95))'"
    ></div>

    <!-- Active Grid contents (change to vertical stack) -->
    <div class="relative z-20 max-w-[1440px] mx-auto px-4 md:px-10 space-y-10">
      
      <!-- Top Section: Dynamic Localized Purpose Quotes -->
      <div class="space-y-6">
        <span class="text-xs font-bold tracking-widest uppercase text-[#10B981] block">{{ store.texts.about.title }}</span>
        <h2 
          class="font-display text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight"
          :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
        >
          {{ store.texts.about.subtitle }}
        </h2>
        <div class="w-10 h-0.5 bg-[#10B981] rounded-full mb-8"></div>

        <!-- Marcus Vinicius Quote Box with Integrated Purpose Image (Green bar) -->
        <div 
          class="border-l-4 border-[#10B981] rounded-2xl p-6 md:p-8 shadow-md transition-all duration-300"
          :class="store.darkMode ? 'bg-[#132030] border-y border-r border-white/5' : 'bg-white border-y border-r border-[#0D1B2E]/10'"
        >
          <div class="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div class="md:col-span-7 space-y-4">
              <p 
                class="font-display font-medium italic text-base leading-relaxed"
                :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
              >
                {{ store.texts.about.quote }}
              </p>
              <div>
                <div 
                  class="font-bold text-xs md:text-sm"
                  :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
                >
                  {{ store.texts.about.quoteAuthor }}
                </div>
                <div class="text-[10px] md:text-xs text-[#6B8299] mt-0.5 uppercase tracking-wider font-semibold">
                  {{ store.texts.about.quoteRole }}
                </div>
              </div>
            </div>

            <!-- Exquisite image layout matching the requested site photo -->
            <div class="md:col-span-5 relative group overflow-hidden rounded-xl shadow-lg border border-neutral-200/10 dark:border-white/5 aspect-[4/3] w-full self-center">
              <img 
                src="/assets/purpose.jpg?v=2"
                alt="ESG e Tal Purpose & Team"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        <!-- Partners Quote Box (Purple bar) -->
        <div 
          class="border-l-4 border-[#8B5CF6] rounded-2xl p-6 md:p-8 shadow-md"
          :class="store.darkMode ? 'bg-[#132030] border-y border-r border-white/5' : 'bg-white border-y border-r border-[#0D1B2E]/10'"
        >
          <p 
            class="font-display font-medium italic text-sm md:text-base leading-relaxed mb-4"
            :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
          >
            {{ store.texts.about.testimonial }}
          </p>
          <div 
            class="font-bold text-xs md:text-sm"
            :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
          >
            {{ store.texts.about.testimonialAuthor }}
          </div>
          <div class="text-[10px] md:text-xs text-[#6B8299] mt-0.5 uppercase tracking-wider font-semibold">
            {{ store.texts.about.testimonialRole }}
          </div>
        </div>
      </div>

      <!-- Bottom Section: Strategic Pillars Grid & Certifications (Dynamic Dark/Light theme) -->
      <div 
        class="rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col justify-between border transition-all duration-300"
        :class="store.darkMode 
          ? 'bg-[#132030] text-[#E8EFF6] border-white/10' 
          : 'bg-white text-[#0D1B2E] border-[#0D1B2E]/10'"
      >
        <!-- Backdrop Bubble -->
        <div class="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-[#10B981]/10 pointer-events-none filter blur-2xl"></div>

        <div class="relative z-10 w-full">
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-6">
            {{ store.lang === 'pt' ? 'Nossos Pilares de Atuação' : 'Our Strategic Action Pillars' }}
          </h3>

          <!-- Pillars Grid (4 elements aligned in 4 columns on medium/large screens, 2 on mobile) -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <template v-for="(pillar, i) in pillars" :key="i">
              <div 
                class="border transition-all duration-300 rounded-xl p-4 flex items-center gap-3"
                :class="store.darkMode 
                  ? 'bg-white/5 border-white/5 hover:bg-white/10' 
                  : 'bg-stone-50 border-neutral-200/60 hover:bg-stone-100'"
              >
                <div 
                  class="w-10 h-10 rounded-lg flex items-center justify-center text-sm shrink-0 transition-colors duration-300"
                  :style="`background: ${pillar.c}15; color: ${pillar.c}`"
                >
                  <i :class="`fa-solid ${pillar.icon}`"></i>
                </div>
                <span 
                  class="text-xs md:text-sm font-semibold leading-snug transition-colors duration-300"
                  :class="store.darkMode ? 'text-white/80' : 'text-[#0D1B2E]/90'"
                >{{ pillar.label }}</span>
              </div>
            </template>
          </div>

          <!-- Certification Badges -->
          <div class="border-t pt-6" :class="store.darkMode ? 'border-white/10' : 'border-neutral-200'">
            <h4 class="text-[10px] font-bold uppercase tracking-wider mb-4" :class="store.darkMode ? 'text-[#6B8299]' : 'text-[#3D5470]'">
              {{ store.lang === 'pt' ? 'Métricas e Diretrizes Integradas' : 'Integrated Metrics & Guidelines' }}
            </h4>
            
            <div class="flex items-center gap-6 md:gap-12 flex-wrap">
              <div class="flex flex-col">
                <span class="font-display text-xl font-bold text-[#10B981]">GRI</span>
                <span class="text-[10px] tracking-wider transition-colors duration-300" :class="store.darkMode ? 'text-white/40' : 'text-neutral-500'">Standard</span>
              </div>
              <div class="flex flex-col">
                <span class="font-display text-xl font-bold text-[#10B981]">IFRS</span>
                <span class="text-[10px] tracking-wider transition-colors duration-300" :class="store.darkMode ? 'text-white/40' : 'text-neutral-500'">S1 & S2</span>
              </div>
              <div class="flex flex-col">
                <span class="font-display text-xl font-bold text-[#10B981]">ABNT</span>
                <span class="text-[10px] tracking-wider transition-colors duration-300" :class="store.darkMode ? 'text-white/40' : 'text-neutral-500'">PR 2030</span>
              </div>
              <div class="flex flex-col">
                <span class="font-display text-xl font-bold text-[#10B981]">ODS</span>
                <span class="text-[10px] tracking-wider transition-colors duration-300" :class="store.darkMode ? 'text-white/40' : 'text-neutral-500'">Pacto Global</span>
              </div>
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

const navItem = computed(() => (store.navbarItems || []).find(i => i.target === 'about'));
const customBg = computed(() => navItem.value?.bgImageUrl || null);

const pillars = computed(() => [
  { icon: 'fa-leaf', label: store.lang === 'pt' ? 'Meio Ambiente' : 'Environment', c: '#10B981' },
  { icon: 'fa-people-group', label: store.lang === 'pt' ? 'Resp. Social' : 'Social Corp.', c: '#F59E0B' },
  { icon: 'fa-scale-balanced', label: store.lang === 'pt' ? 'Governança' : 'Governance', c: '#3B82F6' },
  { icon: 'fa-bullhorn', label: store.lang === 'pt' ? 'Comunicação' : 'Comm Strategic', c: '#8B5CF6' }
]);
</script>
