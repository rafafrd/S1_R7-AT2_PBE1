const express = require("express");
const app = express();
const PORT = 8000;

const { router } = require("./src/routes/routes");

//middleware
app.use(express.json());
app.use("/", router); // pega as rotas do routes.js

app.listen(PORT, () => {
  console.log(`Servidor respondendo em http://localhost:${PORT}`);
});
