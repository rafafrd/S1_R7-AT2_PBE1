require("dotenv").config();

const mysql = require("mysql2"); // Assumindo que você usa mysql2

const pool = mysql.createConnection({
  // 2. Acessa as variáveis usando process.env
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: "3306",
  waitForConnections: true, // Aguardar conexões livres
  connectionLimit: 10, // limita o número de conexões simultâneas
  queueLimit: 0, // 0 = sem limite para fila
});

(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexão com o My SQL foi estabelecida com sucesso");
    connection.release();
  } catch (error) {
    console.error(`Erro ao conectar com o banco de dados: ${error}`);
  }
})();

module.exports = { pool };
