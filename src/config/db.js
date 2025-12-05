require("dotenv").config(); // Carrega as variáveis do arquivo .env

const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "rapido_seguro_db",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true, // Aguardar conexões livres
  connectionLimit: 10, // limita o número de conexões simultâneas
  queueLimit: 0, // 0 = sem limite para fila
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão com o MySQL foi estabelecida com sucesso");
    connection.release();
  } catch (error) {
    console.error(`Erro ao conectar com o banco de dados: ${error}`);
  }
})();

module.exports = { pool };
