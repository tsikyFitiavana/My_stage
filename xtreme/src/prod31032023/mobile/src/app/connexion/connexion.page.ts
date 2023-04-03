import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connexion',
  templateUrl: './connexion.page.html',
  styleUrls: ['./connexion.page.scss'],
})
export class ConnexionPage implements OnInit {
  pseudo_client:string = '';
  mot_de_passe_client:string='';

  constructor(
    private http:HttpClient,
    private router: Router,
    ) { }

  ngOnInit() {
    //this.storage.create();
  }
  connexion(){
    const url = 'http://localhost:8080/login';
    const data = { pseudo_client: this.pseudo_client, mot_de_passe_client: this.mot_de_passe_client };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    this.http.post(url, data, httpOptions).subscribe((response:any) => {
        const client = response.client
        console.log('ty ve le response le '+ client);
      },
      (error) => {
        console.error('Error retourneko => : ', error);
      });
  }

}
