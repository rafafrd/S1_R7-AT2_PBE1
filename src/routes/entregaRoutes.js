const express = require("express");
const entregaRoutes = express.Router();
const { entregaController } = require("../controllers/entregaController");

entregaRoutes.get("/entregas", entregaController.selecionaTodos);
entregaRoutes.patch("/entregas/:id", entregaController.atualizarStatus);

module.exports = { entregaRoutes };
