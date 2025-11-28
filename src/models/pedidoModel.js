const { pool } = require("../config/db");

const pedidoModel = {
  // Busca de todos os pedidos;
  selectAll: async () => {
    const sql = "SELECT * FROM pedidos;";
    const [rows] = await pool.query(sql);
    return rows;
  },
  selectById: async (pId_pedido) => {
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const values = [pId_pedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  selectByClienteId: async (pId_cliente) => {
    const sql = "SELECT * FROM pedidos WHERE id_cliente = ?;";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  insertPedido: async (pIdCliente, pPesoCarga) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // insert 1 - pedido
      const sqlPedido =
        "INSERT INTO pedidos (id_cliente, peso_carga) VALUES (?,?);";
      const valuesPedido = [pIdCliente, pPesoCarga];
      const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);
      connection.commit();
      return { rowsPedido };
    } catch (error) {
      connection.rollback();
      throw error;
    }
  },
};

module.exports = { pedidoModel };
