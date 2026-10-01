const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const { sequelize } = require('./models');

const indexRouter = require('./routes/index');
const produtosRouter = require('./routes/produtos');
const categoriasRouter = require('./routes/categorias');

const app = express();

// Sincroniza os Models com o banco de dados SQLite
sequelize.sync().then(() => {
  console.log('Banco de dados sincronizado com sucesso.');
}).catch((err) => {
  console.error('Erro ao sincronizar banco de dados:', err);
});

// Configuração do view engine (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas da aplicação
app.use('/', indexRouter);
app.use('/produtos', produtosRouter);
app.use('/categorias', categoriasRouter);

// Captura 404 e encaminha para o manipulador de erros
app.use(function(req, res, next) {
  next(createError(404));
});

// Manipulador de erros
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
