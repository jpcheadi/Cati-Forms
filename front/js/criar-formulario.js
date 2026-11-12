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
    // Monta uma URL apontando para a página de resposta pública com o parâmetro do formulário
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

  // Clona o nó HTML do template
  const bloco = tplPergunta.content.firstElementChild.cloneNode(true);
  bloco.dataset.tipoPergunta = tipo;

  // Define o rótulo (badge) do tipo de pergunta
  const badge = bloco.querySelector("[data-tipo]");
  if (badge) badge.textContent = TIPOS_PERGUNTA[tipo] || tipo;

  // Configura a área de opções para múltipla escolha ou escolha única
  const dataOpcoes = bloco.querySelector("[data-opcoes]");
  if (tipo !== "DISCURSIVA" && dataOpcoes) {
    dataOpcoes.hidden = false;
    // Adiciona 2 opções iniciais por padrão
    adicionarOpcao(bloco);
    adicionarOpcao(bloco);
  }

  // Evento do botão "Remover Pergunta"
  const btnRemover = bloco.querySelector("[data-remover]");
  if (btnRemover) {
    btnRemover.addEventListener("click", () => bloco.remove());
  }

  // Evento do botão "Adicionar opção"
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
      const textosOpcao = camposOpcao.map((input) => input.value.trim());
      const opcaoVaziaIndex = textosOpcao.findIndex((texto) => !texto);

      if (opcaoVaziaIndex !== -1) {
        return {
          erro: "Preencha ou remova as opções que estão em branco.",
          foco: camposOpcao[opcaoVaziaIndex]
        };
      }
      itemPergunta.opcoes = textosOpcao;
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
  // Conecta os botões de adicionar pergunta pelo atributo data-add
  document.querySelectorAll("[data-add]").forEach((botao) => {
    botao.addEventListener("click", () => {
      UI.limparErro();
      adicionarPergunta(botao.dataset.add);
    });
  });

  // Conecta o evento de submissão do formulário
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
        // Simulação temporária de código gerado enquanto o Backend Spring Boot não está conectado
        const codigoGeradoMock = "form-" + Math.random().toString(36).substring(2, 9);
        
        const link = UI.linkResposta(codigoGeradoMock);
        
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