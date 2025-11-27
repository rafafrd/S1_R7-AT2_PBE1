const axios = require('axios');

async function consultarCepAxios(cep) {
    try {
        const url = `https://viacep.com.br/ws/${cep}/json/`;
        const response = await axios.get(url);

        const data = response.data;

        // Verificação específica do ViaCEP
        if (data.erro) {
            console.log('CEP inválido ou não encontrado.');
            return;
        }

        console.log(`Rua: ${data.logradouro}`);
        console.log(`Cidade: ${data.localidade}/${data.uf}`);

    } catch (error) {
        console.error('Erro na requisição:', error.message);
    }
}

consultarCepAxios('01001000');