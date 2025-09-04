import http from 'node:http';

const server = http.createServer((req, res) => {
  res.end('ok');
});

server.listen(3333);
