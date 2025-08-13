# House Flipping Dashboard - Guia de Desenvolvimento

## 📋 Visão Geral do Projeto

Este projeto é um **sistema de gestão completo para house flipping** que evoluirá gradualmente conforme o negócio cresce. Começamos com um MVP focado em **prospecção e análise de imóveis**, expandindo posteriormente para gestão de obras e vendas.

### Contexto do Negócio
- **Usuários**: Casal iniciante no house flipping (2 pessoas)
- **Objetivo**: Centralizar toda operação em uma plataforma web
- **Fluxo**: Prospecção → Análise → Compra → Reforma → Venda
- **Volume inicial**: 3 análises/dia, até 2 imóveis simultâneos (meta: 4 em 1 ano)

---

## 🎯 MVP - Primeira Entrega (Fases 1-4)

### Funcionalidades Prioritárias
1. **CRUD de Imóveis** - Cadastro e gestão completa
2. **LIA (Análise de Mercado)** - Filtros e cálculo de preço/m²
3. **Calculadora de Viabilidade** - Baseada em planilha existente
4. **Gestão de Visitas** - Agenda e formulários de avaliação
5. **Web Scraping Integration** - Importação automática de dados
6. **Feed de Notícias** - Market intelligence automatizado

### Funcionalidades Futuras (Não implementar agora)
- Gestão de obras e fornecedores
- Controle financeiro detalhado
- Business Intelligence avançado
- Sistema de vendas

---

## 🛠️ Stack Tecnológica

### Frontend
- **Next.js 14** (App Router)
- **TypeScript** (tipagem forte)
- **Tailwind CSS** + **shadcn/ui**
- **Zustand** (estado global)
- **React Hook Form** + **Zod** (validação)

### Backend
- **Next.js API Routes** (CRUD básico)
- **Python FastAPI** (scraping + cálculos complexos)
- **Supabase** (PostgreSQL + Auth + Storage)

### Deploy
- **Vercel** (Frontend + API Routes)
- **Railway/Render** (Python APIs)
- **Supabase Cloud** (Database)

---

## 🎨 Design System & Visual

### Estilo Visual
- **Minimalista e moderno** - clean, espaçamento generoso
- **Professional** - cores neutras com toques de cor estratégicos
- **Data-driven** - dashboards e métricas visuais
- **Mobile-first** - responsivo e touch-friendly

### Referências de Design
**Procure inspiração em:**
- **Linear.app** - UI clean e moderna
- **Notion** - organização hierárquica
- **Stripe Dashboard** - métricas e dados financeiros
- **Figma** - navegação intuitiva
- **Railway.app** - minimalismo técnico
- **Vercel Dashboard** - cards e layouts
- **Dribbble/Behance** - buscar por "real estate dashboard", "property management UI"

### Paleta de Cores Sugerida
```css
/* Neutros */
--background: 0 0% 100%        /* Branco */
--foreground: 222.2 84% 4.9%   /* Quase preto */
--muted: 210 40% 96%           /* Cinza claro */
--border: 214.3 31.8% 91.4%    /* Bordas sutis */

/* Accent */
--primary: 221.2 83.2% 53.3%   /* Azul moderno */
--secondary: 210 40% 94%       /* Cinza secundário */
--success: 142.1 76.2% 36.3%   /* Verde para aprovado */
--warning: 47.9 95.8% 53.1%    /* Amarelo para atenção */
--destructive: 0 84.2% 60.2%   /* Vermelho para cancelar */
```

### Branding
- **Nome**: "House Flipping Pro" ou similar
- **Logo**: Ícone de casa + gráfico de crescimento (usar Lucide React icons como base)
- **Posicionamento**: Header esquerdo + sidebar quando aplicável
- **Favicon**: Versão simplificada da logo

---

## 📱 Responsividade

### Breakpoints
```css
sm: '640px'   /* Mobile landscape */
md: '768px'   /* Tablet */
lg: '1024px'  /* Desktop */
xl: '1280px'  /* Large desktop */
```

### Páginas Mobile-Critical
- **Dashboard** - Cards empilhados, métricas essenciais
- **Lista de Imóveis** - Cards verticais, filtros em drawer
- **Detalhes do Imóvel** - Tabs colapsáveis
- **Visitas** - Calendar view + lista otimizada
- **Formulário de Visita** - Form touch-friendly

### Navegação Mobile
- **Sidebar** → **Bottom navigation** (5 itens principais)
- **Filtros** → **Drawer/Modal** 
- **Actions** → **Floating Action Button** quando necessário

