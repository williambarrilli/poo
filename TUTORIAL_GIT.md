# Tutorial: criar um repositório e subir um projeto no Git

Este guia mostra como transformar uma pasta de projeto em um repositório Git e publicá-la no GitHub.

## 1. Pré-requisitos

Instale o [Git](https://git-scm.com/downloads) e tenha uma conta no [GitHub](https://github.com/).

Confira a instalação:

```bash
git --version
```

## 2. Configure sua identidade

Faça esta configuração uma vez no computador:

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@example.com"
```

## 3. Entre na pasta do projeto

```bash
cd caminho/para/seu-projeto
```

## 4. Crie um `.gitignore`

O `.gitignore` evita enviar dependências, arquivos locais e segredos. Para um projeto Node.js:

```gitignore
node_modules/
.env
.env.*
!.env.example
```

Nunca publique senhas, tokens ou chaves de API.

## 5. Inicialize o repositório

```bash
git init
git branch -M main
```

O comando `git init` cria a pasta `.git`, que guarda o histórico do projeto.

## 6. Adicione os arquivos

Confira o que será enviado:

```bash
git status
```

Adicione os arquivos ao staging e confira novamente:

```bash
git add .
git status
```

Se algum arquivo indevido aparecer, ajuste o `.gitignore` antes de continuar.

## 7. Crie o primeiro commit

```bash
git commit -m "initial commit"
```

O commit registra as alterações no histórico local.

## 8. Crie o repositório no GitHub

No GitHub, clique em **New repository**, escolha o nome e a visibilidade e crie um repositório vazio. Para este fluxo, não marque a opção de criar README, `.gitignore` ou licença.

Copie a URL, por exemplo:

```text
https://github.com/usuario/nome-do-repositorio.git
```

## 9. Conecte o projeto ao GitHub

```bash
git remote add origin https://github.com/usuario/nome-do-repositorio.git
git remote -v
```

Se `origin` já existir, atualize a URL:

```bash
git remote set-url origin https://github.com/usuario/nome-do-repositorio.git
```

## 10. Faça o primeiro push

```bash
git push -u origin main
```

O parâmetro `-u` associa a branch local `main` à branch remota `origin/main`. Nos próximos envios, basta usar:

```bash
git push
```

## Fluxo das próximas alterações

```bash
git status
git add .
git commit -m "descreva a alteração"
git push
```

Exemplos de mensagens:

- `feat: adicionar rota de tarefas`;
- `fix: corrigir validação do título`;
- `docs: atualizar instruções de instalação`.

## Comandos úteis

```bash
git log --oneline --decorate --graph  # histórico
git diff                              # alterações não adicionadas
git diff --cached                     # alterações no staging
git fetch origin                      # consulta alterações remotas
```

## Erros comuns

### `remote origin already exists`

Veja ou corrija a URL do remote:

```bash
git remote -v
git remote set-url origin https://github.com/usuario/nome-do-repositorio.git
```

### `rejected: fetch first`

O remoto tem commits que não existem localmente. Integre-os antes de publicar:

```bash
git pull --rebase origin main
git push
```

### Um segredo foi adicionado ao Git

Remova-o do staging sem apagar o arquivo local:

```bash
git restore --staged .env
```

Adicione o arquivo ao `.gitignore`. Se o segredo já foi publicado, revogue ou troque a credencial; apagar o arquivo não remove o segredo do histórico.

## Resumo do primeiro envio

```bash
cd caminho/para/seu-projeto
git init
git branch -M main
git add .
git commit -m "initial commit"
git remote add origin https://github.com/usuario/nome-do-repositorio.git
git push -u origin main
```
