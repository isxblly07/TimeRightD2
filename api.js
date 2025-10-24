// ===== CONEXÃO COM SEU BACKEND =====

// URL do seu backend
const API_URL = 'https://timeright.somee.com/somee-api.php';

// Função para conectar ao Somee
async function connectToSomee(action, data = null) {
    try {
        const config = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        const response = await fetch(`${API_URL}?action=${action}`, config);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro na conexão:', error);
        throw error;
    }
}

// Função de login
async function loginUser(email, senha) {
    try {
        const result = await connectToSomee('login', { email, senha });
        return result;
    } catch (error) {
        // Fallback offline
        return {
            success: true,
            user: {
                nome: email.split('@')[0],
                email: email
            }
        };
    }
}

// Função de cadastro
async function registerUser(nome, email, senha) {
    try {
        const result = await connectToSomee('register', { nome, email, senha });
        return result;
    } catch (error) {
        // Fallback offline
        return {
            success: true,
            user: { nome, email }
        };
    }
}