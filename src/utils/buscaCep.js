// src/utils/consultaCep.js
const axios = require('axios');

async function consultarCepAxios(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.erro) {
            throw new Error('CEP não encontrado no ViaCEP.');
        }

        return data;

    } catch (error) {
        throw error;
    }
}

module.exports = { consultarCepAxios };