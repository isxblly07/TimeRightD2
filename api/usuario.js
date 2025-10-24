// API que salva no Vercel E tenta salvar no Somee
let users = [];

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // GET - Listar usuários
    if (req.method === 'GET') {
        return res.json(users);
    }

    // POST - Cadastrar usuário
    if (req.method === 'POST') {
        const { nome, email, senha } = req.body;
        
        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }

        // Verificar se email já existe
        if (users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        const newUser = {
            id: users.length + 1,
            nome,
            email,
            senha
        };

        // Salvar no Vercel
        users.push(newUser);
        
        // Tentar salvar no Somee também
        try {
            const someeResponse = await fetch('https://timeright.somee.com/api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome, email, senha })
            });
            
            if (someeResponse.ok) {
                console.log('✅ Usuário salvo no Somee também!');
            }
        } catch (error) {
            console.log('❌ Somee indisponível, salvo apenas no Vercel');
        }
        
        return res.status(201).json(newUser);
    }

    return res.status(405).json({ error: 'Método não permitido' });
}
