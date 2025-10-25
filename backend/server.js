import express from "express";
import sql from "mssql";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Configuração do SQL Server
const dbConfig = {
  user: "Isxblly_07_SQLLogin_1",
  password: "wm1qivt6o6",
  server: "timeright.mssql.somee.com",
  database: "timeright",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// 🔹 Função utilitária para conectar
async function getPool() {
  return await sql.connect(dbConfig);
}

// =======================
// ROTAS
// =======================

//  CADASTRO DE USUÁRIO
app.post("/api/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("nome", sql.VarChar, nome)
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, senha)
      .input("data_cadastro", sql.DateTime, new Date())      
      .input("cod_status", sql.Int, 1)
        .query(
            "INSERT INTO usuario (nome, email, senha, data_cadastro, cod_status) VALUES (@nome, @email, @senha, @data_cadastro, @cod_status)"
    );
    res.json({ success: true, message: "Usuário cadastrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//  LOGIN DE USUÁRIO
app.post("/api/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const pool = await getPool();
    const result = await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("senha", sql.VarChar, senha)
      .query(
        "SELECT * FROM usuario WHERE email = @email AND senha = @senha"
      );

    if (result.recordset.length > 0) {
      res.json({
        success: true,
        user: result.recordset[0],
      });
    } else {
      res.json({
        success: false,
        error: "E-mail ou senha incorretos.",
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// =======================
// INICIAR SERVIDOR
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
