const { entregaModel } = require("../models/entregaModel");

const entregaController = {
  selecionaTodos: async (req, res) => {
    try {
      const resultado = await entregaModel.selectAllEntrega();
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
   * Atualiza o status de uma entrega.
   * Rota PUT /entregas/:id/status
   * * @async
   * @param {object} req - Request contendo id na URL e id_status no body.
   * @param {object} res - Response.
   * @example
   * // PUT /entregas/10/status
   * // Body: { "id_status": 3 } (3 = Entregue)
   */
  atualizarStatus: async (req, res) => {
    try {
      const { id_entrega } = req.params; // ID da entrega vindo da URLs
      const { id_status } = req.body; // Novo status vindo do JSON

      // Validação básica
      if (!id_entrega || isNaN(id_entrega) || !id_status || isNaN(id_status)) {
        return res.status(400).json({ message: "IDs inválidos fornecidos." });
      }

      const resultado = await entregaModel.updateStatus(id_entrega, id_status);

      // affectedRows verifica se alguma linha foi alterada no banco
      if (resultado.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Entrega não encontrada para atualização." });
      }

      res.status(200).json({
        message: "Status da entrega atualizado com sucesso",
        info: resultado,
      });
    } catch (error) {
      console.error(`Erro ao atualizar: ${error}`);
      res.status(500).json({
        message: "Erro no servidor ao atualizar status.",
        errorMessage: error.message,
      });
    }
  },
};

module.exports = { entregaController };
