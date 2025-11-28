const { pedidoModel } = require("../models/pedidoModel");

const pedidoController = {
  /**
   * Busca e retorna todos os clientes cadastrados.
   * Rota GET /clientes
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Response>} Retorna um JSON com a lista de clientes ou uma mensagem.
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
   * Cria um novo pedido, incluindo seus itens, validando os dados enviados.
   *
   * @async
   * @function criarPedido
   * @param {object} req Objeto Request contendo os dados do pedido.
   * @param {object} res Objeto Response usado para retornar o resultado.
   * @returns {Promise<object>} JSON com a confirmação da criação.
   *
   * @example
   * // POST /pedido
   * // body:
   * // {
   * //   "id_cliente": 1,
   * //   "valor_pedido": 150.90,
   * //   "data_pedido": "2025-01-10",
   * //   "id_produto": 10,
   * //   "quantidade": 2,
   * //   "valor_item": 75.45
   * // }
   * app.post("/pedido", pedidoController.criarPedido);
   */
  criarPedido: async (req, res) => {
    try {
      const { id_cliente, peso_carga } = req.body;

      if (
        !id_cliente ||
        !peso_carga ||
        isNaN(peso_carga) ||
        isNaN(id_cliente) ||
        peso_carga <= 0
      ) {
        return res.status(400).json({
          message: "Verifique os dados enviados e tente novamente",
        });
      }
      const resultado = await pedidoModel.insertPedido(id_cliente, peso_carga);
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
};

module.exports = { pedidoController };
