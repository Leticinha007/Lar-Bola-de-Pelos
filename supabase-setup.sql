-- =========================================================
-- LAR BOLA DE PELOS — Supabase Setup
-- =========================================================

-- Tabela de gatos
CREATE TABLE gatos (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome        text        NOT NULL,
  idade       text        NOT NULL,
  genero      text        NOT NULL CHECK (genero IN ('macho', 'femea')),
  porte       text        NOT NULL DEFAULT 'Médio',
  descricao   text        DEFAULT '',
  tags        text[]      DEFAULT '{}',
  disponivel  boolean     DEFAULT true,
  modo        text        NOT NULL DEFAULT 'ambos' CHECK (modo IN ('adocao', 'apadrinhamento', 'ambos')),
  foto_url    text,
  criado_em   timestamptz DEFAULT now(),
  atualizado_em timestamptz DEFAULT now()
);

-- Atualiza atualizado_em automaticamente
CREATE OR REPLACE FUNCTION update_atualizado_em()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.atualizado_em = now(); RETURN NEW; END;
$$;
CREATE TRIGGER gatos_atualizado_em
  BEFORE UPDATE ON gatos
  FOR EACH ROW EXECUTE FUNCTION update_atualizado_em();

-- RLS
ALTER TABLE gatos ENABLE ROW LEVEL SECURITY;

-- Público pode ler todos os gatos disponíveis
CREATE POLICY "leitura_publica" ON gatos
  FOR SELECT USING (true);

-- Apenas admin autenticado pode criar/editar/deletar
CREATE POLICY "admin_escrita" ON gatos
  FOR ALL USING (auth.role() = 'authenticated');

-- =========================================================
-- Storage bucket para fotos
-- =========================================================

-- Permite leitura pública das fotos
CREATE POLICY "fotos_leitura_publica" ON storage.objects
  FOR SELECT USING (bucket_id = 'gatos');

-- Apenas admin autenticado pode fazer upload/editar/deletar fotos
CREATE POLICY "fotos_admin_upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'gatos' AND auth.role() = 'authenticated');

CREATE POLICY "fotos_admin_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'gatos' AND auth.role() = 'authenticated');

CREATE POLICY "fotos_admin_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'gatos' AND auth.role() = 'authenticated');

-- =========================================================
-- Dados de exemplo
-- =========================================================
INSERT INTO gatos (nome, idade, genero, porte, descricao, tags, disponivel, modo) VALUES
('Luna',     '2 anos',  'femea', 'Médio',   'Luna é uma gatinha encantadora que adora receber carinho e brincar com bolinhas.',   ARRAY['carinhosa','brincalhona'], true, 'ambos'),
('Mel',      '1 ano',   'femea', 'Pequeno', 'Mel é docinha e precisa de paciência para ganhar confiança.',                        ARRAY['timida','docil'],         true, 'ambos'),
('Thor',     '3 anos',  'macho', 'Grande',  'Thor é um gatão imponente e muito brincalhão. Vive bem sozinho ou com outro gato.',  ARRAY['brincalhona','independente'], true, 'adocao'),
('Bolinha',  '6 meses', 'macho', 'Pequeno', 'Bolinha é um filhote cheio de energia que adora correr e fazer bagunça.',            ARRAY['energetica','sociavel'],  true, 'ambos'),
('Nala',     '4 anos',  'femea', 'Médio',   'Nala é uma rainha! Adora carinho e se dá bem com todo mundo.',                      ARRAY['carinhosa','sociavel'],   true, 'ambos'),
('Biscuit',  '2 anos',  'macho', 'Médio',   'Biscuit é tranquilo e observador. Ideal para lares mais calmos.',                   ARRAY['independente','reservada'], true, 'apadrinhamento');
