const API_AUTH_URL = "http://localhost:8080/api/auth";

const Auth = {
    /**
     * Realiza a requisição de autenticação na API.
     * @param {string} username - Nome de usuário fornecido na interface.
     * @param {string} senha - Senha fornecida na interface.
     * @returns {Promise<boolean>} - Retorna true em caso de sucesso (HTTP 200 OK), false caso contrário.
     */
    async login(username, senha) {
        try {
            const response = await fetch(`${API_AUTH_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, senha })
            });

            if (response.ok) {
                const data = await response.json();
                // Armazena o token JWT retornado pelo backend (RF01/RF02)
                localStorage.setItem("authToken", data.token);
                return true; 
            }
            
            return false; 
        } catch (error) {
            console.error("Erro de comunicação com a API de autenticação:", error);
            return false;
        }
    },

    /**
     * Verifica a presença de um token de sessão válido no armazenamento local.
     * @returns {boolean}
     */
    estaLogado() {
        return localStorage.getItem("authToken") !== null;
    },

    /**
     * Valida o estado de autenticação e redireciona usuários não autorizados.
     * Deve ser invocada no carregamento de rotas protegidas.
     */
    protegerPagina() {
        if (!this.estaLogado()) {
            window.location.href = "login.html"; 
        }
    },

    /**
     * Invalida a sessão atual no lado do cliente e redireciona para o login.
     */
    logout() {
        localStorage.removeItem("authToken");
        window.location.href = "login.html";
    }
};

// Configuração de escutadores de eventos globais de autenticação
document.addEventListener("DOMContentLoaded", () => {
    const botaoSair = document.getElementById("btn-sair");

    if (botaoSair) {
        botaoSair.addEventListener("click", () => {
            Auth.logout();
        });
    }
});