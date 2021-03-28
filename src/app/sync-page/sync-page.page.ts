import { Component, OnInit } from "@angular/core";
import { RestService } from "../services/rest.service";
import { Storage } from "@ionic/storage";
import {
  LoadingController,
  ModalController,
  ActionSheetController,
  AlertController
} from "@ionic/angular";
import { SyncPhotosPage } from "../sync-photos/sync-photos.page";
import { Router } from "@angular/router";
import { MessagesService } from "../services/messages.service";

import { UsersFirebaseService } from "../services/users-firebase.service";
import { SyncGestorPage } from "../sync-gestor/sync-gestor.page";
import { SyncUpdatePage } from "../sync-update/sync-update.page";
import { AppVersion } from '@ionic-native/app-version/ngx';

@Component({
  selector: "app-sync-page",
  templateUrl: "./sync-page.page.html",
  styleUrls: ["./sync-page.page.scss"]
})
export class SyncPagePage implements OnInit {
  data: any;
  loading: any;
  dataVisit: any;
  cont: number = 0;
  total: number = 0;
  isActivated: boolean = false;
  fecha: string = "1999-09-09";
  contador: number = 0;
  gestor: any;
  plaza: any;
  activeSync: boolean = false;
  activeFotos: boolean = false;
  totalFotos: number = 0;
  totalSincronizados: number;
  totalPendientes: number;
  userRol: number = 0;
  userFB: any;
  totalG: number = 0;
  userInfo: any;
  progress: boolean = false;
  progressTotal: number = 0;
  idRol: number;
  isHide: boolean

  constructor(
    private service: RestService,
    public actionSheetController: ActionSheetController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private modalController: ModalController,
    private alertController: AlertController,
    private router: Router,
    private mensaje: MessagesService,
    private usersFirebase: UsersFirebaseService,
    private app: AppVersion
  ) { }
  /*   async getTotalG(){
    this.usersFirebase.getUserInfoAccount().subscribe(async user=>{
      this.userInfo = user
      this.totalG = this.userInfo.managedAccounts
      this.idRol = this.userInfo.idRol
    })
  } */

