const express = require("express");
const { pedidoController } = require("../controllers/pedidoController");
const pedidoRoutes = express.Router();

pedidoRoutes.get("/pedidos", pedidoController.selecionaTodos);
pedidoRoutes.post("/pedido", pedidoController.criarPedido);

module.exports = { pedidoRoutes };
