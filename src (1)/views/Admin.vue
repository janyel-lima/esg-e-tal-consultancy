<template>
  <div 
    class="min-h-screen flex flex-col justify-between font-sans transition-colors duration-300"
    :class="store.darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'"
  >
    
    <!-- ── ADMIN HEADER ── -->
    <header 
      class="transition-all duration-300 py-4 px-6 md:px-10 flex items-center justify-between shrink-0 border-b"
      :class="store.darkMode ? 'bg-slate-950 border-white/5 text-slate-100' : 'bg-white border-slate-200 text-slate-800'"
    >
      <div class="flex items-center gap-3">
        <div class="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse"></div>
        <span class="font-display font-bold text-lg" :class="store.darkMode ? 'text-slate-100' : 'text-slate-800'">ESG e Tal CMS Portal</span>
        <span class="px-2.5 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981] text-[9px] font-black tracking-widest uppercase">CMS v3</span>
      </div>

      <!-- Live Sync badge info -->
      <div class="flex items-center gap-4">
        <!-- New Theme Switcher Button -->
        <button
          @click="store.toggleDark"
          class="px-4 py-2 rounded-full border text-xs font-bold font-sans transition-all flex items-center gap-2 cursor-pointer select-none"
          :class="store.darkMode 
            ? 'border-white/10 hover:border-amber-400 bg-white/5 text-amber-400 hover:text-amber-300' 
            : 'border-slate-200 hover:border-indigo-600 bg-slate-100/80 text-indigo-600 hover:text-indigo-700'"
        >
          <i class="fa-solid" :class="store.darkMode ? 'fa-sun' : 'fa-moon'"></i>
          <span class="hidden sm:inline">{{ store.darkMode ? 'Modo Claro' : 'Modo Escuro' }}</span>
        </button>

        <div class="hidden sm:flex items-center gap-2">
          <!-- Sync state dot indicator -->
          <span 
            class="w-1.5 h-1.5 rounded-full"
            :class="{
              'bg-[#10B981]': store.firebaseStatus.includes('Sincronizado') || store.isLoggedIn,
              'bg-amber-400': store.firebaseStatus.includes('Iniciando'),
              'bg-red-500': store.firebaseStatus.includes('Erro') || store.firebaseStatus.includes('não conectado')
            }"
          ></span>
          <span class="text-[10px] tracking-wide font-semibold uppercase" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">{{ store.firebaseStatus }}</span>
        </div>

        <router-link 
          to="/" 
          class="px-4 py-2 rounded-full border text-xs font-bold font-sans transition-all flex items-center gap-2"
          :class="store.darkMode 
            ? 'border-white/10 hover:border-[#10B981] bg-white/5 text-slate-100 hover:text-[#10B981]' 
            : 'border-slate-200 hover:border-[#10B981] bg-slate-100/50 text-slate-700 hover:text-[#10B981]'"
        >
          <i class="fa-solid fa-house text-[10px]"></i>
          <span>Voltar ao Portal</span>
        </router-link>
      </div>
    </header>

    <!-- ── AUTHENTICATION GATE ── -->
    <main v-if="!store.isLoggedIn" class="flex-1 p-6 flex flex-col items-center justify-center relative">
      <div 
        class="border rounded-3xl p-8 max-w-sm w-full shadow-2xl relative z-10 backdrop-blur-md transition-all duration-300"
        :class="store.darkMode 
          ? 'bg-slate-950/80 border-white/5 text-slate-100' 
          : 'bg-white border-slate-200/80 text-slate-850 shadow-xl'"
      >
        <div 
          class="w-12 h-12 rounded-2xl flex items-center justify-center text-xl mx-auto mb-6 transition-all duration-300"
          :class="store.darkMode 
            ? 'bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981]' 
            : 'bg-emerald-50 border border-emerald-100 text-emerald-600'"
        >
          <i class="fa-solid" :class="loginIcon"></i>
        </div>
        
        <h2 class="font-display font-bold text-center text-lg mb-2" :class="store.darkMode ? 'text-slate-100' : 'text-slate-900'">Painel de Administração</h2>
        <p class="text-xs text-center mb-6 font-medium" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Acesse com sua conta do Firebase Auth para gerenciar o site em tempo real.</p>
        
        <div class="space-y-4 mb-4">
          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider mb-1.5 pl-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">E-mail</label>
            <input 
              type="email" 
              v-model="loginEmail" 
              placeholder="admin@esgetal.com.br"
              class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all"
              :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>

          <div>
            <label class="block text-[10px] font-bold uppercase tracking-wider mb-1.5 pl-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Senha</label>
            <input 
              type="password" 
              v-model="loginPassword" 
              placeholder="••••••••"
              @keydown.enter="signIn"
              class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] transition-all"
              :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
            />
          </div>
        </div>

        <!-- Feedback Messages -->
        <p v-if="loginError" class="text-xs text-red-500 text-center min-h-[1.5em] mb-4 font-bold">{{ loginError }}</p>

        <button 
          @click="signIn"
          :disabled="isLoggingIn"
          class="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-xl py-3 text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border-none"
        >
          <span v-if="isLoggingIn" class="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
          <span v-else>Entrar</span>
        </button>

        <div class="mt-6 pt-6 border-t space-y-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-100'">
          <button 
            @click="bypassAuth" 
            class="w-full font-bold rounded-xl py-2 text-[11px] transition-all flex items-center justify-center gap-1.5 cursor-pointer border-none shadow-xs hover:scale-101 select-none"
            :class="store.darkMode ? 'bg-white/5 hover:bg-white/10 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'"
          >
            <i class="fa-solid fa-server"></i>
            <span>Avançar em Modo Offline</span>
          </button>

          <button 
            @click="showKeysModal = true" 
            class="w-full bg-transparent hover:text-[#10B981] text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer hover:underline border-none"
            :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'"
          >
            <i class="fa-solid fa-key text-[10px]"></i>
            <span>Configurar chaves Firebase</span>
          </button>
        </div>
      </div>
    </main>

    <!-- ── AUTHENTICATED CONTROL PANEL ── -->
    <main v-else class="flex-1 flex flex-col md:flex-row items-stretch min-h-0">
      
      <!-- Side Tab Controller Menu -->
      <nav 
        class="w-full md:w-[220px] p-4 flex flex-col justify-between overflow-y-auto shrink-0 space-y-4 md:space-y-0 border-r transition-all duration-300"
        :class="store.darkMode ? 'bg-slate-950 border-white/5' : 'bg-white border-slate-200 shadow-xs'"
      >
        <div class="space-y-1">
          <p class="text-[9px] font-extrabold uppercase tracking-wider px-3.5 mb-2.5" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Conteúdos</p>
          <button 
            v-for="tabItem in tabs" 
            :key="tabItem.id"
            @click="activeCmsTab = tabItem.id"
            class="flex items-center gap-2.5 w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wide cursor-pointer transition-all border-none"
            :class="activeCmsTab === tabItem.id 
              ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/25 font-bold shadow-xs' 
              : (store.darkMode ? 'text-slate-400 hover:bg-white/5 hover:text-slate-100' : 'text-slate-600 hover:bg-slate-150 hover:text-slate-900')"
          >
            <i :class="`fa-solid ${tabItem.icon} shrink-0`"></i>
            <span>{{ tabItem.name }}</span>
          </button>
        </div>

        <div class="pt-4 border-t space-y-1 text-xs" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
          <!-- Live User Credentials -->
          <div class="px-3.5 py-1.5 font-semibold truncate select-none text-[10px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'" :title="store.userEmail || 'Modo Offline'">
            <i class="fa-solid fa-circle-user mr-1.5"></i>
            <span>{{ store.userEmail || 'Sandbox-Offline' }}</span>
          </div>

          <button 
            @click="handleLogout"
            class="flex items-center gap-2 w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
            :class="store.darkMode 
              ? 'text-red-400/80 hover:bg-red-500/5 hover:text-red-400' 
              : 'text-red-600 hover:bg-red-55/60 hover:text-red-700'"
          >
            <i class="fa-solid fa-right-from-bracket shrink-0"></i>
            <span>Encerrar Sessão</span>
          </button>
        </div>
      </nav>

      <!-- Center content modules area -->
      <section 
        class="flex-grow flex flex-col min-h-0 transition-colors duration-300"
        :class="store.darkMode ? 'bg-slate-900' : 'bg-slate-50/50'"
      >
        
        <!-- Tab Headline Title bar -->
        <div 
          class="py-4 px-6 md:px-10 border-b flex items-center justify-between shrink-0 transition-colors duration-300"
          :class="store.darkMode ? 'bg-slate-950/40 border-white/5' : 'bg-white border-slate-200/80'"
        >
          <div>
            <h3 class="font-display text-lg font-bold leading-snug" :class="store.darkMode ? 'text-slate-100' : 'text-slate-800'">
              {{ currentTabMetadata.name }}
            </h3>
            <p class="text-[10px] font-semibold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
              {{ currentTabMetadata.desc }}
            </p>
          </div>

          <!-- Language Segment toggle inside CMS -->
          <div class="flex border border-white/10 rounded-lg p-0.5 overflow-hidden scale-95 shrink-0" :class="store.darkMode ? 'bg-slate-950 border-white/10' : 'bg-slate-100 border-slate-200'">
            <button 
              @click="editLang = 'pt'"
              class="px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none"
              :class="editLang === 'pt' ? 'bg-[#10B981] text-white font-bold' : (store.darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800')"
            >
              PT
            </button>
            <button 
              @click="editLang = 'en'"
              class="px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer border-none"
              :class="editLang === 'en' ? 'bg-[#10B981] text-white font-bold' : (store.darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-800')"
            >
              EN
            </button>
          </div>
        </div>

        <!-- Scrollable edit form grid container -->
        <div class="flex-grow overflow-y-auto p-6 md:p-10 space-y-8">
          
          <!-- ─── TAB 1: NOTÍCIAS (Dynamic Unified Management) ─── -->
          <div v-if="activeCmsTab === 'news'" class="space-y-6">
            <AdminNewsTab :editLang="editLang" :openAdvEditor="openAdvEditor" />
          </div>

          <!-- ─── TAB 2: PESQUISA (Research Unified Management) ─── -->
          <div v-else-if="activeCmsTab === 'research'" class="space-y-6">
            <AdminResearchTab :editLang="editLang" :openAdvEditor="openAdvEditor" />
          </div>

          <!-- OLD RESEARCH TAB COIL (DEPRECATED) -->
          <div v-else-if="false" class="space-y-6">
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
                    class="px-2.5 py-1 text-[10px] font-bold bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#a78bfa] rounded-md transition-all cursor-pointer"
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
                    Nenhum artigo encontrado
                  </div>
                </div>

                <!-- Custom Pager -->
                <div v-if="totalResearchPages > 1" class="flex items-center justify-between border-t pt-3 text-[10px] font-semibold select-none" :class="store.darkMode ? 'border-white/5 text-slate-400' : 'border-slate-150 text-slate-500'">
                  <button 
                    :disabled="currentResearchPage === 1" 
                    @click="currentResearchPage--" 
                    class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
                    :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#8B5CF6]/15 hover:text-white hover:border-[#8B5CF6]/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-[#8B5CF6]/10  hover:text-[#8B5CF6]'"
                  >
                    Anterior
                  </button>
                  <span>Página {{ currentResearchPage }} / {{ totalResearchPages }}</span>
                  <button 
                    :disabled="currentResearchPage === totalResearchPages" 
                    @click="currentResearchPage++" 
                    class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
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
                  <span>Ambiente de Edição — {{ selectedResId === 'new_res' || !selectedResId ? 'Novo Artigo' : `Artigo ID: ${activeResearchItem.id}` }}</span>
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

                <!-- Authors Credential labels PT & EN -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Autor PT</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.authorPt" 
                      placeholder="Afiliações autorais" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Autor EN</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.authorEn" 
                      placeholder="Academic author in English" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                </div>

                <!-- Core Body text summaries PT & EN -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Resumo PT (Parágrafo 1)</label>
                      <button type="button" @click="openAdvEditor('Estudo: Resumo PT', activeResearchItem.bodyPt, (val) => { activeResearchItem.bodyPt = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                        <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                      </button>
                    </div>
                    <textarea 
                      v-model="activeResearchItem.bodyPt" 
                      placeholder="Resumo principal ou apresentação" 
                      rows="6" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[140px]" 
                      :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
                    ></textarea>
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Resumo EN (Parágrafo 1)</label>
                      <button type="button" @click="openAdvEditor('Estudo: Resumo EN', activeResearchItem.bodyEn, (val) => { activeResearchItem.bodyEn = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                        <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                      </button>
                    </div>
                    <textarea 
                      v-model="activeResearchItem.bodyEn" 
                      placeholder="Primary academic synopsis in English" 
                      rows="6" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[140px]" 
                      :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
                    ></textarea>
                  </div>
                </div>

                <!-- Secondary complementary text segments Body2 -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo Estendido §2 PT (Opcional)</label>
                      <button type="button" @click="openAdvEditor('Estudo: Corpo Estendido PT', activeResearchItem.body2Pt, (val) => { activeResearchItem.body2Pt = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                        <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                      </button>
                    </div>
                    <textarea 
                      v-model="activeResearchItem.body2Pt" 
                      placeholder="Parágrafo estendido adicional do artigo" 
                      rows="5" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[110px]" 
                      :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
                    ></textarea>
                  </div>
                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo Estendido §2 EN (Opcional)</label>
                      <button type="button" @click="openAdvEditor('Estudo: Corpo Estendido EN', activeResearchItem.body2En, (val) => { activeResearchItem.body2En = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                        <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                      </button>
                    </div>
                    <textarea 
                      v-model="activeResearchItem.body2En" 
                      placeholder="Alternative advanced block in English" 
                      rows="5" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all min-h-[110px]" 
                      :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
                    ></textarea>
                  </div>
                </div>

                <!-- Capa & CTA links -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL Imagem Capa (Opcional)</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.imgUrl" 
                      placeholder="Ex: /assets/research_featured.jpg" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">URL do Artigo / Download (PDF, Forms)</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.ctaUrl" 
                      placeholder="Ex: https://docs.google.com/forms/..." 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                </div>

                <!-- Link buttons customization -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto do Botão PT</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.ctaTextPt" 
                      placeholder="Ex: Clique aqui e acesse o artigo completo" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto do Botão EN</label>
                    <input 
                      type="text" 
                      v-model="activeResearchItem.ctaTextEn" 
                      placeholder="Ex: Click here to access the full article" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#8B5CF6] transition-all" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                </div>

                <!-- Checkboxes Options -->
                <div class="border p-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center rounded-xl" :class="store.darkMode ? 'bg-white/5 border-white/5 text-slate-200' : 'bg-slate-50 border-slate-150 text-slate-800'">
                  <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                    <input type="checkbox" v-model="activeResearchItem.isFeatured" class="w-4 h-4 rounded-md border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span>Estudo em Destaque</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-xs cursor-pointer select-none">
                    <input type="checkbox" v-model="activeResearchItem.visible" class="w-4 h-4 rounded-md border-white/20 bg-slate-900 text-[#8B5CF6] focus:ring-[#8B5CF6]" />
                    <span>Visível</span>
                  </label>
                </div>

                <!-- Custom Badge and Customizable Extra Fields Section for Research -->
                <div class="border-t border-white/5 pt-4 space-y-4">
                  <h5 class="text-[11px] font-black uppercase tracking-wider text-[#8B5CF6] flex items-center gap-1.5 mb-2 font-bold">
                    <i class="fa-solid fa-tags"></i>
                    <span>Tag / Badge Customizado & Campos Extras</span>
                  </h5>

                  <div class="p-4 rounded-xl space-y-4" :class="store.darkMode ? 'bg-white/5 border border-white/5' : 'bg-slate-50 border border-slate-200 shadow-xs text-slate-800'">
                    <!-- Badge Row -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                      <div class="md:col-span-5">
                        <label class="block text-[9px] font-black uppercase mb-1 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo do Badge (PT)</label>
                        <input 
                          type="text" 
                          v-model="activeResearchItem.customBadgeTextPt" 
                          placeholder="Ex: PDF, Infográfico, etc." 
                          class="w-full py-2 px-3 rounded-lg text-xs outline-none focus:border-[#8B5CF6]" 
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        />
                      </div>
                      <div class="md:col-span-4">
                        <label class="block text-[9px] font-black uppercase mb-1 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rótulo do Badge (EN)</label>
                        <input 
                          type="text" 
                          v-model="activeResearchItem.customBadgeTextEn" 
                          placeholder="Ex: PDF, Infographic, etc." 
                          class="w-full py-2 px-3 rounded-lg text-xs outline-none focus:border-[#8B5CF6]" 
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        />
                      </div>
                      <div class="md:col-span-3">
                        <label class="block text-[9px] font-black uppercase mb-1 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Cor do Badge</label>
                        <select 
                          v-model="activeResearchItem.customBadgeColor" 
                          class="w-full py-2 px-3 rounded-lg text-xs outline-none focus:border-[#8B5CF6] cursor-pointer"
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        >
                          <option value="violet">Violet (Roxo)</option>
                          <option value="emerald">Emerald (Verde)</option>
                          <option value="amber">Amber (Amarelo)</option>
                          <option value="indigo">Indigo (Índigo)</option>
                          <option value="sky">Sky (Ciano)</option>
                          <option value="rose">Rose (Rosa)</option>
                          <option value="blue">Blue (Azul)</option>
                        </select>
                      </div>
                    </div>

                    <!-- Customizable Dynamic Extra Fields Lists -->
                    <div class="space-y-3">
                      <div class="flex items-center justify-between border-t pt-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-200'">
                        <span class="text-[9px] font-black uppercase font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Campos Extras Adicionais ({{ activeResearchItem.customFields ? activeResearchItem.customFields.length : 0 }})</span>
                        <button 
                          @click="addResearchCustomField"
                          type="button"
                          class="px-2 py-1 text-[9px] font-extrabold bg-[#8B5CF6]/15 hover:bg-[#8B5CF6]/25 text-[#7D3AED] rounded transition-all cursor-pointer border-none"
                        >
                          <i class="fa-solid fa-plus-circle mr-1"></i> Adicionar Campo
                        </button>
                      </div>

                      <div v-if="!activeResearchItem.customFields || activeResearchItem.customFields.length === 0" class="text-center text-[11px] text-slate-500 py-2">
                        Nenhum campo personalizado adicionado. Estes campos aparecem como metadados adicionais na base do card.
                      </div>

                      <div v-else class="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                        <div 
                          v-for="(field, fIdx) in activeResearchItem.customFields" 
                          :key="fIdx"
                          class="p-3 border rounded-lg space-y-3 relative"
                          :class="store.darkMode ? 'bg-slate-950/80 border-white/5' : 'bg-white border-slate-200 shadow-xs'"
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
                              <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título do Campo PT</label>
                              <input 
                                type="text" 
                                v-model="field.label.pt" 
                                placeholder="Ex: Páginas, Autor" 
                                class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-[#8B5CF6]" 
                                :class="store.darkMode ? 'bg-slate-900 border border-white/5 text-white' : 'bg-slate-100 border border-slate-200 text-slate-800'"
                              />
                            </div>
                            <div>
                              <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título do Campo EN</label>
                              <input 
                                type="text" 
                                v-model="field.label.en" 
                                placeholder="Ex: Pages, Author" 
                                class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-[#8B5CF6]" 
                                :class="store.darkMode ? 'bg-slate-900 border border-white/5 text-white' : 'bg-slate-100 border border-slate-200 text-slate-800'"
                              />
                            </div>
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Valor do Campo PT</label>
                              <input 
                                type="text" 
                                v-model="field.value.pt" 
                                placeholder="Ex: 48 páginas" 
                                class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-[#8B5CF6]" 
                                :class="store.darkMode ? 'bg-slate-900 border border-white/5 text-white' : 'bg-slate-100 border border-slate-200 text-slate-800'"
                              />
                            </div>
                            <div>
                              <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Valor do Campo EN</label>
                              <input 
                                type="text" 
                                v-model="field.value.en" 
                                placeholder="Ex: 48 pages" 
                                class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-[#8B5CF6]" 
                                :class="store.darkMode ? 'bg-slate-900 border border-white/5 text-white' : 'bg-slate-100 border border-slate-200 text-slate-800'"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Option to notify subscribers via newsletter -->
                <div class="bg-violet-500/10 border border-violet-500/15 rounded-xl p-4 flex items-center justify-between gap-3 mb-4">
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

                <!-- Action row -->
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

          </div> <!-- grid ends -->
          </div> <!-- tab ends -->

          <!-- ─── TAB: NAVBAR MENU MANAGER ─── -->
          <div v-else-if="activeCmsTab === 'navbar'" class="space-y-6">
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
                <div class="space-y-2 max-h-[500px] overflow-y-auto scrollbar-thin">
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
                        <h5 class="font-bold text-xs leading-none mb-1">{{ navItem.label.pt }} <span :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'" class="font-normal text-[10px]">| {{ navItem.label.en }}</span></h5>
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
                    class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
                    :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-indigo-500/15 hover:text-white hover:border-indigo-500/10' : 'bg-white border-slate-200 text-slate-600 hover:bg-indigo-500/10 hover:text-indigo-500'"
                  >
                    Anterior
                  </button>
                  <span>Página {{ currentNavbarPage }} / {{ totalNavbarPages }}</span>
                  <button 
                    :disabled="currentNavbarPage === totalNavbarPages" 
                    @click="currentNavbarPage++" 
                    class="px-3 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all"
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
                      class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 disabled:opacity-50 transition-all"
                      :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
                    />
                  </div>
                  <div>
                    <label class="block text-[9px] font-black uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Ordem (Ex: 10, 20...)</label>
                    <input 
                      type="number" 
                      v-model.number="navForm.order" 
                      placeholder="ex: 70" 
                      class="w-full p-2.5 rounded-xl text-xs outline-none focus:border-indigo-500 transition-all font-semibold"
                      :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-slate-50 border border-slate-200 text-slate-800'"
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

                    <div class="grid grid-cols-2 gap-3">
                      <div>
                        <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Descrição (PT)</label>
                        <textarea 
                          v-model="navForm.sectionBodyPt" 
                          rows="2" 
                          placeholder="Descreva os objetivos desta seção..." 
                          class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500 resize-none"
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        ></textarea>
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Texto de Descrição (EN)</label>
                        <textarea 
                          v-model="navForm.sectionBodyEn" 
                          rows="2" 
                          placeholder="Describe the goals of this section..." 
                          class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500 resize-none"
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
                          class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500" 
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
                          class="w-full py-1.5 px-2 rounded text-xs outline-none focus:border-indigo-500 font-mono" 
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
                      class="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <i class="fa-solid fa-trash"></i> Excluir
                    </button>
                  </div>
                  
                  <button 
                    @click="resetNavbarItemForm" 
                    class="px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer border-none"
                    :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-650'"
                  >
                    Limpar / Novo
                  </button>
                </div>
              </div>

            </div> <!-- Grid ends -->
          </div> <!-- tab ends -->

          <!-- ─── TAB 3: ÁREAS (Departments editing) ─── -->
          <div v-else-if="activeCmsTab === 'areas'" class="space-y-6">
            <!-- Polished Help Callout Box -->
            <div class="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
              <i class="fa-solid fa-circle-info text-[#10B981] mt-0.5 text-sm shrink-0"></i>
              <div>
                <strong class="text-[#10B981] font-bold block mb-1">Central de Áreas de Atuação</strong>
                <p class="leading-relaxed text-slate-305" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">
                  Gerencie as quatro divisões temáticas de impacto ESG (Meio Ambiente, Responsabilidade Social, Governança e Comunicação Estratégica).
                </p>
              </div>
            </div>

            <!-- Select target area to edit parameters -->
            <div 
              class="flex flex-wrap gap-2 mb-4 p-2 border rounded-2xl transition-all"
              :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-slate-100 border-slate-200 text-slate-800'"
            >
              <button 
                v-for="area in store.areas" 
                :key="area.key"
                @click="selectedAreaCmsKey = area.key"
                class="px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none"
                :class="selectedAreaCmsKey === area.key 
                  ? (store.darkMode ? 'bg-white/10 text-[#10B981] border border-[#10B981]/25' : 'bg-white text-[#10B981] border border-slate-200 shadow-xs') 
                  : 'text-slate-400 hover:text-slate-600'"
              >
                {{ area.name }}
              </button>
            </div>

            <div v-if="activeAreaNode" class="space-y-6">
              <!-- Basic fields overrides -->
              <div 
                class="border p-6 rounded-2xl space-y-4 transition-colors"
                :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
              >
                <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Identidade e Atributos de Entrada</h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Nome</label>
                    <input 
                      type="text" 
                      v-model="activeAreaNode.name" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981] font-bold" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Cor Hexadecimal Principal</label>
                    <input 
                      type="text" 
                      v-model="activeAreaNode.color" 
                      placeholder="Ex: #10B981" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981] font-semibold" 
                      :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                </div>

                <!-- Custom FontAwesome Icon Picker -->
                <div class="border-t border-white/5 pt-4">
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-2 pl-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
                    Ícone Selecionado: 
                    <span class="text-[#10B981] font-bold">
                      <i class="fa-solid" :class="activeAreaNode.icon || 'fa-question'"></i> {{ activeAreaNode.icon || '(Nenhum)' }}
                    </span>
                  </label>
                  <div 
                    class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl border transition-all duration-300"
                    :class="store.darkMode ? 'bg-slate-950/40 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  >
                    <div>
                      <label class="block text-[9px] font-bold uppercase mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Classe de Ícone FontAwesome</label>
                      <input 
                        type="text" 
                        v-model="activeAreaNode.icon" 
                        placeholder="Ex: fa-leaf" 
                        class="w-full py-2 px-3 rounded-lg outline-none text-xs font-medium focus:border-[#10B981] transition-all"
                        :class="store.darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'"
                      />
                      
                      <p class="text-[9px] mt-2 leading-relaxed" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
                        Insira a classe de iconografia personalizada diretamente ou clique em qualquer opção do seletor intuitivo ao lado.
                      </p>
                    </div>
                    
                    <!-- Searchable & Categorized Icon Grid Picker -->
                    <div class="flex flex-col h-[180px] min-h-0">
                      <div class="flex gap-2 mb-2 items-center shrink-0">
                        <input 
                          type="search" 
                          v-model="searchAreaIcon" 
                          placeholder="Pesquisar ícones..." 
                          class="flex-1 py-1 px-2.5 rounded text-[10px] outline-none focus:border-[#10B981] transition-all"
                          :class="store.darkMode ? 'bg-slate-900 border-white/5 text-white placeholder-slate-500' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'"
                        />
                      </div>
                      <div class="flex gap-1 overflow-x-auto pb-1 mb-2 shrink-0 scrollbar-none border-b" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                        <button 
                          v-for="cat in iconCategories" 
                          :key="cat"
                          @click="catAreaFilter = cat"
                          type="button"
                          class="px-2 py-0.5 rounded text-[8px] font-bold uppercase transition-all whitespace-nowrap cursor-pointer border-none"
                          :class="catAreaFilter === cat ? 'bg-[#10B981] text-white font-black' : (store.darkMode ? 'bg-slate-900 text-slate-400 hover:text-white' : 'bg-slate-200/80 text-slate-600 hover:text-slate-900')"
                        >
                          {{ cat }}
                        </button>
                      </div>
                      <div 
                        class="flex-grow overflow-y-auto grid grid-cols-4 gap-1 p-2 rounded-lg border scrollbar-thin transition-colors min-h-0"
                        :class="store.darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-white border-slate-150'"
                      >
                        <button 
                          v-for="item in filteredAreaIcons" 
                          :key="item.icon" 
                          @click="activeAreaNode.icon = item.icon" 
                          type="button"
                          class="p-1 px-2 rounded transition-all flex flex-col items-center justify-center gap-1 text-[10px] cursor-pointer border-none"
                          :class="store.darkMode 
                            ? 'hover:bg-white/10 text-slate-300 hover:text-[#10B981]' 
                            : 'hover:bg-slate-100 text-slate-600 hover:text-[#10B981]'"
                          :title="item.name"
                        >
                          <i class="fa-solid text-sm" :class="item.icon"></i>
                          <span class="text-[8px] text-center truncate w-full select-none scale-90" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">{{ item.name }}</span>
                        </button>
                        <div v-if="filteredAreaIcons.length === 0" class="col-span-4 text-center py-4 text-[10px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
                          Nenhum ícone encontrado
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <!-- Managed placeholder to match layout -->
                  </div>
                  <div>
                    <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Imagem Thumbnail URL</label>
                    <input 
                      type="text" 
                      v-model="activeAreaNode.img" 
                      class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981]" 
                      :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>
                </div>

                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Descrição</label>
                    <button type="button" @click="openAdvEditor('Área: Descrição Geral', activeAreaNode.desc, (val) => { activeAreaNode.desc = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                      <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                    </button>
                  </div>
                  <textarea 
                    v-model="activeAreaNode.desc" 
                    rows="6" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] resize-none"
                    :class="store.darkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  ></textarea>
                </div>

                <div class="pt-2 flex gap-3">
                  <button @click="saveAreaBasicNode" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                    Salvar Campos Gerais
                  </button>
                </div>
              </div>

              <!-- Testimonial portion -->
              <div 
                class="border p-6 rounded-2xl space-y-4 transition-colors"
                :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
              >
                <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Depoimento de Parceria</h4>
                
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label class="block text-[10px] font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Citação</label>
                    <button type="button" @click="openAdvEditor('Área: Citação do Depoimento', activeAreaNode.testimonial, (val) => { activeAreaNode.testimonial = val })" class="text-[9px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                      <i class="fa-solid fa-expand text-[8px]"></i> Ampliar e Editar ✨
                    </button>
                  </div>
                  <textarea 
                    v-model="activeAreaNode.testimonial" 
                    rows="5" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981] resize-none"
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Autor do depoimento</label>
                  <input 
                    type="text" 
                    v-model="activeAreaNode.testimonialAuthor" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>

                <div class="pt-2 flex gap-3">
                  <button @click="saveAreaTestimonial" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer">
                    Salvar Depoimento
                  </button>
                  <button @click="resetAreaNode" class="px-5 py-2.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                    Resetar Todos os overrides desta área
                  </button>
                </div>
              </div>

              <!-- ─── SUBTOPICS & CHILD ITEMS EDITOR ─── -->
              <div 
                class="border p-6 rounded-2xl space-y-6 transition-colors"
                :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
              >
                <div class="flex items-center justify-between border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                  <div>
                    <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider flex items-center gap-1.5">
                      <i class="fa-solid fa-folder-tree"></i>
                      <span>Subprojetos & Itens Filhos ({{ activeAreaNode.subtopics ? activeAreaNode.subtopics.length : 0 }})</span>
                    </h4>
                    <p class="text-[10px] mt-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Gerencie os subprojetos e pontos de metas que aparecem detalhados no modal (idioma: {{ editLang.toUpperCase() }}).</p>
                  </div>
                  <button 
                    @click="addAreaSubtopic"
                    class="px-3 py-1.5 text-xs font-bold bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] rounded-xl transition-all cursor-pointer border-none flex items-center gap-1"
                  >
                    <i class="fa-solid fa-plus"></i> Novo Subprojeto
                  </button>
                </div>

                <!-- Live Subprojects Loop -->
                <div v-if="!activeAreaNode.subtopics || activeAreaNode.subtopics.length === 0" class="text-center text-xs py-6" :class="store.darkMode ? 'text-slate-500' : 'text-slate-450'">
                  Nenhum subprojeto cadastrado para esta área. Adicione novos elementos acima.
                </div>

                <div v-else class="space-y-6">
                   <div 
                    v-for="(sub, sIdx) in activeAreaNode.subtopics" 
                    :key="sIdx"
                    class="p-5 border rounded-2xl space-y-4 relative transition-colors"
                    :class="store.darkMode ? 'bg-white/5 border-white/5 hover:border-white/10' : 'bg-slate-50 border-slate-150 hover:bg-slate-100'"
                  >
                    <!-- Controls Header -->
                    <div class="flex items-center justify-between border-b pb-3" :class="store.darkMode ? 'border-white/5' : 'border-slate-200'">
                      <span class="text-[10px] font-black uppercase text-[#10B981] tracking-wider font-bold">Subprojeto / Serviço #{{ sIdx + 1 }}</span>
                      
                      <div class="flex items-center gap-1.5">
                        <button 
                          @click="moveAreaSubtopic(sIdx, 'up')"
                          :disabled="sIdx === 0"
                          type="button"
                          class="p-1.5 text-[10px] disabled:opacity-30 rounded cursor-pointer border-none transition-colors"
                          :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-355' : 'bg-white border border-slate-250 text-slate-600 hover:bg-slate-200'"
                          title="Mover para cima"
                        >
                          <i class="fa-solid fa-angle-up"></i>
                        </button>
                        <button 
                          @click="moveAreaSubtopic(sIdx, 'down')"
                          :disabled="sIdx === activeAreaNode.subtopics.length - 1"
                          type="button"
                          class="p-1.5 text-[10px] disabled:opacity-30 rounded cursor-pointer border-none transition-colors"
                          :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-355' : 'bg-white border border-slate-250 text-slate-600 hover:bg-slate-200'"
                          title="Mover para baixo"
                        >
                          <i class="fa-solid fa-angle-down"></i>
                        </button>
                        <button 
                          @click="deleteAreaSubtopic(sIdx)"
                          type="button"
                          class="p-1.5 text-[10px] bg-red-500/15 hover:bg-red-500/25 text-red-500 rounded cursor-pointer border-none"
                          title="Excluir subprojeto"
                        >
                          <i class="fa-solid fa-trash-can"></i>
                        </button>
                      </div>
                    </div>

                    <!-- Layout inputs -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label class="block text-[9px] font-bold uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Título do Subprojeto</label>
                        <input 
                          type="text" 
                          v-model="sub.title" 
                          placeholder="Ex: Gestão de Resíduos & Economia Circular"
                          class="w-full py-2 px-3 rounded-xl text-xs outline-none focus:border-[#10B981] font-semibold transition-all"
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        />
                      </div>
                      <div>
                        <label class="block text-[9px] font-bold uppercase mb-1.5 font-bold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Imagem de Capa (URL)</label>
                        <input 
                          type="text" 
                          v-model="sub.img" 
                          placeholder="Ex: /assets/env_sub1.jpg (ou vazio para padrão)"
                          class="w-full py-2 px-3 rounded-xl text-xs outline-none focus:border-[#10B981] font-mono transition-all"
                          :class="store.darkMode ? 'bg-slate-900 border border-white/10 text-white' : 'bg-white border border-slate-200 text-slate-800'"
                        />
                      </div>
                    </div>

                    <!-- Bullet items lists -->
                    <div class="space-y-3 p-4 rounded-xl border transition-colors" :class="store.darkMode ? 'bg-slate-900/40 border-white/5' : 'bg-white border-slate-200 shadow-xs'">
                      <div class="flex items-center justify-between border-b pb-2" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                        <span class="text-[9px] font-black uppercase font-bold" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">Pontos / Itens Filhos ({{ sub.items ? sub.items.length : 0 }})</span>
                        <button 
                          @click="addSubtopicBullet(sIdx)"
                          type="button"
                          class="px-2 py-0.5 text-[9px] font-extrabold bg-[#10B981]/15 hover:bg-[#10B981]/25 text-[#10B981] rounded transition-all cursor-pointer border-none"
                        >
                          <i class="fa-solid fa-plus mr-0.5"></i> Add Ponto
                        </button>
                      </div>

                      <div v-if="!sub.items || sub.items.length === 0" class="text-center text-[10px] text-slate-500 py-2">
                        Nenhum item filho adicionado.
                      </div>

                      <div v-else class="space-y-2">
                        <div 
                          v-for="(bullet, bIdx) in sub.items" 
                          :key="bIdx"
                          class="flex items-center gap-2"
                        >
                          <div class="shrink-0 text-[10px] text-slate-500 font-mono w-4 text-center">
                            •
                          </div>
                          
                          <input 
                            type="text" 
                            v-model="sub.items[bIdx]" 
                            placeholder="Descreva o ponto de ação"
                            class="flex-1 py-1.5 px-2.5 rounded-lg text-xs outline-none focus:border-[#10B981] transition-colors"
                            :class="store.darkMode ? 'bg-slate-950 border border-white/5 text-slate-200' : 'bg-slate-100 border border-slate-200 text-slate-800'"
                          />

                          <div class="flex items-center gap-1 select-none">
                            <button 
                              @click="moveSubtopicBullet(sIdx, bIdx, 'up')"
                              :disabled="bIdx === 0"
                              type="button"
                              class="p-1 text-[9px] disabled:opacity-30 rounded cursor-pointer border-none"
                              :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'"
                              title="Subir ponto"
                            >
                              <i class="fa-solid fa-angle-up"></i>
                            </button>
                            <button 
                              @click="moveSubtopicBullet(sIdx, bIdx, 'down')"
                              :disabled="bIdx === sub.items.length - 1"
                              type="button"
                              class="p-1 text-[9px] disabled:opacity-30 rounded cursor-pointer border-none"
                              :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-600'"
                              title="Descer ponto"
                            >
                              <i class="fa-solid fa-angle-down"></i>
                            </button>
                            <button 
                              @click="deleteSubtopicBullet(sIdx, bIdx)"
                              type="button"
                              class="p-1 text-[9px] bg-red-400/10 hover:bg-red-400/20 text-red-400 rounded cursor-pointer border-none"
                              title="Remover ponto"
                            >
                              <i class="fa-solid fa-xmark"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="pt-2 flex gap-3">
                  <button @click="saveAreaSubtopics" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none flex items-center gap-1.5">
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Salvar Subprojetos e Itens Filhos</span>
                  </button>
                </div>
              </div>

            </div>
          </div>

          <!-- ─── TAB 4: TEXTOS (Global copy overrides) ─── -->
          <div v-else-if="activeCmsTab === 'copy'" class="space-y-6">
            <!-- Polished Help Callout Box -->
            <div class="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
              <i class="fa-solid fa-circle-info text-[#10B981] mt-0.5 text-sm shrink-0"></i>
              <div>
                <strong class="text-[#10B981] font-bold block mb-1">Central de Textos & Traduções Globais</strong>
                <p class="leading-relaxed text-slate-300">
                  Faça customizações finas sobre os títulos do Banner Hero, menus de navegação do cabeçalho e rodapé. Utilize o <span class="bg-slate-950 px-1.5 py-0.5 rounded border border-white/10 font-bold text-white text-[10px]">seletor de idioma (PT/EN)</span> no topo direito da tela para editar as duas versões lingüísticas perfeitamente.
                </p>
              </div>
            </div>

            <!-- Hero copy fields -->
            <div 
              class="border p-6 rounded-2xl space-y-4 transition-colors"
              :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
            >
              <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Textos e Mensagens do Banner Hero</h4>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Tag 1</label>
                  <input 
                    type="text" 
                    v-model="copyForm.heroTag1" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Tag 2</label>
                  <input 
                    type="text" 
                    v-model="copyForm.heroTag2" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Tag 3</label>
                  <input 
                    type="text" 
                    v-model="copyForm.heroTag3" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
              </div>

              <div>
                <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Subtítulo</label>
                <textarea 
                  v-model="copyForm.heroSubtitle" 
                  rows="2" 
                  class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981] resize-none" 
                  :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                ></textarea>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Botão Principal</label>
                  <input 
                    type="text" 
                    v-model="copyForm.heroCta" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Botão Secundário</label>
                  <input 
                    type="text" 
                    v-model="copyForm.heroCtaSub" 
                    class="w-full py-2.5 px-4 rounded-xl text-xs font-medium outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
              </div>

              <div class="pt-2 flex gap-3">
                <button @click="saveHeroCopy" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                  Salvar Textos Hero
                </button>
                <button @click="resetHeroCopy" class="px-5 py-2.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                  Zerar e Resetar Hero
                </button>
              </div>
            </div>

            <!-- Nav and Headers label overrides -->
            <div 
              class="border p-6 rounded-2xl space-y-4 transition-colors"
              :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
            >
              <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Legendas dos Menus de Navegação</h4>
              
              <div class="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Inicial</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navHome" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Notícias</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navNews" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Quem Somos</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navAbout" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Áreas</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navAreas" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Pesquisas</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navResearch" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
                <div>
                  <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Contatos</label>
                  <input 
                    type="text" 
                    v-model="copyForm.navContact" 
                    class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981]" 
                    :class="store.darkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                  />
                </div>
              </div>

              <div class="pt-2 flex gap-3">
                <button @click="saveNavCopy" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                  Salvar Legendas Nav
                </button>
              </div>
            </div>
          </div>

          <!-- ─── TAB 5: ESTATÍSTICAS (Hero Stats blocks) ─── -->
          <div v-else-if="activeCmsTab === 'stats'" class="space-y-6">
            <!-- Polished Help Callout Box -->
            <div class="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
              <i class="fa-solid fa-circle-info text-[#10B981] mt-0.5 text-sm shrink-0"></i>
              <div>
                <strong class="text-[#10B981] font-bold block mb-1">Central de Estatísticas & Métricas Hero</strong>
                <p class="leading-relaxed text-slate-300">
                  Ajuste os quatro blocos numéricos do topo do site (seção Hero). Forneça o valor metrificado principal (Ex: 100%, 15+, GRI) e as respectivas legendas explicativas traduzidas em Português (PT) e Inglês (EN) para alimentar o banner de entrada.
                </p>
              </div>
            </div>

            <!-- Edit the 4 stats cards dynamically -->
            <div 
              class="border p-6 rounded-2xl space-y-6 transition-colors"
              :class="store.darkMode ? 'bg-slate-950/60 border-white/5' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
            >
              <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Modificar as 4 Estatísticas do Visual Hero Banner</h4>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch pt-2">
                <div 
                  v-for="(statistic, idx) in statList" 
                  :key="idx" 
                  class="border rounded-2xl p-5 space-y-4"
                  :class="store.darkMode ? 'bg-slate-900 border-white/5' : 'bg-slate-50 border-slate-150 text-slate-800'"
                >
                  <div class="flex items-center justify-between border-b pb-2" :class="store.darkMode ? 'border-white/5' : 'border-slate-200'">
                    <span class="text-[10px] font-black uppercase text-[#10B981] tracking-widest font-bold">Métrica #{{ idx + 1 }}</span>
                    <!-- Real visual indicator preview -->
                    <span 
                      class="text-xs font-bold px-2 py-0.5 rounded leading-none"
                      :class="store.darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-650 bg-slate-200'"
                    >{{ statistic.value }}</span>
                  </div>

                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Valor Metrificado (Ex: 60h+, GRI)</label>
                      <input 
                        type="text" 
                        v-model="statistic.value" 
                        class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                        :class="store.darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'"
                      />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rotulagem / Label (PT)</label>
                      <input 
                        type="text" 
                        v-model="statistic.label_pt" 
                        class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                        :class="store.darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'"
                      />
                    </div>
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Rotulagem / Label (EN)</label>
                      <input 
                        type="text" 
                        v-model="statistic.label_en" 
                        class="w-full py-2 px-3 rounded-lg text-xs font-semibold outline-none focus:border-[#10B981] transition-all" 
                        :class="store.darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="pt-4 flex gap-3 border-t font-semibold" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                <button @click="saveStatsNode" class="px-5 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                  Aplicar Modificações
                </button>
                <button @click="resetStatsNode" class="px-5 py-2.5 bg-red-400/10 hover:bg-red-400/20 text-red-400 text-xs font-bold rounded-lg transition-all cursor-pointer border-none">
                  Zerar e Restaurar Padrões
                </button>
              </div>
            </div>
          </div>

          <!-- ─── TAB: NEWSLETTER & CRM ─── -->
          <div v-else-if="activeCmsTab === 'newsletter'" class="space-y-6">
            <!-- Dynamic Light / Dark Mode Toggle card inside CRM widget -->
            <div 
              class="flex flex-col sm:flex-row items-center justify-between p-5 rounded-2xl border transition-all duration-300 gap-4"
              :class="store.darkMode 
                ? 'bg-slate-950/60 border-white/5' 
                : 'bg-white border-slate-200/80 shadow-xs text-slate-800'"
            >
              <div class="flex items-center gap-3 w-full sm:w-auto">
                <div 
                  class="w-10 h-10 rounded-xl flex items-center justify-center text-sm shrink-0"
                  :class="store.darkMode ? 'bg-amber-400/10 text-amber-400' : 'bg-indigo-50 text-indigo-600'"
                >
                  <i :class="store.darkMode ? 'fa-solid fa-moon text-base' : 'fa-solid fa-sun text-base'"></i>
                </div>
                <div>
                  <h4 class="text-xs font-black uppercase tracking-wider" :class="store.darkMode ? 'text-slate-100' : 'text-slate-800'">
                    Aparência do CRM & Portal ESG e Tal
                  </h4>
                  <p class="text-[10px] leading-relaxed mt-0.5" :class="store.darkMode ? 'text-slate-400 font-semibold' : 'text-slate-500 font-semibold'">
                    Alterne instantaneamente o visual do portal e deste dashboard entre Claro e Escuro.
                  </p>
                </div>
              </div>

              <!-- Toggle Switch Button -->
              <button 
                @click="store.toggleDark"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs select-none hover:scale-102"
                :class="store.darkMode 
                  ? 'bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/10' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/10'"
              >
                <i :class="store.darkMode ? 'fa-solid fa-sun text-[11px]' : 'fa-solid fa-moon text-[11px]'"></i>
                <span>{{ store.darkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro' }}</span>
              </button>
            </div>

            <!-- Help banner / Callout -->
            <div 
              class="border rounded-2xl p-4 flex gap-3 text-xs items-start transition-all duration-300"
              :class="store.darkMode 
                ? 'bg-emerald-500/10 border-emerald-500/25 text-slate-200' 
                : 'bg-emerald-50 border-emerald-200/60 text-emerald-900'"
            >
              <i class="fa-solid fa-envelope-open-text text-[#10B981] mt-0.5 text-sm shrink-0 font-bold"></i>
              <div>
                <strong class="text-[#10B981] font-bold block mb-1">Módulo Central de Relacionamento (CRM) e Campanhas</strong>
                <p class="leading-relaxed" :class="store.darkMode ? 'text-slate-300 font-semibold' : 'text-emerald-805 font-medium'">
                  Gerencie todos os inscritos da sua Newsletter, ative ou cancele inscrições avulsas, customize conexões de e-mail e realize disparos em massa automáticos! Caso utilize o provedor Real, cada e-mail disparado enviará um link de auto-cancelamento dinâmico sem necessidade de login.
                </p>
              </div>
            </div>

            <!-- Two Column Layout: Settings & Dispatch Form left, Live Subscriber Database right -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              <!-- LEFT COLUMN: Configurations & Email Dispatch Form -->
              <div class="lg:col-span-5 space-y-6">
                
                <!-- Email Provider Configurations -->
                <div 
                  class="p-6 border rounded-2xl space-y-4 transition-all duration-300"
                  :class="store.darkMode 
                    ? 'bg-slate-950/60 border-white/5' 
                    : 'bg-white border-slate-200/80 shadow-xs'"
                >
                  <div class="flex items-center justify-between border-b pb-2" :class="store.darkMode ? 'border-white/5' : 'border-slate-100'">
                    <h4 class="text-xs font-bold text-[#10B981] uppercase tracking-wider">Conexão de E-mails / SMTP</h4>
                    <span 
                      class="text-[10px] uppercase font-bold px-2 py-0.5 rounded leading-none"
                      :class="store.darkMode ? 'text-slate-400 bg-white/5' : 'text-slate-600 bg-slate-100'"
                    >
                      {{ tempConfig.provider === 'emailjs' ? 'Produção Real' : 'Simulador Local' }}
                    </span>
                  </div>

                  <div class="space-y-3">
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Escolha o Canal de Disparo</label>
                      <select 
                        v-model="tempConfig.provider" 
                        class="w-full py-2.5 px-3 rounded-lg text-xs outline-none focus:border-[#10B981] font-semibold cursor-pointer transition-all"
                        :class="store.darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                      >
                        <option value="simulator" class="font-semibold" :class="store.darkMode ? 'text-white bg-slate-900' : 'text-slate-800 bg-white'">Simulador Web (Mapeia Logs em tela)</option>
                        <option value="emailjs" class="font-semibold" :class="store.darkMode ? 'text-white bg-slate-900' : 'text-slate-800 bg-white'">EmailJS.com (Integração Direta e Real)</option>
                      </select>
                    </div>

                    <!-- EmailJS Settings -->
                    <transition name="slide-fade">
                      <div 
                        v-if="tempConfig.provider === 'emailjs'" 
                        class="space-y-4 pt-2"
                      >
                        <!-- Seção de Acesso & API -->
                        <div 
                          class="p-4 rounded-xl border space-y-3"
                          :class="store.darkMode ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-100/60 border-slate-205'"
                        >
                          <div class="flex items-center gap-1.5 border-b pb-1.5 animate-fade-in" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                            <i class="fa-solid fa-key text-[#10B981] text-xs"></i>
                            <span class="text-[10px] uppercase font-mono font-bold" :class="store.darkMode ? 'text-slate-300' : 'text-slate-700'">Chaves de Integração API</span>
                          </div>
                          
                          <div class="grid grid-cols-1 select-none gap-3">
                            <div>
                              <label class="block text-[9px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">EmailJS Service ID</label>
                              <input 
                                type="text" 
                                v-model="tempConfig.serviceId" 
                                placeholder="ex: service_xxxxxx" 
                                class="w-full py-2 px-3 rounded-lg text-xs outline-none focus:border-[#10B981] transition-all font-semibold" 
                                :class="store.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200 shadow-3xs text-slate-800'"
                              />
                            </div>
                            <div>
                              <label class="block text-[9px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">EmailJS Public Key</label>
                              <input 
                                type="password" 
                                v-model="tempConfig.publicKey" 
                                placeholder="Chave Pública (User ID)" 
                                class="w-full py-2 px-3 rounded-lg text-xs outline-none focus:border-[#10B981] transition-all font-mono" 
                                :class="store.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200 shadow-3xs text-slate-800'"
                              />
                            </div>
                          </div>
                        </div>

                        <!-- Seção dos Modelos Específicos -->
                        <div class="space-y-4 pt-1">
                          <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-slate-300 text-[11px] leading-relaxed">
                            <span class="font-extrabold text-[#10B981] flex items-center gap-1.5 mb-1 text-xs">
                              <i class="fa-solid fa-wand-magic-sparkles"></i>
                              Estratégia Inteligente de 2 Templates (Plano Gratuito)
                            </span>
                            O plano gratuito do EmailJS é limitado a apenas <strong class="text-white">2 templates</strong>. Para solucionar isso de forma impecável, o portal implementa o método do <strong>Template Camaleão</strong>: nós renderizamos o assunto e a mensagem completos no código e injetamos como variáveis. Dessa forma, você só precisa de 1 ou 2 templates para enviar e-mails de todos os tipos!
                          </div>

                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- 1. Informativo Geral / Campo Camaleão -->
                            <div class="p-4 rounded-xl border transition-all hover:border-violet-500/30 flex flex-col justify-between"
                              :class="store.darkMode ? 'bg-violet-950/20 border-violet-500/15' : 'bg-violet-50/50 border-violet-200'"
                            >
                              <div>
                                <div class="flex items-center justify-between gap-2 mb-2">
                                  <span class="flex items-center gap-1.5 text-xs font-bold text-violet-400">
                                    <i class="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
                                    1. Template Geral (Camaleão)
                                  </span>
                                  <span class="text-[7px] font-black bg-violet-500/10 text-violet-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Obrigatório</span>
                                </div>
                                <p class="text-[9.5px] leading-relaxed mb-3" :class="store.darkMode ? 'text-slate-400' : 'text-slate-600'">
                                  Recebe qualquer assunto e conteúdo dinamicamente para Campanhas, Envios Manuais ou Notificações Automáticas.
                                </p>
                              </div>
                              <div>
                                <label class="block text-[8px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Template ID</label>
                                <input 
                                  type="text" 
                                  v-model="tempConfig.templateId" 
                                  placeholder="ex: template_geral" 
                                  class="w-full py-1.5 px-3 rounded-lg text-xs outline-none focus:border-violet-500 transition-all font-semibold font-mono mb-2" 
                                  :class="store.darkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-205 shadow-2xs text-slate-800'"
                                />
                                <div class="text-[7.5px] leading-relaxed flex flex-wrap items-center gap-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
                                  <span class="font-mono text-[7px]">Atalhos no EmailJS:</span>
                                  <code class="px-1 rounded text-violet-300 font-mono bg-violet-500/10">\{{subject}}</code>
                                  <code class="px-1 rounded text-violet-300 font-mono bg-violet-500/10">\{{message}}</code>
                                  <code class="px-1 rounded text-violet-300 font-mono bg-violet-500/10">\{{to_name}}</code>
                                  <code class="px-1 rounded text-violet-300 font-mono bg-violet-500/10">\{{unsubscribe_link}}</code>
                                </div>
                              </div>
                            </div>

                            <!-- 2. Boas-Vindas / Onboarding -->
                            <div class="p-4 rounded-xl border transition-all hover:border-emerald-500/30 flex flex-col justify-between"
                              :class="store.darkMode ? 'bg-emerald-950/20 border-emerald-500/15' : 'bg-emerald-50/50 border-emerald-200'"
                            >
                              <div>
                                <div class="flex items-center justify-between gap-2 mb-2">
                                  <span class="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                    <i class="fa-solid fa-handshake text-[11px]"></i>
                                    2. Template de Boas-Vindas
                                  </span>
                                  <span class="text-[7px] font-black bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-mono">Opcional</span>
                                </div>
                                <p class="text-[9.5px] leading-relaxed mb-3" :class="store.darkMode ? 'text-slate-400' : 'text-slate-600'">
                                  Layout fixo/personalizado de Boas-Vindas com sua identidade visual. Se deixado em branco, utiliza o <strong>Template Camaleão</strong>!
                                </p>
                              </div>
                              <div>
                                <label class="block text-[8px] font-bold uppercase tracking-wider mb-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Template ID (Opcional)</label>
                                <input 
                                  type="text" 
                                  v-model="tempConfig.welcomeTemplateId" 
                                  placeholder="ex: template_boasvindas" 
                                  class="w-full py-1.5 px-3 rounded-lg text-xs outline-none focus:border-[#10B981] transition-all font-semibold font-mono mb-2" 
                                  :class="store.darkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-205 shadow-2xs text-slate-800'"
                                />
                                <div class="text-[7.5px] leading-relaxed flex flex-wrap items-center gap-1" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
                                  <span class="font-mono text-[7px]">Atalhos no EmailJS:</span>
                                  <code class="px-1 rounded text-[#10B981] font-mono bg-emerald-500/10">\{{to_name}}</code>
                                  <code class="px-1 rounded text-[#10B981] font-mono bg-emerald-500/10">\{{to_email}}</code>
                                  <code class="px-1 rounded text-[#10B981] font-mono bg-emerald-500/10">\{{unsubscribe_link}}</code>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Seção de Customizadores Extras (Opcional para planos pagos ou adicionais) -->
                          <div class="rounded-xl border animate-fade-in" :class="store.darkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-150'">
                            <details class="group cursor-pointer">
                              <summary class="flex items-center justify-between p-3 text-[10px] uppercase font-bold tracking-wider text-slate-400 select-none list-none outline-none">
                                <span class="flex items-center gap-2" :class="store.darkMode ? 'text-slate-350' : 'text-slate-600'">
                                  <i class="fa-solid fa-sliders text-xs"></i>
                                  Templates Avançados (Plano Pago ou Extra)
                                </span>
                                <i class="fa-solid fa-angle-right transition-transform group-open:rotate-90"></i>
                              </summary>
                              
                              <div class="p-3 border-t grid grid-cols-1 md:grid-cols-2 gap-3.5" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                                <div class="p-3 rounded-lg text-left" :class="store.darkMode ? 'bg-slate-950/40' : 'bg-white border border-slate-150'">
                                  <label class="block text-[8px] font-bold uppercase tracking-wider mb-1 text-rose-450">Template de Cancelamento (Opt-out)</label>
                                  <input 
                                    type="text" 
                                    v-model="tempConfig.unsubscribeTemplateId" 
                                    placeholder="Deixe em branco para usar Geral" 
                                    class="w-full py-1.5 px-2.5 rounded text-xs outline-none focus:border-rose-500 transition-all font-mono mb-1.5" 
                                    :class="store.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                                  />
                                  <p class="text-[8px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">Acionado se você desejar um design específico para e-mails de despedida.</p>
                                </div>

                                <div class="p-3 rounded-lg text-left" :class="store.darkMode ? 'bg-slate-950/40' : 'bg-white border border-slate-150'">
                                  <label class="block text-[8px] font-bold uppercase tracking-wider mb-1 text-blue-400">Template de Notificações Unificadas</label>
                                  <input 
                                    type="text" 
                                    v-model="tempConfig.newItemTemplateId" 
                                    placeholder="Deixe em branco para usar Geral" 
                                    class="w-full py-1.5 px-2.5 rounded text-xs outline-none focus:border-blue-500 transition-all font-mono mb-1.5" 
                                    :class="store.darkMode ? 'bg-slate-900 border-white/5 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                                  />
                                  <p class="text-[8px]" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">Acionado automaticamente no salvamento de Notícias/Estudos com notificação ativa.</p>
                                </div>
                              </div>
                            </details>
                          </div>
                        </div>
                      </div>
                    </transition>

                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Nome do Remetente</label>
                      <input 
                        type="text" 
                        v-model="tempConfig.senderName" 
                        placeholder="ex: ESG e Tal" 
                        class="w-full py-2.5 px-3 rounded-lg text-xs outline-none focus:border-[#10B981] font-semibold transition-all" 
                        :class="store.darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                      />
                    </div>

                    <button @click="saveNlConfig" class="w-full py-3 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md hover:scale-101 select-none">
                      <i class="fa-solid fa-cloud-arrow-up"></i>
                      Salvar Configurações de Conexão
                    </button>
                  </div>
                </div>

                <!-- Circular Dispatch Module -->
                <div 
                  class="p-6 border rounded-2xl space-y-4 transition-all duration-300"
                  :class="store.darkMode 
                    ? 'bg-slate-950/60 border-white/5' 
                    : 'bg-white border-slate-200/80 shadow-xs'"
                >
                  <h4 
                    class="text-xs font-bold border-b pb-2 uppercase tracking-wider"
                    :class="store.darkMode ? 'text-slate-100 border-white/5' : 'text-slate-800 border-slate-100'"
                  >
                    Nova Campanha de E-mail
                  </h4>

                  <div class="space-y-3">
                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Assunto do E-mail</label>
                      <input 
                        type="text" 
                        v-model="newsletterSubject" 
                        class="w-full py-2.5 px-3 text-xs outline-none focus:border-[#10B981] font-semibold rounded-lg transition-all" 
                        :class="store.darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                      />
                    </div>

                    <div>
                      <label class="block text-[10px] font-bold uppercase tracking-wider mb-1 font-semibold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Corpo da Mensagem (Texto principal / HTML)</label>
                      <textarea 
                        v-model="newsletterBody" 
                        rows="6" 
                        class="w-full p-3 rounded-lg text-xs outline-none focus:border-[#10B981] leading-relaxed resize-none transition-all font-medium"
                        :class="store.darkMode ? 'bg-slate-900 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'"
                      ></textarea>
                    </div>

                    <!-- Single Test Dispatch -->
                    <div 
                      class="p-3.5 border rounded-xl space-y-2 transition-all duration-300"
                      :class="store.darkMode ? 'bg-slate-900/60 border-white/5' : 'bg-slate-100/55 border-slate-200/50'"
                    >
                      <span class="block text-[10px] font-bold uppercase font-semibold" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">Disparo de Teste Rápido (Avulso)</span>
                      <div class="flex gap-2">
                        <input 
                          type="email" 
                          v-model="testEmailTarget" 
                          placeholder="Email do administrador..." 
                          class="flex-1 py-2 px-3 rounded text-xs outline-none focus:border-[#10B981] font-semibold" 
                          :class="store.darkMode ? 'bg-slate-950 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-800'"
                        />
                        <button 
                          @click="triggerTestEmail" 
                          :disabled="isSendingNewsletter || !testEmailTarget"
                          class="px-4 py-2 rounded text-xs font-bold transition-all disabled:opacity-45 cursor-pointer select-none"
                          :class="store.darkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-800'"
                        >
                          Enviar Teste
                        </button>
                      </div>
                    </div>

                    <!-- Bulk Dispatch Trigger -->
                    <button 
                      @click="dispatchCircular" 
                      :disabled="isSendingNewsletter"
                      class="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs hover:scale-101 select-none"
                    >
                      <i v-if="isSendingNewsletter" class="fa-solid fa-spinner animate-spin"></i>
                      <i v-else class="fa-solid fa-mail-bulk"></i>
                      <span>
                        {{ isSendingNewsletter ? 'Disparando Lote...' : `Disparar para todos (${store.subscribers.filter(s => s.subscribed !== false).length} inscritos ativos)` }}
                      </span>
                    </button>
                  </div>
                </div>

                <!-- Real-time Progress Tracking and Logs -->
                <transition name="slide-fade">
                  <div 
                    v-if="isSendingNewsletter || sendLogs.length > 0" 
                    class="border p-5 rounded-2xl space-y-3.5 transition-all duration-300"
                    :class="store.darkMode ? 'bg-slate-950 border-white/5 shadow-none' : 'bg-white border-slate-200 shadow-xs text-slate-800'"
                  >
                    <div class="flex items-center justify-between">
                      <h5 class="text-[10px] font-black uppercase tracking-widest text-[#10B981]">Painel de Monitoramento Live</h5>
                      <button @click="sendLogs = []" v-if="!isSendingNewsletter" class="text-[10px] text-slate-450 hover:underline">Limpar Logs</button>
                    </div>

                    <!-- ProgressBar -->
                    <div v-if="isSendingNewsletter && sendProgressTotal > 0" class="space-y-1.5">
                      <div class="flex justify-between text-[10px] font-semibold" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">
                        <span>Progresso de Disparo</span>
                        <span>{{ sendProgressCurrent }} / {{ sendProgressTotal }} ({{ Math.round((sendProgressCurrent/sendProgressTotal)*100) }}%)</span>
                      </div>
                      <div class="w-full h-1.5 rounded-full overflow-hidden" :class="store.darkMode ? 'bg-slate-900' : 'bg-slate-100'">
                        <div class="h-full bg-emerald-500 transition-all duration-300" :style="{ width: `${(sendProgressCurrent/sendProgressTotal)*100}%` }"></div>
                      </div>
                    </div>

                    <!-- Logs list -->
                    <div 
                      class="border rounded-lg p-3 h-32 overflow-y-auto font-mono text-[9px] space-y-1"
                      :class="store.darkMode ? 'bg-black/40 border-white/5 text-emerald-400' : 'bg-slate-50 border-slate-100 text-emerald-700'"
                    >
                      <div v-for="(log, lIdx) in sendLogs" :key="lIdx" class="leading-normal">
                        {{ log }}
                      </div>
                    </div>
                  </div>
                </transition>

              </div>

              <!-- RIGHT COLUMN: Interactive Subscriber Database Module -->
              <div class="lg:col-span-7 space-y-6">
                <div 
                  class="p-6 border rounded-2xl space-y-5 transition-all duration-300"
                  :class="store.darkMode 
                    ? 'bg-slate-950/60 border-white/5' 
                    : 'bg-white border-slate-200/80 shadow-xs'"
                >
                  
                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4" :class="store.darkMode ? 'border-white/5' : 'border-slate-100'">
                    <div>
                      <h4 class="text-xs font-bold uppercase tracking-wider" :class="store.darkMode ? 'text-slate-200' : 'text-slate-800'">Banco de Dados de Contatos</h4>
                      <p class="text-[10px] mt-0.5 font-semibold" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">Total de contatos listados: {{ store.subscribers.length }}</p>
                    </div>
                  </div>

                  <!-- Table search bar -->
                  <div class="relative">
                    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-xs"></i>
                    <input 
                      type="text" 
                      v-model="searchQuery" 
                      placeholder="Buscar por e-mail ou nome..." 
                      class="w-full py-2.5 pl-9 pr-4 text-xs rounded-xl outline-none focus:border-[#10B981] placeholder-slate-500 font-semibold transition-all"
                      :class="store.darkMode ? 'bg-slate-900 border-white/10 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'"
                    />
                  </div>

                  <!-- Subscribers Grid List -->
                  <div class="overflow-x-auto min-h-60 max-h-[580px] overflow-y-auto border rounded-xl" :class="store.darkMode ? 'border-white/5' : 'border-slate-200/80'">
                    <table class="w-full text-left border-collapse">
                      <thead>
                        <tr class="text-[10px] font-black uppercase tracking-wider border-b" :class="store.darkMode ? 'bg-slate-900 text-slate-400 border-white/5' : 'bg-slate-50 text-slate-500 border-slate-200/80'">
                          <th class="py-3 px-4">Nome</th>
                          <th class="py-3 px-4">E-mail</th>
                          <th class="py-3 px-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody class="divide-y text-xs" :class="store.darkMode ? 'divide-white/5 text-slate-300' : 'divide-slate-100 text-slate-700'">
                        <tr v-if="filteredSubscribers.length === 0">
                          <td colspan="3" class="py-12 text-center italic font-medium" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">
                            Nenhum inscrito localizado com os filtros selecionados.
                          </td>
                        </tr>
                        <tr 
                          v-for="sub in paginatedSubscribers" 
                          :key="sub.id" 
                          class="transition-colors"
                          :class="store.darkMode ? 'hover:bg-slate-900/40' : 'hover:bg-slate-50'"
                        >
                          <td class="py-3 px-4 font-semibold" :class="store.darkMode ? 'text-slate-200' : 'text-slate-800'">
                            {{ sub.name || '-' }}
                          </td>
                          <td class="py-3 px-4 font-mono select-all text-[11px]" :class="store.darkMode ? 'text-slate-300' : 'text-slate-600'">
                            {{ sub.email }}
                          </td>
                          <td class="py-3 px-4 text-center">
                            <button 
                              @click="store.deleteSubscriber(sub.id)"
                              title="Remover definitivamente"
                              class="px-1 py-0.5 transition-colors cursor-pointer"
                              :class="store.darkMode ? 'text-slate-400 hover:text-red-450' : 'text-slate-500 hover:text-red-500'"
                            >
                              <i class="fa-solid fa-trash text-xs"></i>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <!-- Custom Pager for Subscribers -->
                  <div v-if="totalSubscribersPages > 1" class="flex items-center justify-between border-t border-dashed pt-3.5 text-[10px] font-semibold select-none" :class="store.darkMode ? 'border-white/5 text-slate-400' : 'border-slate-150 text-slate-500'">
                    <button 
                      :disabled="currentSubscribersPage === 1" 
                      @click="currentSubscribersPage--" 
                      class="px-2.5 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all text-[9.5px] uppercase tracking-wider font-extrabold"
                      :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#10B981]/15 hover:text-white hover:border-[#10B981]/10' : 'bg-white border-slate-205 text-slate-605 hover:bg-[#10B981]/10 hover:text-[#10B981]'"
                    >
                      Anterior
                    </button>
                    <span>Página {{ currentSubscribersPage }} / {{ totalSubscribersPages }}</span>
                    <button 
                      :disabled="currentSubscribersPage === totalSubscribersPages" 
                      @click="currentSubscribersPage++" 
                      class="px-2.5 py-1.5 rounded-lg border disabled:opacity-30 disabled:pointer-events-none cursor-pointer transition-all text-[9.5px] uppercase tracking-wider font-extrabold"
                      :class="store.darkMode ? 'bg-slate-900 border-white/5 text-slate-300 hover:bg-[#10B981]/15 hover:text-white hover:border-[#10B981]/10' : 'bg-white border-slate-205 text-slate-605 hover:bg-[#10B981]/10 hover:text-[#10B981]'"
                    >
                      Próxima
                    </button>
                  </div>

                </div>
              </div>

            </div>
          </div>

          <!-- ─── TAB: CONSTRUTOR DE BLOCOS INFINITO (CMS PLAYGROUND) ─── -->
          <div v-else-if="activeCmsTab === 'blocks'" class="space-y-6 text-slate-100 font-sans">
            <!-- Polished Help Callout Box -->
            <div class="bg-teal-500/10 border border-teal-500/25 rounded-2xl p-4 flex gap-3 text-slate-200 text-xs items-start">
              <i class="fa-solid fa-wand-magic-sparkles text-teal-400 mt-0.5 text-sm shrink-0"></i>
              <div>
                <strong class="text-teal-400 font-bold block mb-1">Construtor Visual de Componentes & Conteúdos Infinitos</strong>
                <p class="leading-relaxed text-slate-300">
                  Crie e empilhe diferentes tipos de componentes dentro de cada seção. Isso possibilita estruturar layouts dinâmicos no site como: grids de serviços, seções de perguntas frequentes, banners de chamada para ação, linhas de métricas numéricas e imagens. Você pode reordenar os blocos usando as setas.
                </p>
              </div>
            </div>

            <!-- Choose target section -->
            <div class="bg-slate-950/60 p-5 border border-white/5 rounded-2xl space-y-4">
              <div class="max-w-md">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 pl-1">Selecione qual Seção deseja Customizar:</label>
                <select 
                  v-model="selectedBlockSectionId" 
                  class="w-full py-3 px-4 rounded-xl bg-slate-900 border border-white/10 text-xs text-white outline-none focus:border-teal-400 font-bold cursor-pointer"
                >
                  <option value="" disabled>-- Escolha uma Seção no Dropdown --</option>
                  <option 
                    v-for="item in store.navbarItems" 
                    :key="item.id" 
                    :value="item.id"
                  >
                    {{ item.label.pt }} ({{ item.target }}) — {{ item.blocks ? item.blocks.length : 0 }} bloco(s)
                  </option>
                </select>
              </div>

              <!-- Section Summary details -->
              <div v-if="selectedNavSection" class="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-wrap justify-between items-center gap-4 text-xs">
                <div>
                  <span class="text-[9px] font-black uppercase text-teal-400 tracking-wider">Modo Modular Ativo</span>
                  <h4 class="font-bold text-sm text-slate-100">Seção: {{ selectedNavSection.label.pt }}</h4>
                  <p class="text-[10px] text-slate-400 mt-0.5">Disparador de scroll: <strong class="text-white font-mono">#{{ selectedNavSection.target }}</strong></p>
                </div>

                <div class="flex gap-2">
                  <button 
                    @click="saveSectionBlocks"
                    class="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border-none"
                  >
                    <i class="fa-solid fa-cloud-arrow-up"></i>
                    <span>Salvar Estrutura De Blocos</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Empty info guide -->
            <div v-if="!selectedBlockSectionId" class="p-10 rounded-2xl border border-dashed text-center text-xs text-slate-500" :class="store.darkMode ? 'border-white/10' : 'border-slate-300/60'">
              <i class="fa-solid fa-cubes text-slate-600 text-3xl mb-3 block"></i>
              Nenhuma seção selecionada.<br/>Escolha uma seção acima para começar a adicionar componentes de forma quase sem fim.
            </div>

            <!-- Main active playground workspace -->
            <div v-else class="space-y-6">
              
              <!-- Component Toolbox Box -->
              <div class="bg-slate-950/60 p-5 border border-white/5 rounded-2xl">
                <h5 class="text-[10px] font-black uppercase tracking-wider text-teal-400 mb-3 block font-bold">
                  <i class="fa-solid fa-circle-plus"></i> Inserir Novo Componente na Pilha
                </h5>

                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  <button 
                    @click="addCmsBlock('text')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-teal-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-font text-teal-400 text-base"></i>
                    <span>Bloco de Texto</span>
                    <span class="text-[8px] text-slate-500 font-normal">Título + Corpo corrido</span>
                  </button>

                  <button 
                    @click="addCmsBlock('features_grid')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-violet-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-grip text-violet-400 text-base"></i>
                    <span>Grid de Cards</span>
                    <span class="text-[8px] text-slate-500 font-normal">Cards com ícones</span>
                  </button>

                  <button 
                    @click="addCmsBlock('accordion')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-amber-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-window-restore text-amber-400 text-base"></i>
                    <span>Acordeão / FAQ</span>
                    <span class="text-[8px] text-slate-500 font-normal">Acordeão colapsável</span>
                  </button>

                  <button 
                    @click="addCmsBlock('stats')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-emerald-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-chart-simple text-emerald-400 text-base"></i>
                    <span>Métricas Hero</span>
                    <span class="text-[8px] text-slate-500 font-normal">Contadores de impacto</span>
                  </button>

                  <button 
                    @click="addCmsBlock('image')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-sky-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-image text-sky-400 text-base"></i>
                    <span>Imagem Destacada</span>
                    <span class="text-[8px] text-slate-500 font-normal">Plano cheio / cover</span>
                  </button>

                  <button 
                    @click="addCmsBlock('cta')"
                    class="p-3 bg-slate-900 hover:bg-slate-850 border border-white/5 hover:border-pink-500/30 rounded-xl text-left font-semibold text-xs flex flex-col gap-1 cursor-pointer transition-all hover:scale-102 font-sans text-slate-100"
                  >
                    <i class="fa-solid fa-square-envelope text-pink-400 text-base"></i>
                    <span>Chamada CTA</span>
                    <span class="text-[8px] text-slate-500 font-normal">Banner com Botões</span>
                  </button>
                </div>
              </div>

              <!-- Blocks List Assembly -->
              <div class="space-y-4">
                <div class="flex items-center justify-between border-b border-white/5 pb-2">
                  <span class="text-[11px] font-black uppercase text-slate-400 tracking-wider">Pilha de Componentes Ordenada ({{ currentSectionBlocks.length }})</span>
                  <p class="text-[9px] text-slate-500">O primeiro bloco aparece no topo logo abaixo do cabeçalho da seção.</p>
                </div>

                <div v-if="currentSectionBlocks.length === 0" class="text-center py-12 bg-slate-950/40 border border-white/5 rounded-2xl text-xs text-slate-500">
                  <i class="fa-solid fa-layer-group text-[24px] mb-2 text-slate-600 block"></i>
                  Nenhum componente foi empilhado ainda.<br/>Clique em algum tipo de componente acima para adicioná-lo.
                </div>

                <!-- Block Loops -->
                <div 
                  v-for="(block, bIdx) in currentSectionBlocks" 
                  :key="block.id"
                  class="bg-slate-950/60 border rounded-2xl p-5 space-y-4 text-left relative transition-all"
                  :class="{
                    'border-teal-500/30 bg-teal-950/5': block.type === 'text',
                    'border-violet-500/30 bg-violet-950/5': block.type === 'features_grid',
                    'border-amber-500/30 bg-amber-950/5': block.type === 'accordion',
                    'border-emerald-500/30 bg-emerald-950/5': block.type === 'stats',
                    'border-sky-500/30 bg-sky-950/5': block.type === 'image',
                    'border-pink-500/30 bg-pink-950/5': block.type === 'cta'
                  }"
                >
                  <!-- Block Toolbar header -->
                  <div class="flex items-center justify-between border-b border-white/5 pb-3">
                    <div class="flex items-center gap-2">
                      <span class="font-mono text-[9px] bg-slate-900 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-bold">
                        #{{ bIdx + 1 }}
                      </span>
                      <span 
                        class="text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest font-bold"
                        :class="{
                          'bg-teal-500/10 text-teal-400': block.type === 'text',
                          'bg-violet-500/10 text-violet-400': block.type === 'features_grid',
                          'bg-amber-500/10 text-amber-400': block.type === 'accordion',
                          'bg-emerald-500/10 text-emerald-400': block.type === 'stats',
                          'bg-sky-500/10 text-sky-400': block.type === 'image',
                          'bg-pink-500/10 text-pink-400': block.type === 'cta',
                        }"
                      >
                        {{ block.type }}
                      </span>
                      <span class="text-[9px] font-mono text-slate-500 truncate max-w-[150px]">ID: {{ block.id }}</span>
                    </div>

                    <!-- Actions -->
                    <div class="flex items-center gap-1.5 shrink-0 select-none">
                      <button 
                        :disabled="bIdx === 0"
                        @click="moveCmsBlock(bIdx, 'up')"
                        class="px-2 py-1 text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded disabled:opacity-30 cursor-pointer"
                        title="Mover para Cima"
                      >
                        <i class="fa-solid fa-arrow-up"></i>
                      </button>
                      <button 
                        :disabled="bIdx === currentSectionBlocks.length - 1"
                        @click="moveCmsBlock(bIdx, 'down')"
                        class="px-2 py-1 text-[10px] bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 rounded disabled:opacity-30 cursor-pointer"
                        title="Mover para Baixo"
                      >
                        <i class="fa-solid fa-arrow-down"></i>
                      </button>
                      <button 
                        @click="deleteCmsBlock(bIdx)"
                        class="px-2 py-1 text-[10px] bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded cursor-pointer animate-pulse"
                        title="Remover Componente"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Header text fields workspace -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-3.5">
                      <h6 class="text-[9px] font-black uppercase tracking-wider text-slate-400 border-l-2 border-slate-500 pl-1.5 font-bold">Conteúdo Português (PT)</h6>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Título principal no bloco</label>
                        <input type="text" v-model="block.title.pt" placeholder="Título opcional..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Subtítulo / Cartola</label>
                        <input type="text" v-model="block.subtitle.pt" placeholder="Subtítulo decorativo opcional..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400" />
                      </div>
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-[8px] font-bold uppercase text-slate-400">Corpo textual / Parágrafo descritivo</label>
                          <button type="button" @click="openAdvEditor('Bloco: Corpo PT', block.body.pt, (val) => { block.body.pt = val })" class="text-[8px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                            <i class="fa-solid fa-expand text-[7px]"></i> Ampliar ✨
                          </button>
                        </div>
                        <textarea v-model="block.body.pt" rows="5" placeholder="Descreva os detalhes..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400 resize-none font-sans min-h-[110px]"></textarea>
                      </div>
                    </div>

                    <div class="space-y-3.5">
                      <h6 class="text-[9px] font-black uppercase tracking-wider text-slate-400 border-l-2 border-slate-500 pl-1.5 font-bold">Conteúdo Inglês (EN)</h6>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Title headline inside block</label>
                        <input type="text" v-model="block.title.en" placeholder="Optional title..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400" />
                      </div>
                      <div>
                        <label class="block text-[8px] font-bold uppercase text-slate-400 mb-1">Subtitle / Badge text</label>
                        <input type="text" v-model="block.subtitle.en" placeholder="Optional decorative subtitle..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400" />
                      </div>
                      <div>
                        <div class="flex items-center justify-between mb-1">
                          <label class="block text-[8px] font-bold uppercase text-slate-400">Body paragraph descriptions</label>
                          <button type="button" @click="openAdvEditor('Bloco: Corpo EN', block.body.en, (val) => { block.body.en = val })" class="text-[8px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                            <i class="fa-solid fa-expand text-[7px]"></i> Ampliar ✨
                          </button>
                        </div>
                        <textarea v-model="block.body.en" rows="5" placeholder="Describe details in English..." class="w-full py-2 px-3 rounded-lg bg-slate-900 border border-white/5 text-xs text-white outline-none focus:border-teal-400 resize-none font-sans min-h-[110px]"></textarea>
                      </div>
                    </div>
                  </div>

                  <!-- Text Block Specific fields -->
                  <div v-if="block.type === 'text'" class="p-3 bg-slate-900 border border-white/5 rounded-xl flex items-center gap-4 text-xs font-bold">
                    <span class="text-slate-400 text-[9px] font-bold uppercase">Alinhamento do Texto:</span>
                    <div class="flex rounded-lg border border-white/10 overflow-hidden bg-slate-950 p-0.5">
                      <button 
                        @click="block.alignment = 'left'" 
                        class="px-3 py-1 text-[10px] rounded transition-all cursor-pointer"
                        :class="block.alignment === 'left' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'"
                      >
                        Esquerda (Left)
                      </button>
                      <button 
                        @click="block.alignment = 'center'" 
                        class="px-3 py-1 text-[10px] rounded transition-all cursor-pointer"
                        :class="block.alignment === 'center' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'"
                      >
                        Centralizado (Center)
                      </button>
                      <button 
                        @click="block.alignment = 'right'" 
                        class="px-3 py-1 text-[10px] rounded transition-all cursor-pointer"
                        :class="block.alignment === 'right' ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'"
                      >
                        Direita (Right)
                      </button>
                    </div>
                  </div>

                  <!-- Image Block Specific fields -->
                  <div v-if="block.type === 'image'" class="p-4 bg-slate-900 border border-white/5 rounded-xl space-y-3 text-xs">
                    <div>
                      <span class="text-[9px] uppercase font-bold text-slate-400 block mb-1">URL Imagem Customizada do Bloco</span>
                      <input type="text" v-model="block.bgImageUrl" placeholder="Ex: /assets/my_block_bg.jpg ou link externo" class="w-full py-2 px-3 rounded-lg bg-slate-950 border border-white/10 text-xs text-white outline-none focus:border-teal-400 font-mono" />
                    </div>
                  </div>

                  <!-- Dynamic Nested Item elements builder for grids, FAQs, metrics, custom layouts -->
                  <div 
                    v-if="['features_grid', 'accordion', 'stats', 'cta'].includes(block.type)" 
                    class="border-t border-white/10 pt-4 space-y-4"
                  >
                    <div class="flex items-center justify-between">
                      <span class="text-[10px] font-black uppercase text-teal-400 tracking-wider font-bold">
                        <i class="fa-solid fa-list-check"></i>
                        Itens Filhos / Cartões Cadastrados ({{ block.items ? block.items.length : 0 }})
                      </span>
                      <button 
                        @click="addBlockItemElement(block)"
                        type="button"
                        class="px-3 py-1.5 text-[9px] font-extrabold bg-teal-500/10 border border-teal-500/25 hover:bg-teal-500/20 text-teal-400 rounded-lg transition-all cursor-pointer inline-flex items-center gap-1"
                      >
                        <i class="fa-solid fa-plus-circle text-[10px]"></i>
                        <span>Inserir Novo Item</span>
                      </button>
                    </div>

                    <!-- Inner items loop -->
                    <div v-if="!block.items || block.items.length === 0" class="text-center py-6 border border-dashed border-white/5 rounded-xl text-[10px] text-slate-500 select-none">
                      Nenhum item cadastrado. Clique no botão acima para adicionar elementos.
                    </div>

                    <div v-else class="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                      <div 
                        v-for="(childItem, cIdx) in block.items" 
                        :key="childItem.id"
                        class="p-4 bg-slate-900 border border-white/5 rounded-xl relative space-y-3"
                      >
                        <!-- Child element navigation bar -->
                        <div class="flex items-center justify-between border-b border-white/5 pb-2">
                          <span class="text-[9px] font-bold uppercase text-slate-400 flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                            Item #{{ cIdx + 1 }}
                          </span>
                          
                          <div class="flex items-center gap-1">
                            <button 
                              :disabled="cIdx === 0"
                              @click="moveBlockItemElement(block, cIdx, 'up')"
                              class="p-1 text-[8px] bg-slate-950 hover:bg-slate-850 border border-white/5 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <i class="fa-solid fa-chevron-up"></i>
                            </button>
                            <button 
                              :disabled="cIdx === block.items.length - 1"
                              @click="moveBlockItemElement(block, cIdx, 'down')"
                              class="p-1 text-[8px] bg-slate-950 border border-white/5 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <i class="fa-solid fa-chevron-down"></i>
                            </button>
                            <button 
                              @click="deleteBlockItemElement(block, cIdx)"
                              class="p-1 text-[8px] bg-red-500/10 hover:bg-red-500/20 rounded border border-red-500/10 text-red-400 cursor-pointer"
                            >
                              <i class="fa-solid fa-trash-can"></i>
                            </button>
                          </div>
                        </div>

                        <!-- Fields mapping depends on parent type -->
                        <div class="grid grid-cols-2 gap-4 text-xs font-sans text-slate-100">
                          <!-- Row 1: Titles -->
                          <div>
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Título PT</label>
                            <input type="text" v-model="childItem.title.pt" placeholder="Título em Português" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>
                          <div>
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Título EN</label>
                            <input type="text" v-model="childItem.title.en" placeholder="Title in English" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-xs font-sans text-slate-100">
                          <!-- Row 1.5: Subtitles -->
                          <div>
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Subtítulo / Categoria PT</label>
                            <input type="text" v-model="childItem.subtitle.pt" placeholder="Subtítulo ou Categoria em Português" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>
                          <div>
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Subtítulo / Categoria EN</label>
                            <input type="text" v-model="childItem.subtitle.en" placeholder="Subtitle or Category in English" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4 text-xs font-sans text-slate-100">
                          <!-- Row 2: Bodies -->
                          <div>
                            <div class="flex items-center justify-between mb-0.5">
                              <label class="block text-[8px] font-bold uppercase text-slate-400">Parágrafo descritivo PT</label>
                              <button type="button" @click="openAdvEditor('Item: Parágrafo PT', childItem.body.pt, (val) => { childItem.body.pt = val })" class="text-[7px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                                <i class="fa-solid fa-expand text-[6px]"></i> Ampliar ✨
                              </button>
                            </div>
                            <textarea v-model="childItem.body.pt" rows="4" placeholder="Parágrafo descritivo em Português" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400 min-h-[90px]"></textarea>
                          </div>
                          <div>
                            <div class="flex items-center justify-between mb-0.5">
                              <label class="block text-[8px] font-bold uppercase text-slate-400">Parágrafo descritivo EN</label>
                              <button type="button" @click="openAdvEditor('Item: Parágrafo EN', childItem.body.en, (val) => { childItem.body.en = val })" class="text-[7px] text-teal-400 hover:text-teal-300 font-bold flex items-center gap-0.5 border-none bg-transparent cursor-pointer">
                                <i class="fa-solid fa-expand text-[6px]"></i> Ampliar ✨
                              </button>
                            </div>
                            <textarea v-model="childItem.body.en" rows="4" placeholder="Paragraph in English" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400 min-h-[90px]"></textarea>
                          </div>
                        </div>

                        <!-- Specific subfields based on block category -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 border-t border-white/5 pt-2 text-[8px] text-xs font-sans text-slate-100">
                          <!-- Value for Stats (metric) -->
                          <div v-if="block.type === 'stats'">
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Métrica (Ex: 100%, +25)</label>
                            <input type="text" v-model="childItem.value" placeholder="Métrica..." class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>

                          <!-- FontAwesome icon for grids/metrics -->
                          <div v-if="['features_grid', 'stats'].includes(block.type)" class="md:col-span-3 border-t border-white/5 pt-3 mt-1.5">
                            <label class="block text-[10px] font-bold uppercase mb-1.5" :class="store.darkMode ? 'text-slate-400' : 'text-slate-500'">
                              Ícone Selecionado: 
                              <span class="text-teal-400 font-bold ml-1">
                                <i class="fa-solid" :class="childItem.icon || 'fa-question'"></i> {{ childItem.icon || '(Nenhum)' }}
                              </span>
                            </label>
                            
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label class="block text-[9px] font-bold uppercase text-slate-400 mb-1">Classe de Ícone Personalizada</label>
                                <input 
                                  type="text" 
                                  v-model="childItem.icon" 
                                  placeholder="Ex: fa-leaf, fa-award" 
                                  class="w-full py-1.5 px-2 text-xs font-mono outline-none focus:border-teal-400 transition-all rounded"
                                  :class="store.darkMode ? 'bg-slate-950 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'"
                                />
                                <p class="text-[8px] text-slate-500 mt-1.5 leading-relaxed">
                                  Insira a classe do FontAwesome diretamente ou selecione um dos ícones populares sugeridos no mini painel complementar.
                                </p>
                              </div>
                              
                              <div 
                                class="flex flex-col h-[160px] min-h-0 p-2.5 rounded-lg border animate-fade-in"
                                :class="store.darkMode ? 'bg-black/20 border-white/5' : 'bg-slate-100/50 border-slate-200'"
                              >
                                <div class="flex gap-2 mb-1.5 items-center shrink-0">
                                  <input 
                                    type="search" 
                                    v-model="searchBlockIcon" 
                                    placeholder="Pesquisar ícones..." 
                                    class="flex-1 py-0.5 px-2 rounded text-[10px] outline-none focus:border-teal-400"
                                    :class="store.darkMode ? 'bg-slate-950 border-white/5 text-white placeholder-slate-600' : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400'"
                                  />
                                </div>
                                <div class="flex gap-1 overflow-x-auto pb-1 mb-1.5 shrink-0 scrollbar-none border-b" :class="store.darkMode ? 'border-white/5' : 'border-slate-150'">
                                  <button 
                                    v-for="cat in iconCategories" 
                                    :key="cat"
                                    @click="catBlockFilter = cat"
                                    type="button"
                                    class="px-1.5 py-0.5 rounded text-[7px] font-black uppercase transition-all whitespace-nowrap cursor-pointer border-none"
                                    :class="catBlockFilter === cat ? 'bg-teal-500 text-white' : (store.darkMode ? 'bg-slate-950 text-slate-500 hover:text-slate-350' : 'bg-slate-200 text-slate-600 hover:text-slate-850')"
                                  >
                                    {{ cat }}
                                  </button>
                                </div>
                                <div 
                                  class="flex-1 overflow-y-auto grid grid-cols-4 gap-1 rounded p-1 min-h-0 scrollbar-thin"
                                  :class="store.darkMode ? 'bg-slate-950/40' : 'bg-white'"
                                >
                                  <button 
                                    v-for="item in filteredBlockIcons" 
                                    :key="item.icon" 
                                    @click="childItem.icon = item.icon" 
                                    type="button"
                                    class="p-1 rounded transition-all flex flex-col items-center justify-center gap-1 text-[9px] cursor-pointer border-none"
                                    :class="store.darkMode 
                                      ? 'hover:bg-white/10 text-slate-300 hover:text-teal-400' 
                                      : 'hover:bg-slate-100 text-slate-700 hover:text-teal-500'"
                                    :title="item.name"
                                  >
                                    <i class="fa-solid text-xs" :class="item.icon"></i>
                                    <span class="text-[7px] text-center truncate w-full scale-90" :class="store.darkMode ? 'text-slate-500' : 'text-slate-400'">{{ item.name }}</span>
                                  </button>
                                  <div v-if="filteredBlockIcons.length === 0" class="col-span-4 text-center py-2 text-[8px]" :class="store.darkMode ? 'text-slate-600' : 'text-slate-400'">
                                    Nenhum ícone
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Custom external or scroll link -->
                          <div v-if="['features_grid', 'cta'].includes(block.type)">
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">CTA Destino Link URL</label>
                            <input type="text" v-model="childItem.ctaUrl" placeholder="Ex: https://..." class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400 font-mono" />
                          </div>

                          <!-- CTA label PT -->
                          <div v-if="['features_grid', 'cta'].includes(block.type)">
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Rótulo Botão PT</label>
                            <input type="text" v-model="childItem.ctaText.pt" placeholder="Ver Mais" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>

                          <!-- CTA label EN -->
                          <div v-if="['features_grid', 'cta'].includes(block.type)">
                            <label class="block text-[8px] font-bold uppercase text-slate-400 mb-0.5">Rótulo Botão EN</label>
                            <input type="text" v-model="childItem.ctaText.en" placeholder="Learn more" class="w-full py-1.5 px-2 bg-slate-950 border border-white/5 rounded text-xs text-white outline-none focus:border-teal-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Save bar Footer floating triggers -->
              <div class="bg-slate-950 p-5 border border-white/5 rounded-2xl flex items-center justify-between gap-4">
                <p class="text-[10px] text-slate-400">Certifique-se de salvar suas alterações na pilha para aplicar ao banco Realtime.</p>
                <button 
                  @click="saveSectionBlocks"
                  class="px-6 py-3 bg-teal-500 hover:bg-teal-600 shadow-md text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 border-none"
                >
                  <i class="fa-solid fa-floppy-disk"></i>
                  <span>Salvar Todos os Componentes da Seção</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </section>
    </main>

    <!-- ── FOOTER info ── -->
    <footer class="bg-slate-950 py-3 px-6 text-center text-[10px] text-slate-500 border-t border-white/5 shrink-0 select-none font-medium">
      ESG e Tal Admin CMS Portal — Built securely with Vue 3 & Pinia state sync.
    </footer>

    <!-- ── FIREBASE KEY BUILDER MODAL DIALOG ── -->
    <div v-if="showKeysModal" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
      <div class="bg-slate-950 border border-white/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative">
        <h3 class="font-display font-bold text-lg text-[#10B981] mb-2 flex items-center gap-1.5 justify-center sm:justify-start">
          <i class="fa-solid fa-key"></i>
          <span>Vincular Credenciais Firebase</span>
        </h3>
        <p class="text-xs text-slate-400 mb-6 text-center sm:text-left leading-relaxed">
          Cole chaves de seu aplicativo registradas no console Firebase Realtime. Nós salvaremos e iniciaremos em tempo real.
        </p>

        <div class="space-y-3.5 mb-6 text-xs text-slate-300">
          <div>
            <label class="block text-[9px] font-black uppercase text-slate-400 mb-1">API Key</label>
            <input type="text" v-model="credForm.apiKey" placeholder="AIzaSy..." class="w-full p-2 rounded bg-white/5 border border-white/10 text-white outline-none focus:border-[#10B981]" />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase text-slate-400 mb-1">Auth Domain</label>
            <input type="text" v-model="credForm.authDomain" placeholder="seu-projeto.firebaseapp.com" class="w-full p-2 rounded bg-white/5 border border-white/10 text-white outline-none focus:border-[#10B981]" />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase text-slate-400 mb-1">Database Realtime URL</label>
            <input type="text" v-model="credForm.databaseURL" placeholder="https://seu-projeto-default-rtdb.firebaseio.com" class="w-full p-2 rounded bg-white/5 border border-white/10 text-white outline-none focus:border-[#10B981]" />
          </div>
          <div>
            <label class="block text-[9px] font-black uppercase text-slate-400 mb-1">Project ID</label>
            <input type="text" v-model="credForm.projectId" placeholder="seu-projeto" class="w-full p-2 rounded bg-white/5 border border-white/10 text-white outline-none focus:border-[#10B981]" />
          </div>
        </div>

        <div class="flex gap-3 justify-end text-xs font-bold">
          <button @click="showKeysModal = false" class="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all text-slate-400 cursor-pointer">
            Cancelar
          </button>
          
          <button @click="saveKeys" class="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg transition-all cursor-pointer">
            Salvar e Aplicar
          </button>
        </div>
      </div>
    </div>

    <!-- ── ADVANCED GRAPHIC EDITOR AND AI-READY OVERLAY PANEL ── -->
    <div v-if="isAdvEditorOpen" class="fixed inset-0 bg-black/85 backdrop-blur-md z-[3000] flex items-center justify-center p-4 animate-fade-in text-slate-100">
      <div 
        class="border border-white/10 rounded-3xl p-5 md:p-6 shadow-2xl max-w-4xl w-full flex flex-col h-[90vh] md:h-[80vh] bg-slate-950 text-white"
      >
        <!-- Modal header -->
        <div class="flex items-center justify-between border-b border-white/5 pb-3.5 shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-teal-400/10 flex items-center justify-center text-teal-400">
              <i class="fa-solid fa-wand-magic-sparkles text-sm"></i>
            </div>
            <div class="text-left">
              <h3 class="font-display font-bold text-sm tracking-tight text-white mb-0.5">Auxiliar de Edição Avançada</h3>
              <p class="text-[9px] text-slate-400 uppercase font-black tracking-widest block">{{ advEditorLabel }}</p>
            </div>
          </div>
          <button 
            type="button"
            @click="isAdvEditorOpen = false" 
            class="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center hover:scale-105 transition-all text-slate-400 hover:text-white border-none cursor-pointer"
          >
            <i class="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        <!-- Editor Toolbar & options -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-2 border-b border-white/5 text-xs text-slate-300 shrink-0">
          <!-- Text manipulation buttons -->
          <div class="flex flex-wrap gap-1.5">
            <button 
              type="button" 
              @click="advInsertTemplate('esg_report')"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold inline-flex items-center gap-1 border border-white/5 cursor-pointer text-slate-300"
              title="Inserir modelo profissional de relatório de sustentabilidade"
            >
              <i class="fa-solid fa-file-invoice text-teal-400"></i> Modelo ESG
            </button>
            <button 
              type="button" 
              @click="advInsertTemplate('bullet_list')"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold inline-flex items-center gap-1 border border-white/5 cursor-pointer text-slate-300"
              title="Formatar em lista com marcadores de sustentabilidade"
            >
              <i class="fa-solid fa-list-ul text-teal-400"></i> Lista de itens
            </button>
            <button 
              type="button" 
              @click="advTextAction('uppercase')"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold inline-flex items-center gap-1 border border-white/5 cursor-pointer text-slate-300"
            >
              <i class="fa-solid fa-font"></i> CAPS
            </button>
            <button 
              type="button" 
              @click="advTextAction('clean')"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold inline-flex items-center gap-1 border border-white/5 cursor-pointer text-slate-300"
              title="Corrigir pontuações, remover espaços redundantes e parágrafos invisíveis"
            >
              <i class="fa-solid fa-wand-magic"></i> Higienizar texto
            </button>
            <button 
              type="button" 
              @click="advTextAction('double_space')"
              class="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold inline-flex items-center gap-1 border border-white/5 cursor-pointer text-slate-300"
              title="Adicionar quebra de parágrafo extra"
            >
              <i class="fa-solid fa-align-left"></i> Parágrafos espaçados
            </button>
          </div>

          <!-- Live metrics -->
          <div class="flex items-center gap-3 text-[9px] font-black uppercase text-slate-400 tracking-wider">
            <span>{{ advEditorValue.length }} caracteres</span>
            <span>•</span>
            <span>{{ advEditorValue.trim() ? advEditorValue.trim().split(/\s+/).length : 0 }} palavras</span>
            <span>•</span>
            <span>Est. {{ Math.max(1, Math.round(advEditorValue.length / 900)) }} min leitura</span>
          </div>
        </div>

        <!-- Main editing split workspace parent -->
        <div class="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-left">
          <!-- Textarea container (Big text input) -->
          <div class="flex flex-col h-full">
            <div class="flex items-center justify-between mb-1.5">
              <span class="text-[9px] font-black uppercase tracking-widest text-[#10B981]">Texto Original / Edição</span>
              <span class="text-[9px] text-slate-500">Pode usar quebras de linha livremente</span>
            </div>
            <textarea 
              v-model="advEditorValue"
              ref="advEditorTextarea"
              class="flex-1 w-full p-4 rounded-2xl bg-black/40 border border-white/10 text-xs text-slate-100 outline-none focus:border-teal-400 font-sans resize-none leading-relaxed overflow-y-auto"
              placeholder="Digite aqui todo o conteúdo enriquecido..."
            ></textarea>
          </div>

          <!-- HTML/Live Preview box (Space to see!) -->
          <div class="flex flex-col h-full bg-slate-900 p-4 border border-white/5 rounded-2xl">
            <div class="flex items-center justify-between mb-1.5 border-b border-white/5 pb-1 select-none">
              <span class="text-[9px] font-black uppercase tracking-widest text-teal-400">Pré-Visualização Realista (Preview)</span>
              <span class="px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-400 text-[8px] font-extrabold uppercase">Estilos Atuais</span>
            </div>
            
            <div class="flex-1 overflow-y-auto leading-relaxed text-xs pr-1 text-slate-300 font-sans whitespace-pre-line text-left">
              {{ advEditorValue || '(Nenhum conteúdo digitado no editor)' }}
            </div>
          </div>
        </div>

        <!-- Modal footer with save/cancel triggers -->
        <div class="border-t border-white/5 pt-3.5 flex items-center justify-between shrink-0">
          <p class="text-[9px] text-slate-500 leading-normal max-w-md text-left">O editor salva as quebras de linha de forma estruturada. Perfeito para garantir estética premium em qualquer bloco.</p>
          <div class="flex gap-2 text-xs font-bold shrink-0">
            <button 
              type="button"
              @click="isAdvEditorOpen = false" 
              class="px-4 py-2 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-slate-400 cursor-pointer bg-transparent"
            >
              Voltar
            </button>
            <button 
              type="button"
              @click="applyAdvValue" 
              class="px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all cursor-pointer flex items-center gap-1.5 border-none"
            >
              <i class="fa-solid fa-square-check"></i>
              <span>Aplicar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, reactive, onMounted } from 'vue';
