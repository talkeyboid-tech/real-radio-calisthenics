const { setupServer } = require('./server');
const { getHost, getPort } = require('./util/utils');

const HOST = getHost();
const PORT = getPort();
const server = setupServer(HOST, PORT);

server.listen(PORT, () => {
  console.log(`Server listening on: http://${HOST}:${PORT}`);
});
