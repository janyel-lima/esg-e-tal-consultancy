<template>
  <teleport to="body">
    <!-- Overlay Transition Container -->
    <transition name="modal">
      <div 
        v-if="store.activeModal && store.activeArea"
        class="fixed inset-0 min-h-screen bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4 overflow-y-auto"
        @click.self="store.closeAreaModal()"
      >
        <!-- Modal core wrap box -->
        <div 
          class="rounded-3xl max-w-[960px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-neutral-200/10"
          :class="store.darkMode ? 'bg-[#0B1623]' : 'bg-[#FAFAF8]'"
          @click.stop
        >
          <!-- Sticky Header band -->
          <div 
            class="sticky top-0 backdrop-blur-md px-6 py-5 md:px-10 border-b border-neutral-200/10 dark:border-white/5 flex items-start justify-between gap-4 z-50 transition-colors"
            :class="store.darkMode ? 'bg-[#0B1623]/95' : 'bg-[#FAFAF8]/95'"
            :style="`border-left: 4px solid ${store.activeArea.color}`"
          >
            <div>
              <div 
                class="text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 mb-1"
                :style="`color: ${store.activeArea.color}`"
              >
                <i :class="`fa-solid ${store.activeArea.icon}`"></i>
                <span>ESG e Tal Consultancy</span>
              </div>
              <h2 
                class="font-display font-bold text-xl md:text-2xl"
                :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
              >
                {{ store.activeArea.name }}
              </h2>
            </div>

            <!-- Close Circle button -->
            <button 
              @click="store.closeAreaModal()"
              class="w-10 h-10 rounded-full border border-neutral-200 dark:border-white/10 flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-[#10B981] dark:hover:text-[#10B981] hover:bg-neutral-100 dark:hover:bg-white/5 transition-all cursor-pointer grow-0 shrink-0"
              aria-label="Close modal"
            >
              <i class="fa-solid fa-xmark text-sm"></i>
            </button>
          </div>

          <!-- Modal Body Segment (Scrollable area) -->
          <div class="p-6 md:p-10 space-y-8">
            
            <!-- Description paragraph -->
            <p 
              class="text-xs sm:text-sm md:text-base leading-relaxed"
              :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
            >
              {{ store.activeArea.desc }}
            </p>

            <!-- Subtopics / Services Portfolio -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              <div 
                v-for="(st, idx) in store.activeArea.subtopics" 
                :key="idx"
                class="rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between h-full hover:shadow-md transition-all duration-300"
                :class="store.darkMode ? 'bg-[#132030] border border-white/5' : 'bg-white border border-neutral-100'"
              >
                <!-- Image or Backing Placeholder frame -->
                <div class="relative h-[120px] md:h-[135px] overflow-hidden shrink-0 bg-neutral-200 dark:bg-white/5">
                  <img 
                    v-if="st.img"
                    :src="st.img" 
                    :alt="st.title" 
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform"
                  />
                  <div 
                    v-else 
                    class="w-full h-full flex flex-col items-center justify-center gap-1.5 p-3"
                    :style="`background-color: ${store.activeArea.color}10;`"
                  >
                    <i 
                      :class="`fa-solid ${store.activeArea.icon}`" 
                      :style="`color: ${store.activeArea.color}`"
                      class="text-xl"
                    ></i>
                    <span class="text-[9px] font-bold uppercase tracking-widest text-[#6B8299]">
                      {{ store.lang === 'pt' ? 'Serviço Ativo' : 'Active Service' }}
                    </span>
                  </div>
                </div>

                <!-- Card details -->
                <div class="p-4 flex-1 flex flex-col justify-between">
                  <h4 
                    class="font-display text-xs md:text-sm font-bold mb-3 leading-snug line-clamp-3"
                    :class="store.darkMode ? 'text-[#E8EFF6]' : 'text-[#0D1B2E]'"
                  >
                    {{ st.title }}
                  </h4>

                  <!-- Subtopics bullet list -->
                  <div class="space-y-2">
                    <div 
                      v-for="(bullet, bidx) in st.items" 
                      :key="bidx"
                      class="flex gap-2 items-start text-[11px] leading-relaxed"
                      :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
                    >
                      <span class="text-[#6B8299] shrink-0 mt-0.5">—</span>
                      <span>{{ bullet }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Testimonial Client segment -->
            <div 
              v-if="store.activeArea.testimonial"
              class="border-l-4 rounded-xl p-5 md:p-6 bg-neutral-100/50 dark:bg-white/5 border-neutral-300"
              :style="`border-left-color: ${store.activeArea.color}`"
            >
              <div 
                class="text-[9px] font-black uppercase tracking-widest mb-3"
                :style="`color: ${store.activeArea.color}`"
              >
                <i class="fa-solid fa-quote-left mr-1"></i>
                <span>{{ store.texts.modal.testimonialLabel }}</span>
              </div>
              <p 
                class="font-display font-medium italic text-xs md:text-sm leading-relaxed mb-3"
                :class="store.darkMode ? 'text-[#9BB4CC]' : 'text-[#3D5470]'"
              >
                {{ store.activeArea.testimonial }}
              </p>
              <span class="text-[10px] md:text-xs font-bold text-[#6B8299] block mt-1 leading-snug">
                — {{ store.activeArea.testimonialAuthor }}
              </span>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();
</script>

<style scoped>
/* Modal animation transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .mbox,
.modal-leave-active .mbox {
  transition: transform 0.3 cubic-bezier(1, 0.5, 0.8, 1);
}

.modal-enter-from .mbox,
.modal-leave-to .mbox {
  transform: scale(0.95) translateY(12px);
}
</style>
