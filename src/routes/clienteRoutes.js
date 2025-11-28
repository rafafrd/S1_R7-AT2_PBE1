const express = require("express");
const clientesRoutes = express.Router();
const { clienteController } = require("../controllers/clienteController");

clientesRoutes.get("/clientes", clienteController.selecionaTodos);
clientesRoutes.post("/clientes", clienteController.insertDadosCliente);
clientesRoutes.delete("/clientes/:id_cliente", clienteController.deleteCliente);

module.exports = { clientesRoutes };