import { useEsgStore } from '../stores/esgStore';
import { auth, isConfigured } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import AdminNewsTab from '../components/admin/AdminNewsTab.vue';
import AdminResearchTab from '../components/admin/AdminResearchTab.vue';
import AdminNavbarTab from '../components/admin/AdminNavbarTab.vue';

const store = useEsgStore();

// Advanced text editor overlay states and helpers
const isAdvEditorOpen = ref(false);
const advEditorLabel = ref('');
const advEditorValue = ref('');
let advEditorCallback: ((val: string) => void) | null = null;

const openAdvEditor = (label: string, value: string, callback: (val: string) => void) => {
  advEditorLabel.value = label;
  advEditorValue.value = value || '';
  advEditorCallback = callback;
  isAdvEditorOpen.value = true;
};

const applyAdvValue = () => {
  if (advEditorCallback) {
    advEditorCallback(advEditorValue.value);
  }
  isAdvEditorOpen.value = false;
  store.addToast("Texto atualizado com sucesso no editor avançado!", "ok");
};

const advInsertTemplate = (type: string) => {
  if (type === 'esg_report') {
    advEditorValue.value += "\n\nRelatório de Impacto ESG - Ano Base 2026\n• Ambiental (E): Redução comprovada de pegada hídrica e adesão à transição energética verde.\n• Social (S): Desenvolvimento de programas de engajamento comunitário em parceria com cooperativas.\n• Governança (G): Plena transparência nos dados regulatórios e ética operacional.";
  } else if (type === 'bullet_list') {
    advEditorValue.value += "\n• Item Principal: Detalhamento específico da ação realizada.\n• Meta Cumprida: Valor auditável de progresso e conformidade socioambiental.\n• Próximos Passos: Objetivos e alinhamento com a Agenda ESG.";
  }
};

