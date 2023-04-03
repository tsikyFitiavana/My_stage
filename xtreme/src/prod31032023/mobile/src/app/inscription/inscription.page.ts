import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  nom_client:string='';
  prenom_client:string='';
  pseudo_client:string='';
  email_client:string='';
  mot_de_passe_client:string='';

  constructor(private http:HttpClient, private router: Router) { }

  ngOnInit() {
  }

  onSubmit(){
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    const url = 'http://localhost:8080/inscription';
    const data = {
      'nom_client':this.nom_client,
      'prenom_client':this.prenom_client,
      'pseudo_client':this.pseudo_client,
      'email_client':this.email_client,
      'mot_de_passe_client': this.mot_de_passe_client
    }
    console.log(data);
    this.http.post(url, data, httpOptions).subscribe(
      (response) => {
        console.log('Success:');
        this.router.navigateByUrl('/connexion');
      },
      (error) => {

        console.log('tsy mlam');
        console.error('Error retourneko => : ', error);
      }
    );
  }

}
