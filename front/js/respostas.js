// 1. Helper de Interface (O mesmo do Dashboard, para evitar o "UI is not defined")
const UI = {
    el(tag, props, ...filhos) {
      const elemento = document.createElement(tag);
      for (const [chave, valor] of Object.entries(props || {})) {
        if (chave === "text") elemento.textContent = valor;
        else if (chave === "html") elemento.innerHTML = valor; // Permite inserir HTML na tag
        else elemento.setAttribute(chave, valor);
      }
      filhos.forEach(filho => {
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
    }
  };
  
  // 2. Lógica Principal
  (() => {
    const lista = document.getElementById("lista-respostas");
    const vazio = document.getElementById("vazio");
    
    // Elementos do Cabeçalho da Página
    const tituloEl = document.getElementById("titulo");
    const descricaoEl = document.getElementById("descricao");
    const totalEl = document.getElementById("total");
  
    // Botão de Sair
    const btnSair = document.getElementById("btn-sair");
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            Auth.sair();
        });
    }
  
    // Desenha uma única submissão (Card)
    function desenharCard(submissao, index) {
        // Converte a data
        const dataEnvio = new Date(submissao.dataEnvio).toLocaleString('pt-BR');
        const emailCandidato = submissao.email || "Candidato Anônimo";
  
        // Cria a lista <dl> (Definition List) igual ao seu exemplo HTML
        const dl = UI.el("dl", { class: "answer" });
  
        // Percorre as respostas que vieram do banco
        submissao.respostas.forEach(resp => {
            const textoPergunta = resp.pergunta ? resp.pergunta.enunciado : "Pergunta não encontrada";
            
            dl.appendChild(UI.el("dt", { text: textoPergunta }));
            dl.appendChild(UI.el("dd", { html: `📝 <span style="color: #0056b3;">${resp.valor}</span>` }));
        });
  
        // Monta o Card final
        return UI.el("article", { class: "card" },
            UI.el("div", { class: "row row--between" },
                UI.el("h2", { text: `Resposta #${index + 1}` }),
                UI.el("span", { class: "muted", text: emailCandidato + ` (${dataEnvio})` })
            ),
            dl
        );
    }
  
    async function carregar() {
      // Pega o ID da URL (ex: respostas.html?id=123)
      const params = new URLSearchParams(window.location.search);
      const formId = params.get("id");
  
      if (!formId) {
          UI.erro("Nenhum formulário selecionado. Volte para o Dashboard.");
          return;
      }
  
      if (lista) lista.replaceChildren(); // Limpa o card estático
  
      try {
        // 1. Busca os Detalhes do Formulário (Para arrumar o Título lá em cima)
        const form = await Api.detalharFormulario(formId);
        if (tituloEl) tituloEl.textContent = form.titulo;
        if (descricaoEl) descricaoEl.textContent = form.descricao;
  
        // 2. Busca as Respostas (Submissões)
        const submissoes = await Api.listarRespostas(formId);
        
        // Atualiza a badge de total
        if (totalEl) totalEl.textContent = `${submissoes.length} resposta${submissoes.length === 1 ? "" : "s"}`;
        
        // Esconde ou mostra mensagem de vazio
        if (vazio) vazio.hidden = submissoes.length > 0;
  
        // Desenha os cards
        if (lista && submissoes.length > 0) {
            submissoes.forEach((sub, index) => {
                lista.appendChild(desenharCard(sub, index));
            });
        }
      } catch (e) {
        UI.erro(e.message || "Erro ao carregar as respostas.");
      }
    }
    
    carregar();
  })();