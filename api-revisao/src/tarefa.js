export class Tarefa {
  constructor(titulo, descricao) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.concluida = false;
  }
  editarTarefa(titulo, descricao, concluida) {
    this.titulo = titulo;
    this.descricao = descricao;
    this.concluida = concluida;
  }
}

export class Tarefas {
  constructor() {
    this.lista = [];
  }

  adicionar(tarefa) {
    this.lista.push(tarefa);
  }

  listar() {
    return this.lista;
  }

  editarTarefa(titulo) {
    const tarefa = this.lista.find((t) => t.titulo === titulo);
    if (tarefa) {
      tarefa.editarTarefa(tarefa.titulo, tarefa.descricao, true);
    }
  }
}
