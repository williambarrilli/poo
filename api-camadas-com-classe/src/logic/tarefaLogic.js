import * as tarefaRepository from "../repositories/tarefaRepository.js";
import { Tarefa } from "../models/tarefa.js";

export async function obterTarefa() {
  return tarefaRepository.ler();
}

export async function listarTarefas() {
  return tarefaRepository.ler();
}

export async function cadastrarTarefa(dados) {
  const tarefas = await tarefaRepository.ler();
  const proximoId = tarefas.length
    ? Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1
    : 1;

  // A classe Tarefa valida os dados; se algo estiver errado, ela lança ErroDeValidacao.
  const novaTarefa = new Tarefa({
    id: proximoId,
    titulo: dados.titulo,
    descricao: dados.descricao,
    prioridade: dados.prioridade,
  });

  await tarefaRepository.salvar([...tarefas, novaTarefa]);
  return novaTarefa;
}
