/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */

const connexion = require('../config/dbConfig');

//constructeur pour clients
const Clients = function(client){
    this.id_rang = client.id_rang;
    this.nom_client = client.nom_client;
    this.prenom_client = client.prenom_client;
    this.pseudo_client = client.pseudo_client;
    this.email_client = client.email_client;
    this.mot_de_passe_client = client.mot_de_passe_client;
    this.point_client = client.point_client;
    this.date_de_creation = client.date_de_creation;
    this.date_de_validation = client.date_de_validation;
    this.date_de_modification = client.date_de_modification;
    this.code_de_modification = client.code_de_modification;
    this.photo_profil = client.photo_profil;
};


//methode pour enregistrer un client
Clients.enregistrerClient = (nouveau_client, resultat)=>{
    connexion.query('insert into clients set ?',nouveau_client,(erreur, response)=>{
        if (erreur) 
        {  
            // console.log("erreur d'enregistrement client", erreur);
            resultat(null, erreur);        
        }
        else
        {
            // console.log("client bien creer", response.insertId);
            resultat(null, response.insertId);
        }
    });
};

//login modele
Clients.login = (resultat)=>{
    connexion.query('select pseudo_client, email_client, mot_de_passe_client from clients',(erreur, response)=>{
        if(erreur) {
            resultat(null, erreur);
        }
        else{
            resultat(null, response);
        }
    });
}

//recuperer tous les email clients dans le db
Clients.selectionerTousLesEmailAndPseudoClient = (resultat)=>{
    connexion.query('select email_client, pseudo_client from clients', (erreur, response)=>{
        if(erreur) {
            // console.log("erreur de selection : ", erreur);
            resultat(null, erreur);
        }
        else{
            //console.log('donner selectionner ', response);  
            resultat(null, response);
        }
    })
}

//exportations du module clients
module.exports = Clients;