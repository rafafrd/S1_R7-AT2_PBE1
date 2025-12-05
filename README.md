# 🚚 Rápido & Seguro Logística — Sistema de Cálculo de Entregas

Este projeto implementa um sistema **back-end completo** para a Rápido & Seguro Logística, focado no **cadastro de clientes**, **registro de pedidos** e **cálculo automatizado do valor final das entregas**, seguindo regras de negócio específicas.

O sistema foi construído em **arquitetura MVC (Model-View-Controller)** utilizando **Node.js**, **Express** e **MySQL**.

---
<div align="center">
  <h2>🚀 Tecnologias & Ferramentas</h2>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; justify-content: center;">
    <!-- 🗄️ Dados & Banco de Dados -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;">
      <h3>🗄️ Dados & Banco de Dados</h3>
      <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
      <img src="https://img.shields.io/badge/.ENV-ECD53F?logo=dotenv&logoColor=white&style=for-the-badge" />
      <img src="https://img.shields.io/badge/yaml-CB171E?logo=yaml&logoColor=white&style=for-the-badge" />
      <img src="https://img.shields.io/badge/json-000000?logo=json&logoColor=white&style=for-the-badge" />
      <img src="https://img.shields.io/badge/Microsoft_Excel-217346?logo=microsoft-excel&logoColor=white&style=for-the-badge" />
    </div>
    <!-- 🛠️ Back-end -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;">
      <h3>🛠️ Back-end</h3>
      <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
      <img src="https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white&style=for-the-badge" />
      <img src="https://img.shields.io/badge/express-000000?logo=express&logoColor=white&style=for-the-badge" />
    </div>
    <!-- 🧪 Testes, API & Documentação -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;">
      <h3>🧪 API, Testes & Documentação</h3>
      <img src="https://img.shields.io/badge/insomnia-4000BF?logo=insomnia&logoColor=white&style=for-the-badge" />
      <img src="https://img.shields.io/badge/Markdown-000000?logo=markdown&logoColor=white&style=for-the-badge" />
    </div>
    <!-- 📝 Produtividade -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;">
      <h3>📝 Produtividade & Organização</h3>
      <img src="https://img.shields.io/badge/trello-0052CC?style=for-the-badge&logo=trello&logoColor=white" />
      <img src="https://img.shields.io/badge/draw.io-F08705?logo=diagramsdotnet&logoColor=white&style=for-the-badge" />
    </div>
    <!-- 🛠️ Ferramentas de Desenvolvimento -->
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 8px;">
      <h3>🛠️ Dev Tools</h3>
      <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white" />
      <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" />
    </div>
  </div>
</div>
<br>


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
├── 🔐 .env
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
## 📝 Documentação, Testes e Organização

- **Testes:** execução via coleção Insomnia (`docs/insomnia.yaml`)  
- **JSDoc:** documentação completa de Controllers e Models  
- **Gestão do Projeto:**  
  O desenvolvimento foi organizado usando **Trello no modelo Kanban**, com:
  - Cartões por funcionalidade  
  - Checklists de tarefas técnicas  
  - Etapas: *A Fazer → Em Progresso → Revisão → Concluído*  
  - Maior controle do fluxo de desenvolvimento e divisão de responsabilidades  


#### Made with ❤️ by rafafrd and guimunizzz
