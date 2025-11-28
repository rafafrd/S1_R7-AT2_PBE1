const { pool } = require("../config/db");
const { consultarCep } = require("../utils/buscaCep");

const clienteModel = {
  // Busca de todos os clientes;
  /**
   *
   * @returns
   * SELECT
   * c.id_cliente,
   * c.nome,
   * t.telefone,
   * e.logradouro,
   * e.numero,
   * e.cidade,
   * e.estado,
   * e.cep
   * FROM clientes c
   * JOIN enderecos e
   *   ON c.id_cliente = e.id_cliente
   * JOIN telefones t
   *   ON c.id_cliente = t.id_cliente;
   */
  selectAll: async () => {
    const sql =
      "SELECT c.id_cliente, c.nome, t.telefone, e.logradouro, e.numero, e.cidade, e.estado, e.cep FROM clientes c JOIN enderecos e  ON c.id_cliente = e.id_cliente JOIN telefones t ON c.id_cliente = t.id_cliente;";
    const [rows] = await pool.query(sql);
    return rows;
  },
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

      connection.commit();
      return { rowsClientes, rowsTelefones, rowsEnderecos };
    } catch (error) {
      // caso algum insert de erro, ele da rollback e cancela tudo
      connection.rollback();
      throw error;
    }
  },

  // Busca por ID
  selectById: async (pId_cliente) => {
    const sql = "SELECT * FROM clientes WHERE id_cliente = ?;";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  selectByCpf: async (pCpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf = ?;";
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  selectByEmail: async (pEmail) => {
    const sql = "SELECT * FROM clientes WHERE email = ?;";
    const values = [pEmail];
    const [rows] = await pool.query(sql, values);
    return rows;
  },

  delete: async (pId_cliente) => {
    const sql = "DELETE FROM clientes WHERE id_cliente=?";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