const advTextAction = (action: string) => {
  if (!advEditorValue.value) return;
  if (action === 'uppercase') {
    advEditorValue.value = advEditorValue.value.toUpperCase();
  } else if (action === 'clean') {
    // Trim each line, remove double spaces, fix standard periods
    advEditorValue.value = advEditorValue.value
      .split('\n')
      .map(line => line.trim().replace(/\s+/g, ' '))
      .filter(line => line !== '')
      .join('\n\n');
  } else if (action === 'double_space') {
    advEditorValue.value = advEditorValue.value.replace(/\n/g, '\n\n').replace(/\n\n\n/g, '\n\n');
  }
};

// FontAwesome Popular Icons List for ESG e Tal
const popularIconsList = [
  // Environmental (Planet)
  { name: 'Folha', icon: 'fa-leaf', cat: 'Planeta' },
  { name: 'Semente', icon: 'fa-seedling', cat: 'Planeta' },
  { name: 'Árvore', icon: 'fa-tree', cat: 'Planeta' },
  { name: 'Terra', icon: 'fa-globe', cat: 'Planeta' },
  { name: 'Água', icon: 'fa-droplet', cat: 'Planeta' },
  { name: 'Vento', icon: 'fa-wind', cat: 'Planeta' },
  { name: 'Solar', icon: 'fa-sun', cat: 'Planeta' },
  { name: 'Reciclagem', icon: 'fa-recycle', cat: 'Planeta' },
  { name: 'Energia', icon: 'fa-bolt', cat: 'Planeta' },
  { name: 'Nuvem', icon: 'fa-cloud', cat: 'Planeta' },

  // Social (People)
  { name: 'Coração', icon: 'fa-heart', cat: 'Social' },
  { name: 'Doar', icon: 'fa-hand-holding-heart', cat: 'Social' },
  { name: 'Usuários', icon: 'fa-users', cat: 'Social' },
  { name: 'Comunidade', icon: 'fa-people-group', cat: 'Social' },
  { name: 'Balança', icon: 'fa-scale-balanced', cat: 'Social' },
  { name: 'Proteção', icon: 'fa-shield-halved', cat: 'Social' },
  { name: 'Formação', icon: 'fa-graduation-cap', cat: 'Social' },
  { name: 'Mãos Dadas', icon: 'fa-hands-holding-circle', cat: 'Social' },
  { name: 'Médico', icon: 'fa-user-doctor', cat: 'Social' },
  { name: 'Campainha', icon: 'fa-bell', cat: 'Social' },

  // Governance (Corporate)
  { name: 'Prédio', icon: 'fa-building', cat: 'Gestão' },
  { name: 'Prêmio', icon: 'fa-award', cat: 'Gestão' },
  { name: 'Gráfico', icon: 'fa-chart-line', cat: 'Gestão' },
  { name: 'Maleta', icon: 'fa-briefcase', cat: 'Gestão' },
  { name: 'Selo', icon: 'fa-certificate', cat: 'Gestão' },
  { name: 'Chave', icon: 'fa-key', cat: 'Gestão' },
  { name: 'Joia', icon: 'fa-gem', cat: 'Gestão' },
  { name: 'Relatório', icon: 'fa-file-invoice-dollar', cat: 'Gestão' },
  { name: 'Filtro/Engrenagem', icon: 'fa-gear', cat: 'Gestão' },
  { name: 'Lista', icon: 'fa-list-check', cat: 'Gestão' },

  // General
  { name: 'Estrela', icon: 'fa-star', cat: 'Geral' },
  { name: 'Lâmpada', icon: 'fa-lightbulb', cat: 'Geral' },
  { name: 'Pesquisa', icon: 'fa-microscope', cat: 'Geral' },
  { name: 'Bússola', icon: 'fa-compass', cat: 'Geral' },
  { name: 'Olho', icon: 'fa-eye', cat: 'Geral' },
  { name: 'Mundo', icon: 'fa-earth-americas', cat: 'Geral' },
  { name: 'Anúncio', icon: 'fa-bullhorn', cat: 'Geral' },
  { name: 'Foguete', icon: 'fa-rocket', cat: 'Geral' },
  { name: 'Check', icon: 'fa-square-check', cat: 'Geral' },
  { name: 'Pasta', icon: 'fa-folder-open', cat: 'Geral' }
];

