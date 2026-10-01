const express = require('express');
const router = express.Router();
const { Categoria, Produto } = require('../models');

// GET /categorias - Listar todas as categorias
router.get('/', async (req, res, next) => {
  try {
    const categorias = await Categoria.findAll({
      include: [{ model: Produto, as: 'produtos' }],
      order: [['nome', 'ASC']]
    });

    res.render('categorias/index', {
      categorias
    });
  } catch (error) {
    next(error);
  }
});

// GET /categorias/nova - Formulário para nova categoria
router.get('/nova', (req, res) => {
  res.render('categorias/nova');
});

// POST /categorias - Criar nova categoria
router.post('/', async (req, res, next) => {
  try {
    const { nome } = req.body;
    if (nome && nome.trim() !== '') {
      await Categoria.create({ nome: nome.trim() });
    }
    res.redirect('/categorias');
  } catch (error) {
    next(error);
  }
});

// POST /categorias/:id/deletar - Excluir categoria
router.post('/:id/deletar', async (req, res, next) => {
  try {
    await Categoria.destroy({
      where: {
        id: req.params.id
      }
    });
    res.redirect('/categorias');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
