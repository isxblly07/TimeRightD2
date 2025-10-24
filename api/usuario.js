// API de usuários conectada ao SQL Server Somee
import sql from 'mssql';

// Configuração do banco Somee
const config = {
    server: 'timeright.mssql.somee.com',
    database: 'timeright',
    user: 'Isxblly_07_SQLLogin_1',
    password: 'wm1qivt6o6',
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method, query } = req;
    const { id } = query;

    try {
        // Conectar ao banco
        await sql.connect(config);
        
        // Criar tabela se não existir
        await sql.query`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='usuarios' AND xtype='U')
            CREATE TABLE usuarios (
                id INT IDENTITY(1,1) PRIMARY KEY,
                nome NVARCHAR(100) NOT NULL,
                email NVARCHAR(100) UNIQUE NOT NULL,
                senha NVARCHAR(100) NOT NULL,
                created_at DATETIME DEFAULT GETDATE()
            )
        `;

        // GET /api/usuario - Listar todos
        if (method === 'GET' && !id) {
            const result = await sql.query`SELECT id, nome, email, senha FROM usuarios`;
            return res.json(result.recordset);
        }

        // GET /api/usuario/[id] - Buscar por ID
        if (method === 'GET' && id) {
            const userId = parseInt(id);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'ID inválido' });
            }
            
            const result = await sql.query`SELECT id, nome, email, senha FROM usuarios WHERE id = ${userId}`;
            if (result.recordset.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
            return res.json(result.recordset[0]);
        }

        // POST /api/usuario - Criar novo
        if (method === 'POST') {
            const { nome, email, senha } = req.body;
            
            if (!nome || !email || !senha) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            // Verificar se email já existe
            const existing = await sql.query`SELECT id FROM usuarios WHERE email = ${email}`;
            if (existing.recordset.length > 0) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            // Inserir novo usuário
            const result = await sql.query`
                INSERT INTO usuarios (nome, email, senha) 
                OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.senha
                VALUES (${nome}, ${email}, ${senha})
            `;

            return res.status(201).json(result.recordset[0]);
        }

        // PUT /api/usuario/[id] - Atualizar
        if (method === 'PUT' && id) {
            const userId = parseInt(id);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            // Verificar se usuário existe
            const existing = await sql.query`SELECT * FROM usuarios WHERE id = ${userId}`;
            if (existing.recordset.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            const { nome, email, senha } = req.body;
            const currentUser = existing.recordset[0];
            
            // Atualizar usuário
            const result = await sql.query`
                UPDATE usuarios 
                SET nome = ${nome || currentUser.nome}, 
                    email = ${email || currentUser.email}, 
                    senha = ${senha || currentUser.senha}
                WHERE id = ${userId};
                SELECT id, nome, email, senha FROM usuarios WHERE id = ${userId}
            `;

            return res.json(result.recordset[0]);
        }

        // DELETE /api/usuario/[id] - Remover
        if (method === 'DELETE' && id) {
            const userId = parseInt(id);
            if (isNaN(userId)) {
                return res.status(400).json({ error: 'ID inválido' });
            }

            // Verificar se usuário existe
            const existing = await sql.query`SELECT id FROM usuarios WHERE id = ${userId}`;
            if (existing.recordset.length === 0) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }

            // Remover usuário
            await sql.query`DELETE FROM usuarios WHERE id = ${userId}`;
            return res.json({ message: 'Usuário removido com sucesso' });
        }

        return res.status(405).json({ error: 'Método não permitido' });
        
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    } finally {
        await sql.close();
    }
}