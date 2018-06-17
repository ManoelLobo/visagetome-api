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

/**
 * Posts
 */
routes.post('/posts', controllers.postController.create);
routes.delete('/posts/:id', controllers.postController.destroy);

/**
 * Friends
 */
routes.post('/users/:id/friend', controllers.friendController.create);
routes.delete('/users/:id/unfriend', controllers.friendController.destroy);

module.exports = routes;
