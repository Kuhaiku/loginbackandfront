document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagemErro = document.getElementById("mensagemErro");

    try {
        const response = await fetch("http://localhost:3000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const data = await response.json();

        if (!response.ok) {
            mensagemErro.textContent = data.error || "Erro no login";
            return;
        }

        // Salva o token no localStorage
        localStorage.setItem("token", data.token);

        // Redireciona para o dashboard
        window.location.href = "dashboard.html";
    } catch (error) {
        console.error("Erro:", error);
        mensagemErro.textContent = "Erro ao conectar ao servidor.";
    }
});
