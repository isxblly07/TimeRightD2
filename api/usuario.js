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
        await sql.connect(config);
        
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

        if (method === 'GET' && !id) {
            const result = await sql.query`SELECT id, nome, email, senha FROM usuarios`;
            return res.json(result.recordset);
        }

        if (method === 'POST') {
            const { nome, email, senha } = req.body;
            
            if (!nome || !email || !senha) {
                return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
            }

            const existing = await sql.query`SELECT id FROM usuarios WHERE email = ${email}`;
            if (existing.recordset.length > 0) {
                return res.status(400).json({ error: 'Email já cadastrado' });
            }

            const result = await sql.query`
                INSERT INTO usuarios (nome, email, senha) 
                OUTPUT INSERTED.id, INSERTED.nome, INSERTED.email, INSERTED.senha
                VALUES (${nome}, ${email}, ${senha})
            `;

            return res.status(201).json(result.recordset[0]);
        }

        return res.status(405).json({ error: 'Método não permitido' });
        
    } catch (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
    } finally {
        await sql.close();
    }
}
