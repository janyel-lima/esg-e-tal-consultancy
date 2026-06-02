import { defineStore } from 'pinia';
import { db, auth, isConfigured } from '../firebase';
import { ref as dbRef, onValue, set, update, remove, increment } from 'firebase/database';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { 
  AreaGroup, LocalizedTexts, DynamicNewsItem, 
  DynamicResearchItem, HeroStat, ToastMessage, NavbarItem 
} from '../types';

export function resolveAsset(path: string | undefined | null): string {
  if (!path) return '';
  const str = String(path).trim();
  if (/^(https?:|\/\/|data:)/i.test(str)) {
    return str;
  }
  let clean = str;
  if (clean.startsWith('./')) {
    clean = clean.substring(2);
  }
  if (clean.startsWith('/')) {
    clean = clean.substring(1);
  }
  const baseUrl = import.meta.env.BASE_URL || './';
  let base = baseUrl;
  if (!base.endsWith('/')) {
    base = base + '/';
  }
  return `${base}${clean}`;
}

// Let's bring high-fidelity native falling layouts representing original main.js data:
const defaultAreasPt: AreaGroup = {
  env: {
    name: 'Meio Ambiente', color: '#10B981', colorSoft: 'rgba(16,185,129,0.12)', icon: 'fa-leaf',
    img: '/assets/area_env.png?v=2',
    desc: 'Promovemos a interação responsável com os recursos naturais e a biodiversidade, oferecendo soluções para neutralização das emissões de GEE, restauração e preservação ambiental. Nossos serviços incluem gestão de resíduos, avaliação, monitoramento e mitigação de riscos e impactos ambientais e a implantação de estratégias de adaptação e resiliência climáticas.',
    subtopics: [
      { title: 'Gestão sustentável de recursos e resíduos', img: '/assets/env_sub1.jpg?v=2', items: ['Implantamos soluções de economia circular e gestão integrada de resíduos, promovendo o uso eficiente dos recursos.', 'Desenvolvemos iniciativas para aprimorar os processos produtivos e minimizar os impactos ambientais.'] },
      { title: 'Análise e monitoramento de riscos e impactos ambientais', img: '/assets/env_sub2.jpg?v=2', items: ['Realizamos diagnósticos detalhados de riscos ambientais, identificando vulnerabilidades e propondo ações para controle e mitigação.', 'Monitoramos impactos ambientais ao longo do tempo, oferecendo soluções para adaptação e resiliência às mudanças climáticas.'] },
      { title: 'Projetos de restauração e preservação ambiental', img: '/assets/env_sub3.jpg?v=2', items: ['Desenvolvemos e implantamos iniciativas de recuperação ambiental em áreas críticas, como nascentes e florestas degradadas.', 'Elaboramos projetos visando à preservação de recursos naturais e biodiversidade, seguindo padrões internacionais de sustentabilidade.'] }
    ],
    testimonial: '"A visão integrada da ESG e Tal em relação às questões sociais e ambientais tem sido fundamental para o desenvolvimento de projetos complexos de recuperação ambiental e sustentabilidade social e hídrica. O fato de trabalharem com padrões internacionais de sustentabilidade garante um rigor técnico muito importante".',
    testimonialAuthor: 'Eng. Agrônomo Prof. Rinaldo Calheiros, Mestre e Doutor pela USP em Irrigação e Drenagem, Pesquisador e Consultor no planejamento, monitoramento e gestão de recursos hídricos'
  },
  social: {
    name: 'Responsabilidade Social', color: '#F59E0B', colorSoft: 'rgba(245,158,11,0.12)', icon: 'fa-people-group',
    img: '/assets/area_social.png?v=2',
    desc: 'Trabalhamos diretamente com comunidades, promovendo inclusão produtiva, capacitação e desenvolvimento sustentável. Nossas ações focam em mulheres, populações tradicionais e grupos vulneráveis, impulsionando práticas responsáveis de consumo e produção, com impactos reais na geração de renda e na melhoria das condições de vida.',
    subtopics: [
      { title: 'Arranjos Produtivos Locais (APLs) e Inclusão Socioprodutiva', img: '/assets/social_sub1.jpg?v=2', items: ['Desenvolvemos e apoiamos a implantação de APLs, integrando atividades econômicas de forma sustentável, como agricultura e pesca.', 'Trabalhamos em parceria com governos locais and ONGs para promover qualificação profissional e a integração das comunidades.'] },
      { title: 'Promoção da inclusão e diversidade', img: '/assets/social_sub2.jpg?v=2', items: ['Desenvolvemos programas de inclusão com foco em diversidade de gênero, etnia, faixa etária, orientação sexual e ancestralidade.', 'Apoiamos a implantação de iniciativas que ampliem o acesso equânime às oportunidades e reduzam as desigualdades nas organizações.'] },
      { title: 'Investimentos sociais estratégicos', img: '/assets/social_sub3.jpg?v=2', items: ['Apoiamos a estruturação de projetos sociais e produtivos que promovam o desenvolvimento econômico e inclusivo de comunidades.', 'Desenvolvemos estratégias para alavancar investimentos sociais, conectando ações de impacto aos objetivos das organizações.'] }
    ],
    testimonial: '"É sempre uma alegria encontrar Marcus e a Consultoria ESG e Tal para discutir questões sobre o tema Sustentabilidade. Sempre com colocações e análises pertinentes, tecnicamente embasadas e com um olhar amplo sobre todas as esferas".',
    testimonialAuthor: 'Christiana Costa, Superintendente de Sustentabilidade da Arteris, ex-Gerente de Sustentabilidade Corporativa da CPFL Renováveis e ex-Gerente Geral de Relações com Comunidades da Vale'
  },
  gov: {
    name: 'Governança', color: '#3B82F6', colorSoft: 'rgba(59,130,246,0.12)', icon: 'fa-scale-balanced',
    img: '/assets/area_gov.png?v=2',
    desc: 'Aprimoramos a governança corporativa de organizações por meio da implantação de padrões éticos e auditorias rigorosas, conforme diretrizes nacionais e globais (ABNT PR 2030, GRI, IFRS, entre outras). Oferecemos consultoria para fortalecimento de conselhos e implantação de mecanismos de compliance e grievance (queixas), garantindo transparência e conformidade.',
    subtopics: [
      { title: 'Compliance, "queixas" e auditoria em ESG', img: '/assets/gov_sub1.jpg?v=2', items: ['Implantamos mecanismos de compliance e queixas ("grievance") em conformidade com padrões globais de direitos humanos e gênero.', 'Realizamos auditorias periódicas para avaliar e monitorar a conformidade, identificando áreas de melhoria em governança e transparência.'] },
      { title: 'Capacitação e fortalecimento de lideranças e instituições', img: '/assets/gov_sub2.png?v=2', items: ['Apoiamos a criação e fortalecimento de estruturas de transparência e governança, como comitês, conselhos e grupos de trabalho.', 'Desenvolvemos treinamentos customizados para lideranças formais e informais, com foco no engajamento com stakeholders e em ESG.'] },
      { title: 'Avaliação e monitoramento de riscos e aspects ESG', img: '/assets/gov_sub3.jpg?v=2', items: ['Oferecemos soluções de monitoramento contínuo de riscos ESG, atendendo a padrões globais de sustentabilidade.', 'Realizamos avaliações estruturadas, incluindo recomendações, ações de mitigação de impactos e de melhoria do desempenho.'] }
    ],
    testimonial: '"O Grupo é liderado por um profissional excepcional, com sólida formação acadêmica e características únicas, como comprometimento, foco e criatividade. Sob sua liderança, projetos importantes foram conduzidos, oferecendo apoio às operações e à sede de uma grande empresa, abordando questões complexas como geopolítica e engajamento de stakeholders. Suas contribuições foram fundamentais para o desenvolvimento da organização".',
    testimonialAuthor: 'Fabio Rua, Vice-Presidente de Relações Governamentais, Comunicação e ESG da General Motors para a América do Sul e ex-Diretor de Relações Governamentais e Assuntos Regulatórios da IBM América Latina'
  },
  comm: {
    name: 'Comunicação Estratégica', color: '#8B5CF6', colorSoft: 'rgba(139,92,246,0.12)', icon: 'fa-bullhorn',
    img: '/assets/area_comm.png?v=2',
    desc: 'Desenvolvemos estratégias de comunicação que aumentam a reputação corporativa e o engajamento dos stakeholders. Nossas soluções em branding, comunicação visual e presença digital são projetadas para consolidar marcas e criar uma comunicação transparente e eficaz, alinhada com os objetivos de sustentabilidade da organização.',
    subtopics: [
      { title: 'Gestão de marca e reputação', img: '/assets/comm_sub1.jpg?v=2', items: ['Desenvolvemos estratégias completas de branding para fortalecer a reputação corporativa e melhorar o relacionamento com stakeholders.', 'Implantamos programas de avaliação contínua da reputação, medindo o impacto das iniciativas ESG nas percepções dos públicos e na marca.'] },
      { title: 'Comunicação visual de alto impacto', img: null, items: ['Produzimos materiais visuais (infográficos, relatórios etc.) que comunicam claramente os compromissos de sustentabilidade.', 'Desenvolvemos peças de comunicação impressa e digital que reforçam o valor da marca e compromissos em ESG, como os ODS.'] },
      { title: 'Estratégias de gestão e relacionamento com stakeholders', img: '/assets/comm_sub2.jpg?v=2', items: ['Desenvolvemos estratégias para melhorar as relações das empresas com seus públicos-alvo, ampliando seu engajamento via CRM / SRM.', 'Realizamos a avaliação de desempenho de visibilidade e implantamos melhorias que ampliam o alcance das iniciativas.'] }
    ],
    testimonial: '"A ESG e Tal é liderada por um profissional competente, versátil e proativo, focado no trabalho, que possui ótimo relacionamento com clientes internos e externos, veículos de comunicação e demais stakeholders. Muito dinâmico, trabalha bem em equipe, identifica oportunidades de melhoria do serviço e propõe soluções concretas".',
    testimonialAuthor: 'Renato Saraiva, Gerente Corporativo da Qualidade e SSMA do Grupo Darcy Pacheco e ex-Gerente de SSMA da Gerdau'
  }
};

