const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "1234",
  database: "loja_db",
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
