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
const router = express.Router();
//declaration des routes en fonction des besoin
router.post('/inscription', client_controller.enregistrementNouveauClient);
router.post('/login',client_controller.clientsLogin);
router.get('/inscrit', client_controller.recupererEmailAndPseudoClient);


module.exports = router;