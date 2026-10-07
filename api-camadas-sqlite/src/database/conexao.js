// CONEXÃO
// Abre (ou cria) o banco data/banco.db e executa o script data/banco.sql,
// que cria as tabelas e insere os dados iniciais. O script pode rodar a
// cada inicialização: CREATE TABLE IF NOT EXISTS não recria tabelas e
// INSERT OR IGNORE não duplica os registros iniciais.
//
// Usa o módulo node:sqlite, que já vem no Node.js 22.13 ou superior:
// não precisa instalar nenhuma dependência. Ao iniciar, o Node mostra um
// aviso "ExperimentalWarning" sobre o SQLite: é normal, não é erro.
//
// Todos os métodos são síncronos (não precisam de await).
import { DatabaseSync } from "node:sqlite";
import fs from "node:fs";
import path from "node:path";

const pastaDados = path.join(process.cwd(), "data");
const caminhoBanco = path.join(pastaDados, "banco.db");
const caminhoScript = path.join(pastaDados, "banco.sql");

fs.mkdirSync(pastaDados, { recursive: true });

const db = new DatabaseSync(caminhoBanco);
db.exec(fs.readFileSync(caminhoScript, "utf-8"));

export default db;
