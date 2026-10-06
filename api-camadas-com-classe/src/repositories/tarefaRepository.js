import fs from "node:fs/promises";
import path from "node:path";

const caminhoArquivo = path.join(process.cwd(), "data", "tarefa.json");

export async function ler() {
  try {
    const conteudo = await fs.readFile(caminhoArquivo, "utf-8");
    const dados = JSON.parse(conteudo);

    return dados;
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }

    return [];
  }
}

export async function salvar(tarefas) {
  const conteudo = `${JSON.stringify(tarefas, null, 2)}\n`;

  await fs.mkdir(path.dirname(caminhoArquivo), { recursive: true });
  await fs.writeFile(caminhoArquivo, conteudo, "utf-8");
  return tarefas;
}
