import * as http from "http";

const server = http.createServer(
  (req: http.IncomingMessage, res: http.ServerResponse) => {
    res.write(`<html>
  <head>
    <title>Node.js Apps + TS</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>Lorem fasfasd </p>
  </body>
  </html>`);

    res.end();
  }
);

const PORT = 5000;

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
