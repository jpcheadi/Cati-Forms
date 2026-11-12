(() => {
  const lista = document.getElementById("lista-formularios");
  const vazio = document.getElementById("vazio");
  // Botão de Sair (Logout)
  const btnSair = document.getElementById("btn-sair");
  if (btnSair) {
      btnSair.addEventListener("click", () => {
          Auth.sair();
      });
  }

  function desenharCard(f) {
    const total = `${f.totalRespostas} resposta${f.totalRespostas === 1 ? "" : "s"}`;
    const botaoCopiar = UI.el("button", { class: "btn btn-light btn-sm", type: "button", text: "Copiar link" });
    botaoCopiar.addEventListener("click", () => UI.copiar(UI.linkResposta(f.codigo), botaoCopiar));
    return UI.el("article", { class: "card" },
      UI.el("h2", { text: f.titulo }),
      UI.el("p", { class: "muted", text: f.descricao }),
      UI.el("div", { class: "row row--between" },
        UI.el("span", { class: "badge", text: total }),
        UI.el("span", { class: "muted", text: `por ${f.criador}` })),
      UI.el("div", { class: "row", style: "margin-top:1rem" },
        UI.el("a", { class: "btn btn-sm", href: `respostas.html?id=${f.id}`, text: "Ver respostas" }),
        botaoCopiar));
  }

  async function carregar() {
    lista.replaceChildren(); // remove o exemplo estático
    try {
      const formularios = await Api.listarFormularios();
      vazio.hidden = formularios.length > 0;
      lista.append(...formularios.map(desenharCard));
    } catch (e) {
      UI.erro(UI.mensagemDeErro(e));
    }
  }
  carregar();
})();