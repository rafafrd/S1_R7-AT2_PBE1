const express = require("express");
const entregaRoutes = express.Router();
const { entregaController } = require("../controllers/entregaController");

entregaRoutes.get("/entregas", entregaController.selecionaTodos);
entregaRoutes.post("/entregas", entregaController.insertDadosEntrega);

module.exports = { entregaRoutes };