import express from "express";

import homeController from "../controllers/homeController";

let router = express.Router();

const initWebRoutes = (app: express.Application) => {
    router.get("/", (req: express.Request, res: express.Response) => {
        return res.render("index.ejs");
    });


    router.get('/home', homeController.getHomePage);
    router.get('/about', homeController.getAboutPage);
    router.get('/crud', homeController.getCRUD);
    router.post('/post-crud', homeController.postCRUD);
    router.get('/get-crud', homeController.getFindAllCRUD);
    router.get('/edit-crud', homeController.getEditCRUD);
    router.post('/put-crud', homeController.putCRUD);
    router.get('/delete-crud', homeController.deleteCRUD);

    return app.use("/", router);
};

export default initWebRoutes;