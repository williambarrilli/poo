# POO

Exemplos didáticos de APIs com Node.js e Express para praticar servidores HTTP, rotas, requisições JSON e operações CRUD.

## Projetos

| Pasta | Descrição |
| --- | --- |
| `api-teste` | API simples: tudo em um único arquivo (`server.js`), dados em memória. Ponto de partida para quem está vendo Express pela primeira vez. |
| `api-camadas-com-classe` | A mesma ideia, mas separada por responsabilidade em pastas (`controllers`, `logic`, `repositories`, `models`) e com persistência em arquivo JSON. Mostra como organizar uma API conforme ela cresce. |

Cada projeto tem seu próprio README com instruções de instalação, rotas e exemplos de requisição.

## Por onde começar

1. Rode o `api-teste` primeiro: é a versão mais direta, sem camadas.
2. Depois veja o `api-camadas-com-classe`: mesma API, mas com o código dividido por responsabilidade, para entender por que e quando separar em camadas.

O arquivo `SimuladorRequest.html`, na raiz deste repositório, é um cliente HTTP reutilizável para testar qualquer uma das APIs pelo navegador, sem precisar do `curl`.

## Tutorial de Git

Consulte o [Tutorial de Git](TUTORIAL_GIT.md) para aprender a criar um repositório, fazer commits e publicar um projeto no GitHub.
