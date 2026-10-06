// MODEL
// Representa a entidade do domínio: o que é uma tarefa e quais regras
// ela precisa cumprir para existir (aqui, ter título e uma prioridade
// válida). A validação fica no construtor, então um objeto Tarefa
// inválido nunca chega a ser criado. Não sabe nada sobre HTTP nem sobre
// onde os dados são salvos — só sabe o que é "ser uma tarefa".

// Erro lançado quando os dados recebidos não formam uma tarefa válida.
// Herda de Error para continuar funcionando com try/catch normalmente.
export class ErroDeValidacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ErroDeValidacao";
  }
}

// Representa uma tarefa e garante que ela sempre nasce válida.
export class Tarefa {
  constructor({
    id,
    titulo,
    descricao = "",
    prioridade = "media",
    concluida = false,
  }) {
    if (typeof titulo !== "string" || titulo.trim() === "") {
      throw new ErroDeValidacao("O campo titulo é obrigatório");
    }

    this.id = id;
    this.titulo = titulo.trim();
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.concluida = concluida;
  }
}
