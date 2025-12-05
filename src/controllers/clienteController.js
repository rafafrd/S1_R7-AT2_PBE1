const { clienteModel } = require("../models/clienteModel");
const { consultarCep } = require("../utils/buscaCep");

const clienteController = {
  /**
   * Busca e retorna todos os clientes cadastrados.
   * Rota GET /clientes
   * @async
   * @function selecionaTodos
   * @param {Request} req Objeto da requisição HTTP (não utiliza body ou params).
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna um JSON com a lista de clientes (200) ou uma mensagem de erro (500).
   * @example
   * // Requisição: GET /clientes
   * // Resposta 200 (Sucesso):
   * // {
   * //   "data": [
   * //     { "id": 1, "nome": "João Silva", "cpf": "123..." },
   * //     { "id": 2, "nome": "Maria Souza", "cpf": "456..." }
   * //   ]
   * // }
   * // Resposta 200 (Sem resultados):
   * // { "message": "A consulta não retornou resultados" }
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
  selecionaID: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      // validação ID
      if (isNaN(id_cliente) || id_cliente <= 0) {
        return res
          .status(400)
          .json({ message: "ID do cliente inválido ou não fornecido." });
      }
      const resultado = await clienteModel.selectById(id_cliente);
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
   * Insere um novo cliente junto com seus dados de endereço e telefone.
   * Rota POST /clientes
   * Realiza a consulta do CEP via Webservice (VIACEP) e verifica duplicidade de CPF.
   * @async
   * @function insertDadosCliente
   * @param {Request} req Objeto da requisição HTTP (body).
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna 201 em caso de sucesso, ou 400/409/500 em caso de erro.
   * @property {string} req.body.nome Nome completo do cliente.
   * @property {string} req.body.cpf CPF do cliente (não pode ser duplicado).
   * @property {string} req.body.email Email do cliente (não pode ser duplicado).
   * @property {string} req.body.telefone Telefone do cliente.
   * @property {string} req.body.cep CEP do endereço.
   * @property {number} req.body.numero Número do endereço.
   * @example
   * // Requisição: POST /clientes
   * // Body JSON:
   * // {
   * //   "nome": "Carlos Mendes",
   * //   "cpf": "11122233344",
   * //   "email": "carlos@exemplo.com",
   * //   "telefone": "19988887777",
   * //   "cep": "13013000",
   * //   "numero": 150
   * // }
   * // Resposta 201 (Sucesso):
   * // { "message": "Registro incluído com sucesso", "data": { ... } }
   * // Resposta 409 (Conflito):
   * // { "message": "Conflito: CPF já cadastrado." }
   */
  insertDadosCliente: async (req, res) => {
    try {
      const { nome, cpf, email, telefone, cep, numero } = req.body;
      if (
        !nome ||
        !cpf ||
        isNaN(cpf) ||
        !email ||
        !cep ||
        isNaN(cep) ||
        !telefone ||
        isNaN(telefone) ||
        !numero ||
        isNaN(numero)
      ) {
        return res
          .status(400)
          .json({ message: "Dados do cliente incompletos ou inválidos." });
      }

      const dadosEndereco = await consultarCep(cep);

      const clienteExistente = await clienteModel.selectByCpf(cpf);
      if (clienteExistente.length > 0) {
        // Retorna o status 409 (Conflict)
        return res
          .status(409)
          .json({ message: "Conflito: CPF já cadastrado." });
      }
      const emailExistente = await clienteModel.selectByEmail(email);
      if (emailExistente.length > 0) {
        // Retorna o status 409 (Conflict)
        return res
          .status(409)
          .json({ message: "Conflito: Email já cadastrado." });
      }
      const resultado = await clienteModel.insertDadosCliente(
        nome,
        cpf,
        email,
        cep,
        numero,
        telefone,
        dadosEndereco
      );
      res
        .status(201)
        .json({ message: "Registro incluído com sucesso", data: resultado });
    } catch (error) {
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
   * @param {Response} res Objeto da resposta HTTP.
   * @returns {Promise<Response>} Retorna um JSON com a mensagem de sucesso (200) ou erro (400/404/500).
   * @property {number} req.params.id_cliente O ID do cliente a ser excluído.
   * @example
   * // Requisição: DELETE /clientes/5
   * // Resposta 200 (Sucesso):
   * // { "message": "Cliente excluído com sucesso" }
   * // Resposta 404 (Não localizado):
   * // { "message": "Cliente Não localizado" }
   * // Resposta 400 (ID inválido):
   * // { "message": "ID do cliente inválido ou não fornecido." }
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
      const resultDelete = await clienteModel.deletaCliente(id_cliente);
      if (resultDelete.affectedRows !== 0) {
        return res
          .status(200)
          .json({ message: "Cliente excluído com sucesso" });
      } else {
        res
          .status(500)
          .json({ message: "Ocorreu um erro ao excluir o cliente." });
      }
    } catch (error) {
      console.error(`Erro ao executar: ${error}`);
      res.status(500).json({
        message: "Ocorreu um erro no servidor",
        errorMessage: error.message,
      });
    }
  },
  /**
   * Atualiza os dados de um cliente.
   * Valida se CPF, Email ou Telefone já pertencem a outro usuário.
   * Rota PUT /clientes/:id_cliente
   */
  updateCliente: async (req, res) => {
    try {
      const id_cliente = Number(req.params.id_cliente);
      const { nome, cpf, email, telefone, cep, numero } = req.body;

      // validacao
      if (isNaN(id_cliente) || id_cliente <= 0) {
        return res.status(400).json({ message: "ID do cliente inválido." });
      }
      if (!nome || !cpf || !email || !telefone || !cep || !numero) {
        return res
          .status(400)
          .json({ message: "Todos os campos são obrigatórios." });
      }

      let dadosEndereco;
      try {
        dadosEndereco = await consultarCep(cep);
      } catch (cepError) {
        return res
          .status(400)
          .json({ message: "CEP inválido ou não encontrado." });
      }

      //  atualiza
      const resultado = await clienteModel.updateCliente(
        id_cliente,
        nome,
        cpf,
        email,
        telefone,
        dadosEndereco,
        numero,
        cep
      );

      res.status(200).json({
        message: "Cliente atualizado com sucesso",
        data: resultado,
      });
    } catch (error) {
      console.error(`Erro ao atualizar: ${error}`);
      res
        .status(500)
        .json({ message: "Ocorreu um erro no servidor", error: error.message });
    }
  },
};
module.exports = { clienteController };
