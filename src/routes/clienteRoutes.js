const express = require("express");
const clientesRoutes = express.Router();
const { clienteController } = require("../controllers/clienteController");

clientesRoutes.post("/clientes", clienteController.insertDadosCliente);

module.exports = { clientesRoutes };