  async presentAction() {
    this.total = await this.storage.get("total");
    const alert = await this.alertController.create({
      header: "Sincronizar",
      message:
        "<strong>" +
        this.gestor +
        "</strong> tienes <strong>" +
        this.total +
        "</strong> cuentas, sincronizadas el <strong>" +
        this.fecha +
        "</strong>",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Sincronizar",
          cssClass: "secondary",
          handler: () => {
            //  if(this.network.getNetworkType() == 'wifi'){
            this.sync();
            //  }
            //   else{this.mensaje.showAlert("Debes estar conectado a una red WI-FI para asegurar la descarga de la información")}
          }
        }
      ]
    });

    await alert.present();
  }

  async presentActionPhotos() {
    const alert = await this.alertController.create({
      header: "Sincronizar",
      message:
        "Sincroniza tus fotos al servidor de implementta <strong>" +
        this.gestor +
        "</strong>",
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: blah => {
            console.log("Confirm Cancel: blah");
          }
        },
        {
          text: "Aceptar",
          cssClass: "secondary",
          handler: () => {
            this.goFotos();
          }
        }
      ]
    });

    await alert.present();
  }

  ngOnInit() {
    this.getInfo();
    //this.getTotalG();
    this.getCountPhotos();
  }

  async setVersionAndDate(fecha) {
    await this.app.getVersionCode().then(res => {
      let version = res.valueOf().toString()
      console.log(version, fecha)
      this.usersFirebase.setVersion(version, fecha)


    })

  }

  ionViewDidEnter() {
    // this.showCard();
  }
  async getInfo() {
    this.fecha = await this.storage.get("FechaSync");
    if (this.fecha == null) {
      this.fecha = "1999-09-09 12:00:00";
    }

    if (this.total == null) {
      this.total = 0;
    }
    this.gestor = await this.storage.get("Nombre");
    this.plaza = await this.storage.get("Plaza");
  }
  async deleteTable() {
    await this.service.deleteVisit();
  }


  // Este metodo es el que manda a traer el metodo getVisit() del restService que es el que hace la peticion de los atos al sql 
  async sync() {/////////////////////////sincronizacion todos los perfiles
    this.progress = true;
    let active = await this.storage.get("ActivateApp");
    // if (active == "1") {
    this.deleteTable();

    this.loading = await this.loadingCtrl.create({
      message: "Sincronizando cuentas desde el servidor de implementta..."
    });
    await this.loading.present();

    const idaspuser = await this.storage.get("IdAspUser");
    const idplaza = await this.storage.get("IdPlaza");

    this.data = await this.service.getVisit(idaspuser, idplaza);
    this.total = this.data.length;

    if (this.data == 0) {
      this.loading.dismiss();
      return;
    }

    if (this.total == 0) {
      this.mensaje.showAlert("No tienes cuentas para sincronizar");
      this.loading.dismiss();
      return;
    }

    this.storage.set("total", this.total);
    console.log("Datos a almacenar en implementta ", this.data);
    console.log("numMedidor", this.data[0].numMedidor);
    await this.setTableVisit(this.data);

    await this.storage.set("IdRol", this.data[0].idRol);
    await this.storage.set("TipoPlazaServicio", this.data[0].TipoPlazaServicio);
    await this.storage.set("EstatusCartaInvitacion", this.data[0].EstatusCartaInvitacion);
    await this.storage.set("estatusValores", this.data[0].EstatusValores);
    await this.storage.set("EstatusInspeccion", this.data[0].EstatusInspeccion);
    await this.storage.set("rutaArcgis", this.data[0].rutaArcgis);
    await this.storage.set("ModulosNoAsignacion", this.data[0].ModulosNoAsignacion);
    await this.storage.set("campoNumeroMedidor", this.data[0].campoNumeroMedidor);
    //console.log("TipoPlazaServicio", this.storage.get("TipoPlazaServicio"));
    //console.log("Ruta Arcgis: ", this.storage.get("rutaArcgis"));
    //console.log("El campo numero de medidor esta ", this.storage.get("campoNumeroMedidor"));

    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds()
      )
    );

    let fecha = ionicDate.toISOString();
    this.storage.set("FechaSync", fecha);
    await this.setVersionAndDate(fecha);
    this.loading.dismiss();
    this.router.navigateByUrl('home/main-list')
    // navigator.app.loadUrl("file:///android_asset/www/index.html");
    // setTimeout(document.location.href ='index.html',2000)
    //document.location.href = 'index.html';
    // } else {
    //   this.mensaje.showAlert(
    //     "Debes activar la aplicación para poder sincronizar"
    //   );
    // }
  }


  async setTableVisit(data) {
    let cont = 0;
    for (let i = 0; i < data.length; i++) {
      await this.service.setVisit(data[i]);
      cont = cont + 1;
      this.progressTotal = cont / this.total;
    }
  }
  /* async showCard(){
  this.fecha = await this.storage.get('FechaSync')
  this.total = await this.storage.get("total")
  this.gestor = await this.storage.get("Nombre")
  this.plaza = await this.storage.get("Plaza")
  this.userRol = parseInt(await this.storage.get('IdRol'))

} */
  goFotos() {
    this.modalController
      .create({
        component: SyncPhotosPage
      })
      .then(modal => {
        modal.present();
      });
  }
  viewSync() {
    this.activeSync = !this.activeSync;
  }
  // async getChecador() {
  //   let active = await this.storage.get("ActivateApp");
  //   if (active == "1") {
  //     this.router.navigateByUrl("/checador-home");
  //   } else {
  //     this.mensaje.showAlert(
  //       "Debes activar la aplicación para poder checar tu asistencia"
  //     );
  //   }
  // }

  async getChecador() {
    let active = await this.storage.get("ActivateApp");
    console.log(active);
    this.router.navigateByUrl("/checador-home");
  }




  async getCountPhotos() {
    this.totalFotos = await this.service.getCountPhotos();
    this.totalSincronizados = await this.service.getCountPhotosSync();
    this.totalPendientes = this.totalFotos - this.totalSincronizados;
  }

  async getSyncGestor() {


    this.usersFirebase.getUserInfoAccount().subscribe(async user => {
      this.data = user
      console.log('entra por la info del firebase')
      console.log(this.data)
      this.isHide = this.data.isHide

    })

    const modal = await this.modalController.create({
      component: SyncGestorPage,
      componentProps: {
        isHide: this.isHide
      }
    });
    await modal.present();


  }
  async goPhotosWithParameters() {
    this.usersFirebase.getUserInfoAccount().subscribe(async user => {
      this.data = user
      console.log('entra por la info del firebase')
      console.log(this.data)
      this.isHide = this.data.isHide

    })

    const modal = await this.modalController.create({
      component: SyncPhotosPage,
      componentProps: {
        isHide: this.isHide
      }
    });
    await modal.present();
  }

  async goUpdateInfoWithParameters() {

    this.usersFirebase.getUserInfoAccount().subscribe(async user => {
      this.data = user
      console.log('entra por la info del firebase')
      console.log(this.data)
      this.isHide = this.data.isHide

    })

    const modal = await this.modalController.create({
      component: SyncUpdatePage,
      componentProps: {
        isHide: this.isHide
      }
    });
    await modal.present();



  }


  async goUpdateInfo() {
    const modal = await this.modalController.create({
      component: SyncUpdatePage,

    });
    await modal.present();
  }
}
