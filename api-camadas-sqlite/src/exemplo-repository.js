// EXEMPLO DE USO DO REPOSITORY (sem rotas)
// Rode com: npm run exemplo
//
// Mostra cada operação do CRUD funcionando direto no banco, antes de
// existir qualquer rota. No fim, a tarefa de teste é removida, então o
// banco volta a ficar como estava.
import * as tarefaRepository from "./repositories/tarefaRepository.js";

console.log("listar():", tarefaRepository.listar());

const criada = tarefaRepository.criar({ titulo: "Tarefa de teste", prioridade: "alta" });
console.log("criar():", criada);

console.log("buscarPorId():", tarefaRepository.buscarPorId(criada.id));

console.log(
  "atualizar():",
  tarefaRepository.atualizar(criada.id, { concluida: true, descricao: "Atualizada pelo exemplo" }),
);

console.log("remover():", tarefaRepository.remover(criada.id));

console.log("buscarPorId() depois de remover:", tarefaRepository.buscarPorId(criada.id));
