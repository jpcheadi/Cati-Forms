const UI = {
  el(tag, props, ...filhos) {
    const elemento = document.createElement(tag);
    for (const [chave, valor] of Object.entries(props || {})) {
      if (chave === "text") elemento.textContent = valor;
      else if (chave === "html") elemento.innerHTML = valor;
      else elemento.setAttribute(chave, valor);
    }
    filhos.forEach((filho) => {
      if (typeof filho === "string") {
        elemento.appendChild(document.createTextNode(filho));
      } else if (filho) {
        elemento.appendChild(filho);
      }
    });
    return elemento;
  },
  erro(mensagem) {
    const msg = document.getElementById("msg");
    if (msg) {
      msg.textContent = mensagem;
      msg.hidden = false;
    } else {
      alert("Atenção: " + mensagem);
    }
  },
};

(() => {
  const lista = document.getElementById("lista-respostas");
  const vazio = document.getElementById("vazio");

  // Elementos do Cabeçalho da Página
  const tituloEl = document.getElementById("titulo");
  const descricaoEl = document.getElementById("descricao");
  const totalEl = document.getElementById("total");
  const btnCsv = document.getElementById("btn-csv");
  const btnPdf = document.getElementById("btn-pdf");

  // Estado em memória com os dados capturados do banco
  let formularioAtual = null;
  let submissoesAtuais = [];

  // Botão de Sair
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
    btnSair.addEventListener("click", () => {
      Auth.sair();
    });
  }

  function formatarData(dataStr) {
    if (!dataStr) return "Data não registrada";
    const data = new Date(dataStr);
    return isNaN(data.getTime()) ? dataStr : data.toLocaleString("pt-BR");
  }

  function escaparHtml(texto) {
    if (texto === null || texto === undefined) return "";
    return String(texto)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // Desenha uma única submissão (Card) na tela
  function desenharCard(submissao, index) {
    const dataEnvio = formatarData(submissao.dataEnvio || submissao.criadoEm);
    const emailCandidato = submissao.email || "Candidato Anônimo";

    const dl = UI.el("dl", { class: "answer" });
    const respostasLista = submissao.respostas || [];

    respostasLista.forEach((resp) => {
      const textoPergunta = resp.pergunta
        ? resp.pergunta.enunciado
        : "Pergunta não encontrada";

      dl.appendChild(UI.el("dt", { text: textoPergunta }));
      dl.appendChild(
        UI.el("dd", {
          html: `📝 <span style="color: #0056b3;">${escaparHtml(resp.valor || "-")}</span>`,
        })
      );
    });

    return UI.el(
      "article",
      { class: "card" },
      UI.el(
        "div",
        { class: "row row--between" },
        UI.el("h2", { text: `Resposta #${index + 1}` }),
        UI.el("span", {
          class: "muted",
          text: `${emailCandidato} (${dataEnvio})`,
        })
      ),
      dl
    );
  }

  // ==========================================
  // EXPORTAÇÃO CSV
  // ==========================================
  function escaparCelulaCsv(valor) {
    if (valor === null || valor === undefined) return '""';
    const texto = String(valor).replace(/"/g, '""');
    return `"${texto}"`;
  }

  function exportarCsv() {
    if (!formularioAtual || submissoesAtuais.length === 0) {
      UI.erro("Não há respostas disponíveis para exportar.");
      return;
    }

    const perguntas = formularioAtual.perguntas || [];

    const cabecalho = [
      "Submissão",
      "Data de Envio",
      "E-mail",
      ...perguntas.map((p) => p.enunciado),
    ];

    const linhas = [cabecalho.map(escaparCelulaCsv).join(";")];

    submissoesAtuais.forEach((sub, index) => {
      const dataEnvio = formatarData(sub.dataEnvio || sub.criadoEm);
      const email = sub.email || "Anônimo";

      const mapaRespostas = new Map();
      (sub.respostas || []).forEach((r) => {
        if (r.pergunta && r.pergunta.id) {
          mapaRespostas.set(r.pergunta.id, r.valor);
        }
      });

      const valoresPerguntas = perguntas.map((p) =>
        mapaRespostas.has(p.id) ? mapaRespostas.get(p.id) : ""
      );

      const linha = [`#${index + 1}`, dataEnvio, email, ...valoresPerguntas];
      linhas.push(linha.map(escaparCelulaCsv).join(";"));
    });

    // BOM (\uFEFF) garante que o Excel abra acentos (ç, ã, é) sem corromper
    const conteudoCsv = "\uFEFF" + linhas.join("\r\n");
    const blob = new Blob([conteudoCsv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const nomeArquivo = (formularioAtual.titulo || "respostas")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const link = document.createElement("a");
    link.href = url;
    link.download = `${nomeArquivo}-respostas.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // ==========================================
  // EXPORTAÇÃO PDF (Relatório formatado)
  // ==========================================
  function exportarPdf() {
    if (!formularioAtual || submissoesAtuais.length === 0) {
      UI.erro("Não há respostas disponíveis para exportar.");
      return;
    }

    const janelaImpressao = window.open("", "_blank", "width=900,height=700");
    if (!janelaImpressao) {
      UI.erro("Permita pop-ups no navegador para gerar o PDF.");
      return;
    }

    const cardsHtml = submissoesAtuais
      .map((sub, index) => {
        const dataEnvio = formatarData(sub.dataEnvio || sub.criadoEm);
        const email = escaparHtml(sub.email || "Candidato Anônimo");

        const itensHtml = (sub.respostas || [])
          .map((resp) => {
            const pergunta = escaparHtml(
              resp.pergunta ? resp.pergunta.enunciado : "Pergunta não encontrada"
            );
            const valor = escaparHtml(resp.valor || "-");
            return `
              <div class="item">
                <div class="pergunta">${pergunta}</div>
                <div class="resposta">${valor}</div>
              </div>
            `;
          })
          .join("");

        return `
          <div class="card">
            <div class="card-header">
              <strong>Resposta #${index + 1}</strong>
              <span>${email} &bull; ${dataEnvio}</span>
            </div>
            ${itensHtml}
          </div>
        `;
      })
      .join("");

    janelaImpressao.document.write(`
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="utf-8">
        <title>Respostas - ${escaparHtml(formularioAtual.titulo)}</title>
        <style>
          body { font-family: Arial, sans-serif; color: #111; margin: 24px; line-height: 1.4; }
          h1 { margin: 0 0 6px; font-size: 22px; }
          .desc { color: #555; margin: 0 0 8px; font-size: 14px; }
          .meta { font-size: 13px; color: #333; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 2px solid #222; }
          .card { border: 1px solid #ccc; border-radius: 6px; padding: 14px; margin-bottom: 16px; page-break-inside: avoid; }
          .card-header { display: flex; justify-content: space-between; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-bottom: 10px; font-size: 13px; }
          .item { margin-bottom: 10px; }
          .item:last-child { margin-bottom: 0; }
          .pergunta { font-weight: bold; font-size: 13px; color: #333; }
          .resposta { font-size: 14px; color: #000; margin-top: 2px; white-space: pre-wrap; }
        </style>
      </head>
      <body>
        <h1>${escaparHtml(formularioAtual.titulo)}</h1>
        <p class="desc">${escaparHtml(formularioAtual.descricao || "")}</p>
        <div class="meta">Total de submissões: <strong>${submissoesAtuais.length}</strong> &bull; Gerado em ${new Date().toLocaleString("pt-BR")}</div>
        ${cardsHtml}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          };
        </script>
      </body>
      </html>
    `);
    janelaImpressao.document.close();
  }

  if (btnCsv) btnCsv.addEventListener("click", exportarCsv);
  if (btnPdf) btnPdf.addEventListener("click", exportarPdf);

  // ==========================================
  // CARREGAMENTO DO BANCO DE DADOS
  // ==========================================
  async function carregar() {
    const params = new URLSearchParams(window.location.search);
    const formId = params.get("id");

    if (!formId) {
      UI.erro("Nenhum formulário selecionado. Volte para o Dashboard.");
      if (tituloEl) tituloEl.textContent = "Formulário não encontrado";
      return;
    }

    if (lista) lista.replaceChildren();

    try {
      // 1. Busca os detalhes do formulário no banco
      formularioAtual = await Api.detalharFormulario(formId);
      if (tituloEl) tituloEl.textContent = formularioAtual.titulo;
      if (descricaoEl) descricaoEl.textContent = formularioAtual.descricao;

      // 2. Busca as submissões e respostas no banco
      submissoesAtuais = await Api.listarRespostas(formId);

      // Atualiza o contador
      if (totalEl) {
        totalEl.textContent = `${submissoesAtuais.length} resposta${
          submissoesAtuais.length === 1 ? "" : "s"
        }`;
      }

      // Habilita os botões de exportação se houver dados
      const temRespostas = submissoesAtuais.length > 0;
      if (btnCsv) btnCsv.disabled = !temRespostas;
      if (btnPdf) btnPdf.disabled = !temRespostas;

      // Exibe ou oculta o aviso de lista vazia
      if (vazio) vazio.hidden = temRespostas;

      // Renderiza cada submissão na tela
      if (lista && temRespostas) {
        submissoesAtuais.forEach((sub, index) => {
          lista.appendChild(desenharCard(sub, index));
        });
      }
    } catch (e) {UI.erro(e.message || "Erro ao carregar as respostas.");
        if (tituloEl) tituloEl.textContent = "Erro ao carregar";
   }
  }
carregar();
})();
