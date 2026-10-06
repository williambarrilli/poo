# API tudo no server (contraexemplo)

Este projeto **não é um modelo a seguir**. É a mesma API do
[`api-camadas-com-classe`](../api-camadas-com-classe) — mesmas rotas,
mesmo contrato, mesmos dados — mas com tudo dentro de um único
arquivo, `src/server.js`: leitura e escrita de arquivo, validação e
resposta HTTP, todas misturadas na mesma função.

Ele existe para você comparar os dois projetos lado a lado e ver, na
prática, por que separar em camadas (controller, logic, model,
repository) importa.

## Rotas

Iguais às do `api-camadas-com-classe`:

- `GET /`: retorna a primeira tarefa salva.
- `GET /tarefas`: lista todas as tarefas.
- `POST /tarefas`: cadastra uma tarefa (`titulo` obrigatório,
  `prioridade` em `baixa`, `media` ou `alta`).

## Como executar

```bash
npm install
npm start
```

A API fica disponível em `http://localhost:3000`.

## Os problemas, um por um

Os mesmos pontos estão comentados diretamente no código, no lugar
onde aparecem.

### 1. Código duplicado

A leitura do arquivo `data/tarefa.json` (`fs.readFile` + `JSON.parse`)
aparece em três rotas diferentes, copiada e colada. No
`api-camadas-com-classe`, essa leitura existe em um único lugar: a
função `ler()` do repository. Se o formato do arquivo mudasse, ou a
persistência trocasse para um banco de dados, aqui seria preciso achar
e mudar os três lugares; lá, seria um único arquivo.

### 2. Validação que não se repete sozinha

A regra "`titulo` é obrigatório, `prioridade` precisa ser uma das três
opções" está escrita dentro da rota `POST /tarefas`, e só existe ali.
Se amanhã outra rota precisar criar uma tarefa (um `PATCH`, uma
importação em lote), alguém vai copiar esse trecho de novo — e é
exatamente nesse tipo de cópia que uma validação acaba esquecida ou
implementada de um jeito diferente em cada lugar.

No `api-camadas-com-classe`, a validação mora no construtor da classe
`Tarefa` (o model). Qualquer código que tente criar uma tarefa passa
por ela; não tem como criar uma tarefa inválida "esquecendo" de
validar, porque a validação não está na rota, está no próprio objeto.

### 3. Tudo misturado na mesma função

Cada rota deste arquivo faz três coisas ao mesmo tempo: entende a
requisição HTTP, decide a regra de negócio e acessa o arquivo em
disco. Isso tem um custo concreto: para entender o que `POST
/tarefas` faz, é preciso ler a função inteira, inclusive os detalhes
de como o JSON é lido e salvo — mesmo que você só queira saber qual é
a regra de negócio.

No projeto em camadas, cada pergunta tem um lugar certo para ser
respondida: "o que acontece quando chega um POST?" está no controller;
"qual é a regra para cadastrar uma tarefa?" está na logic; "o que é
uma tarefa válida?" está no model; "onde e como os dados são
guardados?" está no repository.

### 4. Difícil de testar sem subir o servidor inteiro

Para conferir a regra "`titulo` é obrigatório" aqui, é preciso subir o
Express e fazer uma requisição HTTP de verdade, tocando o arquivo em
disco. Não existe uma função isolada para chamar direto.

No `api-camadas-com-classe`, dá para testar `new Tarefa({...})`
isoladamente (sem Express, sem tocar no disco) e saber se a validação
funciona. Foi assim que os cenários de sucesso e erro desse projeto
foram conferidos antes do merge: chamando os controllers diretamente,
sem precisar de um servidor rodando.

## Conclusão

Nenhum desses problemas trava a API de funcionar — ela funciona
normalmente. O custo aparece depois, quando o projeto cresce: mais
rotas, mais regras, mais gente mexendo no mesmo arquivo. Separar em
camadas não é regra por regra; é uma forma de manter o código fácil
de entender e de mudar conforme a API cresce.
