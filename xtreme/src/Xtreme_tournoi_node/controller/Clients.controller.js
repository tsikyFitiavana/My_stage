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
                console.log('erreur de recuperation donnée');
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
                        console.log('ito avant cryptage =>'+ nouveau_client.date_de_creation);
                        let code = crypto.createHash('sha3-512').update(a_coder).digest('hex');
                        console.log('ito après cryptage sady go bdd =>'+ nouveau_client.date_de_creation);

                        if(!request.files){
                            response.send({
                                status: false,
                                message: 'No file uploaded'
                            });
                        }
                        else{
                            let photo_profil = request.files.photo_profil;
                            //mettre le champs profil au meme nom du fichier uploader
                            nouveau_client.photo_profil = photo_profil.name;

                            //envoyer l'image dans le dossier photo_profil
                            photo_profil.mv('./public/images/' + photo_profil.name);

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
                                            console.log('ty lay erreur' + error);
                                        } else {
                                            console.log('lasa lesy eh: ' + info.response);
                                        }
                                    });
                                    response.json({error: false, message: " inscription  avec succes ! verifier votre email pour la validation", data:client});
                                }
                            
                            });
                        }
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
            response.send(erreur);
        }
        else{
            resultat.map((client_connecte)=>{
                pseudo_existant.push(client_connecte.pseudo_client);
                email_existant.push(client_connecte.email_client);
                password_existant.push(client_connecte.mot_de_passe_client);
            });
            password_crypter_pour_checker_login = crypto.createHash('sha3-512').update(request.body.password_de_connection).digest('hex');
            if ((email_existant.indexOf(request.body.email_de_connection) !== -1 || pseudo_existant.indexOf(request.body.pseudo_de_connection) !== -1 ) && password_existant.indexOf(password_crypter_pour_checker_login) !== -1) {
                response.send("vous etes connectés");
            }
            else
            {
                response.send("vous n'etes pas encore enregistrer");
            }
        }
    });
}

//test recuperation email et pseudo clients
exports.recupererEmailAndPseudoClient = (request, response)=>{
    Clients.selectionerTousLesEmailAndPseudoClient((erreur, resultat)=>{
        if (erreur) 
            response.send(erreur);
        const email = resultat.map((row)=>row.email_client);
        console.log('ty ataoko anaty console ty zao oatra lay email ', email);
        response.send(resultat);

    });
}