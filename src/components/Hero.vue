<template>
  <section 
    id="home" 
    class="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center bg-[#070F1A]"
    style="background-image: url('/assets/hero_bg.jpg?v=2'); background-position: top center;"
  >
    <!-- Background Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-br from-[#040A14]/95 via-[#0A182A]/85 to-[#040A14]/70 z-10"></div>
    
    <!-- Decorative Grid Overlay -->
    <div 
      class="absolute inset-0 z-10 opacity-30 pointer-events-none"
      style="
        background-image: linear-gradient(rgba(16, 185, 129, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.04) 1px, transparent 1px);
        background-size: clamp(40px, 6vw, 70px) clamp(40px, 6vw, 70px);
        mask-image: radial-gradient(ellipse at center, black 20%, transparent 80%);
      "
    ></div>

    <!-- Radiant Glow Backdrop -->
    <div class="absolute inset-0 z-10 bg-[radial-gradient(ellipse_65%_70%_at_80%_45%,rgba(16,185,129,0.08)_0%,transparent_65%)]"></div>

    <!-- Core Content Wrapper -->
    <div class="relative z-20 max-w-[1440px] w-full mx-auto px-4 sm:px-10 py-24 sm:py-32 flex flex-col justify-center">
      <!-- Logo Mark -->
      <div class="mb-8 animate-fade-up-1">
        <img 
          src="/assets/logo_white.png?v=2" 
          alt="ESG e Tal Logo" 
          class="h-[44px] md:h-[54px] w-auto object-contain block"
        />
      </div>

      <!-- Main Headline -->
      <h1 class="font-display font-bold text-[#E8EFF6] leading-[1.05] tracking-tight mb-6 animate-fade-up-2 text-[clamp(2.4rem,6vw,5.5rem)]">
        <span class="text-[#10B981]">{{ store.texts.hero.tag1 }}</span><br />
        <span>{{ store.texts.hero.tag2 }}</span><br />
        <span>{{ store.texts.hero.tag3 }}</span>
      </h1>

      <!-- Slogan / Description Subtitle -->
      <p class="text-[#9BB4CC] text-base md:text-lg max-w-[530px] leading-relaxed mb-10 animate-fade-up-3">
        {{ store.texts.hero.subtitle }}
      </p>

      <!-- Action Buttons -->
      <div class="flex flex-wrap gap-4 items-center mb-16 sm:mb-20 animate-fade-up-4">
        <a 
          href="#contact" 
          @click.prevent="scrollTo('contact')"
          class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white font-semibold rounded-full shadow-lg hover:shadow-[#10B981]/30 hover:-translate-y-0.5 transition-all duration-300"
        >
          <i class="fa-solid fa-arrow-right text-xs"></i>
          <span>{{ store.texts.hero.cta }}</span>
        </a>
        
        <a 
          href="#areas" 
          @click.prevent="scrollTo('areas')"
          class="inline-flex items-center gap-2 px-8 py-3.5 border border-white/20 hover:border-white/50 bg-white/5 text-white/90 hover:text-white font-medium rounded-full backdrop-blur-sm transition-all duration-300"
        >
          <span>{{ store.texts.hero.ctaSub }}</span>
          <i class="fa-solid fa-chevron-down text-xs opacity-70"></i>
        </a>
      </div>

      <!-- Stat Badges Row -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 border-t border-white/10 pt-8 animate-fade-up-5">
        <template v-for="stat in store.heroStats" :key="stat.value">
          <div class="flex flex-col">
            <span class="font-display text-2xl md:text-3xl font-extrabold text-[#10B981] tracking-tight shadow-sm">{{ stat.value }}</span>
            <span class="text-[#6B8299] text-[11px] md:text-xs tracking-wider uppercase font-semibold mt-1.5 leading-snug">
              {{ store.lang === 'en' ? (stat.label_en || stat.label_pt) : stat.label_pt }}
            </span>
          </div>
        </template>
      </div>
    </div>

    <!-- Floating Scroll Anchor indicator -->
    <button 
      @click="scrollTo('news')"
      class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity z-20 cursor-pointer"
    >
      <div class="w-[1px] h-[36px] bg-gradient-to-b from-[#10B981] to-transparent"></div>
      <i class="fa-solid fa-chevron-down text-[#6B8299] text-[10px]"></i>
    </button>
  </section>
</template>

<script setup lang="ts">
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<style scoped>
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(28px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up-1 { animation: fadeUp 0.6s 0.05s ease both; }
.animate-fade-up-2 { animation: fadeUp 0.6s 0.15s ease both; }
.animate-fade-up-3 { animation: fadeUp 0.6s 0.25s ease both; }
.animate-fade-up-4 { animation: fadeUp 0.6s 0.35s ease both; }
.animate-fade-up-5 { animation: fadeUp 0.6s 0.45s ease both; }
</style>
