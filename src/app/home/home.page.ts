import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{
  loading:any;
  constructor(private router: Router,
    private platform: Platform,
    public loadingController: LoadingController,
    private google: GooglePlus,
    private fireAuth: AngularFireAuth
    ) {}
  
    async ngOnInit() {
      this.loading = await this.loadingController.create({
        message: 'Connecting ...'
      });
    }
    
    
    async presentLoading(loading) {
      await loading.present();
    }
    
    
    logingoogle() {
      let params;
      if (this.platform.is('android')) {
        params = {
          webClientId:'821174182937-b63e92lbufj0hv0ej7kql10f3ganjh3u.apps.googleusercontent.com',
          offline:true
        };
      } else {
        params = {};
      }
      this.google.login(params).then((response) => {
            const { idToken, accessToken } = response;
            this.onLoginSuccess(idToken, accessToken);
          }).catch((error) => {
        console.log(error);
        alert('error:' + JSON.stringify(error));
      });
    }
    onLoginSuccess(accessToken, accessSecret) {
      const credential = accessSecret ? firebase.auth.GoogleAuthProvider
          .credential(accessToken, accessSecret) : firebase.auth.GoogleAuthProvider
          .credential(accessToken);
      this.fireAuth.signInWithCredential(credential).then((response) => {
            this.router.navigate(['/profile']);
            this.loading.dismiss();
          });
    }
}