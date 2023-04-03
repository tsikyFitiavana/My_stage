/**
 * 
 * Rakotondrazanaka Bruno
 * 21-03-2023
 * entreprise d'accueil : A2MI
 * projet xtreme_tournoi
 * 
 */
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fileupload = require('express-fileupload');
// const hbs = require('nodemailer-express-handlebars');
const Clients = require('../model/Clients.model');

const email_utiliser = 'tsikybr@gmail.com';
const password_utiliser = '3120annivk';

//function pour proteger un route en cas de non connexion
exports.requireLogin = (req, res, next) => {
    if (req.session.clientId) {
      next();
    } else {
      res.status(401).send('Pas connecter');
    }
  }

//traitement d'un nouveau client dans le controller lors de l'inscription
exports.enregistrementNouveauClient = (request, response) => {
    //instance clients 
    const nouveau_client = new Clients(request.body);
    //check si au cas ou les données manque
    if(request.body.constructor === Object && Object.keys(request.body).length === 0)
    {
        response.status(400).send({error : true, message : "Erreur d'enregistrement compte utilisateur"});
    }
    else
    {
        //recuperer les email et les pseudo dans le bdd afin de verifier si le nouveau existe déjà
        Clients.selectionerTousLesEmailAndPseudoClient((erreur, resultat) => {
            if(erreur)
            {
                console.log('erreur de recuperation donnée => ' + erreur);
            }
            else
            {
                let liste_email = [];   //table pour stocker les email existant dans le bdd
                let liste_pseudo = [];  //table pour stocker les pseudo existant dans le bdd

                //parcourir le resultat dans le base de données a l'aide de la function map
                resultat.map((client)=>{
                    //ajout de chaque email dans la liste
                    liste_email.push(client.email_client); 
                    //ajout de chaque pseudo dans la liste 
                    liste_pseudo.push(client.pseudo_client) 
                });

                //verification si le pseudo existe déjà

                if(liste_pseudo.indexOf(request.body.pseudo_client) !== -1)
                {
                    response.send('le pseudo: ' + request.body.pseudo_client + ' existe déjà');
                }
                else
                {
                    //verification si l'email existe aussi
                    if(liste_email.indexOf(request.body.email_client ) !== -1)
                    {
                        response.send("Quelqu'un utilise déjà l'email :  " + request.body.email_client);
                    }
                    else
                    {
                        const date_de_creation_compte = new Date();
                        let a_coder = date_de_creation_compte.toLocaleString();
                        let mot_de_passe_client_hacher = crypto.createHash('sha3-512').update(request.body.mot_de_passe_client).digest('hex');
                        nouveau_client.date_de_creation = date_de_creation_compte;
                        nouveau_client.mot_de_passe_client = mot_de_passe_client_hacher;
                        let code = crypto.createHash('sha3-512').update(a_coder).digest('hex');

                        Clients.enregistrerClient(nouveau_client, (erreur, client)=>{
                            if(erreur)
                            {
                                response.send(erreur);
                            }
                            else
                            {
                                //envoye email en utilisant nodemailer
                                let transporter = nodemailer.createTransport({
                                    service: 'Gmail',
                                    auth: {
                                        type:'OAuth2',
                                        user: email_utiliser,
                                        pass: password_utiliser,
                                        clientId: "557564436982-s39iockfcfptt078vik6t9d4uks0hcdp.apps.googleusercontent.com",
                                        clientSecret: "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",
                                        refreshToken: "1//04k6t5O7FZe-LCgYIARAAGAQSNwF-L9Ir4vAYQWcZHtBbbIQAXXSlJoWwsXdXRprpOC-uHxeVEySf7ggVh9VJWzkbanEtQnSWGzI",
                                        accessToken:"ya29.a0AVvZVsrUS4r5jVu87NId83ilX2--kvkD1idW8w_Qbj21FE-_RqQyKvEj9TCmHhXUA0QGTjv7AAcOWffN1FvM5CBXRf2ZAbwDhLTitf5EkEdciuNy8ihzBdR78-kDocpZArYSnaHbdD6aoDC4hiiEVRqWbSjsaCgYKAc0SARESFQGbdwaIRs9wMA-PSzPjmR3YiO6HtA0163"
                                    }
                                });
                                let email_option ={
                                    from: email_utiliser,
                                    to: request.body.email_client,
                                    subject: 'Inscription Xtrem',
                                    html:
                                    `   <div>
                                            <h1>Activation compte Xtreme </h1>
                                            <p>Veuillez cliquer sur le bouton activer pour l'activation de votre compte</p>
                                            <form>
                                                <input types="hidden" value=""/>
                                                <button> Activer </button>
                                            </form>
                                        </div>
                                    `
                                };
                                transporter.sendMail(email_option, (error, info) => {
                                    if (error) {
                                        console.log("l'erreur en cas non envoie du l'email => " + error);
                                    } else {
                                        console.log('email envoyé ' + info.response);
                                    }
                                });
                                response.json({error: false, message: " inscription  avec succes ! verifier votre email pour la validation", data:client});
                            }
                        
                        });
                    }
                }
            }
        });
    }
};

