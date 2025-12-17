# Integração Chatwoot + Supabase

## Visão Geral

Este front end simula dados que futuramente virão do Supabase. O fluxo real envolverá:

1. **Chatwoot** recebendo mensagens.
2. Webhook do Chatwoot -> Cloud Function / API Route -> **Supabase**.
3. **CRM** (este projeto) lendo do Supabase.

## Supabase

### Setup

1. Crie um projeto no Supabase.
2. Instale o client: `npm install @supabase/supabase-js`.
3. Configure `lib/supabaseClient.ts` com as chaves de ambiente.

### Tabelas Recomendadas

- `branches` (id, name, city...)
- `sellers` (id, name, branch_id...)
- `leads` (id, name, phone, origin...)
- `opportunities` (id, status, value...)
- `clients` (id, name...)

## Chatwoot Webhooks

Para criar leads automaticamente:

1. Configure um webhook no Chatwoot para o evento `conversation_created`.
2. O endpoint deve verificar se o contato já existe no Supabase (pelo telefone).
3. Se não, criar `Lead` e `Client`.

### Mapeamento

- Chatwoot `conversation_id` -> CRM `lead_id` (opcional, manter rastreio).
- Chatwoot `contact` properties -> CRM `Lead` fields.

## Substituindo Mock por Real

1. Em `/lib/services/`, substitua o `DELAY` e retorno de mock por chamadas `supabase.from('table').select(...)`.
2. Mantenha as interfaces em `/types` consistentes com o retorno do Supabase.
