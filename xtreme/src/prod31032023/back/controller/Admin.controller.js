const Admin = require('../model/Admin.model');

//function qui permet au utilisateur de se connecter
exports.adminLogin = (request, response)=>{
    let email_admin = [];
    let password_admin = [];

    Admin.connecter((erreur, resultat)=>{
        if(erreur){
            response.send('erreur retourne par check => '+ erreur);
        }
        else{
            resultat.map((admin_connecte)=>{
                email_admin.push(admin_connecte.email_admin);
                password_admin.push(admin_connecte.password_admin);
            });
            if (email_admin.indexOf(request.body.email_admin) !== -1 && password_admin.indexOf(request.body.password_admin) !== -1) {
                response.status(200).json({ message: "Vous êtes connecté(e) !" });
            }
            else
            {
                response.status(401).json({ message: "Email ou mot de passe incorrect. Veuillez vous enregistrer." });
            }
        }
    });
}