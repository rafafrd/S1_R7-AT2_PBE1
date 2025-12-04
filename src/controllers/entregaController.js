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

  insertDadosEntrega: async (req, res) => {
    try {
      const {
        id_pedido,
        tipo_entrega,
        status_entrega,
        distancia,
        valor_base_distancia,
        valor_base_peso,
      } = req.body;
      if (
        !id_pedido ||
        isNaN(id_pedido) ||
        !tipo_entrega ||
        !isNaN(tipo_entrega) ||
        !status_entrega ||
        !isNaN(status_entrega) ||
        !distancia ||
        isNaN(distancia) ||
        !valor_base_distancia ||
        isNaN(valor_base_distancia) ||
        !valor_base_peso ||
        isNaN(valor_base_peso)
      ) {
        return res.status(400).json({
          message: "Dados digitados incorretamente, tente novamente!",
        });
      }
      const resultado = await entregaModel.insertDadosEntrega(
        id_pedido,
        tipo_entrega,
        status_entrega,
        distancia,
        valor_base_distancia,
        valor_base_peso
      );
      res.status(200).json({
        message: "Registro incluído com sucesso",
        data: resultado,
      });
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
      const { id } = req.params; // ID da entrega vindo da URL
      const { id_status } = req.body; // Novo status vindo do JSON

      // Validação básica
      if (!id || isNaN(id) || !id_status || isNaN(id_status)) {
        return res.status(400).json({ message: "IDs inválidos fornecidos." });
      }

      const resultado = await entregaModel.updateStatus(id, id_status);

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
      res
        .status(500)
        .json({ message: "Erro no servidor ao atualizar status." });
    }
  },
};

module.exports = { entregaController };