const searchAreaIcon = ref('');
const catAreaFilter = ref('Todos');

const searchBlockIcon = ref('');
const catBlockFilter = ref('Todos');

const iconCategories = ['Todos', 'Planeta', 'Social', 'Gestão', 'Geral'];

const filteredAreaIcons = computed(() => {
  return popularIconsList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchAreaIcon.value.toLowerCase()) || 
                          item.icon.toLowerCase().includes(searchAreaIcon.value.toLowerCase());
    const matchesCat = catAreaFilter.value === 'Todos' || item.cat === catAreaFilter.value;
    return matchesSearch && matchesCat;
  });
});

const filteredBlockIcons = computed(() => {
  return popularIconsList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchBlockIcon.value.toLowerCase()) || 
                          item.icon.toLowerCase().includes(searchBlockIcon.value.toLowerCase());
    const matchesCat = catBlockFilter.value === 'Todos' || item.cat === catBlockFilter.value;
    return matchesSearch && matchesCat;
  });
});

// Navigation Tabs
const tabs = [
  { id: 'news', name: 'Notícias', icon: 'fa-newspaper', desc: 'Edite os comunicados de imprensa institucionais e dynamic bulletins.' },
  { id: 'research', name: 'Pesquisas', icon: 'fa-microscope', desc: 'Altere relatórios de estudos estatísticos e artigos PDF.' },
  { id: 'navbar', name: 'Menu Navbar', icon: 'fa-bars', desc: 'Gerencie de forma dinâmica a adição, remoção e links do menu superior.' },
  { id: 'blocks', name: 'Construtor de Blocos (CMS)', icon: 'fa-cubes', desc: 'Edite o que compõe cada seção, criando, reordenando e customizando componentes infinitamente.' },
  { id: 'areas', name: 'Áreas de Atuação', icon: 'fa-layer-group', desc: 'Defina focos de projetos, orçamentos, color-coding e sub-grids.' },
  { id: 'copy', name: 'Textos Gerais', icon: 'fa-globe', desc: 'Customizações finas sobre headers, menus, slogans e rodapés.' },
  { id: 'stats', name: 'Métricas Hero', icon: 'fa-gauge-high', desc: 'Mapeamento direto dos 4 principais badges numéricos do hero.' },
  { id: 'newsletter', name: 'Newsletter & CRM', icon: 'fa-envelope-open-text', desc: 'Monitore inscritos, mude status e dispare e-mails de notificação reais/simulados.' }
] as const;