const defaultAreasEn: AreaGroup = {
  env: {
    name: 'Environment', color: '#10B981', colorSoft: 'rgba(16,185,129,0.12)', icon: 'fa-leaf',
    img: '/assets/area_env.png?v=2',
    desc: 'We promote responsible interaction with natural resources and biodiversity, offering solutions for greenhouse gas (GHG) emissions offsetting, environmental restoration, and preservation. Our services include waste management, evaluation, monitoring, and mitigation of environmental risks and impacts, as well as the implementation of climate adaptation and resilience strategies.',
    subtopics: [
      { title: 'Sustainable Resource and Waste Management', img: '/assets/env_sub1.jpg?v=2', items: ['We implement circular economy solutions and integrated waste management, promoting the efficient use of resources.', 'We develop initiatives to improve production processes and minimize environmental impacts.'] },
      { title: 'Analysis and Monitoring of Environmental Risks and Impacts', img: '/assets/env_sub2.jpg?v=2', items: ['We conduct detailed diagnoses of environmental risks, identifying vulnerabilities and proposing actions for control and mitigation.', 'We monitor environmental impacts over time, offering solutions for climate change adaptation and resilience.'] },
      { title: 'Environmental Restoration and Preservation Projects', img: '/assets/env_sub3.jpg?v=2', items: ['We develop and implement environmental recovery initiatives in critical areas, such as water springs and degraded forests.', 'We design projects aimed at preserving natural resources and biodiversity, following international sustainability standards.'] }
    ],
    testimonial: '"The integrated vision of ESG e Tal regarding social and environmental issues has been fundamental to the development of complex environmental recovery, as well as social and water sustainability, projects. The fact that they work with international sustainability standards guarantees very important technical rigor."',
    testimonialAuthor: 'Agronomist Eng. Prof. Rinaldo Calheiros, MSc and PhD from USP in Irrigation and Drainage, Researcher and Consultant in water resources planning, monitoring, and management'
  },
  social: {
    name: 'Social Responsibility', color: '#F59E0B', colorSoft: 'rgba(245,158,11,0.12)', icon: 'fa-people-group',
    img: '/assets/area_social.png?v=2',
    desc: 'We work directly with communities, promoting productive inclusion, capacity-building, and sustainable development. Our actions focus on women, traditional populations, and vulnerable groups, driving responsible consumption and production practices, with real impacts on income generation and standard of living improvements.',
    subtopics: [
      { title: 'Local Productive Arrangements (APLs) and Socioproductive Inclusion', img: '/assets/social_sub1.jpg?v=2', items: ['We develop and support the implementation of APLs, integrating agricultural, fishing, and local economic activities in a sustainable way.', 'We work in partnership with local governments and NGOs to promote professional qualification and community integration.'] },
      { title: 'Promotion of Inclusion and Diversity', img: '/assets/social_sub2.jpg?v=2', items: ['We develop inclusion programs focused on gender diversity, ethnicity, age groups, sexual orientation, and ancestry.', 'We support the implementation of initiatives that expand equitable access to opportunities and reduce inequalities in organizations.'] },
      { title: 'Strategic Social Investments', img: '/assets/social_sub3.jpg?v=2', items: ['We support the structuring of social and productive projects that promote the economic and inclusive development of communities.', 'We develop strategies to leverage social investments, connecting impact initiatives to organizational goals.'] }
    ],
    testimonial: '"It is always a joy to meet Marcus and ESG e Tal Consultancy to discuss sustainability topics. Always with relevant, technically-grounded insights and analyses, and an expansive view across all domains."',
    testimonialAuthor: 'Christiana Costa, Sustainability Superintendent at Arteris, former Corporate Sustainability Manager at CPFL Renováveis and former General Manager of Community Relations at Vale'
  },
  gov: {
    name: 'Governance', color: '#3B82F6', colorSoft: 'rgba(59,130,246,0.12)', icon: 'fa-scale-balanced',
    img: '/assets/area_gov.png?v=2',
    desc: 'We enhance organizations\' corporate governance by implementing ethical standards and rigorous audits in accordance with national and global guidelines (ABNT PR 2030, GRI, IFRS, among others). We offer consulting for board strengthening and the implementation of compliance and grievance mechanisms, ensuring transparency and conformity.',
    subtopics: [
      { title: 'Compliance, "Grievances", and ESG Auditing', img: '/assets/gov_sub1.jpg?v=2', items: ['We implement compliance and grievance ("queixas") mechanisms in accordance with global human rights and gender standards.', 'We conduct periodic audits to evaluate and monitor compliance, identifying areas for improvement in governance and transparency.'] },
      { title: 'Capacity Building and Strengthening of Leadership and Institutions', img: '/assets/gov_sub2.png?v=2', items: ['We support the creation and strengthening of transparency and governance structures, such as committees, boards, and working groups.', 'We develop customized training for formal and informal leaders, focusing on stakeholder engagement and ESG.'] },
      { title: 'Assessment and Monitoring of ESG Risks and Aspects', img: '/assets/gov_sub3.jpg?v=2', items: ['We offer solutions for the continuous monitoring of ESG risks, adhering to global sustainability standards.', 'We carry out structured assessments, including recommendations, impact mitigation actions, and performance improvement measures.'] }
    ],
    testimonial: '"The Group is led by an exceptional professional, with a solid academic background and unique qualities such as commitment, focus, and creativity. Under his leadership, major projects were driven, providing critical support to operations and the headquarters of a large corporation while navigating complex themes like geopolitics and stakeholder engagement. His contributions were fundamental to the development of the organization."',
    testimonialAuthor: 'Fabio Rua, Vice President of Government Relations, Communication, and ESG at General Motors South America, former Director of Government Relations and Regulatory Affairs at IBM Latin America'
  },
  comm: {
    name: 'Strategic Communication', color: '#8B5CF6', colorSoft: 'rgba(139,92,246,0.12)', icon: 'fa-bullhorn',
    img: '/assets/area_comm.png?v=2',
    desc: 'We develop communication strategies that enhance corporate reputation and stakeholder engagement. Our branding, visual communication, and digital presence solutions are designed to consolidate brands and build transparent, effective communication aligned with the organization’s sustainability goals.',
    subtopics: [
      { title: 'Brand and Reputation Management', img: '/assets/comm_sub1.jpg?v=2', items: ['We develop comprehensive branding strategies to strengthen corporate reputation and improve stakeholder relationships.', 'We implement ongoing reputation assessment programs, measuring the impact of ESG initiatives on public perception and brand value.'] },
      { title: 'High-Impact Visual Communication', img: null, items: ['We produce visual assets (infographics, reports, etc.) that clearly communicate sustainability commitments.', 'We design print and digital communication pieces that reinforce brand value and ESG-aligned commitments, such as the UN SDGs.'] },
      { title: 'Stakeholder Relationship and Management Strategies', img: '/assets/comm_sub2.jpg?v=2', items: ['We develop strategies to improve relationships with target environments, expanding engagement through CRM / SRM tools.', 'We perform visibility performance evaluations and implement improvements that broaden the reach of initiatives.'] }
    ],
    testimonial: '"ESG e Tal is led by a competent, versatile, and proactive professional focused on delivering results, who maintains excellent relationships with internal and external clients, media outlets, and key stakeholders. Highly dynamic, a great team player, quick to identify service improvement opportunities, and prone to propose concrete solutions."',
    testimonialAuthor: 'Renato Saraiva, Corporate Quality and HSE Manager at Darcy Pacheco Group, former HSE Manager at Gerdau'
  }
};

