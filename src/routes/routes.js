const express = require("express");
const router = express.Router();
const { clientesRoutes } = require("./clienteRoutes");
const { pedidoRoutes } = require("./pedidoRoutes");

// rotas
router.use("/", clientesRoutes);
router.use("/", pedidoRoutes);

module.exports = { router };
