// Sistema híbrido - tenta Somee, fallback para Vercel
const SOMEE_URL = 'https://timeright.somee.com/api.php';
const VERCEL_URL = '/api/usuario';

// Listar todos os usuários
async function getAllUsers() {
    try {
        // Tenta Somee primeiro
        const response = await fetch(SOMEE_URL);
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.log('Somee indisponível, usando Vercel');
    }
    
    // Fallback para Vercel
    try {
        const response = await fetch(VERCEL_URL);
        return await response.json();
    } catch (error) {
        return [];
    }
}

// Cadastrar usuário
async function registerUser(nome, email, senha) {
    try {
        // Tenta Somee primeiro
        const response = await fetch(SOMEE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        
        if (response.ok) {
            const user = await response.json();
            return { success: true, user, message: 'Usuário cadastrado no Somee!' };
        }
    } catch (error) {
        console.log('Somee indisponível, usando Vercel');
    }
    
    // Fallback para Vercel
    try {
        const response = await fetch(VERCEL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const user = await response.json();
        return { success: true, user, message: 'Usuário cadastrado no Vercel!' };
    } catch (error) {
        return { success: false, error: 'Erro ao cadastrar usuário' };
    }
}

// Login
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
