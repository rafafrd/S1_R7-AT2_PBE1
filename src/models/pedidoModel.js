const { pool } = require("../config/db");

/**
 * Modelo responsável pelas operações de banco de dados relacionadas a Pedidos.
 * Contém a lógica de negócios para cálculo de frete e orquestração de transações.
 */
const pedidoModel = {
  /**
   * Busca todos os pedidos cadastrados.
   * * @async
   * @returns {Promise<Array<Object>>} Lista de pedidos.
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
   */
  selectByClienteId: async (pId_cliente) => {
    const sql = "SELECT * FROM pedidos WHERE id_cliente = ?;";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Cria um novo pedido e gera automaticamente a entrega calculada.
   * A lógica de negócio (cálculos de frete, taxas e descontos) é executada na aplicação.
   * Utiliza transação para garantir a consistência entre Pedido e Entrega.
   *
   * @async
   * @param {number} pIdCliente - ID do cliente solicitante.
   * @param {number} pValorBaseDistancia - Valor base cobrado por KM.
   * @param {number} pDistancia - Distância total em KM.
   * @param {number} pValorBasePeso - Valor base cobrado por KG.
   * @param {number} pPesoCarga - Peso total da carga em KG.
   * @param {number} pTipoEntrega - ID do tipo de entrega (fk).
   * @returns {Promise<Object>} Objeto com dados do pedido, entrega e detalhes do cálculo.
   * @throws {Error} Realiza rollback em caso de falha em qualquer etapa.
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

      // pegando o tipo de entrega para base de calculo
      const [rowsTipo] = await connection.query(
        "SELECT tipo_entrega FROM tipo_entrega WHERE id_tipo_entrega = ?",
        [pTipoEntrega]
      );

      let nomeTipoEntrega = "normal";
      if (rowsTipo.length > 0) {
        nomeTipoEntrega = rowsTipo[0].tipo_entrega; // 'urgente' ou 'normal'
      }

      // parse para number e fazendo calculos
      const valorDistancia = Number(pDistancia) * Number(pValorBaseDistancia);
      const valorPeso = Number(pPesoCarga) * Number(pValorBasePeso);
      const valorBaseTotal = valorDistancia + valorPeso;

      // add de 20% se for urgente
      let acrescimo = 0.0;
      if (nomeTipoEntrega === "urgente") {
        acrescimo = valorBaseTotal * 0.2;
      }

      // taxa extra se pesar mais de 50kg
      let taxaExtra = 0.0;
      if (Number(pPesoCarga) > 50) {
        taxaExtra = 15.0;
      }

      // fazendo subtotal para validar desconto
      const subtotal = valorBaseTotal + acrescimo + taxaExtra;

      // desconto de 10% se passar de 500
      let desconto = 0.0; // se não aplicar não modifica
      if (subtotal > 500.0) {
        desconto = subtotal * 0.1;
      }

      const valorFinal = subtotal - desconto;

      // insert
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
      const [resultPedido] = await connection.query(sqlPedido, valuesPedido);
      const novoIdPedido = resultPedido.insertId; // pegando para dar insert na tabela entrega

      const idStatusCalculado = 1; // ID 1 é 'calculado' na tabela status_entrega

      const sqlEntrega = `
        INSERT INTO entregas 
        (id_pedido, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_final, id_status_entrega, id_tipo_entrega) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const valuesEntrega = [
        novoIdPedido,
        valorDistancia,
        valorPeso,
        acrescimo,
        desconto,
        taxaExtra,
        valorFinal,
        idStatusCalculado,
        pTipoEntrega,
      ];

      const [resultEntrega] = await connection.query(sqlEntrega, valuesEntrega);

      // deu certo, commita
      await connection.commit();
      return { resultPedido, resultEntrega};
    } catch (error) {
      // se der erro no cálculo ou no insert, desfaz tudo (Pedido não será criado sem entrega)
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  deletaPedido:async (pId_pedido) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // tabela entregas
      const sqlEntregas = "DELETE FROM entregas WHERE id_pedido = ?;";
      const valuesEntregas = [pId_pedido];
      const [rowsEntregas] = await connection.query(sqlEntregas, valuesEntregas);

      // tabela pedidos
      const sqlPedidos = "DELETE FROM pedidos WHERE id_pedido = ?;";
      const valuesPedidos = [pId_pedido];
      const [rowsPedidos] = await connection.query(sqlPedidos, valuesPedidos); 

      await connection.commit();
      return { rowsEntregas, rowsPedidos};
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },
};

module.exports = { pedidoModel };
