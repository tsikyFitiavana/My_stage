/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const passwordGenerator = require('password-generator');
const session = require('express-session');
const routes = require('./routes/routes'); //importation des routes dans le fichier routes.js
const app = express();
const port = 8080;
const sessionSecret = passwordGenerator(64, false);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use(
    session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(fileUpload({
    createParentPath: true
}));


app.use('/', routes);

app.listen(port, () => {console.log('Serveur bien lancer sur le port', port)});