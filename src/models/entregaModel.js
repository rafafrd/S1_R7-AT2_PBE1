const { pool } = require("../config/db");

/**
 * Modelo responsável pelas operações de banco de dados relacionadas a Entregas.
 * Gerencia a inserção manual de entregas, tipos de entrega e status.
 */
const entregaModel = {
  /**
   * Busca todas as entregas registradas no sistema.
   * * @async
   * @returns {Promise<Array<Object>>} Lista de todas as entregas.
   * @example
   * // Retorno esperado:
   * [
   * {
   * "id_entrega": 1,
   * "id_pedido": 50,
   * "valor_distancia": 25.50,
   * "valor_peso": 10.00,
   * "acrescimo": 0.00,
   * "desconto": 0.00,
   * "taxa_extra": 0.00,
   * "valor_final": 35.50,
   * "id_status_entrega": 1,
   * "id_tipo_entrega": 1
   * }
   * ]
   */
  selectAllEntrega: async () => {
    const sql = "SELECT * FROM entregas;";
    const [rows] = await pool.query(sql);
    return rows;
  },
  /**
   * Atualiza o status de uma entrega específica.
   * Útil para mover de 'calculado' -> 'em transito' -> 'entregue'.
   * * @async
   * @param {number} idEntrega - O ID da entrega a ser atualizada.
   * @param {number} idNovoStatus - O ID do novo status (ex: 2 para 'em transito').
   * @returns {Promise<Object>} Resultado da operação (affectedRows).
   */
  updateStatus: async (idEntrega, idNovoStatus) => {
    const connection = await pool.getConnection();
    try {
      // Query de UPDATE simples
      const sql =
        "UPDATE entregas SET id_status_entrega = ? WHERE id_entrega = ?";
      const values = [idNovoStatus, idEntrega];

      const [result] = await connection.query(sql, values);
      return result;
    } catch (error) {
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Remove uma entrega do banco de dados pelo ID.
   * Envolvido em transação para segurança.
   * * @async
   * @param {number} pId_entrega - ID da entrega a ser removida.
   * @returns {Promise<Object>} Resultado da exclusão.
   * @throws {Error} Realiza rollback em caso de falha.
   * @example
   * // Retorno esperado:
   * { "affectedRows": 1, "serverStatus": 2, ... }
   */
  delete: async (pId_entrega) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const sql = "DELETE FROM entregas WHERE id_entrega = ?";
      const values = [pId_entrega];
      const [rows] = await connection.query(sql, values);

      await connection.commit();
      return rows;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = { entregaModel };
