<template>
  <div class="space-y-6">
    <!-- Polished Help Callout Box -->
    <div class="bg-[#10B981]/10 border border-[#10B981]/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
      <i class="fa-solid fa-circle-info text-[#10B981] mt-0.5 text-sm shrink-0"></i>
      <div>
        <strong class="text-[#10B981] font-bold block mb-1">Central de Notícias & Informativos</strong>
        <p class="leading-relaxed text-slate-300">
          Gerencie as publicações que alimentam o carrossel interativo na tela inicial. Escolha qualquer notícia para editar, marque se é um <span class="text-amber-400 font-bold">Prêmio</span> (ganha badge dourado) ou se é a <span class="text-[#10B981] font-bold">Capa do Livro</span> em destaque. Utilize a barra de busca e paginação para organizar grandes lotes de conteúdo cadastrado.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- Left Side: List Selector -->
      <div 
        class="lg:col-span-4 border rounded-2xl p-4 space-y-3 shrink-0 transition-colors"
        :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
      >
        <div class="flex items-center justify-between border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <span class="text-[11px] font-black uppercase tracking-wider text-slate-400" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Notícias ({{ filteredNews.length }})</span>
          <button 
            @click="loadNewsItem('')" 
            class="px-2.5 py-1 text-[10px] font-bold bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] rounded-md transition-all cursor-pointer border-none"
          >
            <i class="fa-solid fa-plus mr-1"></i> Criar Nova
          </button>
        </div>

        <!-- Live Search input -->
        <div class="relative">
          <input 
            type="text" 
            v-model="newsSearchQuery" 
            placeholder="Pesquisar por título ou texto..." 
            class="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none focus:border-[#10B981] transition-colors"
            :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-500' : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'"></i>
        </div>

        <!-- List Loop with pagination -->
        <div class="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
          <div 
            v-for="item in paginatedNews" 
            :key="item.id"
            @click="loadNewsItem(item.id)"
            class="p-3 rounded-xl border transition-all cursor-pointer text-left focus:outline-none"
            :class="selectedNewsId === item.id 
              ? 'bg-[#10B981]/10 border-[#10B981]/30 text-emerald-400' 
              : (store.darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-200' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800')"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold" :class="store.darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-200 text-slate-600'">
                {{ item.id }}
              </span>
              <div class="flex items-center gap-1.5">
                <span v-if="item.isAward" class="text-[9px] text-amber-500 bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20 font-bold uppercase animate-pulse">Prêmio</span>
                <span v-if="item.isFeaturedBook" class="text-[9px] text-emerald-500 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20 font-bold uppercase">Livro</span>
                <span v-if="item.visible === false" class="text-[9px] text-red-500 bg-red-500/10 px-1 py-0.5 rounded border border-red-500/15 font-bold uppercase">Oculto</span>
              </div>
            </div>
            <h5 class="font-bold text-xs truncate leading-snug">{{ item.headline?.pt || item.headline?.en || 'Sem Título' }}</h5>
            <p class="text-[9px] mt-1 flex items-center gap-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
              <i class="fa-regular fa-calendar text-[8px]"></i>
              {{ item.date?.pt || 'Sem Data' }}
            </p>
          </div>

          <div v-if="filteredNews.length === 0" class="text-center py-8 text-xs font-medium" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
            <i class="fa-regular fa-folder-open block text-base mb-2"></i>
            Nenhuma notícia encontrada
          </div>
        </div>

        <!-- Custom Pager -->
        <div v-if="totalNewsPages > 1" class="flex items-center justify-between border-t pt-3 text-[10px] font-semibold select-none" :class="store.darkMode ? 'border-white/5 text-slate-400' : 'border-slate-150 text-slate-500'">
          <button 
            :disabled="currentNewsPage === 1" 
            @click="currentNewsPage--" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#10B981]/15 hover:text-white hover:border-[#10B981]/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#10B981]/10 hover:text-[#10B981]'"
          >
            Anterior
          </button>
          <span>Página {{ currentNewsPage }} / {{ totalNewsPages }}</span>
          <button 
            :disabled="currentNewsPage === totalNewsPages" 
            @click="currentNewsPage++" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#10B981]/15 hover:text-white hover:border-[#10B981]/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#10B981]/10 hover:text-[#10B981]'"
          >
            Próxima
          </button>
        </div>
      </div>

      <!-- Right Side: Item editor form workspace -->
      <div 
        class="lg:col-span-8 border rounded-2xl p-6 space-y-4 text-left transition-colors"
        :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
      >
        <div class="border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>Ambiente de Edição — {{ selectedNewsId === 'new_news' || !selectedNewsId ? 'Nova Notícia' : `Notícia ID: ${activeNewsItem.id}` }}</span>
          </h4>
        </div>

        <div class="space-y-4">
          <!-- Meta Row: ID, Date, Action toggles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Data (PT)</label>
              <input 
                type="text" 
                v-model="activeNewsItem.datePt" 
                placeholder="Ex: 01/01/2026" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Data (EN)</label>
              <input 
                type="text" 
                v-model="activeNewsItem.dateEn" 
                placeholder="Ex: 01/01/2026" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Headline Header PT & EN -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título PT</label>
              <input 
                type="text" 
                v-model="activeNewsItem.headlinePt" 
                placeholder="Título principal em Português" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título EN</label>
              <input 
                type="text" 
                v-model="activeNewsItem.headlineEn" 
                placeholder="Title headline in English" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Core Body 1 text block -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo §1 PT</label>
                <button type="button" @click="openAdvEditor('Notícia: Corpo §1 PT', activeNewsItem.bodyPt, (val) => { activeNewsItem.bodyPt = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeNewsItem.bodyPt" 
                placeholder="Parágrafo principal da notícia" 
                rows="6" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all min-h-[140px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo §1 EN</label>
                <button type="button" @click="openAdvEditor('Notícia: Corpo §1 EN', activeNewsItem.bodyEn, (val) => { activeNewsItem.bodyEn = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeNewsItem.bodyEn" 
                placeholder="Primary descriptive paragraph in English" 
                rows="6" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all min-h-[140px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
          </div>

          <!-- Optional Body 2 texts -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo §2 PT (Opcional)</label>
                <button type="button" @click="openAdvEditor('Notícia: Corpo §2 PT', activeNewsItem.body2Pt, (val) => { activeNewsItem.body2Pt = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeNewsItem.body2Pt" 
                placeholder="Parágrafo secundário complementar" 
                rows="5" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all min-h-[110px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo §2 EN (Opcional)</label>
                <button type="button" @click="openAdvEditor('Notícia: Corpo §2 EN', activeNewsItem.body2En, (val) => { activeNewsItem.body2En = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeNewsItem.body2En" 
                placeholder="Alternative secondary paragraph in English" 
                rows="5" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all min-h-[110px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
          </div>

          <!-- Action Links CTA URLs parameters -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
            <div class="md:col-span-1">
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL Principal do Link</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkUrl" 
                placeholder="Ex: https://esgetal.com.br" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto Link PT</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkTextPt" 
                placeholder="Texto do link nacional" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto Link EN</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkTextEn" 
                placeholder="Link in English" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Alternate Links properties -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL Alternativa do Link</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkAltUrl" 
                placeholder="Ex: https://amazon.com.br" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto Link Alt PT</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkAltTextPt" 
                placeholder="Ex: também disponível na Amazon" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto Link Alt EN</label>
              <input 
                type="text" 
                v-model="activeNewsItem.linkAltTextEn" 
                placeholder="English alternative link text" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Options Checkboxes Segment -->
          <div class="border p-4 grid grid-cols-1 md:grid-cols-3 gap-4 items-center rounded-xl" :class="store.darkMode ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-slate-50 border-slate-150 text-slate-800'">
            <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
              <input type="checkbox" v-model="activeNewsItem.isAward" class="w-4 h-4 rounded-md border-white/20 bg-slate-900 text-[#10B981] focus:ring-[#10B981]" />
              <span>Badge de Prêmio</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
              <input type="checkbox" v-model="activeNewsItem.isFeaturedBook" class="w-4 h-4 rounded-md border-white/20 bg-slate-900 text-[#10B981] focus:ring-[#10B981]" />
              <span>Capa do Livro</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
              <input type="checkbox" v-model="activeNewsItem.visible" class="w-4 h-4 rounded-md border-white/20 bg-slate-900 text-[#10B981] focus:ring-[#10B981]" />
              <span>Item Visível</span>
            </label>
          </div>

          <!-- Custom Badge and Customizable Extra Fields Section -->
          <div class="border-t border-white/5 pt-4 space-y-4">
            <h5 class="text-[11px] font-black uppercase tracking-wider text-[#10B981] flex items-center gap-1.5 mb-2 font-bold">
              <i class="fa-solid fa-tags"></i>
              <span>Tag / Badge Customizado & Campos Extras</span>
            </h5>

            <div class="p-4 bg-white/5 border border-white/5 rounded-xl space-y-4">
              <!-- Badge Row -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="md:col-span-5">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Rótulo do Badge (PT)</label>
                  <input type="text" v-model="activeNewsItem.customBadgeTextPt" placeholder="Ex: Webinar, Parceria, etc." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#10B981]" />
                </div>
                <div class="md:col-span-4">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Rótulo do Badge (EN)</label>
                  <input type="text" v-model="activeNewsItem.customBadgeTextEn" placeholder="Ex: Webinar, Partnership, etc." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#10B981]" />
                </div>
                <div class="md:col-span-3">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Cor do Badge</label>
                  <select v-model="activeNewsItem.customBadgeColor" class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#10B981] cursor-pointer">
                    <option value="emerald">Emerald (Verde)</option>
                    <option value="amber">Amber (Amarelo)</option>
                    <option value="indigo">Indigo (Índigo)</option>
                    <option value="sky">Sky (Ciano)</option>
                    <option value="rose">Rose (Rosa)</option>
                    <option value="violet">Violet (Roxo)</option>
                    <option value="blue">Blue (Azul)</option>
                  </select>
                </div>
              </div>

              <!-- Customizable Dynamic Extra Fields Lists -->
              <div class="space-y-3">
                <div class="flex items-center justify-between border-t border-white/5 pt-3">
                  <span class="text-[9px] font-black uppercase text-slate-400 font-bold">Campos Extras Adicionais ({{ activeNewsItem.customFields ? activeNewsItem.customFields.length : 0 }})</span>
                  <button 
                    @click="addNewsCustomField"
                    type="button"
                    class="px-2 py-1 text-[9px] font-extrabold bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] rounded transition-all cursor-pointer border-none"
                  >
                    <i class="fa-solid fa-plus-circle mr-1"></i> Adicionar Campo
                  </button>
                </div>

                <div v-if="!activeNewsItem.customFields || activeNewsItem.customFields.length === 0" class="text-center text-[11px] text-slate-500 py-2">
                  Nenhum campo personalizado adicionado. Estes campos aparecem como metadados adicionais na base do card.
                </div>

                <div v-else class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  <div 
                    v-for="(field, fIdx) in activeNewsItem.customFields" 
                    :key="fIdx"
                    class="p-3 bg-slate-950/80 border border-white/5 rounded-lg space-y-3 relative"
                  >
                    <div class="absolute top-2 right-2 flex items-center">
                      <button 
                        @click="removeNewsCustomField(fIdx)"
                        type="button" 
                        class="text-red-400 hover:text-red-500 text-xs px-2 py-1 bg-red-500/10 hover:bg-red-500/20 rounded cursor-pointer border-none"
                        title="Remover este campo"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4">
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Título do Campo PT</label>
                        <input type="text" v-model="field.label.pt" placeholder="Ex: Local, Financiador" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#10B981]" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Título do Campo EN</label>
                        <input type="text" v-model="field.label.en" placeholder="Ex: Location, Funder" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#10B981]" />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Valor do Campo PT</label>
                        <input type="text" v-model="field.value.pt" placeholder="Ex: São Paulo - SP" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#10B981]" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Valor do Campo EN</label>
                        <input type="text" v-model="field.value.en" placeholder="Ex: Sao Paulo - SP" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#10B981]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Option to notify subscribers via newsletter -->
          <div class="bg-indigo-500/10 border border-indigo-500/15 rounded-xl p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <input 
                type="checkbox" 
                id="notifySubscribers" 
                v-model="notifySubscribersOnSave"
                class="w-4 h-4 rounded border-white/20 bg-slate-900 text-[#10B981] focus:ring-[#10B981] cursor-pointer"
              />
              <label for="notifySubscribers" class="text-[11px] font-semibold text-slate-300 cursor-pointer select-none">
                Enviar Notificação de Nova Publicação por E-mail aos Inscritos da Newsletter
              </label>
            </div>
            <span class="text-[8px] font-black uppercase text-indigo-400 tracking-wider">EMAIL NOTIFICATION</span>
          </div>

          <!-- Submit / Control actions bar -->
          <div class="pt-4 flex gap-3 border-t border-white/5 justify-between">
            <div class="flex gap-3">
              <button @click="saveNewsItem" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border-none">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Salvar Notícia</span>
              </button>
              <button 
                v-if="selectedNewsId && selectedNewsId !== 'new_news' && selectedNewsId !== 'news_book' && selectedNewsId !== 'news_award'" 
                @click="deleteNewsItem(activeNewsItem.id)" 
                class="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border-none"
              >
                <i class="fa-solid fa-trash-can"></i>
                <span>Excluir</span>
              </button>
            </div>
            <button @click="loadNewsItem('')" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer border-none">
              Cancelar / Criar Nova
            </button>
          </div>
        </div>
      </div>
    </div>
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

// Local active states for News Management
const selectedNewsId = ref('');
const notifySubscribersOnSave = ref(false);

const activeNewsItem = reactive({
  id: '',
  datePt: '',
  dateEn: '',
  headlinePt: '',
  headlineEn: '',
  bodyPt: '',
  bodyEn: '',
  body2Pt: '',
  body2En: '',
  linkUrl: '',
  linkTextPt: '',
  linkTextEn: '',
  linkAltUrl: '',
  linkAltTextPt: '',
  linkAltTextEn: '',
  isAward: false,
  isFeaturedBook: false,
  visible: true,
  customBadgeTextPt: '',
  customBadgeTextEn: '',
  customBadgeColor: 'emerald',
  customFields: [] as { label: { pt: string; en: string }; value: { pt: string; en: string } }[]
});

// Filters & Pagination configuration
const newsSearchQuery = ref('');
const newsPageSize = 5;
const currentNewsPage = ref(1);

const filteredNews = computed(() => {
  const query = newsSearchQuery.value.trim().toLowerCase();
  const sorted = [...store.dynamicNews].sort((a, b) => b.createdAt - a.createdAt);
  if (!query) return sorted;
  return sorted.filter(item => {
    const headlinePt = (item.headline?.pt || '').toLowerCase();
    const headlineEn = (item.headline?.en || '').toLowerCase();
    const bodyPt = (item.body?.pt || '').toLowerCase();
    const bodyEn = (item.body?.en || '').toLowerCase();
    const id = item.id.toLowerCase();
    return headlinePt.includes(query) || headlineEn.includes(query) || bodyPt.includes(query) || bodyEn.includes(query) || id.includes(query);
  });
});

const paginatedNews = computed(() => {
  const start = (currentNewsPage.value - 1) * newsPageSize;
  return filteredNews.value.slice(start, start + newsPageSize);
});

const totalNewsPages = computed(() => {
  return Math.ceil(filteredNews.value.length / newsPageSize) || 1;
});

watch(newsSearchQuery, () => {
  currentNewsPage.value = 1;
});

// Load details of selected item
const loadNewsItem = (id: string) => {
  const item = store.dynamicNews.find(n => n.id === id);
  if (item) {
    selectedNewsId.value = id;
    activeNewsItem.id = item.id;
    activeNewsItem.datePt = item.date?.pt || '';
    activeNewsItem.dateEn = item.date?.en || '';
    activeNewsItem.headlinePt = item.headline?.pt || '';
    activeNewsItem.headlineEn = item.headline?.en || '';
    activeNewsItem.bodyPt = item.body?.pt || '';
    activeNewsItem.bodyEn = item.body?.en || '';
    activeNewsItem.body2Pt = item.body2?.pt || '';
    activeNewsItem.body2En = item.body2?.en || '';
    activeNewsItem.linkUrl = item.linkUrl || '';
    activeNewsItem.linkTextPt = item.linkText?.pt || '';
    activeNewsItem.linkTextEn = item.linkText?.en || '';
    activeNewsItem.linkAltUrl = item.linkAltUrl || '';
    activeNewsItem.linkAltTextPt = item.linkAltText?.pt || '';
    activeNewsItem.linkAltTextEn = item.linkAltText?.en || '';
    activeNewsItem.isAward = !!item.isAward;
    activeNewsItem.isFeaturedBook = !!item.isFeaturedBook;
    activeNewsItem.visible = item.visible !== false;
    activeNewsItem.customBadgeTextPt = item.customBadgeText?.pt || '';
    activeNewsItem.customBadgeTextEn = item.customBadgeText?.en || '';
    activeNewsItem.customBadgeColor = item.customBadgeColor || 'emerald';
    activeNewsItem.customFields = item.customFields ? JSON.parse(JSON.stringify(item.customFields)) : [];
  } else {
    selectedNewsId.value = 'new_news';
    activeNewsItem.id = 'n' + Date.now();
    activeNewsItem.datePt = '';
    activeNewsItem.dateEn = '';
    activeNewsItem.headlinePt = '';
    activeNewsItem.headlineEn = '';
    activeNewsItem.bodyPt = '';
    activeNewsItem.bodyEn = '';
    activeNewsItem.body2Pt = '';
    activeNewsItem.body2En = '';
    activeNewsItem.linkUrl = '';
    activeNewsItem.linkTextPt = '';
    activeNewsItem.linkTextEn = '';
    activeNewsItem.linkAltUrl = '';
    activeNewsItem.linkAltTextPt = '';
    activeNewsItem.linkAltTextEn = '';
    activeNewsItem.isAward = false;
    activeNewsItem.isFeaturedBook = false;
    activeNewsItem.visible = true;
    activeNewsItem.customBadgeTextPt = '';
    activeNewsItem.customBadgeTextEn = '';
    activeNewsItem.customBadgeColor = 'emerald';
    activeNewsItem.customFields = [];
  }
};

// Custom Fields lists management
const addNewsCustomField = () => {
  if (!activeNewsItem.customFields) {
    activeNewsItem.customFields = [];
  }
  activeNewsItem.customFields.push({
    label: { pt: '', en: '' },
    value: { pt: '', en: '' }
  });
};

const removeNewsCustomField = (index: number) => {
  if (activeNewsItem.customFields) {
    activeNewsItem.customFields.splice(index, 1);
  }
};

// Watch dynamicNews array to select first by default
watch(() => store.dynamicNews, (newList) => {
  if (newList && newList.length > 0 && selectedNewsId.value === '') {
    loadNewsItem(newList[0].id);
  }
}, { immediate: true });

// Async Save operations
const saveNewsItem = async () => {
  if (!activeNewsItem.headlinePt || !activeNewsItem.bodyPt) {
    store.addToast("Insira ao menos um título e corpo em português.", "err");
    return;
  }
  
  const payload = {
    id: activeNewsItem.id,
    date: { pt: activeNewsItem.datePt || 'Hoje', en: activeNewsItem.dateEn || 'Today' },
    headline: { pt: activeNewsItem.headlinePt, en: activeNewsItem.headlineEn || activeNewsItem.headlinePt },
    body: { pt: activeNewsItem.bodyPt, en: activeNewsItem.bodyEn || activeNewsItem.bodyPt },
    body2: activeNewsItem.body2Pt ? { pt: activeNewsItem.body2Pt, en: activeNewsItem.body2En || activeNewsItem.body2Pt } : null,
    linkUrl: activeNewsItem.linkUrl || null,
    linkText: activeNewsItem.linkTextPt ? { pt: activeNewsItem.linkTextPt, en: activeNewsItem.linkTextEn || activeNewsItem.linkTextPt } : null,
    linkAltUrl: activeNewsItem.linkAltUrl || null,
    linkAltText: activeNewsItem.linkAltTextPt ? { pt: activeNewsItem.linkAltTextPt, en: activeNewsItem.linkAltTextEn || activeNewsItem.linkAltTextPt } : null,
    isAward: activeNewsItem.isAward,
    isFeaturedBook: activeNewsItem.isFeaturedBook,
    visible: activeNewsItem.visible,
    customBadgeText: activeNewsItem.customBadgeTextPt ? { pt: activeNewsItem.customBadgeTextPt, en: activeNewsItem.customBadgeTextEn || activeNewsItem.customBadgeTextPt } : null,
    customBadgeColor: activeNewsItem.customBadgeColor || 'emerald',
    customFields: activeNewsItem.customFields && activeNewsItem.customFields.length > 0 ? activeNewsItem.customFields : null,
    createdAt: Date.now()
  };

  await store.setFirebaseNode(`dynamicNews/${activeNewsItem.id}`, payload);
  store.addToast("Notícia salva com sucesso!", "ok");

  if (notifySubscribersOnSave.value) {
    try {
      await store.loadNewsletterSubscribers();
      await store.loadNewsletterConfig();
      
      const activeSubs = store.subscribers || [];
      if (activeSubs.length > 0) {
        store.addToast(`Iniciando disparo de notificação para ${activeSubs.length} inscritos...`, "info");
        
        let successCount = 0;
        let failCount = 0;
        const config = store.newsletterConfig || { provider: 'simulator', senderName: 'ESG e Tal' };
        
        const snippet = payload.body.pt.length > 200 ? payload.body.pt.slice(0, 200) + "..." : payload.body.pt;
        const body2Snippet = payload.body2?.pt ? `\n\n${payload.body2.pt}` : '';
        const intro = `Olá! Temos uma nova publicação no portal ESG e Tal:\n\n`;
        const newsTitle = `📰 "${payload.headline.pt}" (${payload.date.pt})\n`;
        const separator = `────────────────────────────────────────\n`;
        const outro = `\n\nAcesse nosso portal completo para ler a matéria na íntegra:\n${window.location.origin}`;
        
        const fullMessageText = `${intro}${newsTitle}${separator}${snippet}${body2Snippet}${outro}`;
        
        for (const sub of activeSubs) {
          try {
            if (config.provider === 'emailjs') {
              const tid = config.newItemTemplateId || config.templateId;
              if (!config.serviceId || !tid || !config.publicKey) {
                throw new Error("Credenciais do EmailJS incompletas.");
              }
              const isCustomTemplate = !(!config.newItemTemplateId);
              const emailPayload = {
                service_id: config.serviceId,
                template_id: tid,
                user_id: config.publicKey,
                template_params: isCustomTemplate ? {
                  to_email: sub.email,
                  to_name: sub.name || "Leitor ESG e Tal",
                  sender_name: config.senderName || "ESG e Tal",
                  item_title: payload.headline.pt,
                  item_type: "Notícia 📰",
                  item_author: "ESG e Tal",
                  item_date: payload.date?.pt || "Hoje",
                  item_summary: snippet,
                  item_url: `${window.location.origin}`,
                  unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(sub.email)}`
                } : {
                  to_email: sub.email,
                  to_name: sub.name || "Leitor ESG e Tal",
                  sender_name: config.senderName || "ESG e Tal",
                  subject: `ESG e Tal (Informativo) - ${payload.headline.pt}`,
                  message: fullMessageText,
                  unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(sub.email)}`
                }
              };

              const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emailPayload)
              });

              if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Erro na API do EmailJS");
              }
              successCount++;
            } else {
              // Local simulator
              await new Promise(resolve => setTimeout(resolve, 300));
              successCount++;
              console.log(`[SIMULAÇÃO DISPARO AUTOMÁTICO] Notificação enviada para: ${sub.email}. Assunto: ESG e Tal (Informativo) - ${payload.headline.pt}`);
            }
          } catch (itemErr) {
            failCount++;
            console.error(`Erro ao enviar para ${sub.email}:`, itemErr);
          }
        }
        
        if (config.provider === 'emailjs') {
          store.addToast(`Notificação enviada! Sucesso: ${successCount}, Falhas: ${failCount}`, "ok");
        } else {
          store.addToast(`[Simulador] Disparadas ${successCount} simulações de notificação nos logs de console.`, "ok");
        }
      } else {
        store.addToast("Nenhum inscrito na lista de Newsletter para receber.", "info");
      }
    } catch (nlErr: any) {
      console.error("Erro no fluxo do newsletter:", nlErr);
      store.addToast(`Falha nas notificações: ${nlErr.message}`, "err");
    } finally {
      notifySubscribersOnSave.value = false;
    }
  }
};

const deleteNewsItem = async (id: string) => {
  if (confirm("Deseja realmente excluir esta notícia?")) {
    await store.deleteFirebaseNode(`dynamicNews/${id}`);
    store.addToast("Notícia removida com sucesso.", "info");
    if (selectedNewsId.value === id) {
      loadNewsItem('');
    }
  }
};
</script>
