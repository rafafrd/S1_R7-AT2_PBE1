const { pool } = require("../config/db");
const { buscaCep } = require("../utils/buscaCep");

const clienteModel = {
  // Busca de todos os clientes;
  selectAll: async () => {
    const sql = "SELECT * FROM clientes;";
    const [rows] = await pool.query(sql);
    return rows;
  },
  insertDadosCliente: async (pIdCliente, pNomeCliente, pCpf, pEmail, pCep, pTelefone) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const dadosEndereco = await buscaCep(pCep)

      // tabela clientes
      const sqlClientes = "INSERT INTO clientes(nome, cpf, email) VALUES(?,?,?);";
      const valuesClientes = [pNomeCliente, pCpf, pEmail];
      const [rowsClientes] = await connection.query(sqlClientes, valuesClientes);

      // tabela telefones
      const sqlTelefones = "INSERT INTO telefones(telefone, id_cliente) VALUES(?,?);";
      const valuesTelefones = [pTelefone, pIdCliente]
      const [rowsTelefones] = await connection.query(sqlTelefones, valuesTelefones);

      // tabela enderecos
      const sqlEnderecos = "INSERT INTO enderecos(logradouro, numero, bairro, complemento, cidade, estado, cep) VALUES (?,?,?,?,?,?,?);";
      const valuesEnderecos = [pCep, dadosEndereco.logradouro, dadosEndereco.bairro, dadosEndereco.complemento, dadosEndereco.localidade, dadosEndereco.estado]
      const [rowsEnderecos] = await connection.query(sqlEnderecos, valuesEnderecos)

      connection.commit();
      return { rowsClientes, rowsTelefones, rowsEnderecos }
    } catch (error) {
      // caso algum insert de erro, ele da rollback e cancela tudo
      connection.rollback();
      throw error;
    }
  },
  selectByCpf: async (pCpf) => {
    const sql = "SELECT * FROM clientes WHERE cpf_cliente = ?;";
    const values = [pCpf];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
  selectByEmail: async (pEmail) => {
    const sql = "SELECT * FROM clientes WHERE email_cliente = ?;";
    const values = [pEmail];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
