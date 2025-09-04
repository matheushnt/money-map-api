import { randomUUID } from 'node:crypto';
import http from 'node:http';

const server = http.createServer((req, res) => {
  const { method, url } = req;

  if (method === 'GET' && url === '/categorias') {
    const categoria = {
      id: randomUUID(),
      nome: 'investimenos',
    };

    return res.setHeader('Content-Type', 'application/json').end(JSON.stringify(categoria));
  }

  return res.writeHead(404).end();
});

server.listen(3333);
