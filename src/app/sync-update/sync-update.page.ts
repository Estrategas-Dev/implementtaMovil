import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-sync-update',
  templateUrl: './sync-update.page.html',
  styleUrls: ['./sync-update.page.scss'],
})
export class SyncUpdatePage implements OnInit {
usuario : boolean = false
propietario : boolean = false
notificacion : boolean = false
predio : boolean = true
propietarioA : any
address :any
loading: any;
  constructor(private service : RestService, private loadingCtrl : LoadingController, private modal : ModalController, private mensaje : MessagesService) { }

   ngOnInit() {
  
  }
  ionViewDidEnter(){
    this.getInfo();
  
  }
  isActivated(id: number){
    switch(id){
      case 1 : this.propietario = false; this.usuario = false; this.notificacion = false; this.predio = true; break;
      case 2 :  this.propietario = false; this.usuario = false; this.notificacion = true; this.predio = false; break;
      case 3 :  this.propietario = false; this.usuario = true; this.notificacion = false; this.predio = false; break;
      case 4 :  this.propietario = true; this.usuario = false; this.notificacion = false; this.predio = false; break;
  
    
    }
    
    } 
  async getInfo(){
    this.address = null
    this.propietarioA = null
    this.address = await this.service.getDireccion()
    console.log(this.address)
  
    this.propietarioA = await this.service.getPropietario()
  console.log(this.propietarioA)
 
 

}

  async sincronizar(){
    this.loading = await this.loadingCtrl.create({
      message: "Sincronizando al servidor..."
    });
  await this.loading.present();
  await this.service.syncActualizacionDatosDomicilios();
  await this.service.syncActualizacionDatosPropietario()
  this.loading.dismiss();
  this.modal.dismiss();
}
delete (id, type){
  console.log('entra a borrar el id :: '+id + 'en el tipo :: '+type)
  if(type == 1 ){this.service.deleteDataUpdatedAddress(id);this.getInfo()}else{this.service.deleteDataUpdatedUser(id);this.getInfo()}
}
}
