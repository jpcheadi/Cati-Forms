document.getElementById("btn-entrar").addEventListener("click", () => {
    const u = document.getElementById("user").value;
    const p = document.getElementById("pass").value;

    if (Auth.login(u, p)) {
        // Se o login for sucesso, "conecta" o HTML indo para o dashboard
        window.location.href = "dashboard.html";
    } else {
        document.getElementById("erro-login").hidden = false;
    }
});