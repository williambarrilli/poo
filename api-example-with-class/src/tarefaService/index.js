const fs = require("fs/promises");

class Tarefa {
  constructor(caminhoArquivo) {
    this.caminhoArquivo = caminhoArquivo;
  }

  async carregar() {
    const conteudo = await fs.readFile(this.caminhoArquivo, "utf-8");
    return JSON.parse(conteudo);
  }

  async gravar(tarefas) {
    const dados = JSON.stringify(tarefas, null, 2);
    console.log(`Gravando tarefas: ${dados}`);
    await fs.writeFile(this.caminhoArquivo, dados);
  }

  async listar() {
    return this.carregar();
  }

  async buscarPorId(id) {
    const tarefas = await this.carregar();
    return tarefas.find((tarefa) => tarefa.id === Number(id));
  }

  async salvar(titulo, descricao = "", prioridade = "media") {
    const tarefas = await this.carregar();
    const novaTarefa = {
      id: tarefas.length
        ? Math.max(...tarefas.map((tarefa) => tarefa.id)) + 1
        : 1,
      titulo,
      descricao,
      prioridade,
      concluida: false,
    };

    tarefas.push(novaTarefa);
    await this.gravar(tarefas);
    return novaTarefa;
  }

  async atualizar(id, dados) {
    const tarefas = await this.carregar();
    const tarefa = tarefas.find((tarefa) => tarefa.id === Number(id));

    if (!tarefa) {
      return null;
    }

    const { titulo, descricao, prioridade, concluida } = dados;

    if (titulo !== undefined) tarefa.titulo = titulo;
    if (descricao !== undefined) tarefa.descricao = descricao;
    if (prioridade !== undefined) tarefa.prioridade = prioridade;
    if (concluida !== undefined) tarefa.concluida = concluida;

    await this.gravar(tarefas);
    return tarefa;
  }

  async remover(id) {
    const tarefas = await this.carregar();
    const indice = tarefas.findIndex(
      (tarefa) => tarefa.id === Number(id),
    );

    if (indice === -1) {
      return null;
    }

    const [tarefaRemovida] = tarefas.splice(indice, 1);
    await this.gravar(tarefas);
    return tarefaRemovida;
  }
}

module.exports = { Tarefa };
