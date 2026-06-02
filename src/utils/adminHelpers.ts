// Common Admin UI helpers and icon list declarations for modular use

export interface PopularIcon {
  name: string;
  icon: string;
  cat: string;
}

export const popularIconsList: PopularIcon[] = [
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

export const iconCategories = ['Todos', 'Planeta', 'Social', 'Gestão', 'Geral'];
