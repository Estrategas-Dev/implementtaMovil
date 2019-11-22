import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { GestionGestorPage } from '../gestion-gestor/gestion-gestor.page';
import { Storage } from '@ionic/storage';
import { GestionAbogadoPage } from '../gestion-abogado/gestion-abogado.page';
import { GestionReductorPage } from '../gestion-reductor/gestion-reductor.page';
import { GestionCallPage } from '../gestion-call/gestion-call.page';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gestion-page',
  templateUrl: './gestion-page.page.html',
  styleUrls: ['./gestion-page.page.scss'],
})
export class GestionPagePage implements OnInit {
gestor :boolean = false;
abogado: boolean = false;
callcenter:boolean = false;
reductor : boolean =false;
constructor( private modalController : ModalController, private storage : Storage ,private platform :Platform,private router : Router ) { }

 async ngOnInit() {
  await this.platform.ready();
  await this.checkProfile();
  }
  async checkProfile(){

  let profile = await this.storage.get("IdRol")
  
  console.log("this is the profile :"+profile)
  switch (profile){
    case "2" : this.abogado = true; break;
    case "5" : this.gestor = true ; break;
    case "4" : this.callcenter = true; break;
    case "7" : this.reductor = true; break;
    case "1" : this.abogado= true;this.reductor=true;this.gestor=true;this.callcenter=true;break;
  }
}

  async gestionGestor() {
   // Data = 1;
    const modal = await this.modalController.create({
      component: GestionGestorPage,
     // componentProps: {
      //  Data:Data }
     
    });
  
     await modal.present();
     modal.onDidDismiss().then(data=>{
      //console.log(data)
      console.log('trata de salir')

      this.router.navigate(['/home/main-list']);
     })
  
  }
  
  async gestionAbogado() {
     const modal = await this.modalController.create({
       component: GestionAbogadoPage,    
     });  
      await modal.present(); 
      modal.onDidDismiss().then(data=>{
        //console.log(data)
        console.log('trata de salir')
        this.router.navigate(['/home/main-list']);
      })
   }
   
  async gestionReductor() {
     const modal = await this.modalController.create({
       component: GestionReductorPage,    
     });
      await modal.present();
      modal.onDidDismiss().then(data=>{
        //console.log(data)
        console.log('trata de salir')
        this.router.navigate(['/']);
      })
   
   }
   async gestionCall() {
    const modal = await this.modalController.create({
      component: GestionCallPage,    
    });
     await modal.present();
     modal.onDidDismiss().then(data=>{
      //console.log(data)
      console.log('trata de salir')
      this.router.navigate(['home']);
      
     })
  }
   

}
