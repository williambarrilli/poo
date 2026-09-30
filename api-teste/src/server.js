const express = require("express");

const app = express();
const PORTA = Number(process.env.PORT || 3000);

// Permite que o SimuladorRequest.html seja aberto fora deste projeto.
app.use((request, response, next) => {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (request.method === "OPTIONS") {
    return response.sendStatus(204);
  }

  next();
});

// Permite receber objetos JSON em POST e PATCH.
app.use(express.json());

// Dados apenas em memória: eles são reiniciados quando o servidor é reiniciado.
const tarefas = [
  {
    id: 1,
    titulo: "Estudar rotas do Express",
    descricao: "Praticar GET, POST, PATCH e DELETE",
    prioridade: "alta",
    concluida: false,
  },
  {
    id: 2,
    titulo: "Criar um endpoint",
    descricao: "Implementar uma nova rota para a API",
    prioridade: "media",
    concluida: false,
  },
];

function encontrarTarefa(id) {
  return tarefas.find((tarefa) => tarefa.id === Number(id));
}

// Lista todas as tarefas.
app.get("/tarefas", (request, response) => {
  response.json(tarefas);
});

// Busca uma tarefa pelo ID.
app.get("/tarefas/:id", (request, response) => {
  const tarefa = encontrarTarefa(request.params.id);

  if (!tarefa) {
    return response.status(404).json({ mensagem: "Tarefa não encontrada" });
  }

  response.json(tarefa);
});

// Cria uma tarefa.
app.post("/tarefas", (request, response) => {
  const { titulo, descricao = "", prioridade = "media" } = request.body;

  if (!titulo) {
    return response.status(400).json({ mensagem: "O campo titulo é obrigatório" });
  }

  const novaTarefa = {
    id: tarefas.length ? Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1 : 1,
    titulo,
    descricao,
    prioridade,
    concluida: false,
  };

  tarefas.push(novaTarefa);
  response.status(201).json(novaTarefa);
});

// Atualiza apenas os campos enviados.
app.patch("/tarefas/:id", (request, response) => {
  const tarefa = encontrarTarefa(request.params.id);

  if (!tarefa) {
    return response.status(404).json({ mensagem: "Tarefa não encontrada" });
  }

  const { titulo, descricao, prioridade, concluida } = request.body;

  if (titulo !== undefined) tarefa.titulo = titulo;
  if (descricao !== undefined) tarefa.descricao = descricao;
  if (prioridade !== undefined) tarefa.prioridade = prioridade;
  if (concluida !== undefined) tarefa.concluida = concluida;

  response.json(tarefa);
});

// Remove uma tarefa.
app.delete("/tarefas/:id", (request, response) => {
  const indice = tarefas.findIndex((tarefa) => tarefa.id === Number(request.params.id));

  if (indice === -1) {
    return response.status(404).json({ mensagem: "Tarefa não encontrada" });
  }

  response.json(tarefas.splice(indice, 1)[0]);
});

app.listen(PORTA, () => {
  const url = `http://localhost:${PORTA}`;

  console.log(`API disponível em: ${url}`);
});
