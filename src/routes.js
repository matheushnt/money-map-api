import { Database } from './database.js';
import { randomUUID } from 'node:crypto';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: '/categorias',
    handler: (req, res) => {
      const categorias = database.select('categorias');

      return res.end(JSON.stringify({ categorias }));
    },
  },
  {
    method: 'POST',
    path: '/categorias',
    handler: (req, res) => {
      const { nome } = req.body;

      const categoriaId = randomUUID();

      const categoria = {
        id: categoriaId,
        nome,
      };

      database.insert('categorias', categoria);

      return res.writeHead(201).end(JSON.stringify({ id: categoriaId }));
    },
  },
];
