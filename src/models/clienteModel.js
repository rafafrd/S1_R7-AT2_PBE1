const { pool } = require("../config/db");

const clienteModel = {
  // Busca de todos os clientes;
  selectAll: async () => {
    const sql = "SELECT * FROM clientes;";
    const [rows] = await pool.query(sql);
    return rows;
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
  // insert: async (pNomeCliente, pCpf, pEmail_cliente) => {
  //   const sql = "INSERT INTO clientes(nome, cpf, email) VALUES(?,?,?);";
  //   const values = [pNomeCliente, pCpf, pEmail_cliente];
  //   const [rows] = await pool.query(sql, values);
  //   return rows;
  // },
  delete: async (pId_cliente) => {
    const sql = "DELETE FROM clientes WHERE id_cliente=?";
    const values = [pId_cliente];
    const [rows] = await pool.query(sql, values);
    return rows;
  },
};

module.exports = { clienteModel };
