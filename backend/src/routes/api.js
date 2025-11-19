import express from 'express';

import delay from '../middlewares/delay.js';
import auth from '../middlewares/auth.js';

import {createUser, handleLogin, getUser, getAccount} from '../controllers/UserController.js';

const routerAPI = express.Router();

routerAPI.use(auth);


routerAPI.get('/', (req, res) => {
    return res.status(200).json("Status: ok");
})

routerAPI.post('/register', createUser);
routerAPI.post('/login', handleLogin);

routerAPI.get('/user', getUser);
routerAPI.get('/account', delay, getAccount);

export default routerAPI;