const activeCmsTab = ref<typeof tabs[number]['id']>('news');
const editLang = ref<'pt' | 'en'>('pt');

const currentTabMetadata = computed(() => {
  return tabs.find(t => t.id === activeCmsTab.value) || tabs[0];
});

// Authentication fields
const loginIcon = ref(localStorage.getItem('admin-login-icon') || 'fa-user-lock');
const searchLoginIcon = ref('');
const catLoginFilter = ref('Todos');
const filteredLoginIcons = computed(() => {
  return popularIconsList.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchLoginIcon.value.toLowerCase()) || 
                          item.icon.toLowerCase().includes(searchLoginIcon.value.toLowerCase());
    const matchesCat = catLoginFilter.value === 'Todos' || item.cat === catLoginFilter.value;
    return matchesSearch && matchesCat;
  });
});
const updateLoginIcon = (iconClass: string) => {
  loginIcon.value = iconClass;
  localStorage.setItem('admin-login-icon', iconClass);
};
const loginEmail = ref('');
const loginPassword = ref('');
const logoutPass = ref('');
const isLoggingIn = ref(false);
const loginError = ref('');

// Firebase Credential Form fields
const showKeysModal = ref(false);
const credForm = reactive({
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: ''
});

// Dynamic News Active Workspace Model
const selectedNewsId = ref('');
const notifySubscribersOnSave = ref(false);
const notifySubscribersOnSaveResearch = ref(false);
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

