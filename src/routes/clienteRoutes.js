const express = require("express");
const clientesRoutes = express.Router();
const { clienteController } = require("../controllers/clienteController");

clientesRoutes.get("/clientes", clienteController.selecionaTodos);
clientesRoutes.post("/clientes", clienteController.inserirCliente);

module.exports = { clientesRoutes };
