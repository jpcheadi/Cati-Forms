(() => {
  const form = document.getElementById("form-cadastro");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    UI.limparErro();
    const username = form.username.value.trim();
    const senha = form.senha.value;
    if (!username || !senha) return UI.erro("Preencha usuário e senha.");

    const botao = form.querySelector("[type=submit]");
    UI.ocupado(botao, true);
    try {
      await Api.cadastrar(username, senha);
      await Api.login(username, senha); // já entra logado após criar a conta
      location.replace("dashboard.html");
    } catch (e) {
      UI.erro(e.status === 409 ? "Esse usuário já existe. Escolha outro." : UI.mensagemDeErro(e));
    } finally {
      UI.ocupado(botao, false);
    }
  });
})();