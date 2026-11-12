(() => {
  const id = UI.param("id");
  const lista = document.getElementById("lista-respostas");
  const vazio = document.getElementById("vazio");

  function desenhar(r) {
    const dl = UI.el("dl", { class: "answer" });
    for (const item of r.itens) {
      dl.append(UI.el("dt", { text: item.enunciado }));
      const dd = UI.el("dd");
      if (item.tipo === "DISCURSIVA") {
        dd.textContent = item.texto;
      } else {
        dd.append(item.opcoesSelecionadas.join(", "));
        if (item.justificativa) dd.append(UI.el("br"), UI.el("span", { class: "muted", text: `Justificativa: ${item.justificativa}` }));
      }
      dl.append(dd);
    }
    const quando = [r.email, UI.data(r.enviadoEm)].filter(Boolean).join(" · ");
    return UI.el("article", { class: "card" },
      UI.el("div", { class: "row row--between" }, UI.el("h2", { text: `Resposta #${r.id}` }), UI.el("span", { class: "muted", text: quando })),
      dl);
  }

  async function carregar() {
    lista.replaceChildren(); // remove o exemplo estático
    if (!id) return UI.erro("Formulário não informado.");
    try {
      // As duas chamadas são independentes: disparamos juntas e esperamos as duas.
      const [formulario, respostas] = await Promise.all([Api.detalharFormulario(id), Api.listarRespostas(id)]);
      document.getElementById("titulo").textContent = formulario.titulo;
      document.getElementById("descricao").textContent = formulario.descricao;
      document.getElementById("total").textContent = `${respostas.length} resposta${respostas.length === 1 ? "" : "s"}`;
      vazio.hidden = respostas.length > 0;
      lista.append(...respostas.map(desenhar));
    } catch (e) {
      UI.erro(e.status === 404 ? "Formulário não encontrado." : UI.mensagemDeErro(e));
    }
  }

  // Exportação (RF15, RF16) entra na Fase 8: devolve arquivo, não JSON.
  ["btn-csv", "btn-pdf"].forEach((bid) =>
    document.getElementById(bid).addEventListener("click", () => UI.erro("A exportação será implementada na Fase 8.")));

  carregar();
})();