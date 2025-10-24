// URL da API
const API_URL = '/api';

// Função de login
async function loginUser(email, senha) {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}

// Função de cadastro
async function registerUser(nome, email, senha) {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}
