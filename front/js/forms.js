// js/forms.js

// Endereço base do Backend em Spring Boot
const API_BASE_URL = "http://localhost:8080/api/formularios/public";
let formularioAtualId = null;

document.addEventListener("DOMContentLoaded", async () => {
  const parametrosDaUrl = new URLSearchParams(window.location.search);
  formularioAtualId = parametrosDaUrl.get("id");

  if (!formularioAtualId) {
    exibirErro("Nenhum formulário especificado na URL.");
    return;
  }

  try {
    const respostaServidor = await fetch(`${API_BASE_URL}/${formularioAtualId}`);

    if (!respostaServidor.ok) {
      throw new Error("Formulário não encontrado ou link inválido.");
    }

    // Converte a resposta do servidor de texto (JSON) para um Objeto JavaScript
    const dadosDoBanco = await respostaServidor.json();
    
    // Desenha a tela com os dados 
    renderizarFormulario(dadosDoBanco);

  } catch (erro) {
    exibirErro("Erro de conexão: " + erro.message);
  }
});


function renderizarFormulario(dados) {
  document.getElementById("titulo").textContent = dados.titulo;
  document.getElementById("descricao").textContent = dados.descricao;
  const formElement = document.getElementById("form-responder");
  const listaPerguntas = document.getElementById("lista-perguntas");

  if (dados.solicitaEmail) {
    document.getElementById("campo-email").hidden = false;
    document.getElementById("input-email").required = true;
  }

  dados.perguntas.forEach((pergunta) => {
    let clone;
    if (pergunta.tipo === "DISCURSIVA") {
      const template = document.getElementById("tpl-resp-discursiva");
      clone = template.content.firstElementChild.cloneNode(true);
      clone.querySelector("[data-enunciado]").textContent = pergunta.enunciado;
      clone.querySelector("[data-input]").name = `pergunta_${pergunta.id}`;
      clone.querySelector("[data-input]").dataset.tipo = pergunta.tipo;
    } 
    else if (pergunta.tipo === "MULTIPLA_ESCOLHA") {
      const template = document.getElementById("tpl-resp-multipla");
      clone = template.content.firstElementChild.cloneNode(true);
      clone.querySelector("[data-enunciado]").textContent = pergunta.enunciado;
      const containerOpcoes = clone.querySelector("[data-lista-opcoes]");
      
      pergunta.opcoes.forEach(opcao => {
        const tplOpcao = document.getElementById("tpl-opcao-checkbox");
        const cloneOpcao = tplOpcao.content.firstElementChild.cloneNode(true);
        cloneOpcao.querySelector("[data-texto]").textContent = opcao.texto;
        const input = cloneOpcao.querySelector("[data-input]");
        input.name = `pergunta_${pergunta.id}`;
        input.value = opcao.id;
        input.dataset.tipo = pergunta.tipo;
        containerOpcoes.appendChild(cloneOpcao);
      });
    }
    else if (pergunta.tipo === "ESCOLHA_UNICA_JUSTIFICADA") {
      const template = document.getElementById("tpl-resp-unica");
      clone = template.content.firstElementChild.cloneNode(true);
      clone.querySelector("[data-enunciado]").textContent = pergunta.enunciado;
      const containerOpcoes = clone.querySelector("[data-lista-opcoes]");
      
      pergunta.opcoes.forEach(opcao => {
        const tplOpcao = document.getElementById("tpl-opcao-radio");
        const cloneOpcao = tplOpcao.content.firstElementChild.cloneNode(true);
        cloneOpcao.querySelector("[data-texto]").textContent = opcao.texto;
        const input = cloneOpcao.querySelector("[data-input]");
        input.name = `pergunta_${pergunta.id}`;
        input.value = opcao.id;
        input.required = true; 
        input.dataset.tipo = pergunta.tipo;
        containerOpcoes.appendChild(cloneOpcao);
      });
      clone.querySelector("[data-justificativa]").name = `justificativa_${pergunta.id}`;
    }
    listaPerguntas.appendChild(clone);
  });

  formElement.hidden = false;
}

function exibirErro(mensagem) {
  const msgDiv = document.getElementById("msg");
  msgDiv.textContent = mensagem;
  msgDiv.hidden = false;
  document.getElementById("titulo").textContent = "Erro";
  document.getElementById("form-responder").hidden = true;
}


// LÓGICA DE ENVIO DAS RESPOSTAS 
document.getElementById("form-responder").addEventListener("submit", async (ev) => {
  ev.preventDefault(); // Impede a página de recarregar
  
  const formElement = ev.target;
  const botaoEnvio = formElement.querySelector("[type=submit]");
  botaoEnvio.disabled = true;
  botaoEnvio.textContent = "Enviando...";

  // 1. Cria um objeto FormData para capturar tudo o que o usuário digitou/marcou
  const formData = new FormData(formElement);
  
  // 2. Prepara o pacote JSON que o Spring Boot exige
  const submissao = {
    email: formData.get("email") || null,
    respostas: []
  };

  // 3. Varre os campos para montar a estrutura relacional
  const perguntasProcessadas = new Set();

  for (let [name, value] of formData.entries()) {
    if (name.startsWith("pergunta_")) {
      const idTexto = name.split("_")[1];
      const perguntaId = name.split("_")[1];
      
      // Como checkbox pode ter vários valores com o mesmo nome, processa 1 vez por pergunta
      if (!perguntasProcessadas.has(perguntaId)) {
        perguntasProcessadas.add(perguntaId);
        
        // Descobre o tipo da pergunta olhando para o campo no HTML
        const inputHTML = formElement.querySelector(`[name="${name}"]`);
        const tipo = inputHTML.dataset.tipo;

        let respostaItem = { perguntaId: (perguntaId) };

        if (tipo === "DISCURSIVA") {
          respostaItem.valor = formData.get(name);
        } 
        else if (tipo === "MULTIPLA_ESCOLHA") {
          const selecionadas = formData.getAll(name);
          respostaItem.opcoesIds = selecionadas;
          respostaItem.valor = [...formElement.querySelectorAll(`[name="${name}"]:checked`)]
            .map(input => input.closest("label")?.querySelector("[data-texto]")?.textContent || input.value)
            .join(", ");
        } 
        else if (tipo === "ESCOLHA_UNICA_JUSTIFICADA") {
          const opcao = formData.get(name);
          const justificativa = formData.get(`justificativa_${idTexto}`);
          respostaItem.opcaoId = opcao;
          respostaItem.justificativa = justificativa;
          const inputSelecionado = formElement.querySelector(`[name="${name}"]:checked`);
          const textoOpcao = inputSelecionado?.closest("label")?.querySelector("[data-texto]")?.textContent || opcao;
          respostaItem.valor = `${textoOpcao} - Justificativa: ${justificativa}`;
        }

        submissao.respostas.push(respostaItem);
      }
    }
  }

  try {
    // 4. ENVIA OS DADOS PARA O BACKEND VIA POST
    const respostaServidor = await fetch(`${API_BASE_URL}/${formularioAtualId}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(submissao) // Transforma o objeto JS em texto JSON
    });

    if (!respostaServidor.ok) throw new Error("Falha ao salvar as respostas.");

    // Se deu certo, oculta o formulário e mostra o card de sucesso
    formElement.hidden = true;
    document.getElementById("sucesso").hidden = false;
    window.scrollTo(0, 0);

  } catch (erro) {
    alert("Erro ao enviar: " + erro.message);
    botaoEnvio.disabled = false;
    botaoEnvio.textContent = "Enviar respostas";
  }
});
