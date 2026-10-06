// CONTROLLER
// Faz a ponte entre o Express e o resto da aplicação. Recebe `request` e
// `response`, extrai o que precisa da requisição (parâmetros, corpo) e
// chama a camada de logic. Depois traduz o resultado (ou o erro) em uma
// resposta HTTP: define o status (200, 201, 400, 500...) e o corpo JSON.
// Não decide regra de negócio aqui — isso é tarefa da logic.
import * as tarefaLogic from "../logic/tarefaLogic.js";
import { ErroDeValidacao } from "../models/tarefa.js";

export async function obterTarefa(request, response) {
  try {
    const tarefa = await tarefaLogic.obterTarefa();

    return response.status(200).json(tarefa);
  } catch (error) {
    console.error(`Erro ao obter tarefa: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}

export async function listarTarefas(request, response) {
  try {
    const tarefas = await tarefaLogic.listarTarefas();

    return response.status(200).json(tarefas);
  } catch (error) {
    console.error(`Erro ao listar tarefas: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}

export async function cadastrarTarefa(request, response) {
  try {
    const novaTarefa = await tarefaLogic.cadastrarTarefa(request.body ?? {});

    return response.status(201).json(novaTarefa);
  } catch (error) {
    if (error instanceof ErroDeValidacao) {
      return response.status(400).json({ mensagem: error.message });
    }

    console.error(`Erro ao cadastrar tarefa: ${error.message}`);

    return response.status(500).json({
      mensagem: "Erro interno do servidor",
    });
  }
}
