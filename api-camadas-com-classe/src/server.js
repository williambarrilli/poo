import express from "express";
import { fileURLToPath } from "node:url";
import * as tarefaController from "./controllers/tarefaController.js";

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

app.get("/", tarefaController.obterTarefa);
app.get("/tarefas", tarefaController.listarTarefas);
app.post("/tarefas", tarefaController.cadastrarTarefa);

// Só inicia o servidor (app.listen) quando este arquivo é executado
// diretamente, por exemplo com `node src/server.js` ou `npm start`.
//
// `import.meta.url` é a URL deste próprio arquivo (algo como
// "file:///.../src/server.js"). `fileURLToPath` converte essa URL para
// um caminho comum de arquivo, para poder comparar com
// `process.argv[1]`, que é o caminho do arquivo que o Node recebeu para
// rodar.
//
// Se alguém importar este arquivo de outro lugar (um arquivo de teste,
// por exemplo, com `import app from "./server.js"`), o arquivo
// executado pelo Node deixa de ser o server.js, então a condição é
// falsa e `app.listen` não roda. Isso permite testar as rotas de `app`
// sem abrir uma porta de verdade, e evita abrir duas portas por engano
// se o servidor for importado em outro script.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(PORTA, () => {
    console.log(`API disponível em http://localhost:${PORTA}`);
  });
}

export default app;
