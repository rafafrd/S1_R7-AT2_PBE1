const { pool } = require("../config/db");

const pedidoModel = {
  // Busca de todos os clientes;
  selectAll: async () => {
    const sql = "SELECT * FROM clientes;";
    const [rows] = await pool.query(sql);
    return rows;
  },
};

module.exports = { pedidoModel };
