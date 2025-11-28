const { clienteModel } = require("../models/clienteModel");

const clienteController = {
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
      const resultado = await clienteModel.selectAll();
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
   *
   * @param {*} req
   * @param {*} res
   * @returns
   */
  insertDadosCliente: async (req, res) => {
    try {
      const { nome, cpf, email, cep, telefone } = req.body;
      if (
        !nome ||
        !cpf ||
        isNaN(cpf) ||
        !email ||
        !cep ||
        isNaN(cep) ||
        !telefone ||
        isNaN(telefone)
      ) {
        return res.status(400).json({ message: telefone });
      }
      const clienteExistente = await clienteModel.selectByCpf(cpf);
      if (clienteExistente.length > 0) {
        // Retorna o status 409 (Conflict)
        return res
          .status(409)
          .json({ message: "Conflito: CPF já cadastrado." });
      }
      const resultado = await clienteModel.insertDadosCliente(
        nome,
        cpf,
        email,
        cep,
        telefone
      );
      res
        .status(201)
        .json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
      // Se o erro for de 'UNIQUE constraint', mais amigavel
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },

  /**
   * Exclui um cliente do banco de dados pelo ID.
   * Rota DELETE /clientes/:id_cliente
   * @async
   * @function deleteCliente
   * @param {Request} req Objeto da requisição (params: 'id_cliente').
   * @param {Response} res Objeto da resposta HTTP
   * @returns {Promise<Response>} Retorna um JSON com a mensagem de sucesso ou erro.
   */

  deleteCliente: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      // validação ID
      if (isNaN(id_cliente) || id_cliente <= 0) {
        return res
          .status(400)
          .json({ message: "ID do cliente inválido ou não fornecido." });
      }
      const clienteSelecionado = await clienteModel.selectById(id_cliente);
      if (clienteSelecionado.length === 0) {
        return res.status(404).json({ message: "Cliente Não localizado" });
      }
      const resultDelete = await clienteModel.delete(id_cliente);
      if (resultDelete.affectedRows === 1) {
        return res
          .status(200)
          .json({ message: "Cliente excluído com sucesso" });
      } else {
        res
          .status(500)
          .json({ message: "Ocorreu um erro ao excluir o o cliente." });
      }
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({ message: "Ocorreu um erro no servidor" });
    }
  },
};
module.exports = { clienteController };
