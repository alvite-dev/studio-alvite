# Configuração do Supabase - Studio Alvite

Este documento explica como configurar o banco de dados Supabase para o sistema de agenda de visitas.

## 📋 Passos para Configuração

### 1. Criar as Tabelas
Execute o arquivo `sql/create_tables.sql` no SQL Editor do Supabase:

```sql
-- Copie e cole todo o conteúdo do arquivo create_tables.sql
```

Este script cria:
- ✅ Tabela `corretores` (id, nome, telefone, imobiliaria)
- ✅ Tabela `imoveis` (id, link, endereco, quartos, banheiros, vagas, corretor_id)
- ✅ Tabela `visitas` (dados híbridos - suporta base + manual)
- ✅ Índices para performance
- ✅ Triggers para updated_at automático
- ✅ Constraints de validação

### 2. Inserir Dados Mockados
Execute o arquivo `sql/insert_mock_data.sql`:

```sql
-- Copie e cole todo o conteúdo do arquivo insert_mock_data.sql
```

⚠️ **Importante**: Se receber erro de UUID inválido, use o arquivo `sql/insert_mock_data_fixed.sql` que tem UUIDs corrigidos.

**Erro comum**: `ERROR: invalid input syntax for type uuid`
- **Causa**: UUIDs só aceitam caracteres 0-9 e a-f
- **Solução**: Use o arquivo corrigido ou execute a query de validação

Isso irá inserir:
- 🏢 10 corretores com diferentes imobiliárias
- 🏠 10 imóveis variados (apartamentos, casas, lofts)
- 📅 6 visitas de exemplo (base + manual + mista)

### 3. Configurar RLS (Row Level Security)

⚠️ **Importante**: As policies de RLS estão comentadas no script. Descomente e configure conforme suas necessidades:

```sql
-- Habilitar RLS
ALTER TABLE corretores ENABLE ROW LEVEL SECURITY;
ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;

-- Exemplo de policy para usuários autenticados
CREATE POLICY "Allow all operations for authenticated users" ON corretores
    FOR ALL USING (auth.role() = 'authenticated');
```

## 🔗 Estrutura das Tabelas

### Corretores
```sql
- id (UUID, PK)
- nome (VARCHAR, NOT NULL)
- telefone (VARCHAR, NOT NULL)  
- imobiliaria (VARCHAR, nullable)
- created_at, updated_at (timestamps)
```

### Imóveis
```sql
- id (UUID, PK)
- link (TEXT, nullable)
- endereco (TEXT, NOT NULL)
- quartos, banheiros, vagas (INTEGER)
- corretor_id (UUID, FK to corretores)
- created_at, updated_at (timestamps)
```

### Visitas (Estrutura Híbrida)
```sql
- id (UUID, PK)
-- Imóvel: da base OU manual
- imovel_id (UUID, FK to imoveis)
- imovel_link_manual (TEXT)
- imovel_endereco_manual (TEXT)
-- Corretor: da base OU manual  
- corretor_id (UUID, FK to corretores)
- corretor_nome_manual (VARCHAR)
- corretor_telefone_manual (VARCHAR)
-- Dados gerais
- data_hora (TIMESTAMP, NOT NULL)
- observacoes_pre (TEXT)
- ordem (INTEGER, para drag-and-drop)
- created_at, updated_at (timestamps)
```

## 🔍 Queries Importantes

### Buscar todas as visitas com dados completos:
```sql
SELECT 
    v.id,
    v.data_hora,
    COALESCE(v.imovel_endereco_manual, i.endereco) as endereco,
    COALESCE(v.corretor_nome_manual, c.nome) as corretor_nome,
    i.quartos, i.banheiros, i.vagas
FROM visitas v
LEFT JOIN imoveis i ON v.imovel_id = i.id
LEFT JOIN corretores c ON v.corretor_id = c.id
ORDER BY v.ordem, v.data_hora;
```

### Para dropdowns na aplicação:
```sql
-- Corretores
SELECT id, nome, telefone, imobiliaria FROM corretores ORDER BY nome;

-- Imóveis  
SELECT id, endereco, quartos, banheiros, vagas FROM imoveis ORDER BY endereco;
```

## 🛠️ Próximos Passos

1. **Configurar variáveis de ambiente** no projeto Next.js:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

2. **Instalar client do Supabase**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Atualizar os stores** para usar Supabase em vez de dados mockados

4. **Configurar RLS policies** adequadas para sua aplicação

## 📁 Arquivos Relacionados

- `sql/create_tables.sql` - Script de criação das tabelas
- `sql/insert_mock_data.sql` - Dados de exemplo
- `sql/queries_examples.sql` - Queries úteis para desenvolvimento

## ⚠️ Importantes

- As tabelas suportam **dados híbridos** (base + manual)
- Use `COALESCE()` para priorizar dados manuais sobre da base
- O campo `ordem` permite implementar drag-and-drop
- Constraints garantem integridade dos dados híbridos
- Triggers mantêm `updated_at` sempre atual