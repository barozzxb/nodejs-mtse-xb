import "dotenv/config";
import express from 'express';
import cors from 'cors';
import routes from './routes/api.js';


import connection from './configs/database.js';

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.use('api/v1', routes);

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