# API de exemplo com Express sem classes

Esta é uma cópia da API de exemplo com a mesma funcionalidade, mas sem usar classes. Toda a lógica de leitura, gravação e CRUD das tarefas está no arquivo `src/server.js`.

## Como executar

Na pasta do projeto, execute:

```bash
npm install
npm start
```

Durante o desenvolvimento, use:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3000`.

## Estrutura

```text
api-example-without-class/
├── SimuladorRequest.html # Cliente HTTP reutilizável
├── data/
│   └── tarefas.json      # Dados persistidos das tarefas
├── src/
│   └── server.js         # Servidor, funções e rotas do CRUD
├── package.json
└── package-lock.json
```

## Rotas

- `GET /tarefas`: lista todas as tarefas;
- `GET /tarefas/:id`: busca uma tarefa pelo ID;
- `POST /tarefas`: cria uma tarefa com `titulo`, `descricao` e `prioridade`;
- `PATCH /tarefas/:id`: atualiza somente os campos enviados;
- `DELETE /tarefas/:id`: remove uma tarefa.

Os dados continuam sendo persistidos em `data/tarefas.json`, exatamente como na API original.
