<template>
  <section id="contact" class="relative overflow-hidden py-16 md:py-24 transition-colors duration-400">
    <!-- Clean Solid/Gradient Dark/Light Theme Background on the Outer Container -->
    <div 
      class="absolute inset-0 z-0 transition-colors duration-450"
      :class="store.darkMode 
        ? 'bg-gradient-to-br from-[#08111C] via-[#0B1929] to-[#08111C]' 
        : 'bg-gradient-to-br from-[#FAF9F6] via-[#EFEAE4] to-[#FAF9F6]'"
    ></div>

    <!-- Customizable Background Image -->
    <div 
      v-if="customBg"
      class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500 pointer-events-none"
      :class="store.darkMode ? 'opacity-25' : 'opacity-15'"
      :style="{ backgroundImage: `url(${customBg})` }"
    ></div>

    <!-- Main Content Frame (z-20) -->
    <div class="relative z-20 max-w-[1440px] mx-auto px-4 md:px-10">
      <div 
        class="relative overflow-hidden rounded-3xl border p-8 md:p-12 transition-all shadow-xl"
        :class="store.darkMode 
          ? 'bg-[#132030]/35 border-white/10'
          : 'bg-white/45 border-[#0E2035]/10'"
      >
        <!-- The Content & Image Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Left Side: Texts, Badge and CTAs -->
          <div class="lg:col-span-7 text-center lg:text-left space-y-6">
            <!-- Section Label Badge -->
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/25 text-[#10B981] text-[10px] font-extrabold uppercase tracking-wide">
              <i class="fa-solid fa-envelope"></i>
              <span>{{ store.lang === 'pt' ? 'Contatos' : 'Contact' }}</span>
            </div>

            <!-- Headline -->
            <h2 
              class="font-display font-bold text-3xl md:text-4xl leading-tight"
              :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
            >
              {{ store.texts.contact.title }}
            </h2>

            <!-- Subtitle -->
            <p 
              class="text-xs sm:text-sm md:text-base leading-relaxed font-semibold"
              :class="store.darkMode ? 'text-[#E2EEF8]' : 'text-[#1E2E42]'"
            >
              {{ store.texts.contact.subtitle }}
            </p>

            <!-- Body -->
            <p 
              class="text-xs leading-relaxed font-semibold max-w-xl mx-auto lg:mx-0"
              :class="store.darkMode ? 'text-[#A5BEDA]' : 'text-[#2D425C]'"
            >
              {{ store.texts.contact.body }}
            </p>

            <!-- Action buttons (WhatsApp coordinate linkages) -->
            <div class="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full max-w-md mx-auto lg:mx-0 pt-2">
              <a 
                href="https://wa.me/5511987308730" 
                target="_blank" 
                rel="noopener"
                class="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs md:text-sm rounded-full shadow-md hover:shadow-[#10B981]/30 hover:-translate-y-0.5 transition-all duration-300"
              >
                <i class="fa-brands fa-whatsapp text-base"></i>
                <span>{{ store.texts.contact.cta1 }}</span>
              </a>

              <a 
                href="mailto:contato@esgetal.com.br" 
                class="flex items-center justify-center gap-2 w-full px-6 py-3.5 border hover:border-[#10B981] bg-white/5 font-bold text-xs md:text-sm rounded-full transition-all duration-300"
                :class="store.darkMode 
                  ? 'border-white/10 text-[#E8EFF6] hover:text-[#10B981]' 
                  : 'border-[#0D1B2E]/10 text-[#0D1B2E] hover:text-[#10B981]'"
              >
                <i class="fa-solid fa-comments"></i>
                <span>{{ store.texts.contact.cta2 }}</span>
              </a>
            </div>
          </div>

          <!-- Right Side: Majestic Showcase Image (Inspired by the old layout's clean visual framing) -->
          <div class="lg:col-span-5 relative group overflow-hidden rounded-2xl shadow-lg border border-neutral-200/10 dark:border-white/5 aspect-[4/3] w-full self-center">
            <img 
              src="/assets/contact_bg.png?v=2" 
              alt="Fale Conosco Image - ESG e Tal" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>

        </div>

        <!-- Social grid blocks -->
        <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6 border-t border-neutral-200/10 pt-8 mt-10">
          <template v-for="(soc, i) in socialList" :key="i">
            <a 
              :href="soc.link" 
              target="_blank" 
              rel="noopener"
              class="group flex flex-col items-center gap-2 hover:text-[#10B981] hover:-translate-y-1 transition-all duration-250 cursor-pointer"
              :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
            >
              <div 
                class="w-12 h-12 rounded-2xl group-hover:bg-[#10B981]/15 group-hover:border-[#10B981]/30 group-hover:text-[#10B981] flex items-center justify-center text-base shrink-0 transition-all duration-250 shadow-sm"
                :class="store.darkMode 
                  ? 'bg-white/5 border border-white/10' 
                  : 'bg-neutral-100 border border-neutral-300/40'"
              >
                <i :class="soc.icon"></i>
              </div>
              <span class="text-[10px] md:text-xs font-semibold tracking-wide whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                {{ soc.text }}
              </span>
            </a>
          </template>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

const navItem = computed(() => (store.navbarItems || []).find(i => i.target === 'contact'));
const customBg = computed(() => navItem.value?.bgImageUrl || null);

const socialList = computed(() => [
  { icon: 'fa-brands fa-whatsapp', text: '+55 (11) 98730 8730', link: 'https://wa.me/5511987308730' },
  { icon: 'fa-brands fa-linkedin-in', text: 'esgetal-linkedin', link: 'https://www.linkedin.com/company/esgetal/' },
  { icon: 'fa-brands fa-instagram', text: '@grupoesgetal', link: 'https://www.instagram.com/grupoesgetal/' },
  { icon: 'fa-brands fa-facebook-f', text: 'esgetal-facebook', link: 'https://www.facebook.com/esgetal/' },
  { icon: 'fa-solid fa-globe', text: 'esgetal.com.br', link: 'https://esgetal.com.br' }
]);
</script>
