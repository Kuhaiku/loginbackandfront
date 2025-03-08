document.getElementById("register-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;
    const mensagem = document.getElementById("mensagem");

    try {
        const resposta = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            mensagem.style.color = "green";
            mensagem.textContent = dados.message;
            setTimeout(() => {
                window.location.href = "login.html"; // Redireciona para o login
            }, 2000);
        } else {
            mensagem.style.color = "red";
            mensagem.textContent = dados.error || "Erro ao cadastrar.";
        }
    } catch (error) {
        mensagem.style.color = "red";
        mensagem.textContent = "Erro ao conectar ao servidor.";
    }
});
