# 🚚 Rápido & Seguro Logística - Sistema de Cálculo de Entregas

Este projeto implementa um sistema back-end completo para a Rápido & Seguro Logística, focado no **cadastro de clientes**, **registro de pedidos** e **cálculo automatizado do valor final das entregas**, seguindo regras de negócio específicas.

O sistema foi construído em arquitetura **MVC** (Model-View-Controller) utilizando Node.js, Express e MySQL.

-----

## 💡 Tecnologias Utilizadas

  * **Linguagem:** Node.js
  * **Framework Web:** Express
  * **Banco de Dados:** MySQL
  * **Conexão DB:** `mysql2`
  * **Variáveis de Ambiente:** `dotenv`
  * **Requisições Externas (ViaCEP):** `axios`
  * **Documentação Código:** JSDOC

-----

## 🏗️ Arquitetura e Estrutura do Projeto

O projeto segue a arquitetura **Model-View-Controller (MVC)**, com foco na separação de responsabilidades.

```
├── 📁 docs
│   └── 📄 script.sql
├── 📁 src
│   ├── 📁 config
│   │   └── 📄 db.js
│   ├── 📁 controllers
│   │   ├── 📄 clienteController.js
│   │   └── 📄 pedidoController.js
│   ├── 📁 models
│   │   ├── 📄 clienteModel.js
│   │   └── 📄 pedidoModel.js
│   ├── 📁 routes
│   │   ├── 📄 clienteRoutes.js
│   │   ├── 📄 pedidoRoutes.js
│   │   └── 📄 routes.js
│   ├── 📁 utils
│   │   └── 📄 buscaCep.js
│   └── 📁 views
├── ⚙️ .gitignore
├── ⚙️ package.json
└── 📄 server.js
```

---

## 🗃️ Modelo de Dados (7 Tabelas)

O banco de dados foi modelado seguindo a **Terceira Forma Normal (3FN)** para evitar redundância e garantir a integridade.

---

## 🚀 Endpoints da API

| Funcionalidade | Método | Rota | Descrição |
| :--- | :--- | :--- | :--- |
| **Clientes** | `POST` | `/clientes` | Cadastra cliente, telefones e endereços (integrando com ViaCEP). |
| **Clientes** | `GET` | `/clientes/:id` | Retorna dados do cliente, telefones e endereços. |
| **Pedidos** | `POST` | `/pedidos` | Registra novo pedido e dispara o **cálculo automático** do frete. |
| **Pedidos** | `GET` | `/pedidos/:id` | Retorna detalhes do pedido e o resultado do cálculo. |

-----

## 📐 Regras de Negócio (Cálculo Automático)

A rota `POST /pedidos` executa automaticamente a seguinte lógica:

1.  **Valor Base:** Soma (Distância \* Valor/km) + (Peso \* Valor/kg).
2.  **Acréscimo Urgente:** +20% sobre o Valor Base se o Tipo de Entrega for "urgente".
3.  **Valor Final Intermediário:** Valor Base + Acréscimo.
4.  **Desconto:** -10% se o Valor Final Intermediário for **superior a R$ 500,00**.
5.  **Taxa Extra:** +R$ 15,00 se o Peso da Carga for **superior a 50 kg**.
6.  O resultado final é registrado na tabela `Calculos_Entregas`.

-----

## 📝 Documentação e Testes

  * **Testes:** Todas as rotas podem ser testadas através da coleção **Insomnia** localizada em `docs/insomnia_tests.json`.
  * **Documentação de Código:** Todas as funções nos **Controllers** e **Models** estão documentadas com **JSDOC**, detalhando parâmetros, retornos e responsabilidades.