const defaultUiTexts: { pt: LocalizedTexts; en: LocalizedTexts } = {
  pt: {
    nav: { home: 'Inicial', news: 'Notícias', about: 'Quem Somos', areas: 'Áreas de Atuação', research: 'Pesquisa e Estudos', contact: 'Contatos' },
    hero: { tag1: 'Sustentabilidade', tag2: 'Legitimidade', tag3: 'Transparência', subtitle: 'Transformando práticas ESG em resultados reais para empresas, comunidades e territórios.', cta: 'Fale Conosco', ctaSub: 'Saiba Mais' },
    news: {
      title: 'Notícias e Atualizações',
      item1: { date: '01/01/2026', headline: '"ESG e Tal – 60 Horas de Diálogos sobre Sustentabilidade para um Mundo Melhor"', link: 'Clique aqui para adquirir a obra com desconto em esgetal.com.br', linkAlt: 'também disponível na Amazon', body: 'Ela nasceu da convicção de que as práticas socioambientais, de governança e reputação não se limitam a grandes centros corporativos: elas pulsam nas escolas, pequenos negócios e na resiliência do povo, do Agreste Alagoano às grandes conferências internacionais.', body2: 'A iniciativa da ESG e Tal tem autoria de Marcus Vinicius Peixoto da Silva e projeto gráfico, ilustrações e capa de José Adnael Silva, tendo sido viabilizada com recursos da Política Nacional Aldir Blanc, do Governo Federal, através do Ministério da Cultura. A PNAB/AL foi operacionalizada pelo Governo de Alagoas por meio da Secretaria de Estado da Cultura e Economia Criativa de Alagoas.' },
      item2: { date: '28/05/2025', headline: 'Diretor da ESG e Tal recebe prêmio: cordel reúne inclusão, inovação, cultura e legado', link: 'Clique aqui e acesse a versão eletrônica.', body: 'Se preferir baixar a obra para impressão (PDF),', linkAlt: 'clique neste link' },
      nl: { title: 'Fique por dentro', subtitle: 'Receba pesquisas, notícias e insights sobre ESG diretamente na sua caixa de entrada.', namePh: 'Seu nome completo', emailPh: 'Seu melhor e-mail', btn: 'Inscrever-se gratuitamente', ok: 'Inscrição realizada com sucesso!', disclaimer: 'Respeitamos sua privacidade · Cancele a qualquer momento · Cumprimos a LGPD' }
    },
    about: { title: 'NOSSO PROPÓSITO', subtitle: 'Transformar sustentabilidade em resultados, com transparência e inclusão produtiva.', quote: '"Queremos que nossos clientes sejam referência no Brasil em boas práticas ESG e Comunicação, promovendo o desenvolvimento socioeconômico de maneira inclusiva. Para isso, construímos parcerias de longo prazo com organizações que buscam impactar de modo positivo o meio ambiente, a sociedade e a governança nos territórios nos quais estejam inseridas".', quoteAuthor: 'Marcus Vinicius Peixoto da Silva', quoteRole: 'Sócio-Diretor da ESG e Tal', testimonial: '"O Grupo é liderado por um profissional excepcional, com sólida formação acadêmica e características únicas, como comprometimento, foco e criatividade. Sob sua liderança, projetos importantes foram conduzidos, oferecendo apoio às operações e à sede de uma grande empresa, abordando questões complexas como geopolítica e engajamento de stakeholders. Suas contribuições foram fundamentais para o desenvolvimento da organização".', testimonialAuthor: 'Fabio Rua', testimonialRole: 'Vice-Presidente de Relações Governamentais, Comunicação e ESG da GM para a América do Sul' },
    areas: { title: 'Áreas de Atuação', learnMore: 'Saiba Mais' },
    research: { title: 'Pesquisa e Estudos', item1: { date: '14/01/2026', headline: 'Precisamos falar de segurança pública: quando uma vida, o "S" de ESG e o território se encontram', author: 'Artigo de Marcus Peixoto (ESG e Tal), sobre segurança pública, planejamento territorial e design ambiental.', cta: 'Clique aqui e acesse o artigo completo', body1: 'O artigo compila dados e análises técnicas sobre segurança urbana e soluções de design ambiental. Desejamos que ele alcance o maior número de mãos comprometidas com uma mudança real no cenário da violência de gênero, como lideranças, gestores e pesquisadores.', body2: 'O acesso é gratuito. Pedimos apenas um breve cadastro para manter um canal aberto sobre futuras ações e debates focados na melhoria dos indicadores socioeconômicos em nossos territórios.', body3: 'A ESG e Tal cumpre rigorosamente a legislação de proteção de dados (LGPD). Nossos representantes e parceiros respeitam ao máximo as razões que motivaram a elaboração deste documento.' } },
    contact: { title: 'Fale Conosco', subtitle: 'Estamos prontos para ajudar sua empresa a alcançar resultados sustentáveis e impactar positivamente o mundo.', body: 'Entre em contato com a ESG e Tal e descubra como podemos trabalhar juntos para criar soluções inovadoras em ESG e comunicação estratégica.', cta1: 'Solicite uma proposta', cta2: 'Converse com especialista' },
    footer: { tagline: 'Sustentabilidade · Legitimidade · Transparência', rights: '© 2026 ESG e Tal Consultancy. Todos os direitos reservados.' },
    modal: { close: 'Fechar', testimonialLabel: 'O que dizem sobre nós' }
  },
  en: {
    nav: { home: 'Home', news: 'News', about: 'About Us', areas: 'Expertise', research: 'Research', contact: 'Contact' },
    hero: { tag1: 'Sustainability', tag2: 'Legitimacy', tag3: 'Transparency', subtitle: 'Turning ESG practices into real results for companies, communities, and territories.', cta: 'Contact Us', ctaSub: 'Learn More' },
    news: {
      title: 'News & Updates',
      item1: { date: '01/01/2026', headline: '"ESG e Tal – 60 Hours of Dialogues on Sustainability for a Better World"', link: 'Click here to purchase the book on esgetal.com.br', linkAlt: 'also available on Amazon', body: 'Born from the conviction that socio-environmental, governance, and reputational practices are not limited to large corporate centers: they pulse in schools, small businesses, and the resilience of people, from the Agreste Alagoano to major international conferences.', body2: 'The ESG e Tal initiative was authored by Marcus Vinicius Peixoto da Silva with graphic design, illustrations and cover by José Adnael Silva, made possible by the Aldir Blanc National Policy, through the Ministry of Culture.' },
      item2: { date: '28/05/2025', headline: 'ESG e Tal Director Receives Award: cordel brings together inclusion, innovation, culture and legacy', link: 'Click here to access the electronic version.', body: 'If you prefer to download for printing (PDF),', linkAlt: 'click here' },
      nl: { title: 'Stay in the loop', subtitle: 'Receive our latest research, news, and ESG insights directly in your inbox.', namePh: 'Your full name', emailPh: 'Your best email', btn: 'Subscribe for free', ok: 'You\'re subscribed! Thank you.', disclaimer: 'We respect your privacy · Unsubscribe anytime · LGPD compliant' }
    },
    about: { title: 'OUR PURPOSE', subtitle: 'Transform sustainability into results, with transparency and productive inclusion.', quote: '"We want our clients to be a reference in Brazil for good ESG and Communication practices, promoting socioeconomic development inclusively. To this end, we build long-term partnerships with organizations that seek to positively impact the environment, society, and governance in the territories where they operate".', quoteAuthor: 'Marcus Vinicius Peixoto da Silva', quoteRole: 'Managing Director, ESG e Tal', testimonial: '"The Group is led by an exceptional professional, with strong academic background and unique characteristics such as commitment, focus, and creativity. Under his leadership, important projects were conducted, providing support to operations and the headquarters of a large company, addressing complex issues such as geopolitics and stakeholder engagement. His contributions were fundamental to the organization\'s development".', testimonialAuthor: 'Fabio Rua', testimonialRole: 'VP of Government Relations, Communication and ESG at GM South America' },
    areas: { title: 'Areas of Expertise', learnMore: 'Learn More' },
    research: { title: 'Research & Studies', item1: { date: '01/14/2026', headline: 'We need to talk about public security: when a life, the "S" in ESG, and territory intersect', author: 'Article by Marcus Peixoto (ESG e Tal), on public security, territorial planning, and environmental design.', cta: 'Click here to access the full article', body1: 'The article compiles technical data and analyses on urban security and environmental design solutions. We hope it reaches the greatest number of hands committed to real change in the landscape of gender violence.', body2: 'Access is free. We only ask for a brief registration to maintain an open channel on future actions and debates focused on improving socioeconomic indicators in our territories.', body3: 'ESG e Tal strictly complies with data protection legislation (LGPD). Our representatives and partners fully respect the reasons that motivated the preparation of this document.' } },
    contact: { title: 'Get in Touch', subtitle: 'We are ready to help your company achieve sustainable results and make a positive impact on the world.', body: 'Contact ESG e Tal and discover how we can work together to create innovative solutions in ESG and strategic communication.', cta1: 'Request a proposal', cta2: 'Talk to an expert' },
    footer: { tagline: 'Sustainability · Legitimacy · Transparency', rights: '© 2026 ESG e Tal Consultancy. All rights reserved.' },
    modal: { close: 'Close', testimonialLabel: 'What they say about us' }
  }
};

const defaultStats: HeroStat[] = [
  { value: '4', label_pt: 'Áreas de Atuação', label_en: 'Areas of Expertise' },
  { value: '60h+', label_pt: 'Horas de Diálogos', label_en: 'Hours of Dialogues' },
  { value: 'GRI', label_pt: 'Padrão Internacional', label_en: 'International Standard' },
  { value: 'ESG', label_pt: '100% Transparência', label_en: 'Full Transparency' },
];

export const defaultNavbarItems: NavbarItem[] = [
  { id: 'home', label: { pt: 'Inicial', en: 'Home' }, target: 'home', isExternal: false, visible: true, order: 10 },
  { id: 'news', label: { pt: 'Notícias', en: 'News' }, target: 'news', isExternal: false, visible: true, order: 20 },
  { id: 'about', label: { pt: 'Quem Somos', en: 'About Us' }, target: 'about', isExternal: false, visible: true, order: 30 },
  { id: 'areas', label: { pt: 'Áreas de Atuação', en: 'Expertise' }, target: 'areas', isExternal: false, visible: true, order: 40 },
  { id: 'research', label: { pt: 'Pesquisa e Estudos', en: 'Research' }, target: 'research', isExternal: false, visible: true, order: 50 },
  { id: 'contact', label: { pt: 'Contatos', en: 'Contact' }, target: 'contact', isExternal: false, visible: true, order: 60 }
];

export const initialNewsList: DynamicNewsItem[] = [
  {
    id: 'news_book',
    date: { pt: '01/01/2026', en: '01/01/2026' },
    headline: {
      pt: '"ESG e Tal – 60 Horas de Diálogos sobre Sustentabilidade para um Mundo Melhor"',
      en: '"ESG e Tal – 60 Hours of Dialogues on Sustainability for a Better World"'
    },
    body: {
      pt: 'Ela nasceu da convicção de que as práticas socioambientais, de governança e reputação não se limitam a grandes centros corporativos: elas pulsam nas escolas, pequenos negócios e na resiliência do povo, do Agreste Alagoano às grandes conferências internacionais.',
      en: 'Born from the conviction that socio-environmental, governance, and reputational practices are not limited to large corporate centers: they pulse in schools, small businesses, and the resilience of people, from the Agreste Alagoano to major international conferences.'
    },
    body2: {
      pt: 'A iniciativa da ESG e Tal tem autoria de Marcus Vinicius Peixoto de Silva e projeto gráfico, ilustrações e capa de José Adnael Silva, tendo sido viabilizada com recursos da Política Nacional Aldir Blanc, do Governo Federal, através do Ministério da Cultura. A PNAB/AL foi operacionalizada pelo Governo de Alagoas por meio da Secretaria de Estado da Cultura e Economia Criativa de Alagoas.',
      en: 'The ESG e Tal initiative was authored by Marcus Vinicius Peixoto da Silva with graphic design, illustrations and cover by José Adnael Silva, made possible by the Aldir Blanc National Policy, through the Ministry of Culture.'
    },
    linkUrl: 'https://esgetal.com.br',
    linkText: {
      pt: 'Clique aqui para adquirir a obra com desconto em esgetal.com.br',
      en: 'Click here to purchase the book on esgetal.com.br'
    },
    linkAltUrl: 'https://amazon.com.br',
    linkAltText: {
      pt: 'também disponível na Amazon',
      en: 'also available on Amazon'
    },
    isFeaturedBook: true,
    isAward: false,
    visible: true,
    createdAt: 1767225600000
  },
  {
    id: 'news_award',
    date: { pt: '28/05/2025', en: '28/05/2025' },
    headline: {
      pt: 'Diretor da ESG e Tal recebe prêmio: cordel reúne inclusão, inovação, cultura e legado',
      en: 'ESG e Tal Director Receives Award: cordel brings together inclusion, innovation, culture and legacy'
    },
    body: {
      pt: 'A obra de cordel premiada reúne elementos de inclusão socioeconômica, preservação cultural e inovação focada no desenvolvimento sustentável regional. Acesse a versão eletrônica para ler na íntegra.',
      en: 'The award-winning cordel work combines elements of socioeconomic inclusion, cultural preservation, and innovation focused on regional sustainable development. Access the digital version to read in full.'
    },
    linkUrl: 'https://esgetal.com.br',
    linkText: {
      pt: 'Clique aqui e acesse a versão eletrônica.',
      en: 'Click here to access the electronic version.'
    },
    isAward: true,
    isFeaturedBook: false,
    visible: true,
    createdAt: 1748390400000
  }
];

