const express = require('express');
const routes = require('./routes');

const createApp = () => {
  const app = express();

  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json({ type: 'application/vnd.api+json' }));
  // API Routes
  routes(app);

  return app;
};

module.exports = {
  createApp,
};
