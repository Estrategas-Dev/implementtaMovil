import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { ModalController, LoadingController, NavParams } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { UsersFirebaseService } from '../services/users-firebase.service';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-sync-gestor',
  templateUrl: './sync-gestor.page.html',
  styleUrls: ['./sync-gestor.page.scss'],
})
export class SyncGestorPage implements OnInit {
  accounts: any
  rol: any
  loading: any
  data: any
  isHide: boolean = false

  constructor(private service: RestService,
    private navParams: NavParams,
    private modalController: ModalController,
    private storage: Storage,
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService,
    private firebaseService: UsersFirebaseService) {

  }

  async ngOnInit() {

    this.rol = await this.storage.get('IdRol')
    console.log(this.rol)
    await this.getAccounts(this.rol)
    this.getStatus()

  }
  getStatus() {
    this.isHide = this.navParams.get('isHide');
    console.log('se trajo el parametro', this.isHide)
    console.log(this.isHide)

  }
  async getAccounts(rol) {
    console.log('el rol a cargar', rol)
    if (rol == '2') {
      this.accounts = await this.service.getAccountsReadyToSyncAbogado()
      console.log(this.accounts)
    } else if (rol == '5') {
      this.accounts = await this.service.getAccountsReadyToSyncGestor()
      console.log(this.accounts)
    } else if (rol == '7') {
      this.accounts = await this.service.getAccountsReadyToSyncReductor()
      console.log(this.accounts)
    } 
    // else if(rol == '8') {
    //   this.accounts = await this.service.getAccountsReadyToSyncGestor()
    // }

  }

 // Sincronizar solo una cuenta
  async syncAccount( cuenta, rol ) {

    // this.loading = await this.loadingCtrl.create({
    //   message: `Sincronizando la cuenta ${cuenta} servidor de implementta....`
    // // });
    // await this.loading.present();

    if (rol === 'Gestor') {
      console.log('entra gestor con cuenta', cuenta)
      await this.service.getAccountToSyncGestor(cuenta);
      // this.loading.dismiss()
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'Abogado') {
      console.log('entra abogado');
      await this.service.getAccountToSyncAbogado(cuenta);
      // this.loading.dimsiss()
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'Reductor') {
      console.log('entra Reductor');
      await this.service.getAccountToSyncReductor(cuenta);
      // this.loading.dimsiss()
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'CARTA INVITACION') {
      console.log('entra carta invitacion');
      await this.service.getAccountToSyncCartaInvitacion(cuenta);
      // this.loading.dimsiss()
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if (rol === 'Inspeccion clandestino') {
      console.log('entra a inpeccion clandestino');
      await this.service.getAccountToSyncInspeccion(cuenta);
      this.modalController.getTop().then( resp => {
        this.getAccounts(this.rol);
      })
    }

   }


   // borrar solo una cuenta
   
  async deleteAccount( cuenta, rol ) {
    console.log(cuenta, rol);
    if(rol === 'Gestor') {
      console.log("Entra a borrar gestor");
      await this.service.deleteAccountGestor(cuenta); 
      this.mensaje.showToast("Cuenta eliminada correctamente");
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'Abogado') {
      console.log("Entra a borrar abogado");
      await this.service.deleteAccountAbogado(cuenta);
      this.mensaje.showToast("Cuenta eliminada correctamente");
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'Reductor') {
      console.log("Entra a borrar reductor");
      await this.service.deleteAccountReductor(cuenta);
      this.mensaje.showToast("Cuenta eliminada correctamente");
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if(rol === 'CARTA INVITACION') {
      console.log("Entra a borrar carta invitacion");
      await this.service.deleteAccountCartaInvitacion(cuenta);
      this.mensaje.showToast("Cuenta eliminada correctamente");
      this.modalController.getTop().then(res => {
        this.getAccounts(this.rol);
      })
    } else if (rol === 'Inspeccion clandestino') {
      console.log("Entra a borrar inspeccion clandestino");
      await this.service.deleteAccountInspeccion(cuenta);
      this.mensaje.showToast("Cuenta eliminada correctamente");
      this.modalController.getTop().then(resp => {
        this.getAccounts(this.rol);
      })
    }
  }



  async syncAccounts() {
    this.loading = await this.loadingCtrl.create({
      message: "Sincronizando al servidor de implementta...."
    });
    await this.loading.present();

    if (this.rol == '5') {
      console.log('entra gestor')
      await this.service.getAccoutsToSyncGestor();
      await this.service.getAccoutsToSyncCartaInvitacion();
      await this.service.getAccountsToSyncInspeccion();
      this.loading.dismiss()
      //this.mensaje.showToast('Gestiones sincronizadas correctamente')
    }
    else if (this.rol == '2') {
      console.log('entra Abogado')
      await this.service.getAccoutsToSyncAbogado();
      await this.service.getAccoutsToSyncGestor();
      await this.service.getAccoutsToSyncCartaInvitacion();
      await this.service.getAccountsToSyncInspeccion();
      this.loading.dismiss()
      //this.mensaje.showToast('Gestiones legales sicronizadas correctamente')
    }
    else if (this.rol == '7') {
      console.log('entra Reductor')
      await this.service.getAccoutsToSyncAbogado();
      await this.service.getAccoutsToSyncGestor();
      await this.service.getAccoutsToSyncReductor();
      await this.service.getAccoutsToSyncCartaInvitacion();
      await this.service.getAccountsToSyncInspeccion();
      this.loading.dismiss()
    } 
    // else if (this.rol == '8') {
    //   console.log("Entra Carta Invitacion");
    //   await this.service.getAccoutsToSyncCartaInvitacion();
    //   this.loading.dismiss()
    // }
    this.service.syncRecorrido();
    this.modalController.dismiss()

  }
  reDo() {
    this.service.updateStatusLoadAgain(this.rol)
    this.getAccounts(this.rol);

  }







}
