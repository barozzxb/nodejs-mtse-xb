import express from 'express';

let configureViewEngine = (app: express.Express) => {
    app.use(express.static('./src/public'));
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
};

export default configureViewEngine;
