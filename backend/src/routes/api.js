import express from 'express';

import delay from '../middlewares/delay.js';
import auth from '../middlewares/auth.js';
import {validateLogin, validateRegister} from '../middlewares/validation.js';

import {createUser, handleLogin, getUser, getAccount} from '../controllers/UserController.js';
import {authorizeRole} from '../middlewares/role.js';
import * as prodCtrl from '../controllers/ProductController.js';

import * as orderCtrl from '../controllers/OrderController.js';

const routerAPI = express.Router();

routerAPI.use(auth);


routerAPI.get('/', (req, res) => {
    return res.status(200).json("Status: ok");
})

routerAPI.post('/register',validateRegister, createUser);
routerAPI.post('/login', validateLogin, handleLogin);

routerAPI.get('/user',getUser);
routerAPI.get('/account',  authorizeRole("Admin"), delay, getAccount);

routerAPI.post('/products/add', prodCtrl.addProduct);
routerAPI.get('/products', prodCtrl.getAllProductsPage);
routerAPI.get('/products/find', prodCtrl.searchProducts);
routerAPI.get('/products/search', prodCtrl.searchProductsFuzzy);

routerAPI.post("/favorites", auth, prodCtrl.addFavoriteCtrl);
routerAPI.delete("/favorites", auth, prodCtrl.removeFavoriteCtrl);
routerAPI.get("/favorites", auth, prodCtrl.listFavoritesCtrl);
routerAPI.post("/products/:productId/comments", auth, prodCtrl.addCommentCtrl);
routerAPI.get("/products/:productId/comments", prodCtrl.listCommentsCtrl);

routerAPI.get("/products/:productId/similar", prodCtrl.similarProductsCtrl);
routerAPI.get("/products/:productId/stats", prodCtrl.productStatsCtrl);

routerAPI.post('/orders/make', auth, orderCtrl.createOrderController)

export default routerAPI;