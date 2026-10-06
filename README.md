# POO

Exemplos didáticos de APIs com Node.js e Express para praticar servidores HTTP, rotas, requisições JSON e operações CRUD.

## Projetos

| Pasta | Descrição |
| --- | --- |
| `api-example-with-class` | API de tarefas usando a classe `Tarefa`. |
| `api-example-without-class` | A mesma API de tarefas, mas com toda a lógica diretamente no `server.js`, sem classes. |
| `api-revisao` | Exemplo menor para revisão de rotas e tarefas. |
| `api-teste` | API de tarefas com um simulador HTTP reutilizável. |
| `api-camadas-com-classe` | Exemplo resolvido do esqueleto `api-desenvolvimento`: controller, logic, repository e a classe `Tarefa` com validação. |

## Executar a API sem classes

Entre na pasta do projeto e instale as dependências:

```bash
cd api-example-without-class
npm install
```

Inicie o servidor:

```bash
npm start
```

Durante o desenvolvimento, use o `nodemon`:

```bash
npm run dev
```

A API fica disponível em `http://localhost:3000` e persiste as tarefas em `data/tarefas.json`.

### Rotas disponíveis

- `GET /tarefas`: lista as tarefas;
- `GET /tarefas/:id`: busca uma tarefa;
- `POST /tarefas`: cria uma tarefa;
- `PATCH /tarefas/:id`: atualiza os campos enviados;
- `DELETE /tarefas/:id`: remove uma tarefa.

Exemplo de criação:

```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Estudar Express","prioridade":"alta"}'
```

Cada projeto possui seu próprio README com instruções e detalhes adicionais. O arquivo `SimuladorRequest.html` pode ser aberto separadamente para testar as requisições pelo navegador.

## Tutorial de Git

Consulte o [Tutorial de Git](TUTORIAL_GIT.md) para aprender a criar um repositório, fazer commits e publicar um projeto no GitHub.
