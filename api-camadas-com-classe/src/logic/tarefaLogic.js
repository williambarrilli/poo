// LOGIC
// Coordena o caso de uso: busca dados no repository, usa o model para
// validar e montar a tarefa, e decide o que fazer com o resultado (por
// exemplo, calcular o próximo id). É a camada que concentra a regra de
// negócio. Não conhece `request`/`response` do Express (isso é do
// controller) nem sabe onde ou como os dados são guardados (isso é do
// repository).
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
  tarefas.push(novaTarefa);

  await tarefaRepository.salvar(tarefas);
  return novaTarefa;
}
