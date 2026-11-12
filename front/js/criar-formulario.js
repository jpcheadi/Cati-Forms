// 1. Objeto Helper responsável pelas interações de Interface (UI)
const UI = {
  erro(mensagem) {
    const msg = document.getElementById("msg");
    if (msg) {
      msg.textContent = mensagem;
      msg.hidden = false;
    }
  },

  limparErro() {
    const msg = document.getElementById("msg");
    if (msg) {
      msg.textContent = "";
      msg.hidden = true;
    }
  },

  mensagemDeErro(e) {
    return e.message || "Ocorreu um erro inesperado na operação.";
  },

  ocupado(botao, estaOcupado) {
    if (!botao) return;
    botao.disabled = estaOcupado;
    botao.style.opacity = estaOcupado ? "0.6" : "1";
  },

  linkResposta(codigo) {
    return `${window.location.origin}/front/html/forms.html?id=${codigo}`;
  },

  async copiar(texto, botao) {
    try {
      await navigator.clipboard.writeText(texto);
      const textoOriginal = botao.textContent;
      botao.textContent = "Copiado!";
      setTimeout(() => {
        botao.textContent = textoOriginal;
      }, 2000);
    } catch (err) {
      alert("Não foi possível copiar o link automaticamente.");
    }
  }
};

// Botão de Sair (Logout)
const btnSair = document.getElementById("btn-sair");
if (btnSair) {
    btnSair.addEventListener("click", () => {
        Auth.sair();
    });
}

// 2. Mapeamento dos tipos de perguntas
const TIPOS_PERGUNTA = {
  DISCURSIVA: "Discursiva",
  MULTIPLA_ESCOLHA: "Múltipla escolha",
  ESCOLHA_UNICA_JUSTIFICADA: "Escolha única com justificativa"
};

// 3. Função para clonar o template e adicionar uma nova pergunta
function adicionarPergunta(tipo) {
  const tplPergunta = document.getElementById("tpl-pergunta");
  const listaPerguntas = document.getElementById("lista-perguntas");

  if (!tplPergunta || !listaPerguntas) return;

  const bloco = tplPergunta.content.firstElementChild.cloneNode(true);
  bloco.dataset.tipoPergunta = tipo;

  const badge = bloco.querySelector("[data-tipo]");
  if (badge) badge.textContent = TIPOS_PERGUNTA[tipo] || tipo;

  const dataOpcoes = bloco.querySelector("[data-opcoes]");
  if (tipo !== "DISCURSIVA" && dataOpcoes) {
    dataOpcoes.hidden = false;
    adicionarOpcao(bloco);
    adicionarOpcao(bloco);
  }

  const btnRemover = bloco.querySelector("[data-remover]");
  if (btnRemover) {
    btnRemover.addEventListener("click", () => bloco.remove());
  }

  const btnAddOpcao = bloco.querySelector("[data-add-opcao]");
  if (btnAddOpcao) {
    btnAddOpcao.addEventListener("click", () => adicionarOpcao(bloco));
  }

  listaPerguntas.appendChild(bloco);
}

// 4. Função para adicionar uma nova linha de alternativa (opção) dentro da pergunta
function adicionarOpcao(blocoPergunta) {
  const tplOpcao = document.getElementById("tpl-opcao");
  const listaOpcoes = blocoPergunta.querySelector("[data-lista-opcoes]");

  if (!tplOpcao || !listaOpcoes) return;

  const linhaOpcao = tplOpcao.content.firstElementChild.cloneNode(true);
  const btnRemoverOpcao = linhaOpcao.querySelector("[data-remover-opcao]");

  if (btnRemoverOpcao) {
    btnRemoverOpcao.addEventListener("click", () => {
      const quantidadeOpcoes = listaOpcoes.querySelectorAll("[data-opcao]").length;
      if (quantidadeOpcoes > 2) {
        linhaOpcao.remove();
        UI.limparErro();
      } else {
        UI.erro("Perguntas de múltipla escolha ou escolha única exigem no mínimo 2 opções.");
      }
    });
  }

  listaOpcoes.appendChild(linhaOpcao);
}

// 5. Função para ler a tela, validar as entradas e estruturar o JSON
function montarDadosFormulario() {
  const form = document.getElementById("form-criar");
  const lista = document.getElementById("lista-perguntas");

  const titulo = form.titulo.value.trim();
  if (!titulo) return { erro: "Informe o título do formulário.", foco: form.titulo };

  const descricao = form.descricao.value.trim();
  if (!descricao) return { erro: "Informe a descrição do formulário.", foco: form.descricao };

  const blocosPerguntas = [...lista.children];
  if (blocosPerguntas.length === 0) {
    return { erro: "Adicione pelo menos uma pergunta ao formulário." };
  }

  const perguntas = [];
  for (const bloco of blocosPerguntas) {
    const campoEnunciado = bloco.querySelector("[data-enunciado]");
    const enunciado = campoEnunciado.value.trim();

    if (!enunciado) {
      return { erro: "Toda pergunta precisa ter um enunciado preenchido.", foco: campoEnunciado };
    }

    const tipo = bloco.dataset.tipoPergunta;
    const itemPergunta = { enunciado, tipo };

    if (tipo !== "DISCURSIVA") {
      const camposOpcao = [...bloco.querySelectorAll("[data-opcao]")];
      const opcoesObj = camposOpcao.map((input) => ({ texto: input.value.trim() }));
      const textosOpcao = opcoesObj.map(o => o.texto);
      const opcaoVaziaIndex = textosOpcao.findIndex((texto) => !texto);

      if (opcaoVaziaIndex !== -1) {
        return {
          erro: "Preencha ou remova as opções que estão em branco.",
          foco: camposOpcao[opcaoVaziaIndex]
        };
      }
      itemPergunta.opcoes = opcoesObj;
    }

    perguntas.push(itemPergunta);
  }

  return {
    dados: {
      titulo,
      descricao,
      solicitaEmail: form.solicitaEmail.checked,
      perguntas
    }
  };
}

// 6. Inicialização e escutadores de eventos principais após o DOM carregar
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-add]").forEach((botao) => {
    botao.addEventListener("click", () => {
      UI.limparErro();
      adicionarPergunta(botao.dataset.add);
    });
  });

  const form = document.getElementById("form-criar");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      UI.limparErro();

      const resultado = montarDadosFormulario();
      if (resultado.erro) {
        UI.erro(resultado.erro);
        if (resultado.foco) resultado.foco.focus();
        return;
      }

      const btnSubmit = form.querySelector("[type=submit]");
      UI.ocupado(btnSubmit, true);

      try {
        // Envia direto usando o nosso api.js centralizado com autenticação JWT automática
        const formularioSalvo = await Api.criarFormulario(resultado.dados);

        const link = UI.linkResposta(formularioSalvo.id);
        
        const inputLink = document.getElementById("link-gerado");
        if (inputLink) inputLink.value = link;

        const btnCopiar = document.getElementById("btn-copiar");
        if (btnCopiar) {
          btnCopiar.onclick = (e) => UI.copiar(link, e.currentTarget);
        }

        form.hidden = true;
        const divResultado = document.getElementById("resultado");
        if (divResultado) divResultado.hidden = false;

      } catch (e) {
        UI.erro(UI.mensagemDeErro(e));
        UI.ocupado(btnSubmit, false);
      }
    });
  }
});