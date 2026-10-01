const express = require('express');
const router = express.Router();

/* Redireciona a rota raiz para a listagem de produtos */
router.get('/', function(req, res, next) {
  res.redirect('/produtos');
});

module.exports = router;
