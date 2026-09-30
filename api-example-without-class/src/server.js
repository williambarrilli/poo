const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const caminhoArquivo = path.join(__dirname, "../data/tarefas.json");

// Lê as tarefas diretamente do arquivo JSON.
async function carregarTarefas() {
  const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
  return JSON.parse(conteudo);
}

// Salva as tarefas diretamente no arquivo JSON.
async function gravarTarefas(tarefas) {
  const dados = JSON.stringify(tarefas, null, 2);
  console.log(`Gravando tarefas: ${dados}`);
  await fs.writeFile(caminhoArquivo, dados);
}

// Permite que o SimuladorRequest.html seja aberto fora deste projeto.
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

// Permite receber objetos JSON em POST e PATCH.
app.use(express.json());

// Lista todas as tarefas.
app.get("/tarefas", async (request, response) => {
  try {
    const tarefas = await carregarTarefas();

    response.json(tarefas);
  } catch (error) {
    console.error(`Erro ao carregar tarefas: ${error.message}`);
    response.status(500).json({
      mensagem: "Houve um problema, mande esse codigo para o TI ",
      error: error.message,
    });
  }
});

// Busca uma tarefa pelo ID.
app.get("/tarefas/:id", async (request, response) => {
  try {
    const tarefas = await carregarTarefas();
    const tarefaEncontrada = tarefas.find(
      (tarefa) => tarefa.id === Number(request.params.id),
    );

    if (!tarefaEncontrada) {
      return response.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    response.json(tarefaEncontrada);
  } catch (error) {
    console.error(`Erro ao carregar tarefas: ${error.message}`);
    response.status(500).json({
      mensagem: "Houve um problema, mande esse codigo para o TI ",
      error: error.message,
    });
  }
});

// Cria uma tarefa.
app.post("/tarefas", async (request, response) => {
  const { titulo, descricao = "", prioridade = "media" } = request.body;

  if (!titulo) {
    return response
      .status(400)
      .json({ mensagem: "O campo titulo é obrigatório" });
  }

  try {
    const tarefas = await carregarTarefas();
    const novaTarefa = {
      id: tarefas.length
        ? Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1
        : 1,
      titulo,
      descricao,
      prioridade,
      concluida: false,
    };

    tarefas.push(novaTarefa);
    await gravarTarefas(tarefas);
    response.status(201).json(novaTarefa);
  } catch (error) {
    console.error(`Erro ao salvar tarefa: ${error.message}`);
    response.status(500).json({
      mensagem: "Houve um problema, mande esse codigo para o TI ",
      error: error.message,
    });
  }
});

// Atualiza apenas os campos enviados.
app.patch("/tarefas/:id", async (request, response) => {
  try {
    const tarefas = await carregarTarefas();
    const tarefa = tarefas.find(
      (item) => item.id === Number(request.params.id),
    );

    if (!tarefa) {
      return response.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    const { titulo, descricao, prioridade, concluida } = request.body;

    if (titulo !== undefined) tarefa.titulo = titulo;
    if (descricao !== undefined) tarefa.descricao = descricao;
    if (prioridade !== undefined) tarefa.prioridade = prioridade;
    if (concluida !== undefined) tarefa.concluida = concluida;

    await gravarTarefas(tarefas);
    response.json(tarefa);
  } catch (error) {
    console.error(`Erro ao atualizar tarefa: ${error.message}`);
    response.status(500).json({
      mensagem: "Houve um problema, mande esse codigo para o TI ",
      error: error.message,
    });
  }
});

// Remove uma tarefa.
app.delete("/tarefas/:id", async (request, response) => {
  try {
    const tarefas = await carregarTarefas();
    const indice = tarefas.findIndex(
      (tarefa) => tarefa.id === Number(request.params.id),
    );

    if (indice === -1) {
      return response.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    const [tarefaRemovida] = tarefas.splice(indice, 1);
    await gravarTarefas(tarefas);
    response.json(tarefaRemovida);
  } catch (error) {
    console.error(`Erro ao remover tarefa: ${error.message}`);
    response.status(500).json({
      mensagem: "Houve um problema, mande esse codigo para o TI ",
      error: error.message,
    });
  }
});

app.listen(PORTA, () => {
  const url = `http://localhost:${PORTA}`;

  console.log(`API disponível em: ${url}`);
});
