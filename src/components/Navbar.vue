<template>
  <nav 
    class="navbar fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-350 border-b border-transparent"
    :class="scrollY > 60 ? 'bg-[#FAFAF8]/90 dark:bg-[#0B1623]/90 backdrop-blur-md shadow-md border-neutral-200/10' : 'bg-transparent'"
  >
    <div class="max-w-[1440px] h-full mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
      <!-- Brand Logo -->
      <a href="#" @click.prevent="scrollTo('home')" class="h-10 flex items-center shrink-0">
        <img 
          :src="logoSrc" 
          alt="ESG e Tal" 
          class="h-full w-auto max-w-[180px] object-contain block"
        />
      </a>

      <!-- Desktop Nav Links -->
      <nav class="hidden lg:flex items-center gap-6 justify-center flex-1">
        <template v-for="item in navItems" :key="item.id">
          <!-- External Links -->
          <a
            v-if="item.isExternal"
            :href="item.target"
            target="_blank"
            rel="noopener"
            class="text-xs font-semibold uppercase tracking-wider cursor-pointer relative py-1 transition-colors duration-250 hover:text-[#10B981]"
            :class="scrollY > 60 
              ? 'text-[#3D5470] dark:text-[#9BB4CC]' 
              : 'text-white/80 hover:text-white'"
          >
            {{ typeof item.label === 'string' ? item.label : (store.lang === 'pt' ? item.label.pt : (item.label.en || item.label.pt)) }}
            <i class="fa-solid fa-arrow-up-right-from-square text-[8px] ml-1 opacity-50"></i>
          </a>
          <!-- Anchor Links -->
          <a 
            v-else
            :href="item.target.startsWith('http') || item.target.startsWith('/') ? item.target : `#${item.target}`" 
            @click.prevent="item.target.startsWith('http') || item.target.startsWith('/') ? null : scrollTo(item.target)"
            class="text-xs font-semibold uppercase tracking-wider cursor-pointer relative py-1 transition-colors duration-250 hover:text-[#10B981]"
            :class="activeSection === item.target 
              ? 'text-[#10B981]' 
              : scrollY > 60 
                ? 'text-[#3D5470] dark:text-[#9BB4CC]' 
                : 'text-white/80 hover:text-white'"
          >
            {{ typeof item.label === 'string' ? item.label : (store.lang === 'pt' ? item.label.pt : (item.label.en || item.label.pt)) }}
            <span 
              class="absolute bottom-0 left-0 h-0.5 bg-[#10B981] rounded-full transition-all duration-300"
              :class="activeSection === item.target ? 'w-full' : 'w-0'"
            ></span>
          </a>
        </template>
      </nav>

      <!-- Toolbar Controllers -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- Lang Switch -->
        <button 
          @click="store.toggleLang()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200/15 dark:border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-[#10B981] hover:text-[#10B981] text-xs font-semibold"
          :class="scrollY > 60 ? 'text-[#3D5470] dark:text-[#9BB4CC]' : 'text-white/90'"
        >
          <span>{{ store.lang === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN' }}</span>
        </button>

        <!-- Dark/Light Theme Switch -->
        <button 
          @click="store.toggleDark()"
          class="p-2 rounded-full border border-neutral-200/15 dark:border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-[#10B981] hover:text-[#10B981]"
          :class="scrollY > 60 ? 'text-[#3D5470] dark:text-[#9BB4CC]' : 'text-white/90'"
          aria-label="Toggle Theme"
        >
          <i class="fa-solid" :class="store.darkMode ? 'fa-sun' : 'fa-moon'" style="font-size: 0.85rem"></i>
        </button>

        <!-- Mobile Burger Menu Trigger -->
        <button 
          @click="store.mobileMenuOpen = true"
          class="lg:hidden p-2 rounded-full border border-neutral-200/15 dark:border-white/10 bg-white/5 backdrop-blur-sm cursor-pointer transition-all duration-200 hover:border-[#10B981] hover:text-[#10B981]"
          :class="scrollY > 60 ? 'text-[#3D5470] dark:text-[#9BB4CC]' : 'text-white/90'"
          aria-label="Open mobile navigation"
        >
          <i class="fa-solid fa-bars" style="font-size: 0.85rem"></i>
        </button>
      </div>
    </div>
  </nav>

  <!-- Mobile Off-Canvas Menu -->
  <div v-if="store.mobileMenuOpen" class="fixed inset-0 z-[140] transition-opacity duration-300">
    <!-- Backdrop Overlay -->
    <div 
      @click="store.mobileMenuOpen = false" 
      class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-all"
    ></div>

    <!-- Panel Drawer -->
    <div class="absolute top-0 right-0 bottom-0 w-[280px] max-w-[85vw] bg-white dark:bg-[#0F1E30] p-6 shadow-2xl flex flex-col gap-4 overflow-y-auto animate-slide-left z-50">
      <div class="flex items-center justify-between pb-4 border-b border-neutral-200/10 mb-2">
        <img 
          :src="mobileLogoSrc" 
          alt="ESG e Tal" 
          class="h-8 w-auto object-contain"
        />
        <button 
          @click="store.mobileMenuOpen = false"
          class="w-8 h-8 rounded-full border border-neutral-200/10 dark:border-white/10 flex items-center justify-center text-neutral-400 hover:text-[#10B981]"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Links -->
      <nav class="flex flex-col gap-1">
        <template v-for="item in navItems" :key="item.id">
          <!-- External -->
          <a 
            v-if="item.isExternal"
            :href="item.target"
            target="_blank"
            rel="noopener"
            @click="store.mobileMenuOpen = false"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-[#3D5470] dark:text-[#9BB4CC] hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-[#10B981] flex items-center justify-between"
          >
            <span>{{ typeof item.label === 'string' ? item.label : (store.lang === 'pt' ? item.label.pt : (item.label.en || item.label.pt)) }}</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[9px] opacity-60"></i>
          </a>
          <!-- Anchor / Internal -->
          <a 
            v-else
            :href="item.target.startsWith('http') || item.target.startsWith('/') ? item.target : `#${item.target}`" 
            @click.prevent="item.target.startsWith('http') || item.target.startsWith('/') ? (store.mobileMenuOpen = false) : scrollTo(item.target)"
            class="block px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 text-left"
            :class="activeSection === item.target 
              ? 'bg-[#10B981]/10 text-[#10B981] border-l-4 border-[#10B981] pl-6' 
              : 'text-[#3D5470] dark:text-[#9BB4CC] hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-[#10B981]'"
          >
            {{ typeof item.label === 'string' ? item.label : (store.lang === 'pt' ? item.label.pt : (item.label.en || item.label.pt)) }}
          </a>
        </template>
      </nav>

      <!-- Bottom controls -->
      <div class="mt-auto pt-6 border-t border-neutral-200/10 flex flex-col gap-2">
        <button 
          @click="store.toggleLang()"
          class="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-neutral-200/10 dark:border-white/10 text-xs font-semibold text-[#3D5470] dark:text-[#9BB4CC] bg-neutral-50 dark:bg-white/5 hover:text-[#10B981]"
        >
          <span>{{ store.lang === 'pt' ? '🇧🇷 Português (PT-BR)' : '🇺🇸 English (EN)' }}</span>
        </button>

        <button 
          @click="store.toggleDark()"
          class="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-neutral-200/10 dark:border-white/10 text-xs font-semibold text-[#3D5470] dark:text-[#9BB4CC] bg-neutral-50 dark:bg-white/5 hover:text-[#10B981]"
        >
          <i class="fa-solid" :class="store.darkMode ? 'fa-sun' : 'fa-moon'"></i>
          <span>{{ store.darkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

const scrollY = ref(0);
const activeSection = ref('home');

const navItems = computed(() => {
  return store.navbarItems.filter(item => item.visible !== false).sort((a, b) => (a.order || 0) - (b.order || 0));
});

const logoSrc = computed(() => {
  if (store.darkMode) {
    return '/assets/logo_white.png?v=2';
  }
  return scrollY.value > 60 ? '/assets/logo_dark.png?v=2' : '/assets/logo_white.png?v=2';
});

const mobileLogoSrc = computed(() => {
  return store.darkMode ? '/assets/logo_white.png?v=2' : '/assets/logo_dark.png?v=2';
});

const handleScroll = () => {
  scrollY.value = window.scrollY;
  
  // Find current active section from anchor terms
  const targets = navItems.value
    .map(item => item.target)
    .filter(t => t && !t.startsWith('http') && !t.startsWith('/'));
    
  for (const id of [...targets].reverse()) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) {
      activeSection.value = id;
      break;
    }
  }
};

const scrollTo = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  store.mobileMenuOpen = false;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
@keyframes slideLeft {
  from {
    opacity: 0;
    transform: translateX(18px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
.animate-slide-left {
  animation: slideLeft 0.28s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}
</style>
