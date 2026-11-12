document.addEventListener("DOMContentLoaded", () => {
    const formLogin = document.getElementById("form-login");

    if (formLogin) {
        formLogin.addEventListener("submit", async (evento) => {
            evento.preventDefault();

            // ⚠️ ATENÇÃO: Verifique se no seu login.html os IDs dos inputs são exatamente "input-username" e "input-senha".
            // Se no seu HTML os IDs forem diferentes (ex: "usuario" e "senha"), mude aqui embaixo para bater com o HTML!
            const campoUsername = document.getElementById("user");
            const campoSenha = document.getElementById("pass");

            if (!campoUsername || !campoSenha) {
                alert("Erro interno: Não foi possível encontrar os campos de input de usuário ou senha no HTML do login.");
                return;
            }

            const username = campoUsername.value.trim();
            const senha = campoSenha.value.trim();

            try {
                // Chama a função centralizada no api.js (faz o POST e salva o token no localStorage)
                await Api.login(username, senha);

                alert("Login realizado com sucesso!");
                window.location.href = "dashboard.html"; // Redireciona para o painel de criação

            } catch (erro) {
                alert("Erro ao entrar: " + (erro.message || "Credenciais inválidas."));
            }
        });
    }
});