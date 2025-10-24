// Simulação de banco de dados em memória
let users = [];

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'POST') {
    const { action, nome, email, senha } = req.body;
    
    if (action === 'register') {
      // Verificar se email já existe
      if (users.find(u => u.email === email)) {
        return res.json({ success: false, error: 'Email já cadastrado' });
      }
      
      users.push({ nome, email, senha });
      console.log('Usuário cadastrado:', { nome, email });
      return res.json({ success: true, user: { nome, email } });
    }
    
    if (action === 'login') {
      const user = users.find(u => u.email === email && u.senha === senha);
      if (user) {
        return res.json({ success: true, user: { nome: user.nome, email } });
      }
      return res.json({ success: false, error: 'Email ou senha incorretos' });
    }
  }
}
