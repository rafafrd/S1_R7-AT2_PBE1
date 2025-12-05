# 🚚 Rápido & Seguro Logística — Sistema de Cálculo de Entregas

Este projeto implementa um sistema **back-end completo** para a Rápido & Seguro Logística, focado no **cadastro de clientes**, **registro de pedidos** e **cálculo automatizado do valor final das entregas**, seguindo regras de negócio específicas.

O sistema foi construído em **arquitetura MVC (Model-View-Controller)** utilizando **Node.js**, **Express** e **MySQL**.

---

## 💡 Tecnologias Utilizadas

- **Linguagem:** Node.js  
- **Framework Web:** Express  
- **Banco de Dados:** MySQL  
- **Conexão DB:** mysql2 (com Pool)  
- **Variáveis de Ambiente:** dotenv  
- **Requisições Externas (ViaCEP):** axios  
- **Documentação de Código:** JSDoc  

---

## 🏗️ Arquitetura e Estrutura do Projeto

O projeto segue o padrão **MVC**, garantindo separação clara de responsabilidades.

```
├── 📁 docs
│ └── 📄 script.sql
│ └── 📄 insomnia.yaml
├── 📁 src
│ ├── 📁 config
│ │ └── 📄 db.js
│ ├── 📁 controllers
│ │ ├── 📄 clienteController.js
│ │ ├── 📄 entregaController.js
│ │ └── 📄 pedidoController.js
│ ├── 📁 models
│ │ ├── 📄 clienteModel.js
│ │ ├── 📄 entregaModel.js
│ │ └── 📄 pedidoModel.js
│ ├── 📁 routes
│ │ ├── 📄 clienteRoutes.js
│ │ ├── 📄 entregaRoutes.js
│ │ ├── 📄 pedidoRoutes.js
│ │ └── 📄 routes.js
│ ├── 📁 utils
│ │ └── 📄 buscaCep.js
│ └── 📁 views
├── ⚙️ .gitignore
├── ⚙️ package.json
└── 📄 server.js
```

---

## 🗃️ Modelo de Dados (7 Tabelas)

O banco segue a **3ª Forma Normal (3FN)** para evitar redundâncias e garantir integridade.

**Tabelas principais:**  
`clientes`, `telefones`, `enderecos`, `pedidos`, `entregas`, `tipo_entrega`, `status_entrega`.

---

## 🚀 Endpoints da API

### 👤 **Clientes**

| Método | Rota            | Descrição |
|--------|------------------|-----------|
| POST   | /clientes        | Cadastra cliente, telefones e endereços (ViaCEP automático). |
| GET    | /clientes        | Lista todos os clientes. |
| GET    | /clientes/:id    | Retorna dados detalhados do cliente. |
| DELETE | /clientes/:id    | Remove cliente e dados vinculados. |

---

### 📦 **Pedidos (Com Cálculo Automático)**

| Método | Rota           | Descrição |
|--------|----------------|-----------|
| POST   | /pedidos       | Registra pedido e calcula o valor da entrega. |
| GET    | /pedidos       | Lista pedidos (aceita `?id_cliente=X`). |
| GET    | /pedidos/:id   | Retorna detalhes do pedido. |
| PUT    | /pedidos/:id   | Atualiza dados e recalcula o frete. |
| DELETE | /pedidos/:id   | Remove pedido e entrega associada. |

---

### 🚚 **Entregas**

| Método | Rota                   | Descrição |
|--------|-------------------------|-----------|
| GET    | /entregas              | Lista todas as entregas. |
| PUT    | /entregas/:id/status   | Atualiza o status da entrega. |

---

## 📐 Regras de Negócio (Cálculo Automático)

A precificação é executada no back-end a cada **POST** ou **PUT** em `/pedidos`.

### Fórmulas e Regras:

- **Valor Base:**  
  `(Distância km * Valor/km) + (Peso kg * Valor/kg)`

- **Acréscimo de Urgência:**  
  +20% se o tipo for **urgente**

- **Taxa Extra de Peso:**  
  + R$ 15,00 se peso > 50 kg

- **Desconto por valor alto:**  
  –10% se total > R$ 500,00

- **Persistência:**  
  Tudo é salvo na tabela `entregas` vinculada ao pedido.

---

## 📝 Documentação e Testes

- **Testes:** coleção Insomnia disponível em `docs/`  
- **JSDoc:** todos os Controllers e Models documentados com tipos, parâmetros e exemplos.



#### Made with ❤️ by rafafrd and guimunizzz