---

## 🏗️ Arquitetura do Código

### Estrutura de Pastas
```
/app
├── (auth)/              # Rotas de autenticação
├── dashboard/           # Overview geral
├── imoveis/            # CRUD de imóveis
├── lia/                # Análise de mercado
├── viabilidades/       # Calculadora
├── visitas/            # Gestão de visitas
├── noticias/           # Feed de mercado
├── config/             # Configurações
└── api/                # API Routes

/components
├── ui/                 # shadcn/ui components
├── forms/              # Formulários reutilizáveis
├── charts/             # Gráficos e visualizações
├── layout/             # Header, Sidebar, etc
└── features/           # Componentes por funcionalidade

/lib
├── supabase.ts         # Cliente Supabase
├── validations.ts      # Schemas Zod
├── utils.ts            # Utilitários
├── features.ts         # Feature flags
├── constants.ts        # Constantes do app
└── types.ts            # Tipos TypeScript

/hooks
├── use-imoveis.ts      # React Query hooks
├── use-auth.ts         # Autenticação
└── use-local-storage.ts # Persistência local
```

### Padrões de Código
- **Components**: Functional + TypeScript interfaces
- **State**: Zustand para global, useState para local
- **Data Fetching**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Styling**: Tailwind classes + CSS modules quando necessário
- **Error Handling**: Error boundaries + toast notifications

---

## 🗄️ Banco de Dados (Supabase)

