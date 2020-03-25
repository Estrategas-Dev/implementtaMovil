import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UsersFirebaseService } from '../services/users-firebase.service';

@Component({
  selector: 'app-sync-gestor',
  templateUrl: './sync-gestor.page.html',
  styleUrls: ['./sync-gestor.page.scss'],
})
export class SyncGestorPage implements OnInit {
accounts:any
rol : any
loading : any
data : any
isHide : boolean= false

  constructor(private service :RestService,
    private navParams : NavParams,
    private modalController : ModalController, 
    private storage : Storage, 
    private loadingCtrl : LoadingController,
    private firebaseService : UsersFirebaseService) { 
    
  }

  async ngOnInit() {
    
    this.rol = await this.storage.get('IdRol')
    console.log(this.rol)
   await this.getAccounts(this.rol)
   this.getStatus()
     
  }
  getStatus(){
   this.isHide = this.navParams.get('isHide');
   console.log('se trajo el parametro', this.isHide)
console.log(this.isHide)

  }
  async getAccounts(rol){
    console.log('el rol a cargar' , rol)
  if(rol=='2'){
    this.accounts = await this.service.getAccountsReadyToSyncAbogado()
    console.log(this.accounts)
  }else if(rol == '5'){
    this.accounts = await this.service.getAccountsReadyToSyncGestor()
    console.log(this.accounts)
  }else if(rol == '7'){
    this.accounts = await this.service.getAccountsReadyToSyncReductor()
    console.log(this.accounts)
  }

}
  async syncAccounts(){
    this.loading = await this.loadingCtrl.create({
      message: "Sincronizando al servidor de implementta...."
    });
    await this.loading.present();
    
  if(this.rol =='5'){
    console.log('entra gestor')
   await this.service.getAccoutsToSyncGestor();
   this.loading.dismiss()
  }
  else if(this.rol=='2'){
    console.log('entra Abogado')
    await this.service.getAccoutsToSyncAbogado();
    await this.service.getAccoutsToSyncGestor();
    this.loading.dismiss()
  }
  else if(this.rol=='7'){
    console.log('entra Reductor')
    await this.service.getAccoutsToSyncAbogado();
    await this.service.getAccoutsToSyncGestor();
    await this.service.getAccoutsToSyncReductor();
    this.loading.dismiss()


 
}
this.service.syncRecorrido();
this.modalController.dismiss()

}
reDo(){
  this.service.updateStatusLoadAgain(this.rol)
  this.getAccounts(this.rol);

}
}
