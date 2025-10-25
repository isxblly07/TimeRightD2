import { loginUser, registerUser } from "./api.js";

// ======= Funções para controle do modal =======
window.showLogin = function () {
  document.getElementById("loginModal").style.display = "block";
};

window.closeModal = function () {
  document.getElementById("loginModal").style.display = "none";
};

window.showLoginForm = function () {
  document.getElementById("loginForm").classList.add("active");
  document.getElementById("registerForm").classList.remove("active");
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("registerTab").classList.remove("active");
};

window.showRegisterForm = function () {
  document.getElementById("registerForm").classList.add("active");
  document.getElementById("loginForm").classList.remove("active");
  document.getElementById("registerTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
};

// ======= Eventos =======
document.addEventListener("DOMContentLoaded", function () {
  // LOGIN
  document
    .getElementById("loginForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const senha = document.getElementById("loginSenha").value;

      const result = await loginUser(email, senha);

      if (result.success) {
        // Salva apenas o nome do usuário
        localStorage.setItem(
            "timeright_user",
            JSON.stringify({
                nome: result.user.nome || result.user.Nome,
                email: result.user.email,
                admin: result.user.admin === true || result.user.admin === 1, // 🔥 salva info de admin
            })
);
        window.location.href = 'admin.html';
    } else {
        alert(result.error || "Usuário ou senha inválidos.");
      }
    });

  // CADASTRO
  document
    .getElementById("registerForm")
    .addEventListener("submit", async function (e) {
      e.preventDefault();

      const nome = document.getElementById("registerNome").value;
      const email = document.getElementById("registerEmail").value;
      const senha = document.getElementById("registerSenha").value;
      const confirmarSenha = document.getElementById("registerConfirmarSenha").value;

      if (senha !== confirmarSenha) {
        alert("As senhas não coincidem!");
        return;
      }

      const result = await registerUser(nome, email, senha);

      if (result.success) {
        alert("Usuário cadastrado com sucesso!");
        localStorage.setItem('timeright_user', JSON.stringify({ nome: result.user.nome || result.user.Nome }));
        window.location.href = "admin.html";
      } else {
        alert(result.error || "Erro ao cadastrar o usuário.");
      }
    });
});
