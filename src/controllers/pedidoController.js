const { pedidoModel } = require("../models/pedidoModel");

const pedidoController = {
  /**
   * Busca e retorna todos os pedidos cadastrados ou filtra por cliente via query param.
   * Rota GET /pedidos
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP (pode conter query param ?id_cliente=1).
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna um JSON com a lista de pedidos ou mensagem de não encontrado.
   * @example
   * // Requisição: GET /pedidos?id_cliente=1
   * // Resposta 200:
   * // {
   * //   "data": [
   * //     { "id_pedido": 1, "id_cliente": 1, "valor_final": 150.00, ... }
   * //   ]
   * // }
   */
  selecionaTodos: async (req, res) => {
    try {
      let resultado;

      if (req.query.id_cliente) {
        resultado = await pedidoModel.selectByClienteId(req.query.id_cliente);
      } else {
        resultado = await pedidoModel.selectAll();
      }

      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: "A consulta não retornou resultados" });
      }
      res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },

  /**
   * Busca um pedido específico pelo ID.
   * Rota GET /pedidos/:id
   * @async
   * @function VerPorId
   * @param {Request} req Objeto da requisição (params.id).
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} JSON com os dados do pedido.
   * @example
   * // Requisição: GET /pedidos/50
   * // Resposta 200:
   * // { "data": [ { "id_pedido": 50, ... } ] }
   */
  VerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const resultado = await pedidoModel.selectById(id);
      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: "A consulta não retornou resultados" });
      }
      res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },

  /**
   * Busca pedidos por ID de cliente (Alternativa explícita ao query param).
   * @async
   * @function VerPorClienteId
   */
  VerPorClienteId: async (req, res) => {
    try {
      const { id_cliente } = req.query;
      const resultado = await pedidoModel.selectByClienteId(id_cliente);
      if (resultado.length === 0) {
        return res
          .status(200)
          .json({ message: "A consulta não retornou resultados" });
      }
      res.status(200).json({ data: resultado });
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },

  /**
   * Cria um novo pedido, calcula automaticamente o frete e gera a entrega.
   * A lógica de negócio é delegada ao Model, que realiza os cálculos e transação.
   *
   * @async
   * @function criarPedido
   * @param {object} req Objeto Request contendo os dados do pedido no body.
   * @param {object} res Objeto Response usado para retornar o resultado.
   * @returns {Promise<object>} JSON com a confirmação e os detalhes do cálculo.
   *
   * @example
   * // POST /pedidos
   * // Body:
   * // {
   * //   "id_cliente": 1,
   * //   "valor_base_distancia": 2.50, // R$ 2,50 por KM
   * //   "distancia_km": 100,          // 100 KM
   * //   "valor_base_carga": 1.00,     // R$ 1,00 por KG
   * //   "peso_carga": 60,             // 60 KG
   * //   "id_tipo_entrega": 2          // 2 = Urgente
   * // }
   *
   * // Resposta 201 (Sucesso):
   * // {
   * //   "message": "Registro incluído com sucesso",
   * //   "data": {
   * //     "mensagem": "Pedido e Entrega processados com sucesso",
   * //     "id_pedido": 55,
   * //     "id_entrega": 102,
   * //     "detalhes_calculo": {
   * //       "valor_base_total": 310.00,
   * //       "acrescimo": 62.00,
   * //       "taxa_extra": 15.00,
   * //       "desconto": 0.00,
   * //       "valor_final": 387.00
   * //     }
   * //   }
   * // }
   */
  criarPedido: async (req, res) => {
    try {
      const {
        id_cliente,
        valor_base_distancia,
        distancia_km,
        valor_base_carga,
        peso_carga,
        id_tipo_entrega,
      } = req.body;

      // Validação básica dos campos obrigatórios
      if (
        !id_cliente ||
        isNaN(id_cliente) ||
        !valor_base_distancia ||
        isNaN(valor_base_distancia) ||
        valor_base_distancia <= 0 ||
        !distancia_km ||
        isNaN(distancia_km) ||
        distancia_km <= 0 ||
        !valor_base_carga ||
        isNaN(valor_base_carga) ||
        valor_base_carga <= 0 ||
        !peso_carga ||
        isNaN(peso_carga) ||
        peso_carga <= 0 ||
        !id_tipo_entrega ||
        isNaN(id_tipo_entrega) ||
        id_tipo_entrega <= 0
      ) {
        return res.status(400).json({
          message:
            "Dados digitados incorretamente ou incompletos. Verifique os valores numéricos.",
        });
      }

      // Chama o Model que orquestra a transação e o cálculo
      const resultado = await pedidoModel.insertPedido(
        id_cliente,
        valor_base_distancia,
        distancia_km,
        valor_base_carga,
        peso_carga,
        id_tipo_entrega
      );

      res.status(201).json({
        message: "Registro incluído com sucesso",
        data: resultado,
      });
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },

  deletePedido: async (req, res) => {
    try {
      const id_pedido = Number(req.params.id_pedido);
      // validação ID
      if (isNaN(id_pedido) || id_pedido <= 0) {
        return res
          .status(400)
          .json({ message: "ID do pedido inválido ou não fornecido." });
      }
      const pedidoSelecionado = await pedidoModel.selectById(id_pedido);
      if (pedidoSelecionado.length === 0) {
        return res.status(404).json({ message: "Pedido Não localizado" });
      }
      const resultDelete = await pedidoController.deletePedido(id_pedido);
      if (resultDelete.affectedRows === 1) {
        return res
          .status(200)
          .json({ message: "Pedido excluído com sucesso" });
      } else {
        res
          .status(500)
          .json({ message: "Ocorreu um erro ao excluir o pedido." });
      }
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },

};

module.exports = { pedidoController };
