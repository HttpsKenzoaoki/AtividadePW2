# Cadastro de Produtos — MVC

Aplicação web desenvolvida com a arquitetura **MVC (Model-View-Controller)** para gerenciamento completo de catálogo de produtos e categorias em uma loja virtual, utilizando Node.js, Express, EJS, Sequelize e banco de dados SQLite.

---

## Integrante

- **Nome:** Wiliam Kenzo Aoki Da Silva
- **RM:** 20240228

---

## Como executar

### 1. Pré-requisitos
- Node.js (versão 18+ recomendada)
- npm instalado

### 2. Instalação das dependências
Clone o repositório e, dentro da pasta do projeto, execute:

```bash
npm install
```

### 3. Popular o banco de dados (Opcional / Recomendado)
Para carregar dados de demonstração (categorias de Informática, Periféricos, Áudio, Celulares e Acessórios, com produtos vinculados):

```bash
npm run seed
```

### 4. Executar a aplicação
Para iniciar o servidor:

```bash
npm start
```

Acesse em seu navegador:
```
http://localhost:3000
```
*(A rota raiz `/` redireciona automaticamente para `/produtos`).*

---

## Funcionalidades

- **Cadastro de produtos:** Permite cadastrar nome, preço, quantidade em estoque e associar a uma categoria existente.
- **Listagem de produtos:** Visualização tabular de todos os produtos com seu código ID, nome, categoria com badge visual, preço e estoque.
- **Edição de produtos:** Formulário para alteração de qualquer dado do produto, mantendo a categoria previamente selecionada.
- **Exclusão de produtos:** Exclusão rápida e segura com confirmação prévia no cliente.
- **Cadastro e gerenciamento de categorias:** Listagem de categorias com contador de produtos associados, formulário para criação de novas categorias e opção de exclusão.
- **Produtos por categoria (Filtro):** Filtragem dinâmica de produtos ao clicar em uma categoria ou acessar a rota dedicada `/produtos/categoria/:categoriaId`.
- **Pesquisa de produtos por nome:** Barra de busca que realiza busca parcial no banco de dados utilizando `Op.like`.

---

## Desafios

### Desafio 1 — Categorias e Relacionamento com Produtos
- **O que foi feito:**
  - Foi criado o Model `Categoria` com o campo `nome` (além do `id` padrão).
  - No Sequelize, foi configurada uma associação de 1 para N (1:N):
    - `Categoria.hasMany(Produto, { foreignKey: 'categoriaId', as: 'produtos', onDelete: 'SET NULL' });`
    - `Produto.belongsTo(Categoria, { foreignKey: 'categoriaId', as: 'categoria' });`
  - Criada rota e telas para gerenciamento das categorias (`/categorias` e `/categorias/nova`).
  - No cadastro e edição de produtos, o formulário inclui um campo `<select name="categoriaId">` alimentado dinamicamente com as categorias do banco.
  - Na listagem de produtos, as categorias são exibidas em badges coloridos obtidos via `include: [{ model: Categoria, as: 'categoria' }]`.

### Desafio 2 — Listando Produtos por Categoria
- **O que foi feito:**
  - Foi implementada a rota dedicada `GET /produtos/categoria/:categoriaId`.
  - A rota valida se a categoria informada existe e realiza uma busca com filtro via Sequelize:
    ```javascript
    const produtos = await Produto.findAll({
      where: { categoriaId: req.params.categoriaId },
      include: [{ model: Categoria, as: 'categoria' }]
    });
    ```
  - A interface renderiza os produtos filtrados exibindo um cabeçalho indicativo ("Produtos da Categoria: [Nome]") e badges clicáveis para alternar rapidamente entre categorias.

### Desafio Extra — Pesquisa de Produtos
- **O que foi feito:**
  - Foi adicionada uma barra de busca no topo da página de produtos e a rota `GET /produtos/pesquisa` (além de compatibilidade com query param `?termo=...`).
  - A consulta utiliza o operador `Op.like` do Sequelize para encontrar produtos cujo nome contenha o termo informado:
    ```javascript
    const { Op } = require('sequelize');

    const produtos = await Produto.findAll({
      where: {
        nome: { [Op.like]: `%${termo}%` }
      },
      include: [{ model: Categoria, as: 'categoria' }]
    });
    ```
  - Caso nenhum produto seja encontrado, uma tela com estado vazio (*empty state*) amigável é apresentada com botão para limpar a busca.

---

## Estrutura do Projeto

```
AtividadePW2/
│
├── app.js                    # Configuração principal do Express e middlewares
├── package.json              # Dependências e scripts do projeto
├── database.sqlite           # Banco de dados SQLite persistente
├── seed.js                   # Script para população inicial dos dados
├── test_routes.js            # Script automatizado de testes de rotas
│
├── models/
│   └── index.js              # Definição e associações dos Models (Produto e Categoria)
│
├── routes/
│   ├── index.js              # Redirecionamento da raiz
│   ├── produtos.js           # CRUD, busca e filtro por categoria de produtos
│   └── categorias.js         # CRUD de categorias
│
├── views/
│   ├── error.ejs             # Página de erro
│   ├── produtos/
│   │   ├── index.ejs         # Listagem de produtos, pesquisa e filtros
│   │   ├── novo.ejs          # Formulário de criação de produto
│   │   └── editar.ejs        # Formulário de edição de produto
│   └── categorias/
│       ├── index.ejs         # Listagem e contagem de categorias
│       └── nova.ejs          # Formulário de cadastro de categoria
│
└── public/
    └── stylesheets/
        └── style.css         # Estilização visual limpa e responsiva
```

---

## Tecnologias Utilizadas

- **Node.js**: Plataforma de execução JavaScript no servidor.
- **Express**: Framework web e gerenciamento de rotas.
- **EJS**: Engine de renderização de views dinâmicas.
- **Sequelize**: ORM para mapeamento objeto-relacional.
- **SQLite3**: Banco de dados relacional baseado em arquivo local.