async function loginUser(email, senha) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, senha })
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}

async function registerUser(nome, email, senha) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', nome, email, senha })
        });
        return await response.json();
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}
