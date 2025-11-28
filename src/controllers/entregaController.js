const { entregaModel } = require("../models/entregaModel");


const entregaController = {

    selecionaTodos: async (req, res) => {
        try {
            const resultado = await entregaModel.selectAllEntrega();
            if (resultado.length === 0) {
                return res
                    .status(200)
                    .json({ message: "A consulta não retornou resultados" });
            }
            res.status(200).json({ data: resultado });
        } catch (error) {
            console.error(`Erro ao executar: ${error}`);
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    },

    insertDadosEntrega: async (req, res) => {
        try {
            const { id_pedido, tipo_entrega, status_entrega, distancia, valor_distancia, valor_peso } = req.body;
            if (!id_pedido || isNaN(id_pedido) || !tipo_entrega || !isNaN(tipo_entrega) || !status_entrega || !isNaN(status_entrega) || !distancia || isNaN(distancia) || !valor_distancia || isNaN(valor_distancia || !valor_peso || isNaN(valor_peso))) {
                return res.status(400).json({
                    message: "Dados digitados incorretamente, tente novamente!"
                })
            }
            const resultado = await entregaModel.insertDadosEntrega(id_pedido, tipo_entrega, status_entrega, distancia, valor_distancia, valor_peso)
            res.status(200).json({
                message: "Registro incluído com sucesso", data: resultado
            })
        } catch (error) {
            console.error(`Erro ao executar: ${error}`);
            res.status(500).json({ message: "Ocorreu um erro no servidor" });
        }
    },
}

module.exports = { entregaController };