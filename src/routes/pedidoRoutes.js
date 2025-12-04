const express = require("express");
const { pedidoController } = require("../controllers/pedidoController");
const pedidoRoutes = express.Router();

pedidoRoutes.get("/pedidos", pedidoController.selecionaTodos);
pedidoRoutes.get("/pedidos/:id_pedido", pedidoController.VerPorId);
pedidoRoutes.post("/pedidos", pedidoController.criarPedido);
pedidoRoutes.delete("/pedidos/:id_pedido", pedidoController.deletePedido);

module.exports = { pedidoRoutes };
