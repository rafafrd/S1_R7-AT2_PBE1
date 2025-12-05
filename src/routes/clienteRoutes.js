const express = require("express");
const clientesRoutes = express.Router();
const { clienteController } = require("../controllers/clienteController");
// select
clientesRoutes.get("/clientes", clienteController.selecionaTodos);
// alter
clientesRoutes.post("/clientes", clienteController.insertDadosCliente);
clientesRoutes.delete("/clientes/:id_cliente", clienteController.deleteCliente);
clientesRoutes.put("/clientes/:id_cliente", clienteController.updateCliente);

module.exports = { clientesRoutes };
