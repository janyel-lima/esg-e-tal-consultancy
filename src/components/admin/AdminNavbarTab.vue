<template>
  <div class="space-y-6">
    <!-- Polished Help Callout Box -->
    <div class="bg-indigo-500/10 border border-indigo-500/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
      <i class="fa-solid fa-circle-info text-indigo-400 mt-0.5 text-sm shrink-0"></i>
      <div>
        <strong class="text-indigo-400 font-bold block mb-1">Central de Controle do Menu Superior (Navbar)</strong>
        <p class="leading-relaxed text-slate-300">
          Adicione, remova, edite links e configure a visibilidade de elementos da barra de navegação principal. Você pode criar links internos que rolam a página até a seção desejada (ex: <strong class="text-white">#news</strong>) ou links para sites externos informando a URL inteira (ex: <strong class="text-white">https://esgetal.com.br</strong>).
        </p>
      </div>
    </div>

    <!-- Navbar Elements List / Editor Bento Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left Column: Navbar item selectors -->
      <div 
        class="lg:col-span-5 border rounded-2xl p-4 space-y-3 transition-colors"
        :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
      >
        <div class="flex items-center justify-between border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <span class="text-[11px] font-black uppercase tracking-wider font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Elementos ({{ filteredNavbarItems.length }})</span>
          <button 
            @click="initNewNavbarItem" 
            class="px-2.5 py-1 text-[10px] font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-[#a78bfa] rounded-md transition-all cursor-pointer border-none"
          >
            <i class="fa-solid fa-plus mr-1"></i> Criar Novo
          </button>
        </div>

        <!-- Live Search input -->
        <div class="relative">
          <input 
            type="text" 
            v-model="navbarSearchQuery" 
            placeholder="Pesquisar links do menu..." 
            class="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none focus:border-indigo-500 transition-colors"
            :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-500' : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'"></i>
        </div>

        <!-- Live Items Loop -->
        <div class="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin pr-1">
          <div 
            v-for="navItem in paginatedNavbarItems" 
            :key="navItem.id"
            @click="selectNavbarItem(navItem)"
            class="p-3 rounded-xl border transition-all cursor-pointer text-left focus:outline-none flex items-center justify-between"
            :class="selectedNavId === navItem.id 
              ? 'bg-indigo-500/10 border-indigo-500/30 font-semibold' 
              : (store.darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-200' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800')"
          >
            <div class="flex items-center gap-3">
              <div class="w-6 h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold" :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-slate-400' : 'bg-slate-200 border border-slate-300 text-slate-600'">
                {{ navItem.order }}
              </div>
              <div>
                <h5 class="font-bold text-xs leading-none mb-1">{{ navItem.label?.pt || navItem.id }} <span :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'" class="font-normal text-[10px]">| {{ navItem.label?.en || navItem.id }}</span></h5>
                <p class="text-[9px] font-mono truncate max-w-[140px]" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Alvo: {{ navItem.target }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2 select-none">
              <span v-if="navItem.isExternal" class="text-[8px] bg-sky-500/15 border border-sky-400/20 text-sky-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Ext</span>
              <span v-if="navItem.visible === false" class="text-[8px] bg-red-500/15 border border-red-400/20 text-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Oculto</span>
              <span v-else class="text-[8px] bg-emerald-500/15 border border-emerald-400/20 text-emerald-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Ativo</span>
            </div>
          </div>

          <div v-if="filteredNavbarItems.length === 0" class="text-center py-8 text-xs font-medium" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
            <i class="fa-regular fa-folder-open block text-base mb-2"></i>
            Nenhum item de menu encontrado
          </div>
        </div>

        <!-- Custom Pager -->
        <div v-if="totalNavbarPages > 1" class="flex items-center justify-between border-t pt-3 text-[10px] font-semibold select-none" :class="store.darkMode ? 'border-white/5 text-slate-400' : 'border-slate-150 text-slate-500'">
          <button 
            :disabled="currentNavbarPage === 1" 
            @click="currentNavbarPage--" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-indigo-500/15 hover:text-white hover:border-indigo-500/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-indigo-500/10 hover:text-indigo-500'"
          >
            Anterior
          </button>
          <span>Página {{ currentNavbarPage }} / {{ totalNavbarPages }}</span>
          <button 
            :disabled="currentNavbarPage === totalNavbarPages" 
            @click="currentNavbarPage++" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-indigo-500/15 hover:text-white hover:border-indigo-500/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-indigo-500/10 hover:text-indigo-500'"
          >
            Próxima
          </button>
        </div>
      </div>

      <!-- Right Column: Card editor workspace -->
      <div 
        class="lg:col-span-7 border rounded-2xl p-6 space-y-4 text-left transition-colors"
        :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
      >
        <div class="flex items-center justify-between border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <h4 class="text-xs font-bold text-indigo-500 uppercase tracking-wider">
            {{ isEditingNewNav ? 'Cadastrar Novo Elemento' : 'Editar Elemento' }}
          </h4>
          <span v-if="!isEditingNewNav" class="text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold" :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-450' : 'bg-slate-100 border-slate-200 text-slate-600'">
            ID: {{ navForm.id }}
          </span>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">ID do Elemento</label>
            <input 
              type="text" 
              v-model="navForm.id" 
              :disabled="!isEditingNewNav"
              placeholder="ex: custom_link" 
              class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 disabled:opacity-50 transition-all font-semibold"
              :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Ordem (Ex: 10, 20...)</label>
            <input 
              type="number" 
              v-model.number="navForm.order" 
              placeholder="ex: 70" 
              class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all font-semibold"
              :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo PT</label>
            <input 
              type="text" 
              v-model="navForm.label_pt" 
              placeholder="ex: Blog" 
              class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all font-semibold"
              :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo EN</label>
            <input 
              type="text" 
              v-model="navForm.label_en" 
              placeholder="ex: Blog" 
              class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all font-semibold"
              :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>
        </div>

        <div>
          <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Alvo / Destino (Scroll ID ou URL)</label>
          <input 
            type="text" 
            v-model="navForm.target" 
            placeholder="ex: news (para rolar) ou https://..." 
            class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono transition-all"
            :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
          />
          <span class="text-[9px] mt-1 block" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">Escreva o ID do scroll (ex: <strong class="text-slate-400">about</strong>) ou endereço web externo completo.</span>
        </div>

        <div class="grid grid-cols-2 gap-4 p-3 rounded-xl border transition-all" :class="store.darkMode ? 'bg-[#8B5CF6]/5 border-white/5 text-slate-300' : 'bg-slate-50 border-slate-150 text-slate-800'">
          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="navIsExternal" 
              v-model="navForm.isExternal" 
              class="w-4 h-4 rounded bg-slate-950 border border-white/10 accent-indigo-500 cursor-pointer"
            />
            <label for="navIsExternal" class="text-xs font-bold cursor-pointer select-none">Abrir em Nova Guia</label>
          </div>

          <div class="flex items-center gap-2">
            <input 
              type="checkbox" 
              id="navVisible" 
              v-model="navForm.visible" 
              class="w-4 h-4 rounded bg-slate-950 border border-white/10 accent-indigo-500 cursor-pointer"
            />
            <label for="navVisible" class="text-xs font-bold cursor-pointer select-none">Visível no Menu</label>
          </div>
        </div>

        <!-- Custom Section Design Controls -->
        <div class="space-y-4 border-t pt-4" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <h5 class="text-[10px] font-black uppercase tracking-wider text-indigo-500 flex items-center gap-1.5 font-bold">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>Aparência e Conteúdo de Seção Customizada / Existente</span>
          </h5>
          
          <div>
            <label class="block text-[9px] font-black uppercase mb-1 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Imagem de Fundo Customizada (URL)</label>
            <input 
              type="text" 
              v-model="navForm.bgImageUrl" 
              placeholder="Ex: /assets/my_custom_bg.jpg (deixe vazio para usar o padrão dinâmico da seção)" 
              class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 font-mono transition-all"
              :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
            <p class="text-[9px] text-slate-500 mt-1">Se fornecida, esta imagem será usada como plano de fundo da seção. Caso contrário, a seção usará seu estilo padrão (light/dark dinâmico).</p>
          </div>

          <div class="p-3 border rounded-xl space-y-3 transition-colors" :class="store.darkMode ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-slate-50 border-slate-150 text-slate-800'">
            <span class="text-[9px] font-black uppercase block font-bold" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">Conteúdo do Card/Seção Geral</span>
            
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título da Seção (PT)</label>
                <input 
                  type="text" 
                  v-model="navForm.sectionTitlePt" 
                  placeholder="Ex: Nossos Valores" 
                  class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500" 
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                />
              </div>
              <div>
                <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título da Seção (EN)</label>
                <input 
                  type="text" 
                  v-model="navForm.sectionTitleEn" 
                  placeholder="Ex: Our Values" 
                  class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500" 
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 pb-2">
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[8px] font-bold uppercase" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Descrição (PT)</label>
                  <button type="button" @click="openAdvEditor('Menu: Descrição PT', navForm.sectionBodyPt, (val) => { navForm.sectionBodyPt = val })" class="text-[7.5px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                    <i class="fa-solid fa-expand text-[7px]"></i> Ampliar ✨
                  </button>
                </div>
                <textarea 
                  v-model="navForm.sectionBodyPt" 
                  rows="5" 
                  placeholder="Descreva os objetivos desta seção..." 
                  class="w-full py-2 px-3 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium transition-all min-h-[110px]"
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                ></textarea>
              </div>
              <div>
                <div class="flex items-center justify-between mb-1">
                  <label class="block text-[8px] font-bold uppercase" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Descrição (EN)</label>
                  <button type="button" @click="openAdvEditor('Menu: Descrição EN', navForm.sectionBodyEn, (val) => { navForm.sectionBodyEn = val })" class="text-[7.5px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                    <i class="fa-solid fa-expand text-[7px]"></i> Ampliar ✨
                  </button>
                </div>
                <textarea 
                  v-model="navForm.sectionBodyEn" 
                  rows="5" 
                  placeholder="Describe the goals of this section..." 
                  class="w-full py-2 px-3 rounded-xl text-xs outline-none focus:border-indigo-500 font-medium transition-all min-h-[110px]"
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                ></textarea>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="md:col-span-1">
                <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Botão (PT)</label>
                <input 
                  type="text" 
                  v-model="navForm.ctaTextPt" 
                  placeholder="Ver Mais" 
                  class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-505" 
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                />
              </div>
              <div class="md:col-span-1">
                <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Botão (EN)</label>
                <input 
                  type="text" 
                  v-model="navForm.ctaTextEn" 
                  placeholder="Learn More" 
                  class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-505" 
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                />
              </div>
              <div class="md:col-span-1">
                <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Meta Link do Botão (URL)</label>
                <input 
                  type="text" 
                  v-model="navForm.ctaUrl" 
                  placeholder="https://..." 
                  class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-505 font-mono" 
                  :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="pt-4 flex flex-wrap gap-2 justify-between border-t" :class="store.darkMode ? 'border-white/5' : 'border-slate-200'">
          <div class="flex gap-2">
            <button 
              @click="saveNavbarItem" 
              class="px-5 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none"
            >
              <i class="fa-solid fa-save"></i> Salvar Link
            </button>
            <button 
              v-if="!isEditingNewNav"
              @click="deleteNavbarItem" 
              class="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none"
            >
              <i class="fa-solid fa-trash"></i> Excluir
            </button>
          </div>
          
          <button 
            @click="resetNavbarItemForm" 
            class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
            :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'"
          >
            Limpar / Novo
          </button>
        </div>
      </div>

    </div> <!-- Grid ends -->
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { useEsgStore } from '../../stores/esgStore';

const props = defineProps<{
  editLang: 'pt' | 'en';
  openAdvEditor: (label: string, value: string, cb: (val: string) => void) => void;
}>();

const store = useEsgStore();

// State variables for Navbar Items manager
const selectedNavId = ref('');
const isEditingNewNav = ref(true);

const navForm = reactive({
  id: '',
  label_pt: '',
  label_en: '',
  target: '',
  isExternal: false,
  visible: true,
  order: 50,
  bgImageUrl: '',
  sectionTitlePt: '',
  sectionTitleEn: '',
  sectionBodyPt: '',
  sectionBodyEn: '',
  ctaTextPt: '',
  ctaTextEn: '',
  ctaUrl: ''
});

// SEARCH & COMPUTED FILTERS
const navbarSearchQuery = ref('');
const navbarPageSize = 5;
const currentNavbarPage = ref(1);

const filteredNavbarItems = computed(() => {
  const query = navbarSearchQuery.value.trim().toLowerCase();
  const sorted = [...(store.navbarItems || [])].sort((a, b) => (a.order || 0) - (b.order || 0));
  if (!query) return sorted;
  return sorted.filter(item => {
    const labelPt = (item.label?.pt || '').toLowerCase();
    const labelEn = (item.label?.en || '').toLowerCase();
    const target = (item.target || '').toLowerCase();
    const id = (item.id || '').toLowerCase();
    return labelPt.includes(query) || labelEn.includes(query) || target.includes(query) || id.includes(query);
  });
});

const paginatedNavbarItems = computed(() => {
  const start = (currentNavbarPage.value - 1) * navbarPageSize;
  return filteredNavbarItems.value.slice(start, start + navbarPageSize);
});

const totalNavbarPages = computed(() => {
  return Math.ceil(filteredNavbarItems.value.length / navbarPageSize) || 1;
});

watch(navbarSearchQuery, () => {
  currentNavbarPage.value = 1;
});

// Loading selections
const selectNavbarItem = (item: any) => {
  selectedNavId.value = item.id;
  isEditingNewNav.value = false;
  navForm.id = item.id;
  navForm.label_pt = item.label?.pt || '';
  navForm.label_en = item.label?.en || '';
  navForm.target = item.target || '';
  navForm.isExternal = !!item.isExternal;
  navForm.visible = item.visible !== false;
  navForm.order = item.order || 50;
  navForm.bgImageUrl = item.bgImageUrl || '';
  navForm.sectionTitlePt = item.sectionTitle?.pt || '';
  navForm.sectionTitleEn = item.sectionTitle?.en || '';
  navForm.sectionBodyPt = item.sectionBody?.pt || '';
  navForm.sectionBodyEn = item.sectionBody?.en || '';
  navForm.ctaTextPt = item.ctaText?.pt || '';
  navForm.ctaTextEn = item.ctaText?.en || '';
  navForm.ctaUrl = item.ctaUrl || '';
};

const initNewNavbarItem = () => {
  selectedNavId.value = 'new_nav';
  isEditingNewNav.value = true;
  const customId = 'custom_' + Date.now().toString(36).substring(4);
  navForm.id = customId;
  navForm.label_pt = '';
  navForm.label_en = '';
  navForm.target = customId; 
  navForm.isExternal = false;
  navForm.visible = true;
  navForm.bgImageUrl = '';
  navForm.sectionTitlePt = '';
  navForm.sectionTitleEn = '';
  navForm.sectionBodyPt = '';
  navForm.sectionBodyEn = '';
  navForm.ctaTextPt = '';
  navForm.ctaTextEn = '';
  navForm.ctaUrl = '';
  
  const maxOrder = store.navbarItems && store.navbarItems.length > 0 
    ? store.navbarItems.reduce((max, i) => Math.max(max, i.order || 0), 0)
    : 0;
  navForm.order = maxOrder + 10;
};

const resetNavbarItemForm = () => {
  initNewNavbarItem();
};

const saveNavbarItem = async () => {
  if (!navForm.id || !navForm.label_pt || !navForm.target) {
    store.addToast("Insira o ID, o rótulo em português e o destino do link.", "err");
    return;
  }

  if (isEditingNewNav.value) {
    const exists = store.navbarItems && store.navbarItems.some(item => item.id === navForm.id);
    if (exists) {
      store.addToast("Este ID de menu já existe! Use um ID único.", "err");
      return;
    }
  }

  const existingItem = store.navbarItems && store.navbarItems.find(item => item.id === navForm.id);

  const payload = {
    id: navForm.id,
    label: {
      pt: navForm.label_pt,
      en: navForm.label_en || navForm.label_pt
    },
    target: navForm.target,
    isExternal: navForm.isExternal,
    visible: navForm.visible,
    order: Number(navForm.order) || 50,
    bgImageUrl: navForm.bgImageUrl && navForm.bgImageUrl.trim() ? navForm.bgImageUrl.trim() : null,
    sectionTitle: navForm.sectionTitlePt ? {
      pt: navForm.sectionTitlePt,
      en: navForm.sectionTitleEn || navForm.sectionTitlePt
    } : null,
    sectionBody: navForm.sectionBodyPt ? {
      pt: navForm.sectionBodyPt,
      en: navForm.sectionBodyEn || navForm.sectionBodyPt
    } : null,
    ctaText: navForm.ctaTextPt ? {
      pt: navForm.ctaTextPt,
      en: navForm.ctaTextEn || navForm.ctaTextPt
    } : null,
    ctaUrl: navForm.ctaUrl && navForm.ctaUrl.trim() ? navForm.ctaUrl.trim() : null,
    blocks: existingItem?.blocks || null
  };

  await store.setFirebaseNode(`navbarItems/${navForm.id}`, payload);
  store.addToast("Item de menu salvo com sucesso!", "ok");
  
  selectedNavId.value = navForm.id;
  isEditingNewNav.value = false;
};

const deleteNavbarItem = async () => {
  if (!navForm.id) return;
  if (confirm(`Deseja realmente remover o link de menu "${navForm.label_pt || navForm.id}"?`)) {
    const defaultIds = ['home', 'news', 'about', 'areas', 'research', 'contact'];
    if (defaultIds.includes(navForm.id)) {
      await store.setFirebaseNode(`navbarItems/${navForm.id}`, {
        id: navForm.id,
        deleted: true,
        visible: false,
        order: Number(navForm.order) || 50
      });
    } else {
      await store.deleteFirebaseNode(`navbarItems/${navForm.id}`);
    }
    store.addToast("Link de menu excluído.", "info");
    initNewNavbarItem();
  }
};

// Auto-select first item if available
watch(() => store.navbarItems, (newList) => {
  if (newList && newList.length > 0 && selectedNavId.value === '') {
    const activeOnes = newList.filter((item: any) => !item.deleted);
    if (activeOnes.length > 0) {
      selectNavbarItem(activeOnes[0]);
    }
  }
}, { immediate: true });
</script>
