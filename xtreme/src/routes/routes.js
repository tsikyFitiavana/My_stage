/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */


const express = require('express');
const client_controller = require('../controller/Clients.controller');
const admin_controller =require('../controller/Admin.controller')
const router = express.Router();

const sessionMiddleware = function(req, res, next) {
    console.log('kobo eo oh'+ req.session.clientId)
    if (!req.session.clientId) {
        return next(new Error('Session non initialisée'));
    }
    next();
}


//declaration des routes en fonction des besoin
router.post('/inscription', client_controller.enregistrementNouveauClient);
router.post('/login',client_controller.clientsLogin);
router.post('/admin',admin_controller.adminLogin);//connexion de l'administration
router.get('/deconnecter', sessionMiddleware, client_controller.deconnexion);
router.get('/inscrit', client_controller.recupererEmailAndPseudoClient);
router.get('/clients', client_controller.listeClients);


module.exports = router;