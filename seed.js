const { sequelize, Categoria, Produto } = require('./models');

async function seed() {
  try {
    await sequelize.sync({ force: true });
    console.log('Banco de dados sincronizado.');

    const catInformatica = await Categoria.create({ nome: 'Informática' });
    const catPerifericos = await Categoria.create({ nome: 'Periféricos' });
    const catCelulares = await Categoria.create({ nome: 'Celulares' });
    const catAudio = await Categoria.create({ nome: 'Áudio' });
    const catAcessorios = await Categoria.create({ nome: 'Acessórios' });

    await Produto.create({
      nome: 'Teclado Mecânico RGB',
      preco: 189.90,
      quantidade: 15,
      categoriaId: catPerifericos.id
    });

    await Produto.create({
      nome: 'Mouse Gamer 7200 DPI',
      preco: 99.50,
      quantidade: 25,
      categoriaId: catPerifericos.id
    });

    await Produto.create({
      nome: 'Monitor UltraWide 29"',
      preco: 1250.00,
      quantidade: 8,
      categoriaId: catInformatica.id
    });

    await Produto.create({
      nome: 'Headset Sem Fio Bluetooth',
      preco: 299.00,
      quantidade: 12,
      categoriaId: catAudio.id
    });

    await Produto.create({
      nome: 'Smartphone Galaxy 128GB',
      preco: 1899.00,
      quantidade: 10,
      categoriaId: catCelulares.id
    });

    await Produto.create({
      nome: 'Suporte Articulado para Monitor',
      preco: 149.90,
      quantidade: 20,
      categoriaId: catAcessorios.id
    });

    console.log('Seed executado com sucesso! Categorias e produtos de teste criados.');
    process.exit(0);
  } catch (err) {
    console.error('Erro ao executar o seed:', err);
    process.exit(1);
  }
}

seed();
