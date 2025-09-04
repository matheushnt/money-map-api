import { randomUUID } from 'node:crypto';
import http from 'node:http';
import { json } from './middlewares/json.js';
import { Database } from './database.js';

const database = new Database();

const server = http.createServer(async (req, res) => {
  const { method, url } = req;

  await json(req, res);

  if (method === 'GET' && url === '/categorias') {
    const categoria = database.select('categorias');

    return res.end(JSON.stringify(categoria));
  }

  if (method === 'POST' && url === '/categorias') {
    const { nome } = req.body;

    const categoriaId = randomUUID();

    const categoria = {
      id: categoriaId,
      nome,
    };

    database.insert('categorias', categoria);

    return res.writeHead(201).end(JSON.stringify({ categoriaId }));
  }

  return res.writeHead(404).end();
});

server.listen(3333);
