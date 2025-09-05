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

      const categoryId = randomUUID();

      const category = {
        id: categoryId,
        nome,
      };

      database.insert('categorias', category);

      return res.writeHead(201).end(JSON.stringify({ id: categoryId }));
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
  {
    method: 'GET',
    path: buildRoutePath('/lancamentos'),
    handler: (req, res) => {
      const { tipo } = req.query;

      const releases = database.select('lancamentos', tipo ? { tipo } : null);

      return res.end(JSON.stringify({ releases }));
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/lancamentos'),
    handler: (req, res) => {
      const { tipo, valor, data, categoriaId } = req.body;

      const categories = database.select('categorias');

      console.log(categories);

      const categoryExists = categories.find((row) => row.id === categoriaId);

      if (!categoryExists) {
        return res.writeHead(404).end(JSON.stringify({ message: 'Category not found.' }));
      }

      const releaseId = randomUUID();

      const release = {
        id: releaseId,
        tipo,
        valor,
        data,
        categoriaId,
      };

      database.insert('lancamentos', release);

      return res.writeHead(201).end(JSON.stringify({ id: releaseId }));
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/lancamentos/:id'),
    handler: (req, res) => {
      database.update('lancamentos', req.params.id, req.body);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/lancamentos/:id'),
    handler: (req, res) => {
      database.delete('lancamentos', req.params.id);

      return res.writeHead(204).end();
    },
  },
  {
    method: 'GET',
    path: buildRoutePath('/saldo'),
    handler: (req, res) => {
      const releases = database.select('lancamentos');

      const totalRevenues = releases
        .filter((release) => release.tipo === 'receita')
        .reduce((total, revenue) => {
          return total + revenue.valor;
        }, 0);

      const totalExpenses = releases
        .filter((release) => release.tipo === 'despesa')
        .reduce((total, expense) => {
          return total + expense.valor;
        }, 0);

      const saldo = totalRevenues - totalExpenses;

      return res.end(
        JSON.stringify({ totalReceitas: totalRevenues, totalDespesas: totalExpenses, saldo }),
      );
    },
  },
];
