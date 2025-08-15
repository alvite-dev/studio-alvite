-- ================================================
-- Dados Mockados para Supabase - Studio Alvite (CORRIGIDO)
-- Sistema de Agenda de Visitas
-- ================================================
-- NOTA: Todos os UUIDs foram corrigidos para usar apenas caracteres válidos (0-9, a-f)

-- ================================================
-- 1. Inserir Corretores
-- ================================================
INSERT INTO corretores (id, nome, telefone, imobiliaria) VALUES
('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Ana Silva', '(11) 99999-1111', 'Imobiliária Central'),
('550e8400-e29b-41d4-a716-446655440001', 'Carlos Santos', '(11) 98888-2222', 'Prime Imóveis'),
('6ba7b810-9dad-11d1-80b4-00c04fd430c8', 'Mariana Costa', '(11) 97777-3333', NULL),
('3e2f0a4b-8c9d-4e5f-a6b7-c8d9e0f1a2b3', 'Roberto Lima', '(11) 96666-4444', 'Vista Imóveis'),
('9f8e7d6c-5b4a-3918-2736-5647382910ab', 'Fernanda Oliveira', '(11) 95555-5555', 'Casa & Cia'),
('7c6b5a49-3827-4d5e-9f1a-2b3c4d5e6f7a', 'João Pereira', '(11) 94444-6666', NULL),
('2a1b0c9d-8e7f-4635-a524-1b3c5d7e9f0a', 'Luciana Rodrigues', '(11) 93333-7777', 'Habitat Imóveis'),
('8d7c6b5a-4938-2716-5e4f-a1b2c3d4e5f6', 'Eduardo Martins', '(11) 92222-8888', NULL),
('5f4e3d2c-1b0a-9988-7766-554433221100', 'Patrícia Souza', '(11) 91111-9999', 'Moradia Fácil'),
('1e2d3c4b-5a69-7887-9665-443322110099', 'Gabriel Torres', '(11) 90000-0000', 'Premium Houses')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 2. Inserir Imóveis (UUIDs CORRIGIDOS)
-- ================================================
INSERT INTO imoveis (id, link, endereco, quartos, banheiros, vagas, corretor_id) VALUES
('a1b2c3d4-e5f6-7890-1234-567890abcdef', 'https://www.zapimoveis.com.br/imovel/apartamento-3-quartos-vila-madalena', 'Rua Harmonia 123 - Vila Madalena - São Paulo - SP', 3, 2, 1, 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
('b2c3d4e5-f6a7-8901-2345-678901bcdefb', 'https://www.vivareal.com.br/imovel/casa-4-quartos-jardins', 'Av. Paulista 456 - Jardins - São Paulo - SP', 4, 3, 2, '550e8400-e29b-41d4-a716-446655440001'),
('c3d4e5f6-a7b8-9012-3456-789012cdefab', 'https://www.zapimoveis.com.br/imovel/apartamento-2-quartos-moema', 'Rua dos Açores 789 - Moema - São Paulo - SP', 2, 1, 1, NULL),
('d4e5f6a7-b8c9-0123-4567-890123defabc', 'https://www.vivareal.com.br/imovel/cobertura-perdizes', 'Rua Monte Alegre 321 - Perdizes - São Paulo - SP', 3, 3, 2, '3e2f0a4b-8c9d-4e5f-a6b7-c8d9e0f1a2b3'),
('e5f6a7b8-c9d0-1234-5678-901234efabcd', 'https://www.zapimoveis.com.br/imovel/casa-5-quartos-alto-pinheiros', 'Rua Cardeal Arcoverde 654 - Alto de Pinheiros - SP', 5, 4, 3, '9f8e7d6c-5b4a-3918-2736-5647382910ab'),
('f6a7b8c9-d0e1-2345-6789-012345fabcde', 'https://www.vivareal.com.br/imovel/apartamento-1-quarto-vila-olimpia', 'Rua Gomes de Carvalho 987 - Vila Olímpia - SP', 1, 1, 1, NULL),
('a7b8c9d0-e1f2-3456-7890-123456abcdef', 'https://www.zapimoveis.com.br/imovel/duplex-itaim-bibi', 'Av. Brigadeiro Faria Lima 159 - Itaim Bibi - SP', 4, 3, 2, '2a1b0c9d-8e7f-4635-a524-1b3c5d7e9f0a'),
('b8c9d0e1-f2a3-4567-8901-234567bcdef0', 'https://www.vivareal.com.br/imovel/apartamento-3-quartos-brooklin', 'Rua Joaquim Floriano 753 - Brooklin - São Paulo - SP', 3, 2, 1, NULL),
('c9d0e1f2-a3b4-5678-9012-345678cdef01', 'https://www.zapimoveis.com.br/imovel/casa-6-quartos-morumbi', 'Av. Giovanni Gronchi 852 - Morumbi - São Paulo - SP', 6, 5, 4, '5f4e3d2c-1b0a-9988-7766-554433221100'),
('d0e1f2a3-b4c5-6789-0123-456789def012', 'https://www.vivareal.com.br/imovel/loft-pinheiros', 'Rua dos Pinheiros 741 - Pinheiros - São Paulo - SP', 1, 1, 0, '1e2d3c4b-5a69-7887-9665-443322110099')
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 3. Inserir Visitas de Exemplo (UUIDs CORRIGIDOS)
-- ================================================
-- Algumas visitas usando dados da base
INSERT INTO visitas (id, imovel_id, corretor_id, data_hora, observacoes_pre, ordem) VALUES
('e1f2a3b4-c5d6-7890-1234-56789abcdef0', 'a1b2c3d4-e5f6-7890-1234-567890abcdef', 'f47ac10b-58cc-4372-a567-0e02b2c3d479', NOW() + INTERVAL '2 hours', 'Primeira visita do dia. Apartamento muito bem localizado.', 1),
('f2a3b4c5-d6e7-8901-2345-6789abcdef01', 'b2c3d4e5-f6a7-8901-2345-678901bcdefb', '550e8400-e29b-41d4-a716-446655440001', NOW() + INTERVAL '4 hours', 'Casa ampla nos Jardins. Cliente interessado.', 2),
('a3b4c5d6-e7f8-9012-3456-789abcdef012', 'd4e5f6a7-b8c9-0123-4567-890123defabc', '3e2f0a4b-8c9d-4e5f-a6b7-c8d9e0f1a2b3', NOW() + INTERVAL '1 day 10 hours', 'Cobertura em Perdizes com vista incrível.', 3)
ON CONFLICT (id) DO NOTHING;

-- Algumas visitas usando dados manuais
INSERT INTO visitas (id, imovel_endereco_manual, imovel_link_manual, corretor_nome_manual, corretor_telefone_manual, data_hora, observacoes_pre, ordem) VALUES
('b4c5d6e7-f8a9-0123-4567-89abcdef0123', 'Rua Augusta 1000 - Consolação - São Paulo - SP', 'https://example.com/imovel-augusta', 'Maria Santos', '(11) 98765-4321', NOW() + INTERVAL '1 day 14 hours', 'Imóvel não cadastrado ainda. Corretor novo parceiro.', 4),
('c5d6e7f8-a9b0-1234-5678-9abcdef01234', 'Av. Rebouças 500 - Pinheiros - São Paulo - SP', NULL, 'José Silva', '(11) 91234-5678', NOW() + INTERVAL '2 days 9 hours', 'Visita de reconhecimento da região.', 5)
ON CONFLICT (id) DO NOTHING;

-- Visita mista (imóvel da base + corretor manual)
INSERT INTO visitas (id, imovel_id, corretor_nome_manual, corretor_telefone_manual, data_hora, observacoes_pre, ordem) VALUES
('d6e7f8a9-b0c1-2345-6789-abcdef012345', 'e5f6a7b8-c9d0-1234-5678-901234efabcd', 'Ricardo Moreira', '(11) 95555-1234', NOW() + INTERVAL '3 days 16 hours', 'Casa de alto padrão. Corretor especializado em imóveis de luxo.', 6)
ON CONFLICT (id) DO NOTHING;

-- ================================================
-- 4. Verificar dados inseridos
-- ================================================
-- Contagem de registros
SELECT 'corretores' as tabela, COUNT(*) as total FROM corretores
UNION ALL
SELECT 'imoveis' as tabela, COUNT(*) as total FROM imoveis  
UNION ALL
SELECT 'visitas' as tabela, COUNT(*) as total FROM visitas
ORDER BY tabela;

-- ================================================
-- 5. Validação dos UUIDs inseridos
-- ================================================
-- Esta query deve retornar vazio se todos os UUIDs estão corretos
SELECT 'corretores' as tabela, id, 'UUID inválido' as problema
FROM corretores 
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'

UNION ALL

SELECT 'imoveis' as tabela, id, 'UUID inválido' as problema  
FROM imoveis
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'

UNION ALL

SELECT 'visitas' as tabela, id, 'UUID inválido' as problema
FROM visitas  
WHERE id::text !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$';