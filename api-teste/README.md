# API de exemplo com Express

Este projeto é uma API simples para os alunos entenderem os conceitos básicos de um servidor HTTP com Node.js e Express.

Além da API, o projeto possui o [SimuladorRequest.html](SimuladorRequest.html), um cliente HTTP estático para testar requisições. Ele é independente da API, não é servido pelo `server.js` e pode ser copiado para testar qualquer outro projeto.

## Tecnologias

- Node.js
- Express
- HTML, CSS e JavaScript puro

## Estrutura do projeto

```text
api-teste/
├── SimuladorRequest.html # Cliente HTTP reutilizável
├── src/
│   └── server.js     # Servidor Express e rotas da API
├── package.json      # Scripts e dependências do projeto
└── package-lock.json # Versões exatas das dependências instaladas
```

## Como executar

Pré-requisito: ter o Node.js instalado.

Na pasta do projeto, execute:

```bash
npm install
npm start
```

Durante o desenvolvimento, use o `nodemon` para reiniciar o servidor automaticamente quando um arquivo for alterado:

```bash
npm run dev
```

O script `start` executa o Node.js diretamente e é indicado para uma execução normal. O script `dev` usa o `nodemon` e é mais conveniente enquanto você está editando o código.

Quando o servidor iniciar, ele ficará disponível em:

```text
http://localhost:3000
```

Se a porta `3000` já estiver sendo usada por outro projeto, escolha outra porta:

```bash
PORT=3001 npm run dev
```

Nesse caso, informe `http://localhost:3001` no campo **URL base** do `SimuladorRequest.html`.

## Como o servidor funciona

O arquivo [src/server.js](src/server.js) faz quatro coisas principais:

### 1. Importa o Express

```js
const express = require("express");
```

O Express facilita a criação do servidor e das rotas HTTP.

### 2. Converte JSON recebido

```js
app.use(express.json());
```

Esse middleware permite acessar um corpo JSON por meio de `request.body`.

Por exemplo, em uma requisição com:

```json
{
  "titulo": "Estudar APIs"
}
```

o valor estará disponível em `request.body.titulo`.

### 3. Permite chamadas de outros endereços locais

O servidor envia cabeçalhos CORS para que o `SimuladorRequest.html` possa ser aberto diretamente ou por outro servidor local, como o Live Server do VS Code.

Quando o navegador faz uma requisição de verificação (`OPTIONS`), o servidor responde com status `204`, indicando que a chamada pode continuar.

### 4. Inicia o servidor

```js
app.listen(PORTA, () => {
  console.log(`API disponível em http://localhost:${PORTA}`);
});
```

A porta `3000` é o número usado pelo servidor para receber as requisições.

## Rotas da API

Os dados ficam inicialmente nesta lista em memória:

```js
const tarefas = [
  {
    id: 1,
    titulo: "Estudar rotas do Express",
    descricao: "Praticar GET, POST, PATCH e DELETE",
    prioridade: "alta",
    concluida: false
  },
  {
    id: 2,
    titulo: "Criar um endpoint",
    descricao: "Implementar uma nova rota para a API",
    prioridade: "media",
    concluida: false
  }
];
```

Isso significa que os dados não são salvos em banco de dados. Ao parar e iniciar o servidor novamente, a lista volta ao estado inicial.

### `GET /tarefas`

Retorna as tarefas. Informe `GET` e `/tarefas` no `SimuladorRequest.html` para testar essa rota:

```bash
curl http://localhost:3000/tarefas
```

### `GET /tarefas/:id`

Busca uma tarefa específica:

```bash
curl http://localhost:3000/tarefas/1
```

### `POST /tarefas`

Cria uma tarefa. O campo `titulo` é obrigatório; `descricao` e `prioridade` são opcionais:

```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Estudar Express",
    "descricao": "Aprender rotas e middlewares",
    "prioridade": "alta"
  }'
