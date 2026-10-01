const express = require('express');
const router = express.Router();
const { Produto, Categoria, Op } = require('../models');

// GET /produtos - Listar todos os produtos (com suporte a busca e filtro por categoria)
router.get('/', async (req, res, next) => {
  try {
    const { termo, categoriaId } = req.query;
    const where = {};

    if (termo && termo.trim() !== '') {
      where.nome = { [Op.like]: `%${termo.trim()}%` };
    }

    if (categoriaId && categoriaId !== '') {
      where.categoriaId = categoriaId;
    }

    const produtos = await Produto.findAll({
      where,
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['id', 'DESC']]
    });

    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    res.render('produtos/index', {
      produtos,
      categorias,
      termoBusca: termo || '',
      categoriaSelecionada: categoriaId ? Number(categoriaId) : null,
      categoriaAtual: null
    });
  } catch (error) {
    next(error);
  }
});

// GET /produtos/pesquisa - Desafio Extra: Pesquisa de produtos por nome
router.get('/pesquisa', async (req, res, next) => {
  try {
    const termo = (req.query.termo || req.query.q || '').trim();
    const where = {};

    if (termo !== '') {
      where.nome = { [Op.like]: `%${termo}%` };
    }

    const produtos = await Produto.findAll({
      where,
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['id', 'DESC']]
    });

    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    res.render('produtos/index', {
      produtos,
      categorias,
      termoBusca: termo,
      categoriaSelecionada: null,
      categoriaAtual: null
    });
  } catch (error) {
    next(error);
  }
});

// GET /produtos/categoria/:categoriaId - Desafio 2: Listar produtos por categoria
router.get('/categoria/:categoriaId', async (req, res, next) => {
  try {
    const categoriaId = req.params.categoriaId;
    const categoriaAtual = await Categoria.findByPk(categoriaId);

    if (!categoriaAtual) {
      return res.status(404).send('Categoria não encontrada.');
    }

    const produtos = await Produto.findAll({
      where: { categoriaId },
      include: [{ model: Categoria, as: 'categoria' }],
      order: [['id', 'DESC']]
    });

    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    res.render('produtos/index', {
      produtos,
      categorias,
      termoBusca: '',
      categoriaSelecionada: Number(categoriaId),
      categoriaAtual
    });
  } catch (error) {
    next(error);
  }
});

// GET /produtos/novo - Formulário de cadastro de novo produto
router.get('/novo', async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    res.render('produtos/novo', {
      categorias
    });
  } catch (error) {
    next(error);
  }
});

// POST /produtos - Salvar novo produto no banco de dados
router.post('/', async (req, res, next) => {
  try {
    const { nome, preco, quantidade, categoriaId } = req.body;

    await Produto.create({
      nome,
      preco: parseFloat(preco) || 0,
      quantidade: parseInt(quantidade, 10) || 0,
      categoriaId: categoriaId && categoriaId !== '' ? parseInt(categoriaId, 10) : null
    });

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

// GET /produtos/:id/editar - Formulário de edição de produto
router.get('/:id/editar', async (req, res, next) => {
  try {
    const produto = await Produto.findByPk(req.params.id, {
      include: [{ model: Categoria, as: 'categoria' }]
    });

    if (!produto) {
      return res.status(404).send('Produto não encontrado.');
    }

    const categorias = await Categoria.findAll({
      order: [['nome', 'ASC']]
    });

    res.render('produtos/editar', {
      produto,
      categorias
    });
  } catch (error) {
    next(error);
  }
});

// POST /produtos/:id - Atualizar dados do produto
router.post('/:id', async (req, res, next) => {
  try {
    const { nome, preco, quantidade, categoriaId } = req.body;

    await Produto.update({
      nome,
      preco: parseFloat(preco) || 0,
      quantidade: parseInt(quantidade, 10) || 0,
      categoriaId: categoriaId && categoriaId !== '' ? parseInt(categoriaId, 10) : null
    }, {
      where: {
        id: req.params.id
      }
    });

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

// POST /produtos/:id/deletar - Excluir produto
router.post('/:id/deletar', async (req, res, next) => {
  try {
    await Produto.destroy({
      where: {
        id: req.params.id
      }
    });

    res.redirect('/produtos');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
