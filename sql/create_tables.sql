-- ================================================
-- Script SQL para Supabase - Studio Alvite
-- Sistema de Agenda de Visitas
-- ================================================

-- Habilitar RLS (Row Level Security)
-- Para usar em produção, configure as policies adequadas

-- ================================================
-- 1. Tabela de Corretores
-- ================================================
CREATE TABLE IF NOT EXISTS corretores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    imobiliaria VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 2. Tabela de Imóveis
-- ================================================
CREATE TABLE IF NOT EXISTS imoveis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    link TEXT,
    endereco TEXT NOT NULL,
    quartos INTEGER NOT NULL DEFAULT 0,
    banheiros INTEGER NOT NULL DEFAULT 0,
    vagas INTEGER NOT NULL DEFAULT 0,
    corretor_id UUID REFERENCES corretores(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ================================================
-- 3. Tabela de Visitas
-- ================================================
CREATE TABLE IF NOT EXISTS visitas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Imóvel da base ou manual
    imovel_id UUID REFERENCES imoveis(id) ON DELETE CASCADE,
    imovel_link_manual TEXT,
    imovel_endereco_manual TEXT,
    -- Corretor da base ou manual
    corretor_id UUID REFERENCES corretores(id) ON DELETE SET NULL,
    corretor_nome_manual VARCHAR(255),
    corretor_telefone_manual VARCHAR(20),
    -- Data e observações
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    observacoes_pre TEXT,
    -- Ordem para drag-and-drop
    ordem INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Constraints para garantir que pelo menos um tipo de dados existe
    CONSTRAINT check_imovel_data CHECK (
        (imovel_id IS NOT NULL) OR 
        (imovel_endereco_manual IS NOT NULL)
    ),
    CONSTRAINT check_corretor_data CHECK (
        (corretor_id IS NOT NULL) OR 
        (corretor_nome_manual IS NOT NULL AND corretor_telefone_manual IS NOT NULL)
    )
);

-- ================================================
-- 4. Índices para Performance
-- ================================================
CREATE INDEX IF NOT EXISTS idx_visitas_data_hora ON visitas(data_hora);
CREATE INDEX IF NOT EXISTS idx_visitas_ordem ON visitas(ordem);
CREATE INDEX IF NOT EXISTS idx_imoveis_corretor ON imoveis(corretor_id);
CREATE INDEX IF NOT EXISTS idx_visitas_imovel ON visitas(imovel_id);
CREATE INDEX IF NOT EXISTS idx_visitas_corretor ON visitas(corretor_id);

-- ================================================
-- 5. Triggers para updated_at automático
-- ================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_corretores_updated_at 
    BEFORE UPDATE ON corretores 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_imoveis_updated_at 
    BEFORE UPDATE ON imoveis 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitas_updated_at 
    BEFORE UPDATE ON visitas 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 6. RLS Policies (Descomente e configure conforme necessário)
-- ================================================
-- ALTER TABLE corretores ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE imoveis ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE visitas ENABLE ROW LEVEL SECURITY;

-- Exemplo de policies (ajuste conforme suas regras de negócio):
-- CREATE POLICY "Allow all operations for authenticated users" ON corretores
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON imoveis
--     FOR ALL USING (auth.role() = 'authenticated');

-- CREATE POLICY "Allow all operations for authenticated users" ON visitas
--     FOR ALL USING (auth.role() = 'authenticated');