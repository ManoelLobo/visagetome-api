const express = require('express');
const requireDir = require('require-dir');
const authMiddleware = require('./middlewares/auth');

const routes = express.Router();

const controllers = requireDir('./controllers');

/**
 * Auth
 */
routes.post('/signup', controllers.authController.signup);
routes.post('/signin', controllers.authController.signin);

/**
 * ********************
 * Authenticated routes
 * ********************
 */
routes.use(authMiddleware);

routes.get('/testauth', (req, res) => res.send('auth!'));

module.exports = routes;
