document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("token");
    const userInfo = document.getElementById("userInfo");

    if (!token) {
        window.location.href = "login.html"; // Redireciona se não estiver logado
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/auth/user", {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const data = await response.json();

        if (!response.ok) {
            localStorage.removeItem("token"); // Remove token inválido
            window.location.href = "login.html"; // Redireciona para login
            return;
        }

        userInfo.textContent = `Olá, ${data.nome}!`;
    } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        userInfo.textContent = "Erro ao carregar informações.";
    }
});

// Logout
document.getElementById("logout").addEventListener("click", () => {
    localStorage.removeItem("token"); // Remove token do localStorage
    window.location.href = "login.html"; // Redireciona para login
});
