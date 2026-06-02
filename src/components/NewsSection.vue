<template>
  <section id="news" class="relative overflow-hidden py-16 md:py-24 transition-colors duration-300">
    <!-- Immersive Background Image -->
    <div 
      class="absolute inset-0 bg-cover bg-center z-0 transition-opacity duration-500"
      :class="store.darkMode ? 'opacity-35' : (customBg ? 'opacity-15' : 'opacity-0')"
      :style="{ backgroundImage: 'url(' + store.resolveAsset(customBg || '/assets/news_bg.jpg?v=2') + ')' }"
    ></div>

    <!-- Dual theme gradient overlay overlay -->
    <div 
      class="absolute inset-0 z-10 transition-colors duration-400"
      :class="store.darkMode 
        ? 'bg-gradient-to-br from-[#040A14]/95 via-[#0A182A]/92 to-[#040A14]/90' 
        : 'bg-gradient-to-br from-[#FAF9F6] via-[#F3EFE9] to-[#FAF9F6]'"
    ></div>

    <!-- Core Content Container -->
    <div class="relative z-20 max-w-[1440px] mx-auto px-4 md:px-10">
      <span class="text-xs font-bold tracking-widest uppercase text-[#10B981] block mb-2">{{ store.texts.news.title }}</span>
      <h2 
        class="font-display text-3xl font-extrabold tracking-tight mb-4"
        :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
      >
        {{ store.texts.news.title }}
      </h2>
      <div class="w-10 h-0.5 bg-[#10B981] rounded-full mb-10"></div>

      <div class="grid grid-cols-1 xl:grid-cols-3 gap-8 items-stretch">
        <!-- LEFT/CENTER CAROUSEL MODULE (spans 2 columns on desktop) -->
        <div class="xl:col-span-2 overflow-hidden relative">
          <!-- Tracks Wrapper -->
          <div class="relative overflow-hidden w-full">
            <div 
              class="flex gap-6 transition-transform duration-500 ease-out" 
              :style="{ transform: `translateX(calc(-${activeIndex} * (100% + 24px) / ${itemsPerPage}))` }"
            >
              <div 
                v-for="(card, idx) in allNewsCards" 
                :key="idx"
                class="shrink-0 transition-all duration-300 rounded-2xl border p-6 flex flex-col justify-between"
                :style="{ width: `calc(100% / ${itemsPerPage} - ${(24 * (itemsPerPage - 1)) / itemsPerPage}px)` }"
                :class="store.darkMode 
                  ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#10B981]/30' 
                  : 'bg-white border-neutral-200 shadow-sm hover:border-[#10B981]/30 hover:bg-[#FDFDFD] hover:shadow-md'"
              >
                <!-- News Meta Header -->
                <div>
                  <div class="flex items-center gap-2 text-xs font-semibold text-[#10B981] mb-3">
                    <i class="fa-regular fa-calendar-days"></i>
                    <span>{{ card.date }}</span>
                  </div>

                  <!-- Award Special Badge & Customizable badge container -->
                  <div class="flex flex-wrap gap-2 mb-4">
                    <div 
                      v-if="card.customBadgeText"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-extrabold uppercase tracking-wide"
                      :class="getBadgeStyles(card.customBadgeColor)"
                    >
                      <i class="fa-solid fa-tag"></i>
                      <span>{{ card.customBadgeText }}</span>
                    </div>

                    <div 
                      v-if="card.isAward"
                      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase"
                    >
                      <i class="fa-solid fa-award"></i>
                      <span>{{ store.lang === 'pt' ? 'Prêmio' : 'Award' }}</span>
                    </div>
                  </div>

                  <h3 
                    class="font-display font-bold text-lg md:text-xl leading-snug mb-4"
                    :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
                  >
                    {{ card.headline }}
                  </h3>

                  <!-- Content Block with Collapse Transition -->
                  <div 
                    class="overflow-hidden transition-all duration-300"
                    :style="{ maxHeight: card.expanded ? '450px' : '96px' }"
                  >
                    <!-- Unified Link Renderers with improved responsiveness -->
                    <div class="mb-2 flex flex-wrap gap-x-3 gap-y-1.5 text-xs font-semibold leading-relaxed">
                      <a 
                        v-if="card.linkUrl" 
                        :href="card.linkUrl" 
                        target="_blank" 
                        rel="noopener"
                        class="text-[#10B981] hover:text-[#059669] underline transition-colors inline-flex items-center gap-1"
                      >
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        <span>{{ card.linkText || (store.lang === 'pt' ? 'Adquirir / Acessar' : 'Purchase / Access') }}</span>
                      </a>
                      <a 
                        v-if="card.linkAltUrl" 
                        :href="card.linkAltUrl" 
                        target="_blank" 
                        rel="noopener"
                        class="text-[#10B981] hover:text-[#059669] underline transition-colors inline-flex items-center gap-1"
                      >
                        <i class="fa-solid fa-arrow-up-right-from-square text-[9px]"></i>
                        <span>{{ card.linkAltText || '(Amazon)' }}</span>
                      </a>
                    </div>

                    <p 
                      class="text-xs md:text-sm leading-relaxed"
                      :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
                    >
                      {{ card.body }}
                    </p>
                  </div>
                  <p 
                    v-if="card.body2 && card.expanded" 
                    class="text-xs md:text-sm leading-relaxed mt-3"
                    :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
                  >
                    {{ card.body2 }}
                  </p>

                  <!-- Custom Customizable Fields lists -->
                  <div v-if="card.customFields && card.customFields.length > 0" class="mt-4 pt-3 border-t border-dashed border-neutral-200/10 dark:border-white/5 space-y-1.5">
                    <div v-for="(field, fIdx) in card.customFields" :key="fIdx" class="flex justify-between items-center text-[11px] leading-relaxed">
                      <span class="text-neutral-400 font-bold uppercase tracking-wider text-[9px]">
                        {{ store.lang === 'pt' ? field.label.pt : field.label.en }}:
                      </span>
                      <span class="font-semibold text-right" :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-slate-800'">
                        {{ store.lang === 'pt' ? field.value.pt : field.value.en }}
                      </span>
                    </div>
                  </div>

                  <!-- Collapse Toggle Button Option -->
                  <button 
                    @click="toggleExpand(card.id)"
                    class="inline-flex items-center gap-1 mt-4 text-xs font-bold text-[#10B981] hover:text-[#059669] hover:gap-1.5 transition-all text-left bg-transparent border-none cursor-pointer"
                  >
                    <span>{{ card.expanded 
                      ? (store.lang === 'pt' ? 'Ler menos' : 'Read less') 
                      : (store.lang === 'pt' ? 'Ler mais' : 'Read more') }}</span>
                    <i class="fa-solid fa-chevron-down transition-transform duration-300" :class="{ 'rotate-180': card.expanded }"></i>
                  </button>
                </div>

                <!-- Footer Acquisition Buttons for Book -->
                <div v-if="card.isFeaturedBook" class="mt-6 pt-4 border-t border-neutral-200/10 self-start">
                  <a 
                    href="https://esgetal.com.br" 
                    target="_blank" 
                    rel="noopener"
                    class="block opacity-90 hover:opacity-100 hover:scale-[1.02] transition-all"
                  >
                    <img 
                      :src="store.resolveAsset('/assets/book_cover.png?v=2')" 
                      alt="Adquirir Obra" 
                      class="h-[38px] w-auto object-contain rounded-md shadow-sm"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Carousel Dots Navigation / Actions -->
          <div class="flex items-center gap-4 mt-6">
            <button 
              @click="prevSlide" 
              :disabled="activeIndex === 0"
              class="w-9 h-9 rounded-full flex items-center justify-center border border-neutral-200/10 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:border-[#10B981] hover:text-[#10B981] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
              aria-label="Previous"
            >
              <i class="fa-solid fa-chevron-left text-xs"></i>
            </button>

            <!-- Slide Dots Mapping -->
            <div class="flex gap-1.5 items-center">
              <button 
                v-for="i in totalDots" 
                :key="i"
                @click="goToSlide(i - 1)"
                class="h-1.5 rounded-full transition-all duration-300 border-none cursor-pointer"
                :class="activeIndex === (i - 1) ? 'w-[22px] bg-[#10B981]' : 'w-1.5 bg-neutral-200 dark:bg-white/20'"
                :aria-label="`Go to slide ${i}`"
              ></button>
            </div>

            <button 
              @click="nextSlide" 
              :disabled="activeIndex >= maxIndex"
              class="w-9 h-9 rounded-full flex items-center justify-center border border-neutral-200/10 dark:border-white/10 bg-white dark:bg-white/5 text-neutral-400 dark:text-neutral-500 hover:border-[#10B981] hover:text-[#10B981] disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-colors"
              aria-label="Next"
            >
              <i class="fa-solid fa-chevron-right text-xs"></i>
            </button>
          </div>
        </div>

        <!-- RIGHT STANDALONE NEWSLETTER CARD -->
        <div 
          class="relative overflow-hidden border rounded-3xl p-6 md:p-8 flex flex-col justify-between"
          :class="store.darkMode 
            ? 'bg-gradient-to-br from-[#071A2E]/95 to-[#051220]/90 border-[#10B981]/20' 
            : 'bg-gradient-to-br from-white to-[#F2F8F4] border-neutral-200/80 shadow-md'"
        >
          <!-- Decal back-bubbles -->
          <div class="absolute -top-20 -right-20 w-48 h-48 rounded-full border border-[#10B981]/10 pointer-events-none z-0"></div>
          <div class="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#10B981]/5 pointer-events-none z-0"></div>

          <div class="relative z-10 w-full">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-[10px] font-extrabold uppercase mb-4">
              <i class="fa-solid fa-envelope"></i>
              <span>{{ store.texts.news.nl.title }}</span>
            </div>
            
            <h3 
              class="font-display text-xl font-bold mb-2 leading-snug"
              :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
            >
              {{ store.texts.news.nl.title }}
            </h3>
            <div class="w-8 h-[2px] bg-[#10B981] rounded-full mb-4"></div>
            
            <p 
              class="text-xs md:text-sm leading-relaxed mb-6"
              :class="store.darkMode ? 'text-slate-200' : 'text-slate-700'"
            >
              {{ store.texts.news.nl.subtitle }}
            </p>

            <transition name="slide-fade" mode="out-in">
              <!-- Subscribe Form -->
              <div v-if="!newsletterSent && !isUnsubscribeMode" class="space-y-3.5">
                <div class="relative">
                  <i class="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-neutral-400 pointer-events-none"></i>
                  <input 
                    type="text" 
                    v-model="newsletterName"
                    :placeholder="store.texts.news.nl.namePh" 
                    autocomplete="name"
                    class="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-[#10B981] dark:focus:border-[#10B981] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 transition-colors"
                  />
                </div>

                <div class="relative">
                  <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-neutral-400 pointer-events-none"></i>
                  <input 
                    type="email" 
                    v-model="newsletterEmail"
                    :placeholder="store.texts.news.nl.emailPh" 
                    autocomplete="email"
                    @keydown.enter="submitNewsletter"
                    class="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-[#10B981] dark:focus:border-[#10B981] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 transition-colors"
                  />
                </div>

                <button 
                  @click="submitNewsletter"
                  :disabled="loading"
                  class="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl py-3 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <i v-if="loading" class="fa-solid fa-spinner animate-spin"></i>
                  <i v-else class="fa-solid fa-paper-plane"></i>
                  <span>{{ loading ? 'Processando...' : store.texts.news.nl.btn }}</span>
                </button>

                <div class="flex justify-between items-center text-[10px] text-neutral-400 dark:text-[#6B8299] pt-1">
                  <span>{{ store.texts.news.nl.disclaimer }}</span>
                  <button @click="toggleMode" class="text-[#10B981] hover:underline font-bold cursor-pointer">
                    {{ store.lang === 'pt' ? 'Cancelar inscrição' : 'Unsubscribe' }}
                  </button>
                </div>
              </div>

              <!-- Unsubscribe Form -->
              <div v-else-if="!newsletterSent && isUnsubscribeMode" class="space-y-4">
                <p 
                  class="text-xs leading-relaxed"
                  :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'"
                >
                  {{ store.lang === 'pt' ? 'Para cancelar sua inscrição, digite seu e-mail e confirme abaixo:' : 'To cancel your subscription, enter your email below:' }}
                </p>

                <div class="relative">
                  <i class="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 dark:text-neutral-400 pointer-events-none"></i>
                  <input 
                    type="email" 
                    v-model="newsletterEmail"
                    :placeholder="store.texts.news.nl.emailPh" 
                    autocomplete="email"
                    @keydown.enter="submitUnsubscribe"
                    class="w-full bg-neutral-50 dark:bg-white/5 border border-neutral-300 dark:border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-semibold outline-none focus:border-[#10B981] dark:focus:border-[#10B981] text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-white/40 transition-colors"
                  />
                </div>

                <button 
                  @click="submitUnsubscribe"
                  :disabled="loading"
                  class="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  <i v-if="loading" class="fa-solid fa-spinner animate-spin"></i>
                  <i v-else class="fa-solid fa-ban"></i>
                  <span>{{ loading ? 'Processando...' : (store.lang === 'pt' ? 'Confirmar Cancelamento' : 'Confirm Unsubscribe') }}</span>
                </button>

                <div class="text-center pt-1">
                  <button @click="toggleMode" class="text-neutral-400 dark:text-slate-300 hover:underline text-[10px] font-bold cursor-pointer">
                    <i class="fa-solid fa-arrow-left mr-1"></i>
                    {{ store.lang === 'pt' ? 'Voltar para Inscrição' : 'Back to subscription' }}
                  </button>
                </div>
              </div>

              <!-- Success Card -->
              <div v-else class="text-center py-6">
                <i class="fa-solid fa-circle-check text-4xl text-[#10B981] inline-block mb-3"></i>
                <h4 
                  class="font-display font-semibold text-lg mb-2"
                  :class="store.darkMode ? 'text-white' : 'text-[#0D1B2E]'"
                >
                  {{ unsubscribeDone 
                    ? (store.lang === 'pt' ? 'Inscrição Cancelada' : 'Unsubscribed')
                    : store.texts.news.nl.ok }}
                </h4>
                <p class="text-xs text-neutral-400 dark:text-[#9BB4CC] leading-relaxed">
                  {{ unsubscribeDone
                    ? (store.lang === 'pt' ? 'Removemos seu e-mail de nossas listas. Você não receberá mais nossos boletins informativos.' : 'We have removed your email from our lists. You will no longer receive our bulletins.')
                    : (store.lang === 'pt' ? 'Obrigado por nos apoiar em nossa jornada!' : 'Thank you for supporting our sustainability mission!') }}
                </p>
                <div class="mt-4 pt-2">
                  <button @click="resetForm" class="text-[10px] uppercase font-black text-[#10B981] hover:underline cursor-pointer">
                    {{ store.lang === 'pt' ? 'Voltar ao Formulário' : 'Come back' }}
                  </button>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();
