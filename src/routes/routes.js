const express = require("express");
const router = express.Router();
const { clientesRoutes } = require("./clienteRoutes");

// rotas
router.use("/", clientesRoutes);

module.exports = { router };
