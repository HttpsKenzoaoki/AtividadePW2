const http = require('http');
const app = require('./app');

const server = http.createServer(app);

function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port: port,
      path: path,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
}

async function runTests() {
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  console.log(`Servidor de teste rodando na porta ${port}`);

  try {
    // 1. GET /
    let res = await request('/');
    console.log('1. GET / -> Status:', res.statusCode, '(Redirecionamento para /produtos esperado: 302)');
    if (res.statusCode !== 302 || res.headers.location !== '/produtos') {
      throw new Error('Falha no redirecionamento da rota /');
    }

    // 2. GET /produtos
    res = await request('/produtos');
    console.log('2. GET /produtos -> Status:', res.statusCode);
    if (res.statusCode !== 200 || !res.body.includes('Lista de Produtos')) {
      throw new Error('Falha ao renderizar /produtos');
    }

    // 3. GET /produtos/novo
    res = await request('/produtos/novo');
    console.log('3. GET /produtos/novo -> Status:', res.statusCode);
    if (res.statusCode !== 200 || !res.body.includes('Novo Produto')) {
      throw new Error('Falha ao renderizar formulário novo produto');
    }

    // 4. POST /produtos (Criar produto)
    const postData = 'nome=Webcam+Full+HD&preco=250.00&quantidade=10&categoriaId=1';
    res = await request('/produtos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      body: postData
    });
    console.log('4. POST /produtos -> Status:', res.statusCode, 'Location:', res.headers.location);
    if (res.statusCode !== 302) {
      throw new Error('Falha ao criar produto');
    }

    // 5. GET /produtos/pesquisa?termo=Webcam (Desafio Extra)
    res = await request('/produtos/pesquisa?termo=Webcam');
    console.log('5. GET /produtos/pesquisa?termo=Webcam -> Status:', res.statusCode);
    if (res.statusCode !== 200 || !res.body.includes('Webcam Full HD')) {
      throw new Error('Falha na pesquisa de produtos');
    }

    // 6. GET /produtos/categoria/1 (Desafio 2)
    res = await request('/produtos/categoria/1');
    console.log('6. GET /produtos/categoria/1 -> Status:', res.statusCode);
    if (res.statusCode !== 200 || !res.body.includes('Informática')) {
      throw new Error('Falha ao listar produtos por categoria');
    }

    // 7. GET /categorias
    res = await request('/categorias');
    console.log('7. GET /categorias -> Status:', res.statusCode);
    if (res.statusCode !== 200 || !res.body.includes('Categorias')) {
      throw new Error('Falha ao listar categorias');
    }

    // 8. POST /categorias (Criar categoria)
    const catPostData = 'nome=Games';
    res = await request('/categorias', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(catPostData)
      },
      body: catPostData
    });
    console.log('8. POST /categorias -> Status:', res.statusCode, 'Location:', res.headers.location);
    if (res.statusCode !== 302) {
      throw new Error('Falha ao criar categoria');
    }

    console.log('\n--- TODOS OS TESTES PASSARAM COM SUCESSO! ---');
  } catch (err) {
    console.error('Erro nos testes:', err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
}

runTests();