// Dynamic Research Active Workspace Model
const selectedResId = ref('');

// --- PAGINATION & FILTERS FOR NEWS ---
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

// --- PAGINATION & FILTERS FOR RESEARCH ---
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

// --- PAGINATION & FILTERS FOR NAVBAR ITEMS ---
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

const selectedAreaCmsKey = ref('env');

const activeAreaNode = computed(() => {
  const activeSet = editLang.value === 'en' ? store.areasEn : store.areasPt;
  return activeSet[selectedAreaCmsKey.value] || null;
});

const copyForm = reactive({
  heroTag1: '',
  heroTag2: '',
  heroTag3: '',
  heroSubtitle: '',
  heroCta: '',
  heroCtaSub: '',
  
  navHome: '',
  navNews: '',
  navAbout: '',
  navAreas: '',
  navResearch: '',
  navContact: ''
});

const statList = ref([...store.heroStats]);

// Load and map stored values to override forms
const loadStoreConfigs = () => {
  const isEn = editLang.value === 'en';
  const targetCopy = isEn ? store.uiTextsEn : store.uiTextsPt;

  // General Copies mapping
  copyForm.heroTag1 = targetCopy.hero.tag1;
  copyForm.heroTag2 = targetCopy.hero.tag2;
  copyForm.heroTag3 = targetCopy.hero.tag3;
  copyForm.heroSubtitle = targetCopy.hero.subtitle;
  copyForm.heroCta = targetCopy.hero.cta;
  copyForm.heroCtaSub = targetCopy.hero.ctaSub;

  copyForm.navHome = targetCopy.nav.home;
  copyForm.navNews = targetCopy.nav.news;
  copyForm.navAbout = targetCopy.nav.about;
  copyForm.navAreas = targetCopy.nav.areas;
  copyForm.navResearch = targetCopy.nav.research;
  copyForm.navContact = targetCopy.nav.contact;

  statList.value = JSON.parse(JSON.stringify(store.heroStats));
};