```

Se a criação funcionar, a API retorna status `201` e a tarefa criada.

### `PATCH /tarefas/:id`

Atualiza apenas os campos enviados:

```bash
curl -X PATCH http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"concluida":true}'
```

Também é possível atualizar `titulo`, `descricao` e `prioridade`.

### `DELETE /tarefas/:id`

Remove uma tarefa:

```bash
curl -X DELETE http://localhost:3000/tarefas/1
```

Se o ID não existir, a API retorna status `404`.

## Como o `SimuladorRequest.html` chama a API

O arquivo [SimuladorRequest.html](SimuladorRequest.html) possui campos para:

- URL base;
- método HTTP;
- endpoint;
- cabeçalhos HTTP em formato JSON;
- corpo JSON.

Por padrão, a URL base é:

```text
http://localhost:3000
```

Quando o aluno clica em “Enviar requisição”, o JavaScript monta a URL e executa:

```js
const response = await fetch(url, options);
```

Por exemplo:

```text
URL base: http://localhost:3000
Endpoint: /tarefas
```

torna-se:

```text
http://localhost:3000/tarefas
```

Para requisições `POST`, `PATCH` e `PUT`, o simulador lê o texto do campo JSON, valida o conteúdo e envia o cabeçalho:

```http
Content-Type: application/json
```

Para `GET`, `DELETE` e `OPTIONS`, normalmente não é necessário enviar corpo.

O simulador possui a opção `PUT`, mas ainda não existe uma rota `PUT` neste servidor de exemplo. Ela pode ser implementada como exercício; atualmente, use `PATCH` para atualizar uma tarefa.

## Usando o `SimuladorRequest.html` com outras APIs

O `SimuladorRequest.html` é um cliente HTTP genérico. Ele não está preso a esta API: pode ser usado para testar qualquer API acessível pelo navegador que aceite os métodos e formatos enviados.

### 1. Disponibilize o arquivo HTML

Você pode:

- copiar `SimuladorRequest.html` para qualquer pasta ou projeto; ou
- abrir o arquivo com um servidor estático, como o Live Server do VS Code.

Em uma API Express, a configuração costuma ser parecida com:

```js
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
```

Depois, abra no navegador a URL fornecida pelo servidor estático.

### 2. Informe a URL base da nova API

No campo **URL base**, coloque apenas a origem da API ou a origem mais o prefixo comum das rotas.

Exemplos:

```text
http://localhost:4000
http://localhost:4000/api/v1
https://minha-api.exemplo.com
```

No campo **Endpoint**, informe o caminho específico:

```text
URL base: http://localhost:4000/api/v1
Endpoint: /usuarios
```

O simulador fará a chamada para:

```text
http://localhost:4000/api/v1/usuarios
```

Não informe a URL completa nos dois campos, pois isso duplicará o endereço.

### 3. Escolha um endpoint que realmente exista

O simulador não cria rotas automaticamente. O método e o endpoint preenchidos no formulário precisam existir na outra API.

Por exemplo, se a API possui:

```text
GET  /usuarios
POST /usuarios
GET  /usuarios/10
```

use essas combinações no simulador. Se você selecionar `PATCH` ou `DELETE`, a API também precisa ter essas rotas.

### 4. Envie o corpo no formato esperado

Para `POST`, `PATCH` e `PUT`, escreva um JSON válido e compatível com o contrato da outra API:

```json
{
  "nome": "Maria",
  "email": "maria@example.com"
}
```

O `SimuladorRequest.html` envia automaticamente:

```http
Content-Type: application/json
```

Se a API esperar `form-data`, texto puro ou outro formato, será necessário adaptar a função `sendRequest()` no `SimuladorRequest.html`.

### 5. Configure CORS quando as origens forem diferentes

Se o HTML estiver em `http://localhost:5500` e a API em `http://localhost:4000`, são origens diferentes. Nesse caso, a API precisa autorizar o navegador por meio de CORS.

No Express, uma opção é instalar e usar o pacote `cors`:

```bash
npm install cors
```

```js
const cors = require("cors");

app.use(cors());
```

Em produção, prefira informar apenas a origem do frontend:

```js
app.use(cors({ origin: "https://meu-frontend.exemplo.com" }));
```

Se o HTML for entregue pelo mesmo servidor e pela mesma porta da API, por exemplo `http://localhost:4000/`, normalmente não é necessário CORS.

### 6. Adapte autenticação, se existir

O simulador atual não envia token de autenticação. Para uma API protegida, adicione o cabeçalho na função `sendRequest()`:

```js
options.headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer SEU_TOKEN"
};
```

Não coloque tokens reais em um arquivo público ou compartilhe-os no GitHub. Para APIs que usam cookies, também pode ser necessário configurar `credentials` no `fetch` e as permissões correspondentes no CORS.

### Checklist para reutilizar o simulador

- A API está executando e pode ser acessada pelo navegador?
- A URL base está correta?
- O endpoint existe exatamente com esse caminho?
- O método HTTP está correto?
- O corpo é um JSON válido e segue o formato esperado?
- A API permite CORS quando o HTML está em outra origem?
- A API exige autenticação ou headers adicionais?
- A resposta possui `Content-Type: application/json` quando retorna JSON?

## Como abrir o `SimuladorRequest.html` separado

Como o HTML não é servido pelo `server.js`, abra o `SimuladorRequest.html` diretamente ou use um servidor estático:

```text
file:///caminho/para/SimuladorRequest.html
```

Outra opção é usar o Live Server do VS Code. Nesse caso, o HTML pode ficar em `http://localhost:5500/SimuladorRequest.html`, enquanto a API continua em `http://localhost:3000`.

No campo **URL base** do simulador, informe o endereço da API, e não o endereço do HTML. Por exemplo:

```text
HTML: http://localhost:5500/SimuladorRequest.html
API:  http://localhost:3000
```

Nesse cenário, a API precisa permitir CORS. Esta API já possui essa configuração no início do `server.js`.

## Status HTTP usados no projeto

- `200 OK`: requisição executada com sucesso;
- `201 Created`: novo recurso criado;
- `204 No Content`: resposta sem conteúdo, usada na preparação CORS;
- `400 Bad Request`: dados obrigatórios não foram enviados;
- `404 Not Found`: rota ou item não encontrado.

## Exercícios sugeridos

1. Criar uma rota `GET /saudacao/:nome` que retorne uma saudação.
2. Adicionar uma rota `PUT /tarefas/:id`.
3. Criar uma rota para filtrar tarefas concluídas.
4. Trocar a lista em memória por um banco de dados.
5. Separar as rotas em outro arquivo usando `express.Router()`.
