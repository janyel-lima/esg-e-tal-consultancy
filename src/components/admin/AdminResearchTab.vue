<template>
  <div class="space-y-6">
    <!-- Polished Help Callout Box -->
    <div class="bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
      <i class="fa-solid fa-circle-info text-[#8B5CF6] mt-0.5 text-sm shrink-0"></i>
      <div>
        <strong class="text-[#8B5CF6] font-bold block mb-1">Central de Estudos, Pesquisas & Artigos</strong>
        <p class="leading-relaxed text-slate-300">
          Gerencie relatórios, diretrizes e ensaios acadêmicos para download. Você pode selecionar o item de destaque clicando em <span class="text-[#a78bfa] font-bold">Destaque</span>. Defina o link para formulário de capturas via Google Forms ou um endpoint direto no campo <strong class="text-white">URL de Acesso</strong> para que os usuários preencham seus dados antes do download.
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
          <span class="text-[11px] font-black uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Estudos ({{ filteredResearch.length }})</span>
          <button 
            @click="loadResearchItem('')" 
            class="px-2.5 py-1 text-[10px] font-bold bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#a78bfa] rounded-md transition-all cursor-pointer border-none"
          >
            <i class="fa-solid fa-plus mr-1"></i> Criar Nova
          </button>
        </div>

        <!-- Live Search input -->
        <div class="relative">
          <input 
            type="text" 
            v-model="researchSearchQuery" 
            placeholder="Pesquisar por título, autor ou id..." 
            class="w-full pl-8 pr-3 py-2 rounded-xl text-xs outline-none focus:border-[#8B5CF6] transition-colors"
            :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white placeholder-slate-500' : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400'"
          />
          <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'"></i>
        </div>

        <!-- List Loop with pagination -->
        <div class="space-y-2 max-h-[480px] overflow-y-auto scrollbar-thin pr-1">
          <div 
            v-for="item in paginatedResearch" 
            :key="item.id"
            @click="loadResearchItem(item.id)"
            class="p-3 rounded-xl border transition-all cursor-pointer text-left focus:outline-none"
            :class="selectedResId === item.id 
              ? 'bg-[#8B5CF6]/10 border-[#8B5CF6]/30 text-[#8B5CF6]' 
              : (store.darkMode ? 'bg-white/5 border-white/5 hover:bg-white/10 text-slate-200' : 'bg-slate-50 border-slate-150 hover:bg-slate-100 text-slate-800')"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded font-bold" :class="store.darkMode ? 'bg-slate-950 text-slate-400' : 'bg-slate-200 text-slate-600'">
                {{ item.id }}
              </span>
              <div class="flex items-center gap-1.5">
                <span v-if="item.isFeatured" class="text-[9px] text-[#8B5CF6] bg-[#8B5CF6]/10 px-1 py-0.5 rounded border border-[#8B5CF6]/20 font-bold uppercase">Destaque</span>
                <span v-if="item.visible === false" class="text-[9px] text-red-500 bg-red-400/10 px-1 py-0.5 rounded border border-red-500/15 font-bold uppercase">Oculto</span>
              </div>
            </div>
            <h5 class="font-bold text-xs truncate leading-snug">{{ item.headline?.pt || item.headline?.en || 'Sem Título' }}</h5>
            <p class="text-[9px] mt-1 flex items-center gap-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
              <i class="fa-solid fa-user-pen text-[8px]"></i>
              {{ item.author?.pt || 'Sem Autor' }}
            </p>
          </div>

          <div v-if="filteredResearch.length === 0" class="text-center py-8 text-xs font-medium" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
            <i class="fa-regular fa-folder-open block text-base mb-2"></i>
            Nenhum estudo encontrado
          </div>
        </div>

        <!-- Custom Pager -->
        <div v-if="totalResearchPages > 1" class="flex items-center justify-between border-t pt-3 text-[10px] font-semibold select-none" :class="store.darkMode ? 'border-white/5 text-slate-400' : 'border-slate-150 text-slate-500'">
          <button 
            :disabled="currentResearchPage === 1" 
            @click="currentResearchPage--" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#8B5CF6]/15 hover:text-white hover:border-[#8B5CF6]/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6]'"
          >
            Anterior
          </button>
          <span>Página {{ currentResearchPage }} / {{ totalResearchPages }}</span>
          <button 
            :disabled="currentResearchPage === totalResearchPages" 
            @click="currentResearchPage++" 
            class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all bg-transparent"
            :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#8B5CF6]/15 hover:text-white hover:border-[#8B5CF6]/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#8B5CF6]/10 hover:text-[#8B5CF6]'"
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
          <h4 class="text-xs font-bold text-[#8B5CF6] uppercase tracking-wider flex items-center gap-2">
            <i class="fa-solid fa-file-invoice"></i>
            <span>Ambiente de Edição — {{ selectedResId === 'new_res' || !selectedResId ? 'Novo Artigo / Estudo' : `Artigo ID: ${activeResearchItem.id}` }}</span>
          </h4>
        </div>

        <div class="space-y-4">
          <!-- Meta Row: ID, Date, Action toggles -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Data (PT)</label>
              <input 
                type="text" 
                v-model="activeResearchItem.datePt" 
                placeholder="Ex: 14/01/2026" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Data (EN)</label>
              <input 
                type="text" 
                v-model="activeResearchItem.dateEn" 
                placeholder="Ex: Jan 14, 2026" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
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
                v-model="activeResearchItem.headlinePt" 
                placeholder="Título científico principal" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título EN</label>
              <input 
                type="text" 
                v-model="activeResearchItem.headlineEn" 
                placeholder="Title headline in English" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Authors PT & EN -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Autor / Diretório PT</label>
              <input 
                type="text" 
                v-model="activeResearchItem.authorPt" 
                placeholder="Ex: Comitê Científico ESG" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Autor / Diretório EN</label>
              <input 
                type="text" 
                v-model="activeResearchItem.authorEn" 
                placeholder="Ex: ESG Scientific Committee" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Core Body 1 text block -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Resumo / Parágrafo §1 PT</label>
                <button type="button" @click="openAdvEditor('Pesquisa: Corpo §1 PT', activeResearchItem.bodyPt, (val) => { activeResearchItem.bodyPt = val })" class="text-[9px] text-[#a78bfa] hover:text-purple-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeResearchItem.bodyPt" 
                placeholder="Resumo principal do estudo científico" 
                rows="6" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[140px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Resumo / Parágrafo §1 EN</label>
                <button type="button" @click="openAdvEditor('Pesquisa: Corpo §1 EN', activeResearchItem.bodyEn, (val) => { activeResearchItem.bodyEn = val })" class="text-[9px] text-[#a78bfa] hover:text-purple-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeResearchItem.bodyEn" 
                placeholder="Study summary in English" 
                rows="6" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[140px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
          </div>

          <!-- Optional Body 2 text blocks -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Parágrafo §2 PT (Opcional)</label>
                <button type="button" @click="openAdvEditor('Pesquisa: Corpo §2 PT', activeResearchItem.body2Pt, (val) => { activeResearchItem.body2Pt = val })" class="text-[9px] text-[#a78bfa] hover:text-purple-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeResearchItem.body2Pt" 
                placeholder="Parágrafo descritivo secundário" 
                rows="5" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[110px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Parágrafo §2 EN (Opcional)</label>
                <button type="button" @click="openAdvEditor('Pesquisa: Corpo §2 EN', activeResearchItem.body2En, (val) => { activeResearchItem.body2En = val })" class="text-[9px] text-[#a78bfa] hover:text-purple-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                  <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                </button>
              </div>
              <textarea 
                v-model="activeResearchItem.body2En" 
                placeholder="Alternative secondary body text block in English" 
                rows="5" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[110px]" 
                :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
              ></textarea>
            </div>
          </div>

          <!-- Media Illustration & Action CTA button configuration -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL da Imagem Ilustração</label>
              <input 
                type="text" 
                v-model="activeResearchItem.imgUrl" 
                placeholder="Ex:/images/sustentaveis.jpg" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL de Acesso / Download</label>
              <input 
                type="text" 
                v-model="activeResearchItem.ctaUrl" 
                placeholder="Ex: link do Google Sheets" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo do Download (PT)</label>
              <input 
                type="text" 
                v-model="activeResearchItem.ctaTextPt" 
                placeholder="Ex: Baixar Estudo Grátis" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="hidden md:block"></div>
            <div class="hidden md:block"></div>
            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo do Download (EN)</label>
              <input 
                type="text" 
                v-model="activeResearchItem.ctaTextEn" 
                placeholder="Ex: Get Research PDF" 
                class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
              />
            </div>
          </div>

          <!-- Options Checkboxes Segment -->
          <div class="border p-4 grid grid-cols-2 gap-4 items-center rounded-xl" :class="store.darkMode ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-slate-50 border-slate-150 text-slate-800'">
            <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
              <input type="checkbox" v-model="activeResearchItem.isFeatured" class="w-4 h-4 rounded border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
              <span>Marcar estudo em destaque na página inicial (Destaque)</span>
            </label>
            <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
              <input type="checkbox" v-model="activeResearchItem.visible" class="w-4 h-4 rounded border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
              <span>Estudo Visível para Usuários</span>
            </label>
          </div>

          <!-- Custom Badge and Customizable Extra Fields Section -->
          <div class="border-t border-white/5 pt-4 space-y-4">
            <h5 class="text-[11px] font-black uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5 mb-2 font-bold">
              <i class="fa-solid fa-tags"></i>
              <span>Etiqueta / Badge e Campos Extras do Estudo</span>
            </h5>

            <div class="p-4 bg-white/5 border border-white/5 rounded-xl space-y-4">
              <!-- Badge Row -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div class="md:col-span-5">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Rótulo do Badge (PT)</label>
                  <input type="text" v-model="activeResearchItem.customBadgeTextPt" placeholder="Ex: PDF, Artigo, etc." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#8B5CF6]" />
                </div>
                <div class="md:col-span-4">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Rótulo do Badge (EN)</label>
                  <input type="text" v-model="activeResearchItem.customBadgeTextEn" placeholder="Ex: PDF, Paper, etc." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#8B5CF6]" />
                </div>
                <div class="md:col-span-3">
                  <label class="block text-[9px] font-black uppercase text-slate-400 mb-1 font-bold">Cor do Badge</label>
                  <select v-model="activeResearchItem.customBadgeColor" class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-[#8B5CF6] cursor-pointer">
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
                  <span class="text-[9px] font-black uppercase text-slate-400 font-bold">Campos Extras Adicionais ({{ activeResearchItem.customFields ? activeResearchItem.customFields.length : 0 }})</span>
                  <button 
                    @click="addResearchCustomField"
                    type="button"
                    class="px-2 py-1 text-[9px] font-extrabold bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#a78bfa] rounded transition-all cursor-pointer border-none"
                  >
                    <i class="fa-solid fa-plus-circle mr-1"></i> Adicionar Campo
                  </button>
                </div>

                <div v-if="!activeResearchItem.customFields || activeResearchItem.customFields.length === 0" class="text-center text-[11px] text-slate-500 py-2">
                  Nenhum campo personalizado adicionado. Estes campos aparecem como metadados adicionais na base do card do artigo.
                </div>

                <div v-else class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  <div 
                    v-for="(field, fIdx) in activeResearchItem.customFields" 
                    :key="fIdx"
                    class="p-3 bg-slate-950/80 border border-white/5 rounded-lg space-y-3 relative"
                  >
                    <div class="absolute top-2 right-2 flex items-center">
                      <button 
                        @click="removeResearchCustomField(fIdx)"
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
                        <input type="text" v-model="field.label.pt" placeholder="Ex: Local, Coordenador" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Título do Campo EN</label>
                        <input type="text" v-model="field.label.en" placeholder="Ex: Location, Coordinator" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Valor do Campo PT</label>
                        <input type="text" v-model="field.value.pt" placeholder="Ex: Brasília - DF" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Valor do Campo EN</label>
                        <input type="text" v-model="field.value.en" placeholder="Ex: Brasilia - DF" class="w-full py-1.5 px-2 bg-slate-900 border border-white/5 rounded text-xs text-white outline-none focus:border-[#8B5CF6]" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Option to notify subscribers via newsletter -->
          <div class="bg-violet-500/10 border border-violet-500/15 rounded-xl p-4 flex items-center justify-between gap-3">
            <div class="flex items-center gap-2.5">
              <input 
                type="checkbox" 
                id="notifySubscribersResearch" 
                v-model="notifySubscribersOnSaveResearch"
                class="w-4 h-4 rounded border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6] cursor-pointer"
              />
              <label for="notifySubscribersResearch" class="text-[11px] font-semibold text-slate-300 cursor-pointer select-none">
                Enviar Notificação de Nova Publicação (Estudo/Pesquisa) por E-mail aos Inscritos da Newsletter
              </label>
            </div>
            <span class="text-[8px] font-black uppercase text-violet-400 tracking-wider">EMAIL NOTIFICATION</span>
          </div>

          <!-- Action row with triggers -->
          <div class="pt-4 flex gap-3 border-t justify-between" :class="store.darkMode ? 'border-white/5' : 'border-slate-200'">
            <div class="flex gap-3">
              <button @click="saveResearchItem" class="px-5 py-2.5 bg-[#8B5CF6] hover:bg-[#7D3AED] text-white text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border-none">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Salvar Artigo</span>
              </button>
              <button 
                v-if="selectedResId && selectedResId !== 'new_res' && selectedResId !== 'research_featured'" 
                @click="deleteResearchItem(activeResearchItem.id)" 
                class="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 border-none"
              >
                <i class="fa-solid fa-trash-can"></i>
                <span>Excluir</span>
              </button>
            </div>
            <button @click="loadResearchItem('')" class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none" :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-600'">
              Cancelar / Criar Novo
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

// Local active states for Research Management
const selectedResId = ref('');
const notifySubscribersOnSaveResearch = ref(false);

const activeResearchItem = reactive({
  id: '',
  datePt: '',
  dateEn: '',
  headlinePt: '',
  headlineEn: '',
  authorPt: '',
  authorEn: '',
  bodyPt: '',
  bodyEn: '',
  body2Pt: '',
  body2En: '',
  imgUrl: '',
  ctaUrl: '',
  ctaTextPt: '',
  ctaTextEn: '',
  isFeatured: false,
  visible: true,
  customBadgeTextPt: '',
  customBadgeTextEn: '',
  customBadgeColor: 'violet',
  customFields: [] as { label: { pt: string; en: string }; value: { pt: string; en: string } }[]
});

// Filters & Pagination configuration
const researchSearchQuery = ref('');
const researchPageSize = 5;
const currentResearchPage = ref(1);

const filteredResearch = computed(() => {
  const query = researchSearchQuery.value.trim().toLowerCase();
  const sorted = [...store.dynamicResearch].sort((a, b) => b.createdAt - a.createdAt);
  if (!query) return sorted;
  return sorted.filter(item => {
    const headlinePt = (item.headline?.pt || '').toLowerCase();
    const headlineEn = (item.headline?.en || '').toLowerCase();
    const bodyPt = (item.body?.pt || '').toLowerCase();
    const bodyEn = (item.body?.en || '').toLowerCase();
    const authorPt = (item.author?.pt || '').toLowerCase();
    const id = item.id.toLowerCase();
    return headlinePt.includes(query) || headlineEn.includes(query) || bodyPt.includes(query) || bodyEn.includes(query) || authorPt.includes(query) || id.includes(query);
  });
});

const paginatedResearch = computed(() => {
  const start = (currentResearchPage.value - 1) * researchPageSize;
  return filteredResearch.value.slice(start, start + researchPageSize);
});

const totalResearchPages = computed(() => {
  return Math.ceil(filteredResearch.value.length / researchPageSize) || 1;
});

watch(researchSearchQuery, () => {
  currentResearchPage.value = 1;
});

// Load research item properties inside editor
const loadResearchItem = (id: string) => {
  const item = store.dynamicResearch.find(r => r.id === id);
  if (item) {
    selectedResId.value = id;
    activeResearchItem.id = item.id;
    activeResearchItem.datePt = item.date?.pt || '';
    activeResearchItem.dateEn = item.date?.en || '';
    activeResearchItem.headlinePt = item.headline?.pt || '';
    activeResearchItem.headlineEn = item.headline?.en || '';
    activeResearchItem.authorPt = item.author?.pt || '';
    activeResearchItem.authorEn = item.author?.en || '';
    activeResearchItem.bodyPt = item.body?.pt || '';
    activeResearchItem.bodyEn = item.body?.en || '';
    activeResearchItem.body2Pt = item.body2?.pt || '';
    activeResearchItem.body2En = item.body2?.en || '';
    activeResearchItem.imgUrl = item.imgUrl || '';
    activeResearchItem.ctaUrl = item.ctaUrl || '';
    activeResearchItem.ctaTextPt = item.ctaText?.pt || '';
    activeResearchItem.ctaTextEn = item.ctaText?.en || '';
    activeResearchItem.isFeatured = !!item.isFeatured;
    activeResearchItem.visible = item.visible !== false;
    activeResearchItem.customBadgeTextPt = item.customBadgeText?.pt || '';
    activeResearchItem.customBadgeTextEn = item.customBadgeText?.en || '';
    activeResearchItem.customBadgeColor = item.customBadgeColor || 'violet';
    activeResearchItem.customFields = item.customFields ? JSON.parse(JSON.stringify(item.customFields)) : [];
  } else {
    selectedResId.value = 'new_res';
    activeResearchItem.id = 'r' + Date.now();
    activeResearchItem.datePt = '';
    activeResearchItem.dateEn = '';
    activeResearchItem.headlinePt = '';
    activeResearchItem.headlineEn = '';
    activeResearchItem.authorPt = '';
    activeResearchItem.authorEn = '';
    activeResearchItem.bodyPt = '';
    activeResearchItem.bodyEn = '';
    activeResearchItem.body2Pt = '';
    activeResearchItem.body2En = '';
    activeResearchItem.imgUrl = '';
    activeResearchItem.ctaUrl = '';
    activeResearchItem.ctaTextPt = '';
    activeResearchItem.ctaTextEn = '';
    activeResearchItem.isFeatured = false;
    activeResearchItem.visible = true;
    activeResearchItem.customBadgeTextPt = '';
    activeResearchItem.customBadgeTextEn = '';
    activeResearchItem.customBadgeColor = 'violet';
    activeResearchItem.customFields = [];
  }
};

// Customizable meta fields helpers
const addResearchCustomField = () => {
  if (!activeResearchItem.customFields) {
    activeResearchItem.customFields = [];
  }
  activeResearchItem.customFields.push({
    label: { pt: '', en: '' },
    value: { pt: '', en: '' }
  });
};

const removeResearchCustomField = (index: number) => {
  if (activeResearchItem.customFields) {
    activeResearchItem.customFields.splice(index, 1);
  }
};

// Watch study array to load first item by default
watch(() => store.dynamicResearch, (newList) => {
  if (newList && newList.length > 0 && selectedResId.value === '') {
    loadResearchItem(newList[0].id);
  }
}, { immediate: true });

// Saving dynamic studies in Firestore node
const saveResearchItem = async () => {
  if (!activeResearchItem.headlinePt || !activeResearchItem.bodyPt) {
    store.addToast("Insira ao menos um título e resumo em português.", "err");
    return;
  }

  const payload = {
    id: activeResearchItem.id,
    date: { pt: activeResearchItem.datePt || 'Hoje', en: activeResearchItem.dateEn || 'Today' },
    headline: { pt: activeResearchItem.headlinePt, en: activeResearchItem.headlineEn || activeResearchItem.headlinePt },
    author: { pt: activeResearchItem.authorPt || 'ESG e Tal', en: activeResearchItem.authorEn || 'ESG e Tal' },
    body: { pt: activeResearchItem.bodyPt, en: activeResearchItem.bodyEn || activeResearchItem.bodyPt },
    body2: activeResearchItem.body2Pt ? { pt: activeResearchItem.body2Pt, en: activeResearchItem.body2En || activeResearchItem.body2Pt } : null,
    imgUrl: activeResearchItem.imgUrl || null,
    ctaUrl: activeResearchItem.ctaUrl || null,
    ctaText: activeResearchItem.ctaTextPt ? { pt: activeResearchItem.ctaTextPt, en: activeResearchItem.ctaTextEn || activeResearchItem.ctaTextPt } : null,
    isFeatured: activeResearchItem.isFeatured,
    visible: activeResearchItem.visible,
    customBadgeText: activeResearchItem.customBadgeTextPt ? { pt: activeResearchItem.customBadgeTextPt, en: activeResearchItem.customBadgeTextEn || activeResearchItem.customBadgeTextPt } : null,
    customBadgeColor: activeResearchItem.customBadgeColor || 'violet',
    customFields: activeResearchItem.customFields && activeResearchItem.customFields.length > 0 ? activeResearchItem.customFields : null,
    createdAt: Date.now()
  };

  await store.setFirebaseNode(`dynamicResearch/${activeResearchItem.id}`, payload);
  store.addToast("Artigo científico salvo com sucesso!", "ok");

  if (notifySubscribersOnSaveResearch.value) {
    try {
      await store.loadNewsletterSubscribers();
      await store.loadNewsletterConfig();
      
      const activeSubs = store.subscribers || [];
      if (activeSubs.length > 0) {
        store.addToast(`Iniciando disparo de notificação do estudo para ${activeSubs.length} inscritos...`, "info");
        
        let successCount = 0;
        let failCount = 0;
        const config = store.newsletterConfig || { provider: 'simulator', senderName: 'ESG e Tal' };
        
        const snippet = payload.body.pt.length > 200 ? payload.body.pt.slice(0, 200) + "..." : payload.body.pt;
        const body2Snippet = payload.body2?.pt ? `\n\n${payload.body2.pt}` : '';
        const intro = `Olá! Temos um novo estudo publicado no portal ESG e Tal:\n\n`;
        const studyTitle = `🔬 "${payload.headline.pt}" (${payload.date.pt})\n`;
        const separator = `────────────────────────────────────────\n`;
        const outro = `\n\nAcesse nosso portal completo para conferir a publicação:\n${window.location.origin}`;
        
        const fullMessageText = `${intro}${studyTitle}${separator}${snippet}${body2Snippet}${outro}`;
        
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
                  item_type: "Artigo de Pesquisa / Estudo 🔬",
                  item_author: payload.author?.pt || "ESG e Tal",
                  item_date: payload.date?.pt || "Hoje",
                  item_summary: snippet,
                  item_url: `${window.location.origin}`,
                  unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(sub.email)}`
                } : {
                  to_email: sub.email,
                  to_name: sub.name || "Leitor ESG e Tal",
                  sender_name: config.senderName || "ESG e Tal",
                  subject: `ESG e Tal (Estudos e Pesquisas) - ${payload.headline.pt}`,
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
              console.log(`[SIMULAÇÃO DISPARO AUTOMÁTICO ESTUDO] Notificação enviada para: ${sub.email}. Assunto: ESG e Tal (Pesquisas) - ${payload.headline.pt}`);
            }
          } catch (itemErr) {
            failCount++;
            console.error(`Erro ao enviar estudo para ${sub.email}:`, itemErr);
          }
        }
        
        if (config.provider === 'emailjs') {
          store.addToast(`Notificação enviada! Sucesso: ${successCount}, Falhas: ${failCount}`, "ok");
        } else {
          store.addToast(`[Simulador] Disparadas ${successCount} simulações de notificação de estudo nos logs de console.`, "ok");
        }
      } else {
        store.addToast("Nenhum inscrito na lista de Newsletter para receber.", "info");
      }
    } catch (nlErr: any) {
      console.error("Erro no fluxo do newsletter de estudo:", nlErr);
      store.addToast(`Falha nas notificações de estudo: ${nlErr.message}`, "err");
    } finally {
      notifySubscribersOnSaveResearch.value = false;
    }
  }
};

const deleteResearchItem = async (id: string) => {
  if (confirm("Deseja realmente excluir este artigo?")) {
    await store.deleteFirebaseNode(`dynamicResearch/${id}`);
    store.addToast("Artigo de pesquisa removido.", "info");
    if (selectedResId.value === id) {
      loadResearchItem('');
    }
  }
};
</script>
