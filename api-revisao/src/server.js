const express = require("express");
const path = require("path");
const app = express();
const PORTA = 3000;
const { Tarefa, Tarefas } = require("./tarefa");

const tarefas = new Tarefas();
app.use(express.json());

// server.js está em src/, enquanto index.html está em public/.
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (request, response) => {
  response.send("Hello, world!");
});

app.get("/tarefas", (request, response) => {
  response.json(tarefas.listar());
});

app.post("/tarefas", (request, response) => {
  // const {titulo, descricao} = request.body
  const titulo = request.body.titulo;
  const descricao = request.body.descricao;
  const tarefa = new Tarefa(titulo, descricao);
  tarefas.adicionar(tarefa);
  response.status(201).json(tarefa);
});

app.listen(PORTA, () => {
  const url = `http://localhost:${PORTA}`;

  const link = `\u001b]8;;${url}/\u001b\\${url}/\u001b]8;;\u001b\\`;

  console.log(`API disponível em: ${url}`);
  console.log(`Abra o index no navegador: ${link}`);
});