export const initialResearchList: DynamicResearchItem[] = [
  {
    id: 'research_featured',
    date: { pt: '14/01/2026', en: '01/14/2026' },
    headline: {
      pt: 'Precisamos falar de segurança pública: quando uma vida, o "S" de ESG e o território se encontram',
      en: 'We need to talk about public security: when a life, the "S" in ESG, and territory intersect'
    },
    author: {
      pt: 'Artigo de Marcus Peixoto (ESG e Tal), sobre segurança pública, planejamento territorial e design ambiental.',
      en: 'Article by Marcus Peixoto (ESG e Tal), on public security, territorial planning, and environmental design.'
    },
    body: {
      pt: 'O artigo compila dados e análises técnicas sobre segurança urbana e soluções de design ambiental. Desejamos que ele alcance o maior número de mãos comprometidas com uma mudança real no cenário da violência de gênero, como lideranças, gestores e pesquisadores.',
      en: 'The article compiles technical data and analyses on urban security and environmental design solutions. We hope it reaches the greatest number of hands committed to real change in the landscape of gender violence.'
    },
    body2: {
      pt: 'O acesso é gratuito. Pedimos apenas um breve cadastro para manter um canal aberto sobre futuras ações e debates focados na melhoria dos indicadores socioeconômicos em nossos territórios. A ESG e Tal cumpre rigorosamente a legislação de proteção de dados (LGPD).',
      en: 'Access is free. We only ask for a brief registration to maintain an open channel on future actions and debates focused on improving socioeconomic indicators in our territories. ESG e Tal strictly complies with data protection legislation (LGPD).'
    },
    ctaUrl: 'https://docs.google.com/forms/d/16YldwC9CDqSbX7rS9Wfwnk53Ekpcuga0AmE-UX3EhKQ/viewform',
    ctaText: {
      pt: 'Clique aqui e acesse o artigo completo',
      en: 'Click here to access the full article'
    },
    imgUrl: '/assets/research_featured.jpg?v=2',
    isFeatured: true,
    visible: true,
    createdAt: 1768348800000
  }
];

/**
 * Deeply sanitizes any blocks property to ensure it's a solid, backwards-compatible,
 * fully hydrated Array of blocks with items array and standardized keys.
 */
export function sanitizeNavbarBlocks(rawBlocks: any): any[] {
  const ensureArray = (v: any): any[] => {
    if (!v) return [];
    if (Array.isArray(v)) return v;
    if (typeof v === 'object') {
      return Object.keys(v)
        .sort((a, b) => {
          const na = parseInt(a, 10);
          const nb = parseInt(b, 10);
          if (!isNaN(na) && !isNaN(nb)) return na - nb;
          return a.localeCompare(b);
        })
        .map(k => v[k]);
    }
    return [];
  };

  return ensureArray(rawBlocks).map((block: any) => {
    if (!block || typeof block !== 'object') return null;
    
    // Convert strings to localized labels if they were somehow flattened
    const title = typeof block.title === 'string' 
      ? { pt: block.title, en: block.title } 
      : (block.title || { pt: '', en: '' });
      
    const subtitle = typeof block.subtitle === 'string' 
      ? { pt: block.subtitle, en: block.subtitle } 
      : (block.subtitle || { pt: '', en: '' });
      
    const body = typeof block.body === 'string' 
      ? { pt: block.body, en: block.body } 
      : (block.body || { pt: '', en: '' });

    const items = ensureArray(block.items).map((itm: any) => {
      if (!itm || typeof itm !== 'object') return null;
      
      const itemTitle = typeof itm.title === 'string'
        ? { pt: itm.title, en: itm.title }
        : (itm.title || { pt: '', en: '' });

      const itemSubtitle = typeof itm.subtitle === 'string'
        ? { pt: itm.subtitle, en: itm.subtitle }
        : (itm.subtitle || { pt: '', en: '' });

      const itemBody = typeof itm.body === 'string'
        ? { pt: itm.body, en: itm.body }
        : (itm.body || { pt: '', en: '' });

      const itemCtaText = typeof itm.ctaText === 'string'
        ? { pt: itm.ctaText, en: itm.ctaText }
        : (itm.ctaText || { pt: '', en: '' });

      return {
        id: itm.id || ('item_' + Math.random().toString(36).substring(2, 11)),
        title: itemTitle,
        subtitle: itemSubtitle,
        body: itemBody,
        value: itm.value || '',
        icon: itm.icon || 'fa-chevron-right',
        imgUrl: itm.imgUrl || '',
        ctaText: itemCtaText,
        ctaUrl: itm.ctaUrl || ''
      };
    }).filter(Boolean);

    return {
      id: block.id || ('block_' + Math.random().toString(36).substring(2, 11)),
      type: block.type || 'text',
      title,
      subtitle,
      body,
      alignment: block.alignment || 'left',
      bgImageUrl: block.bgImageUrl || '',
      items
    };
  }).filter(Boolean);
}

