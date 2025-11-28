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
      const resultado = await pedidoModel.selectAll();
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
};

module.exports = { pedidoController };
