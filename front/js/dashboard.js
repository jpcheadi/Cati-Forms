// 1. Objeto Helper de Interface (Obrigatório para desenhar os cards e exibir erros)
const UI = {
  el(tag, props, ...filhos) {
    const elemento = document.createElement(tag);
    for (const [chave, valor] of Object.entries(props || {})) {
      if (chave === "text") elemento.textContent = valor;
      else elemento.setAttribute(chave, valor);
    }
    filhos.forEach(filho => elemento.appendChild(filho));
    return elemento;
  },
  erro(mensagem) {
    alert("Atenção: " + mensagem); // Exibe o erro na tela
  },
  mensagemDeErro(e) {
    return e.message || "Ocorreu um erro inesperado.";
  },
  linkResposta(codigo) {
    return `${window.location.origin}/front/html/forms.html?id=${codigo}`;
  },
  async copiar(texto, botao) {
    try {
      await navigator.clipboard.writeText(texto);
      botao.textContent = "Copiado!";
      setTimeout(() => botao.textContent = "Copiar link", 2000);
    } catch (err) {
      alert("Não foi possível copiar o link.");
    }
  }
};

// 2. Lógica Principal do Dashboard
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
    const botaoCopiar = UI.el("button", { class: "btn btn-light btn-sm", type: "button", text: "Copiar link" });
    
    // Passa o f.id para montar o link
    botaoCopiar.addEventListener("click", () => UI.copiar(UI.linkResposta(f.id), botaoCopiar));
    
    return UI.el("article", { class: "card" },
      UI.el("h2", { text: f.titulo }),
      UI.el("p", { class: "muted", text: f.descricao }),
      UI.el("div", { class: "row", style: "margin-top:1rem" },
        UI.el("a", { class: "btn btn-sm", href: `respostas.html?id=${f.id}`, text: "Ver respostas" }),
        botaoCopiar)
    );
  }

  async function carregar() {
    if (lista) lista.replaceChildren(); 
    try {
      const formularios = await Api.listarFormularios();
      if (vazio) vazio.hidden = formularios.length > 0;
      if (lista) lista.append(...formularios.map(desenharCard));
    } catch (e) {
      UI.erro(UI.mensagemDeErro(e));
    }
  }
  
  carregar();
})();