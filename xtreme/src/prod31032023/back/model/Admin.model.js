const connexion = require('../config/dbConfig');
//modele login administration

const admin = (admin)=>{
    this.email_admin = admin.email_admin;
    this.password_admin = admin.password_admin;
}

admin.connecter = (resultat)=>{
    connexion.query('select  email_admin, password_admin from admin',(erreur, response)=>{
        if(erreur) {
            resultat(null, erreur);
        }
        else{
            resultat(null, response);
        }
    });
}

module.exports = admin;