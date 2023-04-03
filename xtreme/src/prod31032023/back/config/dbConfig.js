/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */


const mysql = require('mysql');

//connexion a la base de donnée mysql en local

const connexion = mysql.createConnection({
    host: 'localhost', //a remplace par <--le vrai host--> de la base de données
    user: 'root', //a remplace par <--le vrai user--> de la base de données
    password:'', //a remplace par <--le vrai mot de passe--> de la base de données
    database:'xtreme_tournoi' //a remplace par <--le vrai nom--> de la base de données
});

//gestion erreur de connexion a la base de données
connexion.connect((error)=>{
    if (error) throw error;
    console.log('vous êtes bien connecter a votre base');
});

//exportation du module connexion
module.exports = connexion;