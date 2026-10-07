-- =====================================================================
-- API de desenvolvimento · Banco de dados SQLite
-- Tabelas prontas para a migração do arquivo JSON para o SQLite.
--
-- Este script pode rodar toda vez que a API iniciar:
--   - CREATE TABLE IF NOT EXISTS não recria tabelas que já existem;
--   - INSERT OR IGNORE não duplica os registros iniciais (ids fixos).
-- =====================================================================

-- Liga a verificação de chave estrangeira (o SQLite vem com ela desligada)
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS usuarios (
  id    INTEGER PRIMARY KEY AUTOINCREMENT,
  nome  TEXT    NOT NULL,
  email TEXT    NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS tarefas (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  titulo     TEXT    NOT NULL,
  descricao  TEXT,
  prioridade TEXT    CHECK (prioridade IN ('baixa', 'media', 'alta')),
  concluida  INTEGER NOT NULL DEFAULT 0 CHECK (concluida IN (0, 1)),  -- 0 = false, 1 = true
  usuarioId  INTEGER REFERENCES usuarios (id)
);

-- Dados iniciais
INSERT OR IGNORE INTO usuarios (id, nome, email) VALUES
  (1, 'Ana',   'ana@email.com'),
  (2, 'Bruno', 'bruno@email.com');

INSERT OR IGNORE INTO tarefas (id, titulo, descricao, prioridade, concluida, usuarioId) VALUES
  (1, 'Aprender Express',    'Implementar a primeira tarefa da API', 'media', 0, 1),
  (2, 'Estudar SQL',         'Revisar SELECT, INSERT e UPDATE',      'alta',  1, 1),
  (3, 'Migrar o repository', 'Trocar o arquivo JSON pelo SQLite',    'baixa', 0, 2);
