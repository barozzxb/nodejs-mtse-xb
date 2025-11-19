import express from 'express';

import delay from '../middlewares/delay.js';
import auth from '../middlewares/auth.js';
import {validateLogin, validateRegister} from '../middlewares/validation.js';

import {createUser, handleLogin, getUser, getAccount} from '../controllers/UserController.js';
import {authorizeRole} from '../middlewares/role.js';

const routerAPI = express.Router();

routerAPI.use(auth);


routerAPI.get('/', (req, res) => {
    return res.status(200).json("Status: ok");
})

routerAPI.post('/register',validateRegister, createUser);
routerAPI.post('/login', validateLogin, handleLogin);

routerAPI.get('/user', authorizeRole("Admin"),getUser);
routerAPI.get('/account',  authorizeRole("Admin"), delay, getAccount);

export default routerAPI;