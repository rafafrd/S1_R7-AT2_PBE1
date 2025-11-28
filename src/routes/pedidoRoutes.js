const express = require("express");
const { pedidoController } = require("../controllers/pedidoController");
const pedidoRoutes = express.Router();

pedidoRoutes.get("/pedidos", pedidoController.selecionaTodos);
pedidoRoutes.get("/pedidos/:id", pedidoController.VerPorId);
pedidoRoutes.post("/pedidos", pedidoController.criarPedido);

module.exports = { pedidoRoutes };
