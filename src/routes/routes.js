const express = require("express");
const router = express.Router();
const { clientesRoutes } = require("./clienteRoutes");
const { pedidoRoutes } = require("./pedidoRoutes");
const { entregaRoutes } = require("./entregaRoutes");

// rotas
router.use("/", clientesRoutes);
router.use("/", pedidoRoutes);
router.use("/", entregaRoutes);

module.exports = { router };
