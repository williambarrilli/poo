// Erro lançado quando os dados recebidos não formam uma tarefa válida.
// Herda de Error para continuar funcionando com try/catch normalmente.
export class ErroDeValidacao extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = "ErroDeValidacao";
  }
}

const PRIORIDADES = ["baixa", "media", "alta"];

// Representa uma tarefa e garante que ela sempre nasce válida.
export class Tarefa {
  constructor({ id, titulo, descricao = "", prioridade = "media", concluida = false }) {
    if (typeof titulo !== "string" || titulo.trim() === "") {
      throw new ErroDeValidacao("O campo titulo é obrigatório");
    }

    if (!PRIORIDADES.includes(prioridade)) {
      throw new ErroDeValidacao(
        `O campo prioridade deve ser: ${PRIORIDADES.join(", ")}`,
      );
    }

    this.id = id;
    this.titulo = titulo.trim();
    this.descricao = descricao;
    this.prioridade = prioridade;
    this.concluida = concluida;
  }
}
