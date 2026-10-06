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

    const novoConteudo = `${JSON.stringify(tarefas, null, 2)}\n`;
    await fs.writeFile(caminhoArquivo, novoConteudo, "utf-8");

    response.status(201).json(novaTarefa);
  } catch (error) {
    console.error(`Erro ao salvar tarefa: ${error.message}`);
    response.status(500).json({ mensagem: "Erro interno do servidor" });
  }
});

app.listen(PORTA, () => {
  console.log(`API disponível em http://localhost:${PORTA}`);
});
