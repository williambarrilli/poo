// ⚠️ EXEMPLO DE COMO NÃO ORGANIZAR UMA API ⚠️
//
// Esta é a MESMA API do projeto `api-camadas-com-classe` (mesmas rotas,
// mesmo contrato, mesmos dados), mas escrita com tudo dentro deste
// único arquivo: leitura e escrita do arquivo, validação e resposta
// HTTP, todas misturadas na mesma função.
//
// Compare os dois projetos lado a lado. Os problemas que este arquivo
// tem — e que o outro não tem — estão comentados abaixo, no lugar
// onde eles aparecem.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORTA = Number(process.env.PORT || 3000);
const caminhoArquivo = path.join(__dirname, "../data/tarefa.json");

app.use(express.json());

// Retorna a primeira tarefa salva.
app.get("/", async (request, response) => {
  try {
    // PROBLEMA 1: ler e interpretar o arquivo JSON é código de
    // infraestrutura (persistência), não é o trabalho de uma rota.
    // Esse mesmo bloco de 2 linhas é copiado em mais dois lugares
    // abaixo (`GET /tarefas` e `POST /tarefas`). Se um dia o formato
    // do arquivo mudar, ou a persistência trocar para um banco de
    // dados, é preciso lembrar de mudar nos três lugares.
    const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
    const tarefas = JSON.parse(conteudo);

    response.status(200).json(tarefas[0] ?? null);
  } catch (error) {
    console.error(`Erro ao obter tarefa: ${error.message}`);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

// Lista todas as tarefas.
app.get("/tarefas", async (request, response) => {
  try {
    // Mesma leitura do arquivo, copiada de novo.
    const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
    const tarefas = JSON.parse(conteudo);

    response.status(200).json(tarefas);
  } catch (error) {
    console.error(`Erro ao listar tarefas: ${error.message}`);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

// Cadastra uma tarefa.
app.post("/tarefas", async (request, response) => {
  // PROBLEMA 2: a validação mora dentro da rota, só existe aqui. No
  // projeto em camadas, a validação é da classe Tarefa (o model): ela
  // é testada uma vez e reaproveitada por qualquer código que crie uma
  // tarefa. Aqui, se amanhã outra rota (um PATCH, uma importação em
  // lote) também precisar criar uma tarefa, alguém vai copiar e colar
  // este `if` — e é exatamente nesse tipo de cópia que uma validação
  // acaba esquecida ou implementada diferente em cada lugar.
  const { titulo, descricao = "", prioridade = "media" } = request.body ?? {};

  if (typeof titulo !== "string" || titulo.trim() === "") {
    return response
      .status(400)
      .json({ mensagem: "O campo titulo é obrigatório" });
  }

  if (!["baixa", "media", "alta"].includes(prioridade)) {
    return response.status(400).json({
      mensagem: "O campo prioridade deve ser: baixa, media, alta",
    });
  }

  try {
    // Leitura do arquivo, copiada pela terceira vez.
    const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
    const tarefas = JSON.parse(conteudo);

    const novaTarefa = {
      id: tarefas.length
        ? Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1
        : 1,
      titulo: titulo.trim(),
      descricao,
      prioridade,
      concluida: false,
    };

    tarefas.push(novaTarefa);

    // PROBLEMA 3: gravar o arquivo também está duplicado em espírito —
    // não há uma função "salvar" para chamar, então qualquer rota nova
    // que precisar persistir dados vai reescrever este trecho de novo.
    const novoConteudo = `${JSON.stringify(tarefas, null, 2)}\n`;
    await fs.writeFile(caminhoArquivo, novoConteudo, "utf-8");

    response.status(201).json(novaTarefa);
  } catch (error) {
    console.error(`Erro ao salvar tarefa: ${error.message}`);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

// PROBLEMA 4: para testar a regra "titulo é obrigatório" ou a leitura
// do arquivo, é preciso subir o servidor inteiro e fazer uma
// requisição HTTP de verdade — não existe uma função isolada (como a
// classe Tarefa ou o repository do outro projeto) que dê para chamar
// direto em um teste, sem Express e sem tocar no arquivo em disco.

app.listen(PORTA, () => {
  console.log(`API disponível em http://localhost:${PORTA}`);
});
