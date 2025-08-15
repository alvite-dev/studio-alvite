-- ================================================
-- Queries de Exemplo - Supabase Studio Alvite
-- Sistema de Agenda de Visitas
-- ================================================

-- ================================================
-- 1. Queries para buscar dados (para usar na aplicação)
-- ================================================

-- Buscar todas as visitas com dados completos (JOIN)
SELECT 
    v.id,
    v.data_hora,
    v.observacoes_pre,
    v.ordem,
    -- Dados do imóvel (da base ou manual)
    COALESCE(v.imovel_endereco_manual, i.endereco) as imovel_endereco,
    COALESCE(v.imovel_link_manual, i.link) as imovel_link,
    i.quartos,
    i.banheiros, 
    i.vagas,
    -- Dados do corretor (da base ou manual)
    COALESCE(v.corretor_nome_manual, c.nome) as corretor_nome,
    COALESCE(v.corretor_telefone_manual, c.telefone) as corretor_telefone,
    c.imobiliaria,
    -- IDs originais para referência
    v.imovel_id,
    v.corretor_id,
    -- Flags para identificar se é manual
    CASE WHEN v.imovel_id IS NULL THEN true ELSE false END as imovel_manual,
    CASE WHEN v.corretor_id IS NULL THEN true ELSE false END as corretor_manual
FROM visitas v
LEFT JOIN imoveis i ON v.imovel_id = i.id
LEFT JOIN corretores c ON v.corretor_id = c.id
ORDER BY v.ordem, v.data_hora;

-- ================================================
-- 2. Buscar apenas corretores (para dropdown)
-- ================================================
SELECT id, nome, telefone, imobiliaria
FROM corretores 
ORDER BY nome;

-- ================================================
-- 3. Buscar apenas imóveis (para dropdown)
-- ================================================
SELECT 
    id, 
    endereco,
    link,
    quartos,
    banheiros,
    vagas,
    corretor_id
FROM imoveis 
ORDER BY endereco;

-- ================================================
-- 4. Buscar imóveis com nome do corretor
-- ================================================
SELECT 
    i.id,
    i.endereco,
    i.link,
    i.quartos,
    i.banheiros,
    i.vagas,
    c.nome as corretor_nome,
    c.imobiliaria
FROM imoveis i
LEFT JOIN corretores c ON i.corretor_id = c.id
ORDER BY i.endereco;

-- ================================================
-- 5. Buscar visitas de hoje
-- ================================================
SELECT 
    v.id,
    v.data_hora,
    COALESCE(v.imovel_endereco_manual, i.endereco) as endereco,
    COALESCE(v.corretor_nome_manual, c.nome) as corretor_nome
FROM visitas v
LEFT JOIN imoveis i ON v.imovel_id = i.id
LEFT JOIN corretores c ON v.corretor_id = c.id
WHERE DATE(v.data_hora) = CURRENT_DATE
ORDER BY v.data_hora;

-- ================================================
-- 6. Buscar próximas visitas (próximos 7 dias)
-- ================================================
SELECT 
    v.id,
    v.data_hora,
    COALESCE(v.imovel_endereco_manual, i.endereco) as endereco,
    COALESCE(v.corretor_nome_manual, c.nome) as corretor_nome,
    v.observacoes_pre
FROM visitas v
LEFT JOIN imoveis i ON v.imovel_id = i.id
LEFT JOIN corretores c ON v.corretor_id = c.id
WHERE v.data_hora BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY v.data_hora;

-- ================================================
-- 7. Estatísticas gerais
-- ================================================
SELECT 
    (SELECT COUNT(*) FROM corretores) as total_corretores,
    (SELECT COUNT(*) FROM imoveis) as total_imoveis,
    (SELECT COUNT(*) FROM visitas) as total_visitas,
    (SELECT COUNT(*) FROM visitas WHERE corretor_id IS NULL) as visitas_corretor_manual,
    (SELECT COUNT(*) FROM visitas WHERE imovel_id IS NULL) as visitas_imovel_manual;

-- ================================================
-- 8. Buscar corretor mais ativo (mais visitas)
-- ================================================
SELECT 
    COALESCE(v.corretor_nome_manual, c.nome) as corretor_nome,
    COUNT(*) as total_visitas
FROM visitas v
LEFT JOIN corretores c ON v.corretor_id = c.id
GROUP BY COALESCE(v.corretor_nome_manual, c.nome)
ORDER BY total_visitas DESC
LIMIT 5;

-- ================================================
-- 9. Query para reordenar visitas (drag and drop)
-- ================================================
-- Exemplo: mover visita ID 'v1...' para posição 3
-- UPDATE visitas SET ordem = 3 WHERE id = 'v1a2b3c4-d5e6-f789-0123-456789abcdef';

-- ================================================
-- 10. Limpar dados de teste (cuidado!)
-- ================================================
-- DELETE FROM visitas;
-- DELETE FROM imoveis;
-- DELETE FROM corretores;