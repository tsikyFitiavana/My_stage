/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */

const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload')
const routes = require('./routes/routes'); //importation des routes dans le fichier routes.js
const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({
    createParentPath: true
}));


app.use('/', routes);

app.listen(port, () => {console.log('Serveur bien lancer sur le port', port)});