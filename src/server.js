const experss = require('express');

const { Server, createServer } = require('http');

const CONFIG = require('./config')

const startServer = (app) => {
  const httpServer = createServer(app);

  return httpServer.listen({ port: CONFIG.APP.PORT }, () => {
    console.log(`Application Environment: ${CONFIG.APP.ENV}\n`);
    console.log(`Server ready at http://localhost:${CONFIG.APP.PORT}\n`);
  });
};

module.exports = {
    startServer
}
