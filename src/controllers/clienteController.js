const { clienteModel } = require("../models/clienteModel");

const clienteController = {
  /**
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  insertDadosCliente: async (req, res) => {
    try {
      const { nome, cpf, email, cep, telefone } = req.body;
      if (!nome || !cpf || isNaN(cpf) || !email || !cep || isNaN(cep) || !telefone || isNaN(telefone)) {
        return res
          .status(400)
          .json({ message: telefone });
      }

      const clienteExistente = await clienteModel.selectByCpf(cpf);
      if (clienteExistente.length > 0) {
        // Retorna o status 409 (Conflict)
        return res
          .status(409)
          .json({ message: "Conflito: CPF já cadastrado." });
      }
      const resultado = await clienteModel.insertDadosCliente(nome, cpf, email, cep, telefone);
      res
        .status(201)
        .json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
      // Se o erro for de 'UNIQUE constraint', mais amigavel
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },
};

module.exports = { clienteController };
