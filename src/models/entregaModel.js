const { pool } = require("../config/db");

const entregaModel = {
  selectAllEntrega: async () => {
    const sql = "SELECT * FROM entregas;";
    const [rows] = await pool.query(sql);
    return rows;
  },

  insertDadosEntrega: async (
    pIdPedido,
    pTipoEntrega,
    pStatusEntrega,
    pValorDistancia,
    pValorPeso
  ) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // tabela tipoEntrega
      const sqlTipoEntrega =
        "INSERT INTO tipo_entrega(tipo_entrega) VALUES(?);";
      const valuesTipoEntrega = [pTipoEntrega];
      const [rowsTipoEntrega] = await connection.query(
        sqlTipoEntrega,
        valuesTipoEntrega
      );

      const novoIdTipoEntrega = rowsTipoEntrega.insertId;

      // tabela statusEntrega
      const sqlStatusEntrega =
        "INSERT INTO status_entrega(status_entrega) VALUES(?);";
      const valuesStatusEntrega = [pStatusEntrega];
      const [rowsStatusEntrega] = await connection.query(
        sqlStatusEntrega,
        valuesStatusEntrega
      );

      const novoIdStatusEntrega = rowsStatusEntrega.insertId;

      // tabela Entrega
      const sqlEntrega =
        "INSERT INTO entregas(id_pedido, valor_distancia, valor_peso) VALUES(?,?,?);";
      const valuesEntrega = [
        pIdPedido,
        pDistancia,
        pValorBaseDistancia,
        pValorBasePeso,
        novoIdStatusEntrega,
        novoIdTipoEntrega,
      ];
      const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

      connection.commit();
      return { rowsTipoEntrega, rowsStatusEntrega, rowsEntrega };
    } catch (error) {
      // caso algum insert de erro, ele da rollback e cancela tudo
      connection.rollback();
      throw error;
    }
  },
  delete: async (pId_cliente) => {
    const sql = "DELETE FROM entregas WHERE id_entrega = ?";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { entregaModel };
