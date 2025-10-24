// Sistema que funciona sempre
async function getAllUsers() {
    try {
        const response = await fetch('/api/usuario');
        return await response.json();
    } catch (error) {
        return [];
    }
}

async function registerUser(nome, email, senha) {
    try {
        const response = await fetch('/api/usuario', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const user = await response.json();
        return { success: true, user, message: 'Usuário cadastrado com sucesso!' };
    } catch (error) {
        return { success: false, error: 'Erro ao cadastrar usuário' };
    }
}

async function loginUser(email, senha) {
    try {
        const users = await getAllUsers();
        
        if (Array.isArray(users)) {
            const user = users.find(u => u.email === email && u.senha === senha);
            
            if (user) {
                return {
                    success: true,
                    user: {
                        id: user.id,
                        nome: user.nome,
                        email: user.email
                    },
                    message: 'Login realizado com sucesso!'
                };
            }
        }
        
        return { success: false, error: 'Email ou senha incorretos' };
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}