// --- NAVBAR CMS WORKSPACE STATE ---
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
  navForm.target = customId; // default scroll target corresponds to its own custom id
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
  
  // auto increment order in increments of 10
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

// Unified loaders for selected inputs inside Workspace editor panels
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

// Listen to modifications on target localizations to reload fields
watch([editLang, () => store.heroStats], () => {
  loadStoreConfigs();
}, { deep: true });

// Reactively auto-load initial elements when store arrays are populated or synchronized
watch(() => store.dynamicNews, (newList) => {
  if (newList.length > 0 && !selectedNewsId.value) {
    loadNewsItem(newList[0].id);
  }
}, { immediate: true });

watch(() => store.dynamicResearch, (newList) => {
  if (newList.length > 0 && !selectedResId.value) {
    loadResearchItem(newList[0].id);
  }
}, { immediate: true });

// ── Newsletter CRM Setup ───────────────────────────────────────────────────
const searchQuery = ref('');
const filterActiveOnly = ref(true);

const newsletterSubject = ref('ESG e Tal - Novidades e Insights em Sustentabilidade');
const newsletterBody = ref('Convidamos você a conferir os novos artigos publicados em nosso portal de estudos e as discussões sobre a responsabilidade social.');
const testEmailTarget = ref('');

const isSendingNewsletter = ref(false);
const sendProgressCurrent = ref(0);
const sendProgressTotal = ref(0);
const sendLogs = ref<string[]>([]);

const tempConfig = reactive({
  provider: 'simulator',
  serviceId: '',
  templateId: '',
  publicKey: '',
  senderName: 'ESG e Tal',
  welcomeTemplateId: '',
  unsubscribeTemplateId: '',
  newItemTemplateId: '',
});

// Sync store config into admin form
watch(() => store.newsletterConfig, (newVal) => {
  if (newVal) {
    Object.assign(tempConfig, newVal);
  }
}, { deep: true, immediate: true });

// Auto Load Newsletter data when tab becomes active
watch(activeCmsTab, (tab) => {
  if (tab === 'newsletter') {
    store.loadNewsletterSubscribers();
    store.loadNewsletterConfig();
  }
});

const filteredSubscribers = computed(() => {
  let list = store.subscribers || [];
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(item => 
      (item.email && item.email.toLowerCase().includes(q)) ||
      (item.name && item.name.toLowerCase().includes(q))
    );
  }
  return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
});

const currentSubscribersPage = ref(1);
const subscribersPageSize = 10;

const paginatedSubscribers = computed(() => {
  const start = (currentSubscribersPage.value - 1) * subscribersPageSize;
  return filteredSubscribers.value.slice(start, start + subscribersPageSize);
});

const totalSubscribersPages = computed(() => {
  return Math.ceil(filteredSubscribers.value.length / subscribersPageSize) || 1;
});

watch(searchQuery, () => {
  currentSubscribersPage.value = 1;
});

const saveNlConfig = async () => {
  await store.saveNewsletterConfig(JSON.parse(JSON.stringify(tempConfig)));
};

