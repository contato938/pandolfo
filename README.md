# Pandolfo CRM

Front end moderno e responsivo para CRM multi-filial (14 filiais).
focado em dashboards executivos e gestão de leads/oportunidades.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS** v4
- **Shadcn/UI**
- **Recharts**
- **Zustand** (Estado Global)
- **dnd-kit** (Kanban)

## Como Rodar

1. Instale dependências:
   ```bash
   npm install
   ```
2. Rode o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
3. Acesso em `http://localhost:3000`.

## Estrutura

- `/app`: Rotas e Páginas (Dashboard, Leads, etc).
- `/components`:
  - `/ui`: Componentes Shadcn.
  - `/layout`: Sidebar, Topbar.
  - `/shared`: DataTable, KPI Cards.
- `/lib`:
  - `/services`: Camada de "API Fake" (Mock Data).
  - `/store.ts`: Zustand Store (Filtros, Usuário).
- `/types`: Definições TypeScript.

## Funcionalidades

- **Dashboard**: KPIs, Funnel Chart, Ranking.
- **Leads**: Listagem e Criação.
- **Oportunidades**: Kanban Board (Drag & Drop) e Lista.
- **Gestão**: Filiais, Vendedores, Clientes.

## Integração Futura

Ver `/lib/integrations/notes.md` para detalhes sobre Supabase e Chatwoot.
