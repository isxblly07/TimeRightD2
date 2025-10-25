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

app.get("/api/usuarios", async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query(
      "SELECT id, nome, email, cod_status, admin FROM Usuario"
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Erro ao listar usuários:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/usuarios/:id/status
app.patch("/api/usuarios/:id/status", async (req, res) => {
  const idToChange = parseInt(req.params.id, 10);
  const { emailCaller, cod_status } = req.body; // cod_status: 0 ou 1

  if (!emailCaller) {
    return res.status(400).json({ success: false, error: "emailCaller é obrigatório." });
  }

  if (cod_status !== 0 && cod_status !== 1) {
    return res.status(400).json({ success: false, error: "cod_status deve ser 0 ou 1." });
  }

  try {
    const pool = await getPool();

    // Verifica se o chamador é admin
    const checkAdmin = await pool
      .request()
      .input("email", sql.VarChar, emailCaller)
      .query("SELECT admin FROM Usuario WHERE email = @email");

    if (checkAdmin.recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Usuário chamador não encontrado." });
    }

    const isAdmin = checkAdmin.recordset[0].admin === true || checkAdmin.recordset[0].admin === 1;
    if (!isAdmin) {
      return res.status(403).json({ success: false, error: "Acesso negado. Apenas administradores podem alterar status." });
    }

    // Atualiza o status
    const updateResult = await pool
      .request()
      .input("id", sql.Int, idToChange)
      .input("cod_status", sql.Int, cod_status)
      .query(`
        UPDATE Usuario
        SET cod_status = @cod_status
        WHERE id = @id
      `);

    if (updateResult.rowsAffected[0] === 0) {
      return res.status(404).json({ success: false, error: "Usuário não encontrado para atualização." });
    }

    // Retorna o novo estado atualizado
    const updatedUser = await pool
      .request()
      .input("id", sql.Int, idToChange)
      .query("SELECT id, nome, email, cod_status FROM Usuario WHERE id = @id");

    res.json({
      success: true,
      message: cod_status === 1 ? "Usuário habilitado com sucesso!" : "Usuário desativado com sucesso!",
      user: updatedUser.recordset[0],
    });
  } catch (err) {
    console.error("Erro ao atualizar status:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor." });
  }
});

// =======================
// INICIAR SERVIDOR
// =======================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`)
);
