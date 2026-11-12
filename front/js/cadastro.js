document.addEventListener("DOMContentLoaded", () => {
    const formCadastro = document.getElementById("form-cadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            const campoUsername = document.getElementById("input-username"); 
            const campoSenha = document.getElementById("input-pass");

            // Validação de segurança para nunca mais dar o erro de null
            if (!campoUsername || !campoSenha) {
                alert("Erro interno: Não foi possível encontrar os campos de input no HTML.");
                return;
            }

            const username = campoUsername.value.trim();
            const senha = campoSenha.value.trim();

            try {
                // Chama a função de cadastro do api.js
                await Api.cadastrar(username, senha);

                alert("Usuário cadastrado com sucesso! Faça login para continuar.");
                window.location.href = "login.html"; // Ajuste para o nome do seu arquivo de login

            } catch (erro) {
                alert("Erro no cadastro: " + (erro.message || "Não foi possível registrar o usuário."));
            }
        });
    }
});