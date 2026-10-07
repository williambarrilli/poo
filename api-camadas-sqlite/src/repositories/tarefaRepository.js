// REPOSITORY
// Única camada que conhece o banco de dados e o SQL. Expõe o CRUD de
// tarefas com funções simples (listar, buscarPorId, criar, atualizar,
// remover). Quem usa este módulo recebe e envia objetos JavaScript
// comuns, sem saber que por trás existe uma tabela SQLite.
//
// O repository NÃO valida regras de negócio (título obrigatório,
// prioridade válida, tarefa existente...). Isso é papel da logic.
import db from "../database/conexao.js";

// Campos que podem ser gravados. Qualquer outro campo recebido é ignorado.
const CAMPOS_EDITAVEIS = ["titulo", "descricao", "prioridade", "concluida", "usuarioId"];

// O SQLite não tem tipo booleano: a coluna concluida guarda 0 ou 1.
// Ao ler, convertemos a linha do banco para o formato da API (true/false).
function paraTarefa(linha) {
  if (!linha) return null;

  return { ...linha, concluida: linha.concluida === 1 };
}

// Ao gravar, fazemos o caminho inverso. O node:sqlite também não aceita
// undefined nem true/false como parâmetro: usamos null, 1 ou 0.
function paraBanco(campo, valor) {
  if (campo === "concluida") return valor ? 1 : 0;

  return valor ?? null;
}

// READ: todas as tarefas, ordenadas pelo id.
export function listar() {
  return db.prepare("SELECT * FROM tarefas ORDER BY id").all().map(paraTarefa);
}

// READ: uma tarefa pelo id. Retorna null quando o id não existe.
export function buscarPorId(id) {
  const linha = db.prepare("SELECT * FROM tarefas WHERE id = ?").get(id);

  return paraTarefa(linha);
}

// CREATE: insere a tarefa e retorna o registro criado, com o id gerado
// pelo banco (AUTOINCREMENT).
export function criar(tarefa) {
  const resultado = db
    .prepare(
      `INSERT INTO tarefas (titulo, descricao, prioridade, concluida, usuarioId)
       VALUES (?, ?, ?, ?, ?)`,
    )
    .run(
      paraBanco("titulo", tarefa.titulo),
      paraBanco("descricao", tarefa.descricao),
      paraBanco("prioridade", tarefa.prioridade),
      paraBanco("concluida", tarefa.concluida),
      paraBanco("usuarioId", tarefa.usuarioId),
    );

  return buscarPorId(Number(resultado.lastInsertRowid));
}

// UPDATE: altera somente os campos informados (atualização parcial).
// Retorna a tarefa atualizada, ou null quando o id não existe.
export function atualizar(id, campos) {
  const nomes = CAMPOS_EDITAVEIS.filter((campo) => campos[campo] !== undefined);

  if (nomes.length === 0) {
    return buscarPorId(id);
  }

  // Monta "titulo = ?, prioridade = ?" só com os campos recebidos.
  // Os nomes vêm da lista fixa acima; os valores entram sempre pelo "?".
  const atribuicoes = nomes.map((campo) => `${campo} = ?`).join(", ");
  const valores = nomes.map((campo) => paraBanco(campo, campos[campo]));

  const resultado = db
    .prepare(`UPDATE tarefas SET ${atribuicoes} WHERE id = ?`)
    .run(...valores, id);

  return resultado.changes > 0 ? buscarPorId(id) : null;
}

// DELETE: remove a tarefa. Retorna true se removeu, false se o id não existia.
export function remover(id) {
  const resultado = db.prepare("DELETE FROM tarefas WHERE id = ?").run(id);

  return resultado.changes > 0;
}
