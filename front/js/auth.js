// auth.js — Gerenciamento centralizado da Sessão e do Token JWT
const API_AUTH_URL = "http://localhost:8080/api/auth";

const Auth = {
    // Retorna o token salvo no navegador
    token() {
        return localStorage.getItem("authToken");
    },

    // Retorna o nome do usuário logado
    usuarioLogado() {
        return localStorage.getItem("authUsername");
    },

    // Salva a sessão após o login bem-sucedido
    salvarSessao(token, username) {
        localStorage.setItem("authToken", token);
        if (username) {
            localStorage.setItem("authUsername", username);
        }
    },

    // Remove a sessão e manda o usuário de volta para o login
    sair() {
        localStorage.removeItem("authToken");
        localStorage.removeItem("authUsername");
        window.location.href = "login.html"; // Ajuste o caminho se necessário
    },

    // Verifica se o usuário está autenticado
    estaAutenticado() {
        return !!this.token();
    }
};