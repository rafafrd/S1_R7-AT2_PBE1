// import do viacep
const axios = require('axios');

// valida o cep
function validarCep(pCep) {
    if (!pCep || typeof pCep !== 'string') return false;
    const somenteDigitos = pCep.replace(/\D/g, '');
    return /^\d{8}$/.test(somenteDigitos);
}

// normalizacao do cep
function normalizarCep(pCep) {
    return pCep.replace(/\D/g, '');
}

async function consultarCep(pCep) {
    const cepNormalizado = normalizarCep(String(pCep || ''));

    // valida o cep antes de chamar
    if (!validarCep(cepNormalizado)) {
        const erro = new Error('CEP inválido. Informe 8 dígitos (ex.: 01001000 ou 01001-000).');
        erro.code = 'CEP_INVALIDO';
        throw erro;
    }

    try {
        const url = `https://viacep.com.br/ws/${cepNormalizado}/json/`;
        const response = await axios.get(url, { timeout: 8000 });
        const data = response.data;

        // responde com { erro: true } quando o cep nao existe
        if (data && data.erro) {
            const erro = new Error('CEP não encontrado no ViaCEP. Verifique se o CEP está correto.');
            erro.code = 'CEP_NAO_ENCONTRADO';
            throw erro;
        }

        return data;
    } catch (error) {
        // passou do tempo limite
        if (error.code === 'ECONNABORTED') {
            const erro = new Error('Tempo de consulta excedido ao ViaCEP. Tente novamente mais tarde.');
            erro.code = 'TIMEOUT';
            throw erro;
        }

        // validacao dos status http
        if (error.response) {
            const status = error.response.status;
            let mensagem = 'Erro ao consultar ViaCEP.';
            let code = 'HTTP_ERROR';

            // validacao status 400
            if (status === 400) {
                mensagem = 'Requisição inválida ao ViaCEP (HTTP 400).';
                code = 'HTTP_400';
                // validacao status 404
            } else if (status === 404) {
                mensagem = 'Endpoint do ViaCEP não encontrado (HTTP 404).';
                code = 'HTTP_404';
                // validacao status 500 pra cima
            } else if (status >= 500) {
                mensagem = 'Serviço ViaCEP indisponível no momento (HTTP 5xx).';
                code = 'HTTP_5XX';
            }

            const erro = new Error(mensagem);
            erro.code = code;
            erro.status = status;
            throw erro;
        }

        // erros de comunicação com o viacep
        if (error.request && !error.response) {
            const erro = new Error('Falha de rede ao acessar ViaCEP. Verifique sua conexão.');
            erro.code = 'NETWORK_ERROR';
            throw erro;
        }

        // erro de cep nao encontrado ou invalido
        if (error.code && ['CEP_INVALIDO', 'CEP_NAO_ENCONTRADO'].includes(error.code)) {
            throw error; 
        }

        // erros gerais
        const erro = new Error('Erro desconhecido ao consultar CEP.');
        erro.code = 'UNKNOWN_ERROR';
        erro.causa = error.message;
        throw erro;
    }
}

module.exports = { consultarCep };