const triggerTestEmail = async () => {
  const target = testEmailTarget.value.trim();
  if (!target) {
    store.addToast("Por favor, digite o e-mail de teste.", "err");
    return;
  }
  isSendingNewsletter.value = true;
  sendLogs.value = ["Iniciando envio de e-mail de teste individual..."];
  try {
    if (tempConfig.provider === 'emailjs') {
      if (!tempConfig.serviceId || !tempConfig.templateId || !tempConfig.publicKey) {
        throw new Error("Credenciais do EmailJS incompletas.");
      }
      sendLogs.value.push(`Conectando à API do EmailJS para enviar para ${target}...`);
      
      const payload = {
        service_id: tempConfig.serviceId,
        template_id: tempConfig.templateId,
        user_id: tempConfig.publicKey,
        template_params: {
          to_email: target,
          to_name: "Inscrito Teste",
          sender_name: tempConfig.senderName,
          subject: newsletterSubject.value,
          message: newsletterBody.value,
          unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(target)}`
        }
      };

      const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Erro na API do EmailJS");
      }
      sendLogs.value.push(`Sucesso! E-mail de teste enviado para ${target}.`);
      store.addToast("E-mail de teste enviado real!", "ok");
    } else {
      // Local simulator
      await new Promise(resolve => setTimeout(resolve, 1500));
      sendLogs.value.push(`[SIMULAÇÃO] E-mail enviado com sucesso!`);
      sendLogs.value.push(`Remetente: ${tempConfig.senderName}`);
      sendLogs.value.push(`Destinatário: ${target}`);
      sendLogs.value.push(`Assunto: ${newsletterSubject.value}`);
      sendLogs.value.push(`Conteúdo: ${newsletterBody.value}`);
      sendLogs.value.push(`Link de Saída: ${window.location.origin}/?unsubscribe=${encodeURIComponent(target)}`);
      store.addToast("Simulação de e-mail enviada com sucesso!", "ok");
    }
  } catch (err: any) {
    sendLogs.value.push(`FALHA: ${err.message}`);
    store.addToast(`Falha: ${err.message}`, "err");
  } finally {
    isSendingNewsletter.value = false;
  }
};

const dispatchCircular = async () => {
  const activeSubs = store.subscribers.filter(s => s.subscribed !== false);
  if (activeSubs.length === 0) {
    store.addToast("Nenhum inscrito ativo na lista para enviar.", "err");
    return;
  }

  isSendingNewsletter.value = true;
  sendProgressCurrent.value = 0;
  sendProgressTotal.value = activeSubs.length;
  sendLogs.value = [`Iniciando disparo em lote para ${activeSubs.length} inscritos...`];

  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < activeSubs.length; i++) {
    const sub = activeSubs[i];
    sendProgressCurrent.value = i + 1;
    sendLogs.value.push(`[${i+1}/${activeSubs.length}] Processando ${sub.email}...`);

    try {
      if (tempConfig.provider === 'emailjs') {
        if (!tempConfig.serviceId || !tempConfig.templateId || !tempConfig.publicKey) {
          throw new Error("Credenciais do EmailJS incompletas.");
        }
        const payload = {
          service_id: tempConfig.serviceId,
          template_id: tempConfig.templateId,
          user_id: tempConfig.publicKey,
          template_params: {
            to_email: sub.email,
            to_name: sub.name || "Leitor ESG e Tal",
            sender_name: tempConfig.senderName,
            subject: newsletterSubject.value,
            message: newsletterBody.value,
            unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(sub.email)}`
          }
        };

        const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Erro na API do EmailJS");
        }
        successCount++;
        sendLogs.value.push(` -> Enviado com sucesso para ${sub.email}.`);
      } else {
        await new Promise(resolve => setTimeout(resolve, 800));
        successCount++;
        sendLogs.value.push(` -> Simulação de envio concluída para ${sub.email}.`);
      }
    } catch (err: any) {
      failCount++;
      sendLogs.value.push(` -> ERRO em ${sub.email}: ${err.message}`);
    }
  }

  sendLogs.value.push(`Processamento concluído.`);
  sendLogs.value.push(`Total de envios com Sucesso: ${successCount}`);
  sendLogs.value.push(`Total de Falhas: ${failCount}`);
  isSendingNewsletter.value = false;
  store.addToast(`Lote processado! Sucesso: ${successCount}, Falhas: ${failCount}`, "ok");
};

onMounted(() => {
  loadStoreConfigs();
  
  // Preread stored credentials keys if existing
  const sk = localStorage.getItem('esg-firebase-config');
  if (sk) {
    Object.assign(credForm, JSON.parse(sk));
  }

  if (activeCmsTab.value === 'newsletter') {
    store.loadNewsletterSubscribers();
    store.loadNewsletterConfig();
  }
});

// Authentication actions
const signIn = async () => {
  if (!loginEmail.value || !loginPassword.value) {
    loginError.value = "Insira as credenciais de autenticação.";
    return;
  }
  if (!isConfigured || !auth) {
    loginError.value = "Firebase não foi configurado. Use o botão Configurar no rodapé primeiro.";
    return;
  }

  isLoggingIn.value = true;
  loginError.value = '';
  try {
    await signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value);
    store.addToast("Logado com sucesso!", "ok");
  } catch (err: any) {
    loginError.value = "Acesso negado: Credenciais inválidas.";
    console.error("Login attempt failed:", err);
  } finally {
    isLoggingIn.value = false;
  }
};

const bypassAuth = () => {
  store.isLoggedIn = true;
  store.addToast("Entrando no CMS em modo Sandbox (Offline)", "info");
};

const handleLogout = async () => {
  if (store.isLoggedIn && !store.userEmail) {
    store.isLoggedIn = false;
    store.addToast("Desconectado do Sandbox", "info");
    return;
  }
  await store.logoutUser();
};

const saveKeys = () => {
  if (!credForm.apiKey || !credForm.databaseURL) {
    store.addToast("Insira ao menos a API Key e o DatabaseURL.", "err");
    return;
  }
  store.saveLocalConfig(credForm);
  showKeysModal.value = false;
};

// ── SAVE ACTIONS ──

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
        const config = store.newsletterConfig || tempConfig;
        
        // Snippet length
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
                  item_author: payload.author?.pt || "ESG e Tal",
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
        const config = store.newsletterConfig || tempConfig;
        
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

const saveAreaBasicNode = async () => {
  if (!activeAreaNode.value) return;
  const key = selectedAreaCmsKey.value;
  await store.updateFirebaseNode(`areasData/${editLang.value}/${key}`, {
    name: activeAreaNode.value.name,
    icon: activeAreaNode.value.icon,
    color: activeAreaNode.value.color,
    img: activeAreaNode.value.img,
    desc: activeAreaNode.value.desc
  });
};

const saveAreaTestimonial = async () => {
  if (!activeAreaNode.value) return;
  const key = selectedAreaCmsKey.value;
  await store.updateFirebaseNode(`areasData/${editLang.value}/${key}`, {
    testimonial: activeAreaNode.value.testimonial,
    testimonialAuthor: activeAreaNode.value.testimonialAuthor
  });
};

const resetAreaNode = async () => {
  const key = selectedAreaCmsKey.value;
  await store.deleteFirebaseNode(`areasData/${editLang.value}/${key}`);
};

const addAreaSubtopic = () => {
  if (!activeAreaNode.value) return;
  if (!activeAreaNode.value.subtopics) {
    activeAreaNode.value.subtopics = [];
  }
  activeAreaNode.value.subtopics.push({
    title: "",
    img: null,
    items: [""]
  });
};

const deleteAreaSubtopic = (index: number) => {
  if (!activeAreaNode.value || !activeAreaNode.value.subtopics) return;
  if (confirm("Deseja realmente excluir este subprojeto/serviço?")) {
    activeAreaNode.value.subtopics.splice(index, 1);
  }
};

const moveAreaSubtopic = (index: number, direction: 'up' | 'down') => {
  if (!activeAreaNode.value || !activeAreaNode.value.subtopics) return;
  const list = activeAreaNode.value.subtopics;
  const targetIndex = direction === 'up' ? index - 1 : index + 1;
  if (targetIndex >= 0 && targetIndex < list.length) {
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;
  }
};

const addSubtopicBullet = (subtopicIndex: number) => {
  if (!activeAreaNode.value || !activeAreaNode.value.subtopics) return;
  const subtopic = activeAreaNode.value.subtopics[subtopicIndex];
  if (!subtopic.items) {
    subtopic.items = [];
  }
  subtopic.items.push("");
};

const deleteSubtopicBullet = (subtopicIndex: number, bulletIndex: number) => {
  if (!activeAreaNode.value || !activeAreaNode.value.subtopics) return;
  const subtopic = activeAreaNode.value.subtopics[subtopicIndex];
  if (subtopic.items) {
    subtopic.items.splice(bulletIndex, 1);
  }
};

const moveSubtopicBullet = (subtopicIndex: number, bulletIndex: number, direction: 'up' | 'down') => {
  if (!activeAreaNode.value || !activeAreaNode.value.subtopics) return;
  const subtopic = activeAreaNode.value.subtopics[subtopicIndex];
  if (!subtopic.items) return;
  const targetIndex = direction === 'up' ? bulletIndex - 1 : bulletIndex + 1;
  if (targetIndex >= 0 && targetIndex < subtopic.items.length) {
    const temp = subtopic.items[bulletIndex];
    subtopic.items[bulletIndex] = subtopic.items[targetIndex];
    subtopic.items[targetIndex] = temp;
  }
};

const saveAreaSubtopics = async () => {
  if (!activeAreaNode.value) return;
  const key = selectedAreaCmsKey.value;
  
  if (!activeAreaNode.value.subtopics) {
    activeAreaNode.value.subtopics = [];
  }

  const subtopicsToSave = activeAreaNode.value.subtopics
    .filter((s: any) => s.title && s.title.trim() !== '')
    .map((s: any) => ({
      title: s.title.trim(),
      img: s.img && s.img.trim() ? s.img.trim() : null,
      items: (s.items || []).map((b: string) => b.trim()).filter((b: string) => b !== '')
    }));

  await store.updateFirebaseNode(`areasData/${editLang.value}/${key}`, {
    subtopics: subtopicsToSave
  });
  
  activeAreaNode.value.subtopics = subtopicsToSave;
  store.addToast("Subprojetos e itens filhos salvos com sucesso!", "ok");
};

const saveHeroCopy = async () => {
  await store.updateFirebaseNode(`copy/${editLang.value}/hero`, {
    tag1: copyForm.heroTag1,
    tag2: copyForm.heroTag2,
    tag3: copyForm.heroTag3,
    subtitle: copyForm.heroSubtitle,
    cta: copyForm.heroCta,
    ctaSub: copyForm.heroCtaSub
  });
};

const resetHeroCopy = async () => {
  await store.deleteFirebaseNode(`copy/${editLang.value}/hero`);
};

const saveNavCopy = async () => {
  await store.updateFirebaseNode(`copy/${editLang.value}/nav`, {
    home: copyForm.navHome,
    news: copyForm.navNews,
    about: copyForm.navAbout,
    areas: copyForm.navAreas,
    research: copyForm.navResearch,
    contact: copyForm.navContact
  });
};

const saveStatsNode = async () => {
  await store.setFirebaseNode(`heroStats`, statList.value);
};

const resetStatsNode = async () => {
  await store.deleteFirebaseNode(`heroStats`);
};

// --- SECTION BLOCKS CMS PLAYGROUND (CONSTRUTOR DE BLOCOS) ---
const selectedBlockSectionId = ref('');
const currentSectionBlocks = ref<any[]>([]);

const selectedNavSection = computed(() => {
  return store.navbarItems.find(item => item.id === selectedBlockSectionId.value);
});

const sanitizeBlocksForEdit = (rawBlocks: any[]): any[] => {
  if (!Array.isArray(rawBlocks)) return [];
  return rawBlocks.map(block => {
    // 1. Convert title if missing or string
    const title = { pt: '', en: '' };
    if (block.title) {
      if (typeof block.title === 'string') {
        title.pt = block.title;
        title.en = block.title;
      } else {
        title.pt = block.title.pt || '';
        title.en = block.title.en || '';
      }
    }

    // 2. Convert subtitle
    const subtitle = { pt: '', en: '' };
    if (block.subtitle) {
      if (typeof block.subtitle === 'string') {
        subtitle.pt = block.subtitle;
        subtitle.en = block.subtitle;
      } else {
        subtitle.pt = block.subtitle.pt || '';
        subtitle.en = block.subtitle.en || '';
      }
    }

    // 3. Convert body
    const body = { pt: '', en: '' };
    if (block.body) {
      if (typeof block.body === 'string') {
        body.pt = block.body;
        body.en = block.body;
      } else {
        body.pt = block.body.pt || '';
        body.en = block.body.en || '';
      }
    }

    // 4. Sanitize items
    const rawItems = Array.isArray(block.items) ? block.items : [];
    const items = rawItems.map((item: any) => {
      const itemTitle = { pt: '', en: '' };
      if (item.title) {
        if (typeof item.title === 'string') {
          itemTitle.pt = item.title;
          itemTitle.en = item.title;
        } else {
          itemTitle.pt = item.title.pt || '';
          itemTitle.en = item.title.en || '';
        }
      }

      const itemSubtitle = { pt: '', en: '' };
      if (item.subtitle) {
        if (typeof item.subtitle === 'string') {
          itemSubtitle.pt = item.subtitle;
          itemSubtitle.en = item.subtitle;
        } else {
          itemSubtitle.pt = item.subtitle.pt || '';
          itemSubtitle.en = item.subtitle.en || '';
        }
      }

      const itemBody = { pt: '', en: '' };
      if (item.body) {
        if (typeof item.body === 'string') {
          itemBody.pt = item.body;
          itemBody.en = item.body;
        } else {
          itemBody.pt = item.body.pt || '';
          itemBody.en = item.body.en || '';
        }
      }

      const itemCtaText = { pt: '', en: '' };
      if (item.ctaText) {
        if (typeof item.ctaText === 'string') {
          itemCtaText.pt = item.ctaText;
          itemCtaText.en = item.ctaText;
        } else {
          itemCtaText.pt = item.ctaText.pt || '';
          itemCtaText.en = item.ctaText.en || '';
        }
      }

      return {
        id: item.id || ('item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(4)),
        title: itemTitle,
        subtitle: itemSubtitle,
        body: itemBody,
        value: item.value || '',
        icon: item.icon || 'fa-chevron-right',
        imgUrl: item.imgUrl || '',
        ctaText: itemCtaText,
        ctaUrl: item.ctaUrl || ''
      };
    });

    return {
      id: block.id || ('block_' + Date.now().toString(36)),
      type: block.type || 'text',
      title,
      subtitle,
      body,
      alignment: block.alignment || 'left',
      bgImageUrl: block.bgImageUrl || '',
      items
    };
  });
};

// Watch section choice to populate local reactive blocks structure
watch(selectedBlockSectionId, (newVal) => {
  if (newVal) {
    const matched = store.navbarItems.find(item => item.id === newVal);
    if (matched) {
      currentSectionBlocks.value = matched.blocks ? sanitizeBlocksForEdit(matched.blocks) : [];
    } else {
      currentSectionBlocks.value = [];
    }
  } else {
    currentSectionBlocks.value = [];
  }
});

const addCmsBlock = (type: 'text' | 'features_grid' | 'accordion' | 'stats' | 'image' | 'cta') => {
  if (!selectedBlockSectionId.value) {
    store.addToast("Selecione primeiro uma seção no menu.", "err");
    return;
  }
  const newBlock = {
    id: 'block_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(4),
    type,
    title: { pt: '', en: '' },
    subtitle: { pt: '', en: '' },
    body: { pt: '', en: '' },
    alignment: 'left',
    bgImageUrl: '',
    items: []
  };
  currentSectionBlocks.value.push(newBlock);
  store.addToast(`Bloco do tipo [${type.toUpperCase()}] inserido. Lembre-se de salvar!`, "info");
};

const deleteCmsBlock = (idx: number) => {
  if (confirm("Deseja realmente remover este bloco? Todos os conteúdos deste componente específico no site serão excluídos ao salvar.")) {
    currentSectionBlocks.value.splice(idx, 1);
  }
};

const moveCmsBlock = (idx: number, dir: 'up' | 'down') => {
  const targetIdx = dir === 'up' ? idx - 1 : idx + 1;
  if (targetIdx >= 0 && targetIdx < currentSectionBlocks.value.length) {
    const swap = currentSectionBlocks.value[idx];
    currentSectionBlocks.value[idx] = currentSectionBlocks.value[targetIdx];
    currentSectionBlocks.value[targetIdx] = swap;
  }
};

// Controls to add/edit nested block child elements
const addBlockItemElement = (block: any) => {
  if (!block.items) {
    block.items = [];
  }
  block.items.push({
    id: 'item_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(4),
    title: { pt: '', en: '' },
    subtitle: { pt: '', en: '' },
    body: { pt: '', en: '' },
    value: '',
    icon: 'fa-chevron-right',
    imgUrl: '',
    ctaText: { pt: '', en: '' },
    ctaUrl: ''
  });
};

const deleteBlockItemElement = (block: any, childIdx: number) => {
  block.items.splice(childIdx, 1);
};

const moveBlockItemElement = (block: any, childIdx: number, dir: 'up' | 'down') => {
  const targetIdx = dir === 'up' ? childIdx - 1 : childIdx + 1;
  if (targetIdx >= 0 && targetIdx < block.items.length) {
    const swap = block.items[childIdx];
    block.items[childIdx] = block.items[targetIdx];
    block.items[targetIdx] = swap;
  }
};

const saveSectionBlocks = async () => {
  if (!selectedBlockSectionId.value) {
    store.addToast("Selecione primeiro qual seção deseja atualizar.", "err");
    return;
  }
  const targetId = selectedBlockSectionId.value;
  const processed = sanitizeBlocksForEdit(currentSectionBlocks.value);

  await store.setFirebaseNode(`navbarItems/${targetId}/blocks`, processed);
  await store.setFirebaseNode(`navbarItems/${targetId}/id`, targetId);
  
  // Local Pinia update
  const matched = store.navbarItems.find(item => item.id === targetId);
  if (matched) {
    matched.blocks = processed;
    matched.id = targetId;
  }
  store.addToast("Pilha de componentes e dados da seção salvos com sucesso no Realtime!", "ok");
};
</script>
