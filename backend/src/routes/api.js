import express from 'express';

import delay from '../middlewares/delay.js';
import auth from '../middlewares/auth.js';

import UserController from '../controllers/UserController.js';

const routes = express.Router();

routes.use(auth);


routes.get('/', (req, res) => {
    return res.status(200).json("Status: ok");
})

routes.post('/register', UserController.createUser);
routes.post('/login', UserController.handleLogin);

routes.get('/user', UserController.getUser);
routes.get('/account', delay, UserController.getAccount);

export default routes;