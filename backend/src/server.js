import "dotenv/config";
import express from 'express';
import configViewEngine from "./configs/viewEngine.js";
import cors from 'cors';
import routerAPI from './routes/api.js';
import { getHomePage } from "./controllers/HomeController.js";

import connection from './configs/database.js';

import { apiLimit } from './middlewares/rateLimit.js';

const port = process.env.PORT || 8900;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api/v1', apiLimit)

configViewEngine(app);

const webAPI = express.Router();
webAPI.get("/", getHomePage);

app.use('/api/v1/', routerAPI);

(async () => {
    try{
        await connection();
        app.listen(port, () => {
            console.log("Listening on port " + port);
            
        })
    } catch (error) {
        console.log("Error connecting to database", error);
    }
})();