const { Router } = require('express');
const router = Router();
const course = require('./contact.routes');

module.exports = function (app) {
  app.use('/', router);
  router.use(course);
}

