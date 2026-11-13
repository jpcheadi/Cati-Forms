/* Api.js — única camada que fala com o backend (contrato da API v1).
   Regra: aqui só existe fetch, nunca DOM. As páginas chamam Api.xxx() e
   decidem sozinhas o que mostrar na tela. */
const API_BASE = "http://localhost:8080/api";
// Erro padronizado: todo problema vira um ApiError com status, mensagem e campos.
class ApiError extends Error {
  constructor(status, dados) {
    super(dados?.mensagem || "Ocorreu um erro inesperado.");
    this.status = status;
    this.campos = dados?.campos || []; // [{ campo, mensagem }] vindo de erros 400
  }
}

async function requisitar(metodo, caminho, corpo) {
  const ehPublica = caminho.startsWith("/public");
  const ehLogin = caminho === "/auth/login";
  const headers = {};
  if (corpo !== undefined) headers["Content-Type"] = "application/json";
  if (!ehPublica && !ehLogin) {
    const token = Auth.token();
    console.log("Token que será enviado:", token);
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  let resposta;
  try {
    resposta = await fetch(API_BASE + caminho, {
      method: metodo,
      headers,
      body: corpo !== undefined ? JSON.stringify(corpo) : undefined,
    });
  } catch {
    throw new ApiError(0, { mensagem: "Não foi possível conectar ao servidor." });
  }

  const dados = await resposta.json().catch(() => null); // pode não haver corpo JSON

  if (resposta.status === 401 && !ehLogin && !ehPublica) {
    Auth.sair(); // sessão inválida/expirada: volta ao login
    throw new ApiError(401, { mensagem: "Sua sessão expirou. Entre novamente." });
  }
  if (!resposta.ok) throw new ApiError(resposta.status, dados);
  return dados;
}

const Api = {
  // Usuários (RF01, RF02)
  cadastrar: (username, senha) => requisitar("POST", "/auth/register", { username, senha }),
  async login(username, senha) {
    const dados = await requisitar("POST", "/auth/login", { username, senha });
    Auth.salvarSessao(dados.token, dados.username);
    return dados;
  },

  // Formulários (RF03–RF08, RF14) — rotas protegidas, usam id
  criarFormulario: (formulario) => requisitar("POST", "/formularios", formulario),
  listarFormularios: () => requisitar("GET", "/formularios"),
  detalharFormulario: (id) => requisitar("GET", `/formularios/${id}`),
  listarRespostas: (id) => requisitar("GET", `/formularios/${id}/respostas`),

  // Rotas públicas (RF09–RF13) — usam o codigo (UUID), sem token
  buscarFormularioPublico: (codigo) => requisitar("GET", `/formularios/public/${encodeURIComponent(codigo)}`),
  enviarRespostas: (codigo, respostas) =>
    requisitar("POST", `/formularios/public/${encodeURIComponent(codigo)}/responses`, respostas),

  // Exportação CSV/PDF (RF15, RF16): devolve arquivo, não JSON -> Fase 8.
};