const { pool } = require("../config/db");

/**
 * Modelo responsável pelas operações de banco de dados relacionadas a Pedidos.
 */
const pedidoModel = {
  /**
   * Busca todos os pedidos cadastrados.
   * * @async
   * @returns {Promise<Array<Object>>} Lista de pedidos.
   * @example
   * // Retorno esperado:
   * [
   * {
   * "id_pedido": 1,
   * "id_cliente": 10,
   * "id_tipo_entrega": 2,
   * "valor_base_distancia": 1.5,
   * "distancia_km": 100,
   * "valor_base_carga": 0.5,
   * "peso_carga": 20,
   * "data_pedido": "2023-10-27T10:00:00.000Z"
   * }
   * ]
   */
  selectAll: async () => {
    const sql = "SELECT * FROM pedidos;";
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Busca um pedido específico pelo seu ID.
   * * @async
   * @param {number} pId_pedido - ID do pedido.
   * @returns {Promise<Array<Object>>} Registro do pedido.
   * @example
   * // Retorno esperado:
   * [ { "id_pedido": 5, "id_cliente": 2, ... } ]
   */
  selectById: async (pId_pedido) => {
    const sql = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const values = [pId_pedido];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Busca todos os pedidos de um cliente específico.
   * * @async
   * @param {number} pId_cliente - ID do cliente.
   * @returns {Promise<Array<Object>>} Lista de pedidos do cliente.
   * @example
   * // Retorno esperado:
   * [
   * { "id_pedido": 1, "valor_base_distancia": 2.0, ... },
   * { "id_pedido": 2, "valor_base_distancia": 2.0, ... }
   * ]
   */
  selectByClienteId: async (pId_cliente) => {
    const sql = "SELECT * FROM pedidos WHERE id_cliente = ?;";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Cria um novo pedido no banco de dados.
   * A inserção aciona automaticamente a Trigger 'trg_gerar_entrega_apos_pedido' no banco.
   * Utiliza transação para garantir que o pedido seja salvo corretamente.
   * * @async
   * @param {number} pIdCliente - ID do cliente solicitante.
   * @param {number} pValorBaseDistancia - Valor base cobrado por KM.
   * @param {number} pDistancia - Distância total em KM.
   * @param {number} pValorBasePeso - Valor base cobrado por KG.
   * @param {number} pPesoCarga - Peso total da carga em KG.
   * @param {number} pTipoEntrega - ID do tipo de entrega (fk).
   * @returns {Promise<Object>} Resultado da inserção do pedido.
   * @throws {Error} Realiza rollback em caso de falha.
   * @example
   * // Retorno esperado:
   * {
   * "rowsPedido": {
   * "fieldCount": 0,
   * "affectedRows": 1,
   * "insertId": 15,
   * "serverStatus": 2,
   * "warningCount": 0,
   * "message": "",
   * "protocol41": true,
   * "changedRows": 0
   * }
   * }
   */
  insertPedido: async (
    pIdCliente,
    pValorBaseDistancia,
    pDistancia,
    pValorBasePeso,
    pPesoCarga,
    pTipoEntrega
  ) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // insert 1 - pedido
      const sqlPedido =
        "INSERT INTO pedidos (id_cliente, valor_base_distancia, distancia_km, valor_base_carga, peso_carga, id_tipo_entrega) VALUES (?, ?, ?, ?, ?, ?);";
      const valuesPedido = [
        pIdCliente,
        pValorBaseDistancia,
        pDistancia,
        pValorBasePeso,
        pPesoCarga,
        pTipoEntrega,
      ];
      const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

      await connection.commit();
      return { rowsPedido };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = { pedidoModel };
