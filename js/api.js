// Funções de API para conectar com Somee
async function loginUser(email, senha) {
    try {
        const response = await fetch('https://timeright.somee.com/somee-api.php?action=login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ email, senha })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}

async function registerUser(nome, email, senha) {
    try {
        const response = await fetch('https://timeright.somee.com/somee-api.php?action=register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ nome, email, senha })
        });
        
        const result = await response.json();
        return result;
    } catch (error) {
        return { success: false, error: 'Erro na conexão' };
    }
}
