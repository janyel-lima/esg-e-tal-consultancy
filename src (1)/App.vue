<template>
  <div class="min-h-screen bg-[#FAFAF8] dark:bg-[#0B1623] text-[#0D1B2E] dark:text-[#E8EFF6] transition-colors duration-300 font-sans">
    <!-- Router View for Page Injection -->
    <router-view v-slot="{ Component }">
      <transition 
        name="fade" 
        mode="out-in"
      >
        <component :is="Component" />
      </transition>
    </router-view>

    <!-- Global Floating Toasts Container -->
    <div class="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2 pointer-events-none items-end">
      <transition-group name="toast">
        <div 
          v-for="toast in store.toasts" 
          :key="toast.id"
          class="flex items-center gap-3 px-5 py-3.5 rounded-xl font-medium text-sm shadow-xl pointer-events-auto border transition-all duration-300 animate-slide-in"
          :class="{
            'bg-[#064E3B] border-[#10B981]/30 text-[#6EE7B7]': toast.type === 'ok',
            'bg-[#450A0A] border-[#F87171]/30 text-[#FCA5A5]': toast.type === 'err',
            'bg-[#1E3A5F] border-[#60A5FA]/30 text-[#93C5FD]': toast.type === 'info'
          }"
        >
          <i class="fa-solid" :class="{
            'fa-circle-check': toast.type === 'ok',
            'fa-circle-xmark': toast.type === 'err',
            'fa-circle-info': toast.type === 'info'
          }"></i>
          <span>{{ toast.text }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useEsgStore } from './stores/esgStore';

const store = useEsgStore();
const router = useRouter();
const route = useRoute();

const handleEasterEgg = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.altKey && (e.key === 'e' || e.key === 'E')) {
    e.preventDefault();
    if (route.path === '/admin') {
      router.push('/');
      store.addToast("Retornando ao portal principal", "info");
    } else {
      router.push('/admin');
      store.addToast("Redirecionando ao painel admin (CMS)", "ok");
    }
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleEasterEgg);
  if (store.darkMode) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleEasterEgg);
});
</script>

<style>
/* CSS Page routes transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Toast slides transition list */
.toast-enter-active {
  animation: toast-in 0.28s cubic-bezier(0.34, 1.25, 0.64, 1) both;
}
.toast-leave-active {
  animation: toast-out 0.22s ease both;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: translateY(6px) scale(0.95);
  }
}
</style>
