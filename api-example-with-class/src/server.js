const express = require("express");
const path = require("path");
const { Tarefa } = require("./tarefaService");

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const caminhoArquivo = path.join(__dirname, "../data/tarefas.json");
const tarefa = new Tarefa(caminhoArquivo);

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
    response.json(await tarefa.listar());
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
    const tarefaEncontrada = await tarefa.buscarPorId(request.params.id);

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
    const novaTarefa = await tarefa.salvar(titulo, descricao, prioridade);
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
    const tarefaAtualizada = await tarefa.atualizar(
      request.params.id,
      request.body,
    );

    if (!tarefaAtualizada) {
      return response.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

    response.json(tarefaAtualizada);
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
    const tarefaRemovida = await tarefa.remover(request.params.id);

    if (!tarefaRemovida) {
      return response.status(404).json({ mensagem: "Tarefa não encontrada" });
    }

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
