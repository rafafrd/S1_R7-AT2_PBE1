const { pool } = require("../config/db");
const { consultarCep } = require("../utils/buscaCep");

const clienteModel = {
  /**
   * Busca todos os clientes cadastrados com seus respectivos dados de endereço e telefone.
   * Utiliza JOINs para trazer os dados agregados.
   * * @async
   * @returns {Promise<Array<Object>>} Array contendo os registros encontrados.
   * @example
   * // Retorno esperado:
   * [
   * {
   * "id_cliente": 1,
   * "nome": "João Silva",
   * "telefone": "11999999999",
   * "logradouro": "Rua das Flores",
   * "numero": 123,
   * "cidade": "São Paulo",
   * "estado": "SP",
   * "cep": "01001000"
   * }
   * ]
   */
  selectAll: async () => {
    const sql =
      "SELECT c.id_cliente, c.nome, t.telefone, e.logradouro, e.numero, e.cidade, e.estado, e.cep FROM clientes c JOIN enderecos e ON c.id_cliente = e.id_cliente JOIN telefones t ON c.id_cliente = t.id_cliente;";
    const [rows] = await pool.query(sql);
    return rows;
  },

  /**
   * Insere um novo cliente, telefone e endereço no banco de dados.
   * Executa a operação dentro de uma transação (ACID) para garantir integridade.
   * * @async
   * @param {string} pNomeCliente - Nome completo do cliente.
   * @param {string} pCpf - CPF do cliente (apenas números).
   * @param {string} pEmail - Email do cliente.
   * @param {string} pCep - CEP do endereço.
   * @param {number|string} pNumero - Número do endereço.
   * @param {string} pTelefone - Telefone principal.
   * @param {Object} pDadosEndereco - Objeto retornado pela API de CEP contendo logradouro, bairro, cidade, etc.
   * @returns {Promise<Object>} Objeto contendo os resultados dos inserts (rowsClientes, rowsTelefones, rowsEnderecos).
   * @throws {Error} Lança erro caso a transação falhe, realizando rollback automático.
   * @example
   * // Retorno esperado (OkPacket do MySQL):
   * {
   * "rowsClientes": { "fieldCount": 0, "affectedRows": 1, "insertId": 10, "serverStatus": 2, "warningCount": 0, "message": "", "protocol41": true, "changedRows": 0 },
   * "rowsTelefones": { "fieldCount": 0, "affectedRows": 1, "insertId": 5, ... },
   * "rowsEnderecos": { "fieldCount": 0, "affectedRows": 1, "insertId": 8, ... }
   * }
   */
  insertDadosCliente: async (
    pNomeCliente,
    pCpf,
    pEmail,
    pCep,
    pNumero,
    pTelefone,
    pDadosEndereco
  ) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // tabela clientes
      const sqlClientes =
        "INSERT INTO clientes(nome, cpf, email) VALUES(?,?,?);";
      const valuesClientes = [pNomeCliente, pCpf, pEmail];
      const [rowsClientes] = await connection.query(
        sqlClientes,
        valuesClientes
      );

      const novoIdCliente = rowsClientes.insertId;

      // tabela telefones
      const sqlTelefones =
        "INSERT INTO telefones(telefone, id_cliente) VALUES(?,?);";
      const valuesTelefones = [pTelefone, novoIdCliente];
      const [rowsTelefones] = await connection.query(
        sqlTelefones,
        valuesTelefones
      );

      // tabela enderecos
      const sqlEnderecos =
        "INSERT INTO enderecos(logradouro, numero, bairro, complemento, cidade, estado, cep, id_cliente) VALUES (?,?,?,?,?,?,?,?);";
      const valuesEnderecos = [
        pDadosEndereco.logradouro,
        pNumero,
        pDadosEndereco.bairro,
        pDadosEndereco.complemento,
        pDadosEndereco.localidade,
        pDadosEndereco.estado,
        pCep,
        novoIdCliente,
      ];
      const [rowsEnderecos] = await connection.query(
        sqlEnderecos,
        valuesEnderecos
      );

      await connection.commit();
      return { rowsClientes, rowsTelefones, rowsEnderecos };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  /**
   * Busca um cliente específico pelo ID.
   * * @async
   * @param {number} pId_cliente - O ID do cliente.
   * @returns {Promise<Array<Object>>} Registro do cliente encontrado.
   * @example
   * // Retorno esperado:
   * [
   * { "id_cliente": 1, "nome": "João Silva", "cpf": "12345678901", "email": "joao@email.com" }
   * ]
   */
  selectById: async (pId_cliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?;";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Busca um cliente pelo CPF para verificação de duplicidade.
   * * @async
   * @param {string} pCpf - O CPF a ser consultado.
   * @returns {Promise<Array<Object>>} Registro encontrado ou array vazio.
   * @example
   * // Retorno se existir:
   * [ { "id_cliente": 1, "nome": "João", ... } ]
   * // Retorno se não existir:
   * []
   */
  selectByCpf: async (pCpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf = ?;";
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Busca um cliente pelo Email para verificação de duplicidade.
   * * @async
   * @param {string} pEmail - O email a ser consultado.
   * @returns {Promise<Array<Object>>} Registro encontrado ou array vazio.
   * @example
   * // Retorno se existir:
   * [ { "id_cliente": 1, "email": "teste@teste.com", ... } ]
   */
  selectByEmail: async (pEmail) => {
    const sql = "SELECT * FROM clientes WHERE email = ?;";
    const values = [pEmail];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  /**
   * Exclui um cliente do banco de dados.
   * Utiliza transação para garantir que a operação seja atômica e segura.
   * * @async
   * @param {number} pId_cliente - ID do cliente a ser excluído.
   * @returns {Promise<Object>} Resultado da operação de delete.
   * @throws {Error} Realiza rollback em caso de falha.
   * @example
   * // Retorno esperado:
   * { "fieldCount": 0, "affectedRows": 1, "insertId": 0, "serverStatus": 2, "warningCount": 0, "message": "", "protocol41": true, "changedRows": 0 }
   */
  delete: async (pId_cliente) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const sql = "DELETE FROM clientes WHERE id_cliente = ?";
      const values = [pId_cliente];
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

module.exports = { clienteModel };
