const express = require("express");
const { pedidoController } = require("../controllers/pedidoController");
const pedidoRoutes = express.Router();

// select
pedidoRoutes.get("/pedidos", pedidoController.selecionaTodos);
pedidoRoutes.get("/pedidos/:id_pedido", pedidoController.VerPorId);
// alteração
pedidoRoutes.post("/pedidos", pedidoController.criarPedido);
pedidoRoutes.delete("/pedidos/:id_pedido", pedidoController.deletePedido);
pedidoRoutes.put("/pedidos/:id_pedido", pedidoController.atualizarPedido);
module.exports = { pedidoRoutes };
