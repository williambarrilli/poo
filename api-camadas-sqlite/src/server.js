import express from "express";
import { fileURLToPath } from "node:url";

const app = express();
const PORTA = Number(process.env.PORT || 3000);

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

app.use(express.json());

// ROTAS
// Ainda não há rotas: elas são o exercício. Crie o controller em
// src/controllers/tarefaController.js e a logic em src/logic/tarefaLogic.js,
// e registre aqui as rotas do CRUD, por exemplo:
//
// import * as tarefaController from "./controllers/tarefaController.js";
// app.get("/tarefas", tarefaController.listarTarefas);
//
// A logic é quem chama o repository (src/repositories/tarefaRepository.js),
// que já está pronto com listar, buscarPorId, criar, atualizar e remover.

// Só inicia o servidor quando este arquivo é executado diretamente
// (npm start), e não quando ele é importado por outro arquivo.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;