export const useEsgStore = defineStore('esg', {
  state: () => {
    // Check local preferences
    const sd = localStorage.getItem('esg-dark');
    const sl = localStorage.getItem('esg-lang');

    return {
      lang: (sl === 'en' ? 'en' : 'pt') as 'pt' | 'en',
      darkMode: sd === null ? false : sd === 'true',
      mobileMenuOpen: false,

      // Live synchronized fields
      areasPt: JSON.parse(JSON.stringify(defaultAreasPt)) as AreaGroup,
      areasEn: JSON.parse(JSON.stringify(defaultAreasEn)) as AreaGroup,
      uiTextsPt: JSON.parse(JSON.stringify(defaultUiTexts.pt)) as LocalizedTexts,
      uiTextsEn: JSON.parse(JSON.stringify(defaultUiTexts.en)) as LocalizedTexts,
      heroStats: JSON.parse(JSON.stringify(defaultStats)) as HeroStat[],
      dynamicNews: JSON.parse(JSON.stringify(initialNewsList)) as DynamicNewsItem[],
      dynamicResearch: JSON.parse(JSON.stringify(initialResearchList)) as DynamicResearchItem[],
      navbarItems: JSON.parse(JSON.stringify(defaultNavbarItems)) as NavbarItem[],

      // Connections and status
      isConfigured: isConfigured,
      firebaseStatus: isConfigured ? 'Iniciando…' : 'Firebase não conectado',
      userEmail: null as string | null,
      isLoggedIn: false,
      toasts: [] as ToastMessage[],
      activeModal: null as string | null, // key of active area

      // Newsletter and CRM management
      subscribers: [] as { id: string; email: string; name: string; subscribed: boolean; createdAt: number; updatedAt: number }[],
      newsletterConfig: {
        provider: 'simulator', // 'simulator' | 'emailjs'
        serviceId: '',
        templateId: '',
        publicKey: '',
        senderName: 'ESG e Tal',
        welcomeTemplateId: '',
        unsubscribeTemplateId: '',
        newItemTemplateId: '',
      },

      // Live tracked metrics for site visits and interactions
      metrics: {
        visits: 0,
        contact_whatsapp: 0,
        contact_email: 0,
        contact_form_submit: 0,
        download_book: 0,
        newsletter_submit: 0,
        section_env: 0,
        section_social: 0,
        section_gov: 0,
        section_comm: 0,
      },
      dailyMetrics: {} as Record<string, Record<string, number>>,
    };
  },

  getters: {
    areas(state): (AreaGroup[string] & { key: string })[] {
      const activeGroup = state.lang === 'en' ? state.areasEn : state.areasPt;
      
      const getFallbackAreaImg = (key: string): string => {
        const fallbacks: Record<string, string> = {
          env: '/assets/area_env.png?v=2',
          social: '/assets/area_social.png?v=2',
          gov: '/assets/area_gov.png?v=2',
          comm: '/assets/area_comm.png?v=2'
        };
        return fallbacks[key] || '/assets/area_env.png?v=2';
      };

      const sanitizeImagePath = (path: any, fallback: string): string => {
        if (!path || typeof path !== 'string' || !path.trim() || path === 'null' || path === 'undefined') return resolveAsset(fallback);
        let resolved = path.trim();
        if (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('data:') || resolved.startsWith('//')) {
          return resolved;
        }
        if (!resolved.startsWith('/assets/')) {
          const parts = resolved.split('/');
          const filename = parts[parts.length - 1];
          if (filename && filename.includes('.')) {
            resolved = `/assets/${filename}`;
          } else {
            resolved = fallback;
          }
        }
        if (resolved.startsWith('/assets/') && !resolved.includes('?')) {
          resolved = `${resolved}?v=2`;
        }
        return resolveAsset(resolved);
      };

      return Object.entries(activeGroup).map(([key, value]) => {
        const defaultImg = getFallbackAreaImg(key);
        const resolvedImg = sanitizeImagePath(value.img, defaultImg);
        
        const resolvedSubtopics = (value.subtopics || []).map((st: any, idx: number) => {
          let topicFallback = `/assets/env_sub1.jpg?v=2`;
          if (key === 'env') {
            topicFallback = `/assets/env_sub${(idx % 3) + 1}.jpg?v=2`;
          } else if (key === 'social') {
            topicFallback = `/assets/social_sub${(idx % 3) + 1}.jpg?v=2`;
          } else if (key === 'gov') {
            topicFallback = idx === 1 ? '/assets/gov_sub2.png?v=2' : `/assets/gov_sub${(idx % 3) + 1}.jpg?v=2`;
          } else if (key === 'comm') {
            topicFallback = `/assets/comm_sub${(idx % 2) + 1}.jpg?v=2`;
          }
          return {
            ...st,
            img: sanitizeImagePath(st?.img, topicFallback)
          };
        });

        return {
          key,
          ...value,
          img: resolvedImg,
          subtopics: resolvedSubtopics
        };
      });
    },

    activeArea(state): AreaGroup[string] | null {
      if (!state.activeModal) return null;
      const activeList = this.areas;
      return activeList.find(a => a.key === state.activeModal) || null;
    },

    texts(state): LocalizedTexts {
      return state.lang === 'en' ? state.uiTextsEn : state.uiTextsPt;
    },

    sortedNews(state): DynamicNewsItem[] {
      return [...state.dynamicNews].sort((a, b) => b.createdAt - a.createdAt);
    },

    sortedResearch(state): DynamicResearchItem[] {
      const defaultImg = '/assets/research_featured.jpg?v=2';
      const sanitizeImagePath = (path: any, fallback: string): string => {
        if (!path || typeof path !== 'string' || !path.trim() || path === 'null' || path === 'undefined') return resolveAsset(fallback);
        let resolved = path.trim();
        if (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('data:') || resolved.startsWith('//')) {
          return resolved;
        }
        if (!resolved.startsWith('/assets/')) {
          const parts = resolved.split('/');
          const filename = parts[parts.length - 1];
          if (filename && filename.includes('.')) {
            resolved = `/assets/${filename}`;
          } else {
            resolved = fallback;
          }
        }
        if (resolved.startsWith('/assets/') && !resolved.includes('?')) {
          resolved = `${resolved}?v=2`;
        }
        return resolveAsset(resolved);
      };

      return [...state.dynamicResearch]
        .map(item => ({
          ...item,
          imgUrl: sanitizeImagePath(item.imgUrl, defaultImg)
        }))
        .sort((a, b) => b.createdAt - a.createdAt);
    }
  },

  actions: {
    toggleDark() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('esg-dark', String(this.darkMode));
      if (this.darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },

    toggleLang() {
      this.lang = this.lang === 'pt' ? 'en' : 'pt';
      localStorage.setItem('esg-lang', this.lang);
    },

    addToast(text: string, type: 'ok' | 'err' | 'info' = 'ok') {
      const id = 't' + Date.now() + Math.random().toString(36).slice(2, 5);
      this.toasts.push({ id, text, type });
      setTimeout(() => {
        this.toasts = this.toasts.filter(t => t.id !== id);
      }, 3500);
    },

    openAreaModal(key: string) {
      this.activeModal = key;
      document.body.style.overflow = 'hidden';
    },

    closeAreaModal() {
      this.activeModal = null;
      document.body.style.overflow = '';
    },

    resolveAsset(path: string | undefined | null): string {
      return resolveAsset(path);
    },

    trackEvent(eventKey: string) {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      // Offline or Sandbox increment
      if (this.metrics && typeof (this.metrics as any)[eventKey] === 'number') {
        (this.metrics as any)[eventKey]++;
      }
      if (!this.dailyMetrics) {
        this.dailyMetrics = {};
      }
      if (!this.dailyMetrics[dateStr]) {
        this.dailyMetrics[dateStr] = {};
      }
      this.dailyMetrics[dateStr][eventKey] = (this.dailyMetrics[dateStr][eventKey] || 0) + 1;

      if (!isConfigured || !db) {
        return;
      }
      try {
        const metricRef = dbRef(db, `metrics/${eventKey}`);
        set(metricRef, increment(1));

        const dailyRef = dbRef(db, `daily_metrics/${dateStr}/${eventKey}`);
        set(dailyRef, increment(1));
      } catch (err) {
        console.warn("Error tracking event:", eventKey, err);
      }
    },

    resetMetrics() {
      if (!isConfigured || !db) {
        this.metrics = {
          visits: 0,
          contact_whatsapp: 0,
          contact_email: 0,
          contact_form_submit: 0,
          download_book: 0,
          newsletter_submit: 0,
          section_env: 0,
          section_social: 0,
          section_gov: 0,
          section_comm: 0,
        };
        this.dailyMetrics = {};
        this.addToast("Métricas zeradas no modo offline", "success");
        return;
      }
      try {
        const metricsRef = dbRef(db, 'metrics');
        set(metricsRef, {
          visits: 0,
          contact_whatsapp: 0,
          contact_email: 0,
          contact_form_submit: 0,
          download_book: 0,
          newsletter_submit: 0,
          section_env: 0,
          section_social: 0,
          section_gov: 0,
          section_comm: 0,
        });

        const dailyRef = dbRef(db, 'daily_metrics');
        set(dailyRef, null);

        this.addToast("Todas as métricas foram zeradas com sucesso!", "success");
      } catch (err) {
        console.error("Error resetting metrics:", err);
        this.addToast("Erro ao zerar métricas no Firebase.", "error");
      }
    },

    // ── Firebase Realtime Sync ────────────────────────────────────────────────
    setupAuthObserver() {
      if (!isConfigured || !auth) return;
      onAuthStateChanged(auth, (user) => {
        if (user) {
          this.userEmail = user.email;
          this.isLoggedIn = true;
        } else {
          this.userEmail = null;
          this.isLoggedIn = false;
        }
      });
    },

    setupRealtimeSync() {
      if (!isConfigured || !db) {
        this.loadOfflineCmsCache();
        return;
      }
      const rootRef = dbRef(db, 'siteContent');

      onValue(rootRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          this.firebaseStatus = 'Sincronizado ✓';
          
          const sanitizeImagePath = (path: any, defaultValue: string): string => {
            if (!path || typeof path !== 'string' || !path.trim()) return defaultValue;
            let resolved = path.trim();
            if (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('data:') || resolved.startsWith('//')) {
              return resolved;
            }
            if (!resolved.startsWith('/assets/')) {
              const parts = resolved.split('/');
              const filename = parts[parts.length - 1];
              if (filename && filename.includes('.')) {
                resolved = `/assets/${filename}`;
              } else {
                resolved = defaultValue;
              }
            }
            if (resolved.startsWith('/assets/') && !resolved.includes('?')) {
              return `${resolved}?v=2`;
            }
            return resolved;
          };

          // Overrides Areas with safety checks to never lose images (e.g. from empty DB definitions)
          if (data.areasData) {
            if (data.areasData.pt) {
              Object.entries(data.areasData.pt).forEach(([key, value]: [string, any]) => {
                if (this.areasPt[key]) {
                  const originalImg = this.areasPt[key].img;
                  const originalSubtopics = JSON.parse(JSON.stringify(this.areasPt[key].subtopics));
                  
                  this.areasPt[key] = { ...this.areasPt[key], ...value };
                  
                  // Keep default asset if DB value has empty/falsy/broken image path
                  this.areasPt[key].img = sanitizeImagePath(this.areasPt[key].img, originalImg);
                  
                  // Restore or guard subtopic asset images
                  if (value.subtopics && Array.isArray(value.subtopics)) {
                    this.areasPt[key].subtopics = value.subtopics.map((st: any, sidx: number) => {
                      const origSt = originalSubtopics[sidx] || {};
                      return {
                        title: st.title || '',
                        img: sanitizeImagePath(st.img, origSt.img || null),
                        items: st.items || []
                      };
                    });
                  } else {
                    this.areasPt[key].subtopics = originalSubtopics;
                  }
                }
              });
            }
            if (data.areasData.en) {
              Object.entries(data.areasData.en).forEach(([key, value]: [string, any]) => {
                if (this.areasEn[key]) {
                  const originalImg = this.areasEn[key].img;
                  const originalSubtopics = JSON.parse(JSON.stringify(this.areasEn[key].subtopics));
                  
                  this.areasEn[key] = { ...this.areasEn[key], ...value };
                  
                  // Keep default asset if DB value has empty/falsy/broken image path
                  this.areasEn[key].img = sanitizeImagePath(this.areasEn[key].img, originalImg);
                  
                  // Restore or guard subtopic asset images
                  if (value.subtopics && Array.isArray(value.subtopics)) {
                    this.areasEn[key].subtopics = value.subtopics.map((st: any, sidx: number) => {
                      const origSt = originalSubtopics[sidx] || {};
                      return {
                        title: st.title || '',
                        img: sanitizeImagePath(st.img, origSt.img || null),
                        items: st.items || []
                      };
                    });
                  } else {
                    this.areasEn[key].subtopics = originalSubtopics;
                  }
                }
              });
            }
          }

          // Overrides Core Copy Texts (Nav, Hero, etc.)
          if (data.copy) {
            if (data.copy.pt) {
              const cPt = data.copy.pt;
              if (cPt.hero) this.uiTextsPt.hero = { ...this.uiTextsPt.hero, ...cPt.hero };
              if (cPt.nav) this.uiTextsPt.nav = { ...this.uiTextsPt.nav, ...cPt.nav };
              if (cPt.about) this.uiTextsPt.about = { ...this.uiTextsPt.about, ...cPt.about };
              if (cPt.contact) this.uiTextsPt.contact = { ...this.uiTextsPt.contact, ...cPt.contact };
              if (cPt.footer) this.uiTextsPt.footer = { ...this.uiTextsPt.footer, ...cPt.footer };
              if (cPt.newsNl) this.uiTextsPt.news.nl = { ...this.uiTextsPt.news.nl, ...cPt.newsNl };
              if (cPt.modal) this.uiTextsPt.modal = { ...this.uiTextsPt.modal, ...cPt.modal };
              if (cPt.sectionLabels) {
                const sl = cPt.sectionLabels;
                if (sl.newsTitle) this.uiTextsPt.news.title = sl.newsTitle;
                if (sl.aboutTitle) this.uiTextsPt.about.title = sl.aboutTitle;
                if (sl.areasTitle) this.uiTextsPt.areas.title = sl.areasTitle;
                if (sl.areasLearnMore) this.uiTextsPt.areas.learnMore = sl.areasLearnMore;
                if (sl.researchTitle) this.uiTextsPt.research.title = sl.researchTitle;
              }
            }
            if (data.copy.en) {
              const cEn = data.copy.en;
              if (cEn.hero) this.uiTextsEn.hero = { ...this.uiTextsEn.hero, ...cEn.hero };
              if (cEn.nav) this.uiTextsEn.nav = { ...this.uiTextsEn.nav, ...cEn.nav };
              if (cEn.about) this.uiTextsEn.about = { ...this.uiTextsEn.about, ...cEn.about };
              if (cEn.contact) this.uiTextsEn.contact = { ...this.uiTextsEn.contact, ...cEn.contact };
              if (cEn.footer) this.uiTextsEn.footer = { ...this.uiTextsEn.footer, ...cEn.footer };
              if (cEn.newsNl) this.uiTextsEn.news.nl = { ...this.uiTextsEn.news.nl, ...cEn.newsNl };
              if (cEn.modal) this.uiTextsEn.modal = { ...this.uiTextsEn.modal, ...cEn.modal };
              if (cEn.sectionLabels) {
                const sl = cEn.sectionLabels;
                if (sl.newsTitle) this.uiTextsEn.news.title = sl.newsTitle;
                if (sl.aboutTitle) this.uiTextsEn.about.title = sl.aboutTitle;
                if (sl.areasTitle) this.uiTextsEn.areas.title = sl.areasTitle;
                if (sl.areasLearnMore) this.uiTextsEn.areas.learnMore = sl.areasLearnMore;
                if (sl.researchTitle) this.uiTextsEn.research.title = sl.researchTitle;
              }
            }
          }

          // Fixed News PT/EN inside data.news
          if (data.news) {
            if (data.news.pt) {
              if (data.news.pt.item1) this.uiTextsPt.news.item1 = { ...this.uiTextsPt.news.item1, ...data.news.pt.item1 };
              if (data.news.pt.item2) this.uiTextsPt.news.item2 = { ...this.uiTextsPt.news.item2, ...data.news.pt.item2 };
            }
            if (data.news.en) {
              if (data.news.en.item1) this.uiTextsEn.news.item1 = { ...this.uiTextsEn.news.item1, ...data.news.en.item1 };
              if (data.news.en.item2) this.uiTextsEn.news.item2 = { ...this.uiTextsEn.news.item2, ...data.news.en.item2 };
            }
          }

          // Fixed Research PT/EN inside data.research
          if (data.research) {
            if (data.research.pt && data.research.pt.item1) {
              this.uiTextsPt.research.item1 = { ...this.uiTextsPt.research.item1, ...data.research.pt.item1 };
            }
            if (data.research.en && data.research.en.item1) {
              this.uiTextsEn.research.item1 = { ...this.uiTextsEn.research.item1, ...data.research.en.item1 };
            }
          }

          // Overrides Hero Stats
          if (data.heroStats && Array.isArray(data.heroStats)) {
            this.heroStats = data.heroStats;
          }

          // Dynamic lists Fallbacks (Unification of existing default items & cms registries)
          if (data.dynamicNews) {
            const rawNews = Object.values(data.dynamicNews) as DynamicNewsItem[];
            const mergedMap = new Map<string, DynamicNewsItem>();
            initialNewsList.forEach(item => {
              mergedMap.set(item.id, JSON.parse(JSON.stringify(item)));
            });
            rawNews.forEach((item) => {
              const existing = mergedMap.get(item.id);
              mergedMap.set(item.id, {
                ...existing,
                ...item,
                linkUrl: item.linkUrl || (existing ? existing.linkUrl : 'https://esgetal.com.br'),
              });
            });
            this.dynamicNews = Array.from(mergedMap.values());
          } else {
            this.dynamicNews = JSON.parse(JSON.stringify(initialNewsList));
          }

          if (data.dynamicResearch) {
            const rawResearch = Object.values(data.dynamicResearch) as DynamicResearchItem[];
            const mergedMap = new Map<string, DynamicResearchItem>();
            initialResearchList.forEach(item => {
              mergedMap.set(item.id, JSON.parse(JSON.stringify(item)));
            });
            rawResearch.forEach((item) => {
              const existing = mergedMap.get(item.id);
              mergedMap.set(item.id, {
                ...existing,
                ...item,
                imgUrl: sanitizeImagePath(item.imgUrl, existing ? existing.imgUrl : '/assets/research_featured.jpg')
              });
            });
            this.dynamicResearch = Array.from(mergedMap.values());
          } else {
            this.dynamicResearch = JSON.parse(JSON.stringify(initialResearchList));
          }

          // Dynamic Navbar items
          const mergedNavsMap = new Map<string, NavbarItem>();
          defaultNavbarItems.forEach(item => {
            mergedNavsMap.set(item.id, JSON.parse(JSON.stringify(item)));
          });

          if (data.navbarItems) {
            Object.entries(data.navbarItems).forEach(([navId, navVal]: [string, any]) => {
              if (navVal && typeof navVal === 'object') {
                const itemId = navVal.id || navId;
                if (navVal.deleted === true) {
                  mergedNavsMap.delete(itemId);
                } else {
                  const existing = mergedNavsMap.get(itemId) || { id: itemId };
                  mergedNavsMap.set(itemId, {
                    ...existing,
                    ...navVal,
                    id: itemId,
                    blocks: sanitizeNavbarBlocks(navVal.blocks)
                  });
                }
              }
            });
          }

          this.navbarItems = Array.from(mergedNavsMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));
        } else {
          this.firebaseStatus = 'Sincronizado ✓';
        }
      }, (error) => {
        this.firebaseStatus = 'Erro';
        console.error("Firebase Realtime Database read failed:", error);
      });

      // Listen to live metrics
      const metricsRef = dbRef(db, 'metrics');
      onValue(metricsRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.metrics = {
            visits: val.visits || 0,
            contact_whatsapp: val.contact_whatsapp || 0,
            contact_email: val.contact_email || 0,
            contact_form_submit: val.contact_form_submit || 0,
            download_book: val.download_book || 0,
            newsletter_submit: val.newsletter_submit || 0,
            section_env: val.section_env || 0,
            section_social: val.section_social || 0,
            section_gov: val.section_gov || 0,
            section_comm: val.section_comm || 0,
          };
        }
      }, (error) => {
        console.warn("Firebase metrics read failed:", error);
      });

      // Listen to daily breakdown metrics
      const dailyRef = dbRef(db, 'daily_metrics');
      onValue(dailyRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.dailyMetrics = val;
        } else {
          this.dailyMetrics = {};
        }
      }, (error) => {
        console.warn("Firebase daily metrics read failed:", error);
      });

      // Listen to global newsletter config in real time
      const configRef = dbRef(db, 'newsletterConfig');
      onValue(configRef, (snapshot) => {
        const val = snapshot.val();
        if (val) {
          this.newsletterConfig = { ...this.newsletterConfig, ...val };
        }
      }, (error) => {
        console.warn("Firebase newsletter config read failed:", error);
      });
    },

    loadOfflineCmsCache() {
      try {
        const raw = localStorage.getItem('esg-offline-cms-data');
        if (!raw) return;
        const data = JSON.parse(raw);
        if (!data) return;

        const sanitizeImagePath = (path: any, defaultValue: string): string => {
          if (!path || typeof path !== 'string' || !path.trim()) return defaultValue;
          let resolved = path.trim();
          if (resolved.startsWith('http://') || resolved.startsWith('https://') || resolved.startsWith('data:') || resolved.startsWith('//')) {
            return resolved;
          }
          if (!resolved.startsWith('/assets/')) {
            const parts = resolved.split('/');
            const filename = parts[parts.length - 1];
            if (filename && filename.includes('.')) {
              resolved = `/assets/${filename}`;
            } else {
              resolved = defaultValue;
            }
          }
          if (resolved.startsWith('/assets/') && !resolved.includes('?')) {
            return `${resolved}?v=2`;
          }
          return resolved;
        };

        // Areas Data Pt/En
        if (data.areasData) {
          if (data.areasData.pt) {
            Object.entries(data.areasData.pt).forEach(([key, value]: [string, any]) => {
              if (this.areasPt[key]) {
                const originalImg = this.areasPt[key].img;
                const originalSubtopics = JSON.parse(JSON.stringify(this.areasPt[key].subtopics));
                this.areasPt[key] = { ...this.areasPt[key], ...value };
                this.areasPt[key].img = sanitizeImagePath(this.areasPt[key].img, originalImg);
                if (value.subtopics && Array.isArray(value.subtopics)) {
                  this.areasPt[key].subtopics = value.subtopics.map((st: any, sidx: number) => {
                    const origSt = originalSubtopics[sidx] || {};
                    return {
                      title: st.title || '',
                      img: sanitizeImagePath(st.img, origSt.img || null),
                      items: st.items || []
                    };
                  });
                } else {
                  this.areasPt[key].subtopics = originalSubtopics;
                }
              }
            });
          }
          if (data.areasData.en) {
            Object.entries(data.areasData.en).forEach(([key, value]: [string, any]) => {
              if (this.areasEn[key]) {
                const originalImg = this.areasEn[key].img;
                const originalSubtopics = JSON.parse(JSON.stringify(this.areasEn[key].subtopics));
                this.areasEn[key] = { ...this.areasEn[key], ...value };
                this.areasEn[key].img = sanitizeImagePath(this.areasEn[key].img, originalImg);
                if (value.subtopics && Array.isArray(value.subtopics)) {
                  this.areasEn[key].subtopics = value.subtopics.map((st: any, sidx: number) => {
                    const origSt = originalSubtopics[sidx] || {};
                    return {
                      title: st.title || '',
                      img: sanitizeImagePath(st.img, origSt.img || null),
                      items: st.items || []
                    };
                  });
                } else {
                  this.areasEn[key].subtopics = originalSubtopics;
                }
              }
            });
          }
        }

        // Copy Texts Pt/En
        if (data.copy) {
          if (data.copy.pt) {
            const cPt = data.copy.pt;
            if (cPt.hero) this.uiTextsPt.hero = { ...this.uiTextsPt.hero, ...cPt.hero };
            if (cPt.nav) this.uiTextsPt.nav = { ...this.uiTextsPt.nav, ...cPt.nav };
            if (cPt.about) this.uiTextsPt.about = { ...this.uiTextsPt.about, ...cPt.about };
            if (cPt.contact) this.uiTextsPt.contact = { ...this.uiTextsPt.contact, ...cPt.contact };
            if (cPt.footer) this.uiTextsPt.footer = { ...this.uiTextsPt.footer, ...cPt.footer };
            if (cPt.newsNl) this.uiTextsPt.news.nl = { ...this.uiTextsPt.news.nl, ...cPt.newsNl };
            if (cPt.modal) this.uiTextsPt.modal = { ...this.uiTextsPt.modal, ...cPt.modal };
            if (cPt.sectionLabels) {
              const sl = cPt.sectionLabels;
              if (sl.newsTitle) this.uiTextsPt.news.title = sl.newsTitle;
              if (sl.aboutTitle) this.uiTextsPt.about.title = sl.aboutTitle;
              if (sl.areasTitle) this.uiTextsPt.areas.title = sl.areasTitle;
              if (sl.areasLearnMore) this.uiTextsPt.areas.learnMore = sl.areasLearnMore;
              if (sl.researchTitle) this.uiTextsPt.research.title = sl.researchTitle;
            }
          }
          if (data.copy.en) {
            const cEn = data.copy.en;
            if (cEn.hero) this.uiTextsEn.hero = { ...this.uiTextsEn.hero, ...cEn.hero };
            if (cEn.nav) this.uiTextsEn.nav = { ...this.uiTextsEn.nav, ...cEn.nav };
            if (cEn.about) this.uiTextsEn.about = { ...this.uiTextsEn.about, ...cEn.about };
            if (cEn.contact) this.uiTextsEn.contact = { ...this.uiTextsEn.contact, ...cEn.contact };
            if (cEn.footer) this.uiTextsEn.footer = { ...this.uiTextsEn.footer, ...cEn.footer };
            if (cEn.newsNl) this.uiTextsEn.news.nl = { ...this.uiTextsEn.news.nl, ...cEn.newsNl };
            if (cEn.modal) this.uiTextsEn.modal = { ...this.uiTextsEn.modal, ...cEn.modal };
            if (cEn.sectionLabels) {
              const sl = cEn.sectionLabels;
              if (sl.newsTitle) this.uiTextsEn.news.title = sl.newsTitle;
              if (sl.aboutTitle) this.uiTextsEn.about.title = sl.aboutTitle;
              if (sl.areasTitle) this.uiTextsEn.areas.title = sl.areasTitle;
              if (sl.areasLearnMore) this.uiTextsEn.areas.learnMore = sl.areasLearnMore;
              if (sl.researchTitle) this.uiTextsEn.research.title = sl.researchTitle;
            }
          }
        }

        // News
        if (data.news) {
          if (data.news.pt) {
            if (data.news.pt.item1) this.uiTextsPt.news.item1 = { ...this.uiTextsPt.news.item1, ...data.news.pt.item1 };
            if (data.news.pt.item2) this.uiTextsPt.news.item2 = { ...this.uiTextsPt.news.item2, ...data.news.pt.item2 };
          }
          if (data.news.en) {
            if (data.news.en.item1) this.uiTextsEn.news.item1 = { ...this.uiTextsEn.news.item1, ...data.news.en.item1 };
            if (data.news.en.item2) this.uiTextsEn.news.item2 = { ...this.uiTextsEn.news.item2, ...data.news.en.item2 };
          }
        }

        // Research
        if (data.research) {
          if (data.research.pt && data.research.pt.item1) {
            this.uiTextsPt.research.item1 = { ...this.uiTextsPt.research.item1, ...data.research.pt.item1 };
          }
          if (data.research.en && data.research.en.item1) {
            this.uiTextsEn.research.item1 = { ...this.uiTextsEn.research.item1, ...data.research.en.item1 };
          }
        }

        // Hero Stats
        if (data.heroStats && Array.isArray(data.heroStats)) {
          this.heroStats = data.heroStats;
        }

        // Dynamic News
        if (data.dynamicNews) {
          const rawNews = Object.values(data.dynamicNews) as DynamicNewsItem[];
          const mergedMap = new Map<string, DynamicNewsItem>();
          initialNewsList.forEach(item => {
            mergedMap.set(item.id, JSON.parse(JSON.stringify(item)));
          });
          rawNews.forEach((item) => {
            const existing = mergedMap.get(item.id);
            mergedMap.set(item.id, {
              ...existing,
              ...item,
              linkUrl: item.linkUrl || (existing ? existing.linkUrl : 'https://esgetal.com.br'),
            });
          });
          this.dynamicNews = Array.from(mergedMap.values());
        }

        // Dynamic Research
        if (data.dynamicResearch) {
          const rawResearch = Object.values(data.dynamicResearch) as DynamicResearchItem[];
          const mergedMap = new Map<string, DynamicResearchItem>();
          initialResearchList.forEach(item => {
            mergedMap.set(item.id, JSON.parse(JSON.stringify(item)));
          });
          rawResearch.forEach((item) => {
            const existing = mergedMap.get(item.id);
            mergedMap.set(item.id, {
              ...existing,
              ...item,
              imgUrl: sanitizeImagePath(item.imgUrl, existing ? existing.imgUrl : '/assets/research_featured.jpg')
            });
          });
          this.dynamicResearch = Array.from(mergedMap.values());
        }

        // Dynamic Navbar items
        const mergedNavsMap = new Map<string, NavbarItem>();
        defaultNavbarItems.forEach(item => {
          mergedNavsMap.set(item.id, JSON.parse(JSON.stringify(item)));
        });
        if (data.navbarItems) {
          Object.entries(data.navbarItems).forEach(([navId, navVal]: [string, any]) => {
            if (navVal && typeof navVal === 'object') {
              const itemId = navVal.id || navId;
              if (navVal.deleted === true) {
                mergedNavsMap.delete(itemId);
              } else {
                const existing = mergedNavsMap.get(itemId) || { id: itemId };
                mergedNavsMap.set(itemId, {
                  ...existing,
                  ...navVal,
                  id: itemId,
                  blocks: sanitizeNavbarBlocks(navVal.blocks)
                });
              }
            }
          });
        }
        this.navbarItems = Array.from(mergedNavsMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0));

      } catch (err) {
        console.error("Error applying offline CMS cache:", err);
      }
    },

    // ── Administrative Updates ────────────────────────────────────────────────
    async updateFirebaseNode(path: string, payload: any) {
      if (!isConfigured || !db) {
        // Run in local memory mode
        try {
          const raw = localStorage.getItem('esg-offline-cms-data');
          const dbData = raw ? JSON.parse(raw) : {};
          
          const parts = path.split('/');
          let current = dbData;
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object') {
              current[part] = {};
            }
            current = current[part];
          }
          const lastPart = parts[parts.length - 1];
          if (current[lastPart] && typeof current[lastPart] === 'object' && payload && typeof payload === 'object') {
            current[lastPart] = { ...current[lastPart], ...payload };
          } else {
            current[lastPart] = payload;
          }
          
          localStorage.setItem('esg-offline-cms-data', JSON.stringify(dbData));
          this.loadOfflineCmsCache();
          this.addToast("Alterações salvas localmente no navegador.", "ok");
        } catch (err: any) {
          this.addToast(`Falha ao salvar localmente: ${err.message}`, "err");
        }
        return;
      }
      try {
        await update(dbRef(db, `siteContent/${path}`), payload);
        this.addToast("Alterações aplicadas com sucesso!", "ok");
      } catch (err: any) {
        this.addToast(`Erro ao salvar: ${err.message}`, "err");
        throw err;
      }
    },

    async setFirebaseNode(path: string, payload: any) {
      if (!isConfigured || !db) {
        try {
          const raw = localStorage.getItem('esg-offline-cms-data');
          const dbData = raw ? JSON.parse(raw) : {};
          
          const parts = path.split('/');
          let current = dbData;
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object') {
              current[part] = {};
            }
            current = current[part];
          }
          const lastPart = parts[parts.length - 1];
          current[lastPart] = payload;
          
          localStorage.setItem('esg-offline-cms-data', JSON.stringify(dbData));
          this.loadOfflineCmsCache();
          this.addToast("Notícia salva e atualizada localmente !", "ok");
        } catch (err: any) {
          this.addToast(`Erro ao salvar localmente: ${err.message}`, "err");
        }
        return;
      }
      try {
        await set(dbRef(db, `siteContent/${path}`), payload);
        this.addToast("Configuração salva com sucesso!", "ok");
      } catch (err: any) {
        this.addToast(`Erro ao salvar: ${err.message}`, "err");
        throw err;
      }
    },

    async deleteFirebaseNode(path: string) {
      if (!isConfigured || !db) {
        try {
          const raw = localStorage.getItem('esg-offline-cms-data');
          const dbData = raw ? JSON.parse(raw) : {};
          
          const parts = path.split('/');
          let current = dbData;
          for (let i = 0; i < parts.length - 1; i++) {
            const part = parts[i];
            if (!current[part] || typeof current[part] !== 'object') {
              current[part] = {};
            }
            current = current[part];
          }
          const lastPart = parts[parts.length - 1];
          delete current[lastPart];
          
          localStorage.setItem('esg-offline-cms-data', JSON.stringify(dbData));
          this.loadOfflineCmsCache();
          this.addToast("Item excluído localmente no navegador.", "info");
        } catch (err: any) {
          this.addToast(`Erro ao excluir localmente: ${err.message}`, "err");
        }
        return;
      }
      try {
        await remove(dbRef(db, `siteContent/${path}`));
        this.addToast("Item excluído permanentemente.", "info");
      } catch (err: any) {
        this.addToast(`Erro ao excluir: ${err.message}`, "err");
        throw err;
      }
    },

    saveLocalConfig(config: any) {
      try {
        localStorage.setItem('esg-firebase-config', JSON.stringify(config));
        this.addToast("Configurações do Firebase salvas! Recarregando aplicação...", "ok");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err: any) {
        this.addToast("Erro ao salvar configuração local.", "err");
      }
    },

    resetLocalConfig() {
      try {
        localStorage.removeItem('esg-firebase-config');
        this.addToast("Instâncias do Firebase redefinidas! Recarregando...", "info");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } catch (err) {
        this.addToast("Erro ao resetar.", "err");
      }
    },

    async fullResetFirebaseNode(path: string, defaultVal: any) {
      if (!isConfigured || !db) {
        this.addToast("Modo offline: Redefinindo visual original local...", "info");
        return;
      }
      try {
        await set(dbRef(db, `siteContent/${path}`), defaultVal);
        this.addToast("Fórmula original restaurada!", "ok");
      } catch (err: any) {
        this.addToast(`Erro ao restaurar: ${err.message}`, "err");
      }
    },

    async logoutUser() {
      if (!auth) return;
      try {
        await signOut(auth);
        this.addToast("Sessão encerrada com sucesso.", "info");
      } catch (err: any) {
        this.addToast(`Falha ao sair: ${err.message}`, "err");
      }
    },

    // ── Newsletter CRM Actions ───────────────────────────────────────────────
    async subscribeToNewsletter(name: string, email: string) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) return;
      const safeKey = trimmedEmail.replace(/[@.$#\[\]\/]/g, '_');
      
      const payload: any = {
        id: safeKey,
        email: trimmedEmail,
        name: name.trim() || '',
        subscribed: true,
        updatedAt: Date.now()
      };

      const triggerWelcomeEmailHelper = () => {
        try {
          const config = this.newsletterConfig;
          if (config && config.provider === 'emailjs') {
            if (config.serviceId && config.publicKey) {
              const tid = config.welcomeTemplateId || config.templateId;
              if (tid) {
                const payloadEmail = {
                  service_id: config.serviceId,
                  template_id: tid,
                  user_id: config.publicKey,
                  template_params: {
                    to_email: trimmedEmail,
                    to_name: name.trim() || 'Leitor ESG e Tal',
                    sender_name: config.senderName || 'ESG e Tal',
                    unsubscribe_link: `${window.location.origin}/?unsubscribe=${encodeURIComponent(trimmedEmail)}`
                  }
                };
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payloadEmail)
                }).then(async (res) => {
                  if (!res.ok) {
                    const t = await res.text();
                    console.warn("Erro ao enviar email de boas-vindas: " + t);
                  } else {
                    console.log("E-mail de boas-vindas enviado com sucesso!");
                  }
                }).catch(err => {
                  console.warn("Erro de rede ao enviar email de boas-vindas:", err);
                });
              }
            }
          } else {
            console.log(`[SIMULAÇÃO BOAS-VINDAS] Enviando email de boas-vindas para ${trimmedEmail}. Nome: ${name.trim() || 'Leitor ESG e Tal'}`);
          }
        } catch (e) {
          console.error("Erro ao processar envio de boas-vindas do newsletter:", e);
        }
      };

      if (!isConfigured || !db) {
        const localSubs = JSON.parse(localStorage.getItem('esg-offline-subs') || '[]');
        const existingIdx = localSubs.findIndex((s: any) => s.email === trimmedEmail);
        if (existingIdx > -1) {
          localSubs[existingIdx] = { ...localSubs[existingIdx], ...payload };
        } else {
          payload.createdAt = Date.now();
          localSubs.push(payload);
        }
        localStorage.setItem('esg-offline-subs', JSON.stringify(localSubs));
        this.addToast("Modo offline: Inscrição salva localmente.", "info");
        triggerWelcomeEmailHelper();
        return;
      }

      try {
        const finalRef = dbRef(db, `newsletterSubscribers/${safeKey}`);
        let existingCreatedAt = Date.now();
        
        try {
          const { get } = await import('firebase/database');
          const snap = await get(finalRef);
          if (snap.exists()) {
            const val = snap.val();
            if (val && val.createdAt) {
              existingCreatedAt = val.createdAt;
            }
          }
        } catch (readErr) {
          // If read fails, fallback
        }

        payload.createdAt = existingCreatedAt;
        await set(finalRef, payload);
        this.addToast(this.lang === 'pt' ? 'Inscrição realizada com sucesso!' : 'Subscribed successfully!', "ok");
        triggerWelcomeEmailHelper();
      } catch (err: any) {
        console.error("Newsletter subscribe error:", err);
        this.addToast(this.lang === 'pt' ? 'Falha ao se inscrever. Tente novamente.' : 'Failed to subscribe. Try again.', "err");
        throw err;
      }
    },

    async unsubscribeFromNewsletter(email: string) {
      const trimmedEmail = email.trim().toLowerCase();
      if (!trimmedEmail) return;
      const safeKey = trimmedEmail.replace(/[@.$#\[\]\/]/g, '_');

      const triggerUnsubscribeCancelHelper = () => {
        try {
          const config = this.newsletterConfig;
          if (config && config.provider === 'emailjs') {
            if (config.serviceId && config.publicKey) {
              const tid = config.unsubscribeTemplateId || config.templateId;
              if (tid) {
                const payloadEmail = {
                  service_id: config.serviceId,
                  template_id: tid,
                  user_id: config.publicKey,
                  template_params: {
                    to_email: trimmedEmail,
                    to_name: 'Ex-Leitor ESG e Tal',
                    sender_name: config.senderName || 'ESG e Tal'
                  }
                };
                fetch('https://api.emailjs.com/api/v1.0/email/send', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(payloadEmail)
                }).then(async (res) => {
                  if (!res.ok) {
                    const t = await res.text();
                    console.warn("Erro ao enviar confirmação de cancelamento: " + t);
                  } else {
                    console.log("E-mail de confirmação de cancelamento enviado com sucesso!");
                  }
                }).catch(err => {
                  console.warn("Erro de rede ao enviar cancelamento:", err);
                });
              }
            }
          } else {
            console.log(`[SIMULAÇÃO CANCELAMENTO] Enviando confirmação de cancelamento para ${trimmedEmail}`);
          }
        } catch (e) {
          console.error("Erro ao processar envio de cancelamento:", e);
        }
      };

      if (!isConfigured || !db) {
        const localSubs = JSON.parse(localStorage.getItem('esg-offline-subs') || '[]');
        const filteredSubs = localSubs.filter((s: any) => s.email !== trimmedEmail);
        localStorage.setItem('esg-offline-subs', JSON.stringify(filteredSubs));
        this.subscribers = filteredSubs;
        triggerUnsubscribeCancelHelper();
        this.addToast(this.lang === 'pt' ? 'Inscrição cancelada com sucesso.' : 'Successfully unsubscribed.', "ok");
        return;
      }

      try {
        const finalRef = dbRef(db, `newsletterSubscribers/${safeKey}`);
        const { get } = await import('firebase/database');
        const snap = await get(finalRef);
        
        if (!snap.exists()) {
          this.addToast(this.lang === 'pt' ? 'E-mail não encontrado em nossos registros.' : 'Email not found in our records.', "err");
          return;
        }

        await remove(finalRef);
        this.subscribers = this.subscribers.filter(s => s.email !== trimmedEmail);
        triggerUnsubscribeCancelHelper();
        this.addToast(this.lang === 'pt' ? 'Inscrição cancelada com sucesso.' : 'Successfully unsubscribed.', "ok");
      } catch (err: any) {
        console.error("Newsletter unsubscribe error:", err);
        this.addToast(this.lang === 'pt' ? 'Falha ao cancelar inscrição.' : 'Failed to unsubscribe.', "err");
        throw err;
      }
    },

    async loadNewsletterSubscribers() {
      if (!isConfigured || !db) {
        let localSubs = JSON.parse(localStorage.getItem('esg-offline-subs') || '[]');
        if (localSubs.length === 0) {
          localSubs = [
            { id: 'sub_1', name: 'Ana Souza', email: 'ana.souza@corp.com.br', subscribed: true, createdAt: Date.now() - 86400000 * 2, updatedAt: Date.now() - 86400000 * 2 },
            { id: 'sub_2', name: 'Carlos Mendonça', email: 'carlos.m@esg-solutions.org', subscribed: true, createdAt: Date.now() - 86400000, updatedAt: Date.now() - 86400000 },
            { id: 'sub_3', name: 'Beatriz Rocha', email: 'rocha.beatriz@tech-recicla.net', subscribed: true, createdAt: Date.now() - 3600000 * 5, updatedAt: Date.now() - 3600000 * 2 },
            { id: 'sub_4', name: 'Geraldo Antunes', email: 'geraldo.antunes@planetaverde.eco', subscribed: true, createdAt: Date.now() - 3600000, updatedAt: Date.now() - 3600000 }
          ];
          localStorage.setItem('esg-offline-subs', JSON.stringify(localSubs));
        }
        this.subscribers = localSubs;
        return;
      }
      try {
        const { get } = await import('firebase/database');
        const snap = await get(dbRef(db, 'newsletterSubscribers'));
        if (snap.exists()) {
          const val = snap.val();
          this.subscribers = Object.values(val) as any[];
        } else {
          this.subscribers = [];
        }
      } catch (err: any) {
        console.error("Error loading subscribers:", err);
        this.addToast("Erro ao carregar banco de inscritos.", "err");
      }
    },

    async deleteSubscriber(id: string) {
      if (!isConfigured || !db) {
        let localSubs = JSON.parse(localStorage.getItem('esg-offline-subs') || '[]');
        localSubs = localSubs.filter((s: any) => s.id !== id);
        localStorage.setItem('esg-offline-subs', JSON.stringify(localSubs));
        this.subscribers = localSubs;
        this.addToast("Inscrito removido localmente.", "info");
        return;
      }
      try {
        await remove(dbRef(db, `newsletterSubscribers/${id}`));
        this.subscribers = this.subscribers.filter(s => s.id !== id);
        this.addToast("Inscrito removido com sucesso.", "ok");
      } catch (err: any) {
        this.addToast("Erro ao remover inscrito.", "err");
      }
    },

    async loadNewsletterConfig() {
      if (!isConfigured || !db) return;
      try {
        const { get } = await import('firebase/database');
        const snap = await get(dbRef(db, 'newsletterConfig'));
        if (snap.exists()) {
          this.newsletterConfig = { ...this.newsletterConfig, ...snap.val() };
        }
      } catch (err) {
        console.error("Error loading newsletter config:", err);
      }
    },

    async saveNewsletterConfig(config: any) {
      if (!isConfigured || !db) {
        this.newsletterConfig = { ...this.newsletterConfig, ...config };
        this.addToast("Configuração salva na sessão local.", "info");
        return;
      }
      try {
        await set(dbRef(db, 'newsletterConfig'), config);
        this.newsletterConfig = { ...this.newsletterConfig, ...config };
        this.addToast("Configurações salvas no banco de dados!", "ok");
      } catch (err: any) {
        this.addToast(`Erro ao salvar: ${err.message}`, "err");
      }
    }
  }
});
