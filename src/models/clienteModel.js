const { pool } = require("../config/db");

const clienteModel = {
  insert: async (pNomeCliente, pCpf, pEmail_cliente, pCep) => {
    const sql = "INSERT INTO clientes(nome, cpf, email) VALUES(?,?,?,?);";
    const values = [pNomeCliente, pCpf, pEmail_cliente, pCep];
    const [rows] = await pool.query(sql, values);
    return rows;
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
