import express from 'express';

import delay from '../middlewares/delay.js';
import auth from '../middlewares/auth.js';
import {validateLogin, validateRegister} from '../middlewares/validation.js';

import {createUser, handleLogin, getUser, getAccount} from '../controllers/UserController.js';
import {authorizeRole} from '../middlewares/role.js';
import { addProduct, getAllProductsPage, searchProducts} from '../controllers/ProductController.js';

const routerAPI = express.Router();

routerAPI.use(auth);


routerAPI.get('/', (req, res) => {
    return res.status(200).json("Status: ok");
})

routerAPI.post('/register',validateRegister, createUser);
routerAPI.post('/login', validateLogin, handleLogin);

routerAPI.get('/user',getUser);
routerAPI.get('/account',  authorizeRole("Admin"), delay, getAccount);

routerAPI.post('/products/add', addProduct);
routerAPI.get('/products', getAllProductsPage);
routerAPI.get('/products/find', searchProducts);

export default routerAPI;