### Schema Principal
```sql
-- IMÓVEIS (entidade central)
CREATE TABLE imoveis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo VARCHAR(255),
  endereco_completo TEXT,
  bairro VARCHAR(100),
  cidade VARCHAR(100),
  cep VARCHAR(10),
  m2_terreno DECIMAL(8,2),
  
  -- Dados originais (prospecção)
  quartos_original INTEGER,
  banheiros_original INTEGER,
  vagas_original INTEGER,
  m2_util_original DECIMAL(8,2),
  link_anuncio_original TEXT,
  valor_anuncio DECIMAL(12,2),
  fonte_prospeccao VARCHAR(50),
  
  -- Dados pós-reforma
  quartos_final INTEGER,
  banheiros_final INTEGER,
  vagas_final INTEGER,
  m2_util_final DECIMAL(8,2),
  
  -- Dados financeiros
  valor_compra DECIMAL(12,2),
  valor_compra_total DECIMAL(12,2),
  data_compra DATE,
  valor_venda DECIMAL(12,2),
  data_venda DATE,
  
  -- Controle de processo
  status_processo VARCHAR(50) DEFAULT 'prospectando',
  observacoes TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- VIABILIDADES
CREATE TABLE viabilidades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id),
  valor_compra_estimado DECIMAL(12,2),
  custo_reforma_estimado DECIMAL(12,2),
  valor_venda_estimado DECIMAL(12,2),
  roi_percentual DECIMAL(5,2),
  roi_valor DECIMAL(12,2),
  tempo_estimado_meses INTEGER,
  observacoes TEXT,
  aprovado BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- VISITAS
CREATE TABLE visitas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  imovel_id UUID REFERENCES imoveis(id),
  data_hora TIMESTAMP,
  status VARCHAR(50) DEFAULT 'agendada',
  observacoes_pre TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- AVALIAÇÕES DE VISITA
CREATE TABLE avaliacoes_visita (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visita_id UUID REFERENCES visitas(id),
  imovel_id UUID REFERENCES imoveis(id),
  estado_geral INTEGER CHECK (estado_geral >= 1 AND estado_geral <= 10),
  acabamentos INTEGER CHECK (acabamentos >= 1 AND acabamentos <= 10),
  localizacao INTEGER CHECK (localizacao >= 1 AND localizacao <= 10),
  potencial_reforma INTEGER CHECK (potencial_reforma >= 1 AND potencial_reforma <= 10),
  problemas_estruturais TEXT,
  pontos_positivos TEXT,
  pontos_negativos TEXT,
  fotos_visita TEXT[], -- Array de URLs
  recomenda_compra BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

-- NOTÍCIAS
CREATE TABLE noticias (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT,
  resumo TEXT,
  link TEXT,
  fonte VARCHAR(255),
  data_publicacao DATE,
  relevancia INTEGER CHECK (relevancia >= 1 AND relevancia <= 10),
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

### RLS (Row Level Security)
- Implementar políticas básicas de segurança
- Usuários só acessam seus próprios dados
- Preparar para multi-tenancy futuro

---

## 🔐 Segurança & Qualidade

### Autenticação
- **Supabase Auth** com email/senha
- **Middleware** para rotas protegidas
- **Role-based access** preparado para futuro

### Validação
- **Zod schemas** para todos os forms
- **Server-side validation** nas API routes
- **Client-side feedback** em tempo real

### Performance
- **Next.js Image** para otimização
- **React Query** com cache inteligente
- **Lazy loading** para componentes pesados
- **Bundle analyzer** para monitorar tamanho

### SEO & Meta
- **Metadata API** do Next.js
- **OpenGraph** tags
- **Robots.txt** e **sitemap**

---

## 📋 Páginas Principais - Especificações

### 1. Dashboard (`/dashboard`)
**Layout**: Grid responsivo com cards de métricas
**Componentes**:
- Header com logo + navegação
- Cards de KPIs (imóveis por status, ROI médio, próximas visitas)
- Gráfico de evolução mensal
- Lista de ações rápidas
- Timeline de atividades recentes

### 2. Imóveis (`/imoveis`)
**Layout**: Lista/Grid com sidebar de filtros
**Componentes**:
- Barra de busca + filtros avançados
- Cards de imóveis com foto, preço, m², score
- Botões de ação (ver, editar, calcular viabilidade)
- Paginação
- Botão "Novo Imóvel" flutuante

### 3. Detalhes do Imóvel (`/imoveis/[id]`)
**Layout**: Tabs com informações organizadas
**Tabs**:
- Resumo (dados gerais + fotos)
- Viabilidade (histórico de cálculos)
- Visitas (agenda + avaliações)
- Documentos (uploads futuros)

### 4. LIA (`/lia`)
**Layout**: Filtros à esquerda, resultados à direita
**Componentes**:
- Form de filtros (bairro, quartos, faixa de preço)
- Tabela de resultados
- Card com preço/m² médio destacado
- Gráfico scatter plot (m² x preço)
- Botão exportar CSV

### 5. Viabilidades (`/viabilidades`)
**Layout**: Lista + modal/página de cálculo
**Componentes**:
- Lista de viabilidades com status visual
- Calculadora em modal ou página separada
- Form baseado na planilha atual
- Resultado com breakdown visual

### 6. Visitas (`/visitas`)
**Layout**: Calendar view + lista do dia
**Componentes**:
- Calendário mensal com dots
- Lista detalhada do dia selecionado
- Form de agendamento
- Check-in mobile para avaliação

---

## 🚀 Feature Flags & Deploy

### Controle de Features
```typescript
export const FEATURES = {
  IMOVEIS: true,
  LIA: true, 
  VIABILIDADES: true,
  VISITAS: true,
  SCRAPING: false,        // Ativar depois
  NOTICIAS: false,        // Ativar depois
  PROJETOS_REFORMA: false, // Fase 5
  FINANCEIRO: false,      // Fase 6
} as const;
```

### Environments
- **Development**: Todas as features habilitadas
- **Staging**: Features do MVP apenas
- **Production**: Release gradual controlado

---

## 🎯 Critérios de Sucesso

### Funcional
- [ ] Substituir completamente planilhas atuais
- [ ] Importar dados via scraping funcional
- [ ] Cálculos de viabilidade precisos
- [ ] Interface mobile usável em visitas
- [ ] Tempo de carregamento < 3s

### Técnico
- [ ] Código TypeScript 100% tipado
- [ ] Cobertura de testes > 70%
- [ ] Performance Lighthouse > 90
- [ ] Zero vulnerabilidades críticas
- [ ] Deploy automatizado funcional

### UX
- [ ] Interface intuitiva sem treinamento
- [ ] Responsivo em todos os dispositivos
- [ ] Feedback visual em todas as ações
- [ ] Estados de loading bem definidos
- [ ] Error handling gracioso

---

## 📝 Próximos Passos

1. **Setup inicial** do projeto Next.js + Supabase
2. **Implementar autenticação** básica
3. **Criar CRUD de imóveis** como primeira funcionalidade
4. **Desenvolver LIA** para validar conceito
5. **Iterar baseado no feedback** dos usuários

---

**Lembre-se**: Este é um projeto evolutivo. Foque na qualidade do MVP e expanda gradualmente. Cada funcionalidade deve resolver uma dor real e imediata do negócio.