//function qui permet au utilisateur de se connecter
exports.clientsLogin = (request, response)=>{
    let pseudo_existant = [];
    let email_existant = [];
    let password_existant = [];
    let password_crypter_pour_checker_login = "";

    Clients.login((erreur, resultat)=>{
        if(erreur){
            response.send('erreur retourne par check => '+erreur);
        }
        else{
            resultat.map((client_connecte)=>{
                pseudo_existant.push(client_connecte.pseudo_client);
                email_existant.push(client_connecte.email_client);
                password_existant.push(client_connecte.mot_de_passe_client);
            });
            password_crypter_pour_checker_login = crypto.createHash('sha3-512').update(request.body.mot_de_passe_client).digest('hex');
            if (pseudo_existant.indexOf(request.body.pseudo_client) !== -1  && password_existant.indexOf(password_crypter_pour_checker_login) !== -1) {
                let connecter = pseudo_existant[pseudo_existant.indexOf(request.body.pseudo_client)]
                Clients.selectionerUnUtilisateur( connecter, (err , seule_client_connecter) => {
                    if(err)
                        console.log("erreur de connexion => " + err);

                    //creation session client
                    seule_client_connecter.map((iterator)=>{
                        request.session.clientId =   iterator.id_client;
                    })
                    console.log('ito lay session ito => '+ request.session.clientId);
                    response.status(200).json({ client : request.session.clientId, message: "Vous êtes connecté(e) !"});
                    
                });
                
            }
            else
            {
                response.status(401).json({ message: "Pseudo ou mot de passe incorrect. Veuillez vous enregistrer." });
            }
        }
    });
}
exports.deconnexion = (request, response) => {
    console.log('ty lay ho simbana anaty deconnexion =>' + request.session.clientId);
    if (request.session && request.session.clientId) {
        
        request.session.destroy((err) => {
          if (err) {
            console.log('pas de session =>'+err);
          } else {
            response.send('Deconnecter');
          }
        });
      } else {
        console.log('ato fona za');
        response.status(401).send('erreur de deconnexion');
      }
}

//test recuperation email et pseudo clients
exports.recupererEmailAndPseudoClient = (request, response)=>{
    Clients.selectionerTousLesEmailAndPseudoClient((erreur, resultat)=>{
        if (erreur) 
            response.send('erreur retourner après check ' + erreur);
        const email = resultat.map((row)=>row.email_client);
        console.log('ty ataoko anaty console ty zao oatra lay email ', email);
        response.send(resultat);

    });
}
//lister tous les clients
exports.listeClients=(req,resp)=>{
    Clients.listerTousLesClient((err,resultat) => {
        if(err){
            resp.status(401).json({message:'erreur de selection', error:err})
        }
        else{
            resp.status(200).json({message:'selection reussi', clients:resultat})
        }
    })
}