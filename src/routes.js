import { Database } from './database.js';
import { randomUUID } from 'node:crypto';
import { buildRoutePath } from './utils/build-route-path.js';

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/categorias'),
    handler: (req, res) => {
      const { search } = req.query;

      const categorias = database.select('categorias', search ? { nome: search } : null);

      return res.end(JSON.stringify({ categorias }));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/categorias'),
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
  {
    method: 'PUT',
    path: buildRoutePath('/categorias/:id'),
    handler: (req, res) => {
      database.update('categorias', req.params.id, req.body);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/categorias/:id'),
    handler: (req, res) => {
      database.delete('categorias', req.params.id);

      return res.writeHead(204).end();
    },
  },
];