const route = useRoute();

const navItem = computed(() => (store.navbarItems || []).find(i => i.target === 'news'));
const customBg = computed(() => navItem.value?.bgImageUrl || null);

const newsletterName = ref('');
const newsletterEmail = ref('');
const newsletterSent = ref(false);

const isUnsubscribeMode = ref(false);
const unsubscribeDone = ref(false);
const loading = ref(false);

const activeIndex = ref(0);
const windowWidth = ref(window.innerWidth);

// Items to render per slide depending on viewport size
const itemsPerPage = computed(() => {
  if (windowWidth.value > 1024) return 2;
  return 1;
});

// Reactively track expanded nodes
const expandedNodes = reactive<Record<string, boolean>>({});

// Assemble fully functional list of News items (PT and EN mapped dynamically)
const allNewsCards = computed(() => {
  const isEn = store.lang === 'en';
  return store.sortedNews
    .filter(node => node.visible !== false)
    .map(node => ({
      id: node.id,
      date: isEn ? (node.date?.en || node.date?.pt) : node.date?.pt,
      headline: isEn ? (node.headline?.en || node.headline?.pt) : node.headline?.pt,
      body: isEn ? (node.body?.en || node.body?.pt) : node.body?.pt,
      body2: node.body2 ? (isEn ? (node.body2?.en || node.body2?.pt) : node.body2?.pt) : '',
      linkUrl: node.linkUrl,
      linkText: node.linkText ? (isEn ? (node.linkText?.en || node.linkText?.pt) : node.linkText?.pt) : '',
      linkAltUrl: node.linkAltUrl,
      linkAltText: node.linkAltText ? (isEn ? (node.linkAltText?.en || node.linkAltText?.pt) : node.linkAltText?.pt) : '',
      isAward: node.isAward || false,
      isFeaturedBook: node.isFeaturedBook || false,
      expanded: expandedNodes[node.id] || false,
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
  return list[color?.toLowerCase()] || 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500';
};

const toggleExpand = (id: string) => {
  expandedNodes[id] = !expandedNodes[id];
};

// Slider calculations
const maxIndex = computed(() => {
  return Math.max(0, allNewsCards.value.length - itemsPerPage.value);
});

const totalDots = computed(() => {
  return Math.max(1, allNewsCards.value.length - itemsPerPage.value + 1);
});

const prevSlide = () => {
  if (activeIndex.value > 0) activeIndex.value--;
};

const nextSlide = () => {
  if (activeIndex.value < maxIndex.value) {
    activeIndex.value++;
  } else {
    activeIndex.value = 0; // wrap-around
  }
};

const goToSlide = (idx: number) => {
  activeIndex.value = Math.max(0, Math.min(maxIndex.value, idx));
};

const toggleMode = () => {
  isUnsubscribeMode.value = !isUnsubscribeMode.value;
  unsubscribeDone.value = false;
};

const resetForm = () => {
  newsletterName.value = '';
  newsletterEmail.value = '';
  newsletterSent.value = false;
  isUnsubscribeMode.value = false;
  unsubscribeDone.value = false;
};

const submitNewsletter = async () => {
  if (newsletterEmail.value.trim().length === 0) {
    store.addToast(store.lang === 'pt' ? "Por favor, preencha o seu e-mail." : "Please fill in your email.", "err");
    return;
  }
  loading.value = true;
  try {
    await store.subscribeToNewsletter(newsletterName.value, newsletterEmail.value);
    newsletterSent.value = true;
    unsubscribeDone.value = false;
  } catch (error) {
    // Handled by store
  } finally {
    loading.value = false;
  }
};

const submitUnsubscribe = async () => {
  if (newsletterEmail.value.trim().length === 0) {
    store.addToast(store.lang === 'pt' ? "Por favor, preencha o seu e-mail." : "Please fill in your email.", "err");
    return;
  }
  loading.value = true;
  try {
    await store.unsubscribeFromNewsletter(newsletterEmail.value);
    newsletterSent.value = true;
    unsubscribeDone.value = true;
  } catch (error) {
    // Handled by store
  } finally {
    loading.value = false;
  }
};

const updateWidth = () => {
  windowWidth.value = window.innerWidth;
};

// Reset index boundary on resize to prevent empty spots
watch(itemsPerPage, () => {
  activeIndex.value = Math.min(activeIndex.value, maxIndex.value);
});

onMounted(() => {
  window.addEventListener('resize', updateWidth);

  // Look for unsubscribe parameter in URL
  if (route && route.query && route.query.unsubscribe) {
    const emailParam = String(route.query.unsubscribe);
    if (emailParam) {
      newsletterEmail.value = emailParam;
      isUnsubscribeMode.value = true;
      store.addToast(store.lang === 'pt' 
        ? "Preparamos o formulário para cancelamento da inscrição." 
        : "Prepared unsubscribe form for you.", "info");
      
      // Auto-scroll to news section so they see it instantly
      setTimeout(() => {
        const el = document.getElementById('news');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', updateWidth);
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(8px);
  opacity: 0;
}
</style>
