<template>
  <div class="relative min-h-screen">
    <!-- Sticky Navigation Header -->
    <Navbar />

    <!-- Main Dynamic Section Sections Layout -->
    <main>
      <template v-for="section in activeSections" :key="section.id">
        <!-- Hero Introductory Banner -->
        <template v-if="section.target === 'home'">
          <Hero />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- News collapsible slider & Newsletter subscribe -->
        <template v-else-if="section.target === 'news'">
          <NewsSection />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- Corporate purpose quote panels -->
        <template v-else-if="section.target === 'about'">
          <AboutSection />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- Areas of Expertise mapping cards grid -->
        <template v-else-if="section.target === 'areas'">
          <AreasSection />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- Portrait mini-A4 research papers slider -->
        <template v-else-if="section.target === 'research'">
          <ResearchSection />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- Support messaging actions & Social contacts row -->
        <template v-else-if="section.target === 'contact'">
          <ContactSection />
          <CustomSection v-if="section.blocks && section.blocks.length > 0" :section="section" :only-blocks="true" />
        </template>

        <!-- Fully customizable dynamic custom sections -->
        <CustomSection v-else :section="section" />
      </template>
    </main>

    <!-- Footer Coordinate mappings -->
    <footer 
      class="border-t py-10 md:py-16 text-center transition-all duration-400"
      :class="store.darkMode 
        ? 'bg-[#070F1A] border-white/5 text-white/40' 
        : 'bg-[#EFEAE4] border-[#0D1B2E]/10 text-[#3D5470]/70'"
    >
      <div class="max-w-[1440px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="flex items-center gap-3">
          <img 
            :src="store.darkMode ? store.resolveAsset('/assets/logo_white.png?v=2') : store.resolveAsset('/assets/logo_dark.png?v=2')" 
            alt="ESG e Tal Footer Logo" 
            class="h-6 w-auto object-contain transition-all duration-400"
            :class="store.darkMode ? 'opacity-70' : 'opacity-90'"
          />
          <span 
            class="text-xs md:text-sm tracking-wide font-semibold uppercase transition-colors duration-400"
            :class="store.darkMode ? 'text-neutral-400' : 'text-[#0D1B2E]/80'"
          >
            {{ store.texts.footer.tagline }}
          </span>
        </div>
        
        <p class="text-[11px] md:text-xs transition-colors duration-400">
          {{ store.texts.footer.rights }}
        </p>
      </div>
    </footer>

    <!-- Teleported Areas Detail dialog window -->
    <Modal />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Navbar from '../components/Navbar.vue';
import Hero from '../components/Hero.vue';
import NewsSection from '../components/NewsSection.vue';
import AboutSection from '../components/AboutSection.vue';
import AreasSection from '../components/AreasSection.vue';
import ResearchSection from '../components/ResearchSection.vue';
import ContactSection from '../components/ContactSection.vue';
import CustomSection from '../components/CustomSection.vue';
import Modal from '../components/Modal.vue';
import { useEsgStore } from '../stores/esgStore';

const store = useEsgStore();

// Dynamic computation of ordered active sections on home page
const activeSections = computed(() => {
  return (store.navbarItems || []).filter(item => item.visible !== false && item.isExternal !== true);
});
</script>
