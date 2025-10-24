// APIs conectadas ao Somee
const API_BASE_URL = 'https://timeright.somee.com';

// Listar todos os usuários
async function getAllUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api.php`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}

// Criar novo usuário (Cadastro)
async function registerUser(nome, email, senha) {
    try {
        const response = await fetch(`${API_BASE_URL}/api.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, email, senha })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const user = await response.json();
        return { success: true, user, message: 'Usuário cadastrado com sucesso!' };
    } catch (error) {
        console.error('Register error:', error);
        return { success: false, error: 'Erro ao cadastrar usuário' };
    }
}

// Login (busca usuário por email e senha)
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
        console.error('Login error:', error);
        return { success: false, error: 'Erro na conexão com o servidor' };
    }
}

// Verificar se API está online
async function checkApiStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api.php`);
        return response.ok;
    } catch (error) {
        return false;
    }
}
