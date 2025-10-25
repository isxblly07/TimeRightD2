// js/api.js

const API_BASE_URL = "http://localhost:3000/api"; // URL do seu backend Node.js

// 🔹 Login
export async function loginUser(email, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return { success: false, error: "Erro de conexão com o servidor" };
  }
}

// 🔹 Cadastro
export async function registerUser(nome, email, senha) {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao cadastrar usuário:", error);
    return { success: false, error: "Erro de conexão com o servidor" };
  }
}

// 🔹 Listar todos os usuários (opcional, teste)
export async function getUsuarios() {
  try {
    const response = await fetch(`${API_BASE_URL}/usuarios`);
    return await response.json();
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return [];
  }
}
