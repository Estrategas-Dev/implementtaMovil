import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController } from '@ionic/angular';
import { VerPerfilPage } from '../ver-perfil/ver-perfil.page'
import { UserAddPage } from '../user-add/user-add.page'
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from "@angular/fire/firestore";
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { UsersConfigPage } from '../users-config/users-config.page';
import { MessagesService } from '../services/messages.service';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';

@Component({
  selector: 'app-config-page',
  templateUrl: './config-page.page.html',
  styleUrls: ['./config-page.page.scss'],
})
export class ConfigPagePage implements OnInit {
  loading: any;
  userFb: any
  image: any;
  role: any;

  constructor(private uniqueDeviceID: UniqueDeviceID, private db: AngularFirestore, private modalController: ModalController,
    private storage: Storage, private auth: AuthService, private loadingCtrl: LoadingController, private mensaje: MessagesService,
    private camera: Camera, private webview: WebView) {

  }

  async ngOnInit() {
    this.role = await this.storage.get('IdRol');
    console.log("Este es el rol::  ", this.role)
  }
  async ModalPerfil() {

    const modal = await this.modalController.create({
      component: VerPerfilPage,

    });

    await modal.present();

  }
  async ModalUserAdd() {
    const modal = await this.modalController.create({
      component: UserAddPage,

    });

    await modal.present();
  }
  exit() {
    this.auth.logout();
  }


  async activate() {

    let activate = await this.storage.get("ActivateApp");
    console.log("this is el state de activation ::: " + activate)
    if (activate == "1") {
      this.mensaje.showAlert('Ya has activado tu aplicación en este dispositivo')

    } else {
      this.loading = await this.loadingCtrl.create({
        message: 'Activando la aplicación...'
      });
      await this.loading.present();
      let idFireBase = await this.storage.get('idFireBase')
      console.log(idFireBase);
      await this.getDataCellphone(idFireBase)

      //this.saveDataCellPhone(imei,idFireBase)
    }
  }

  async getDataCellphone(id) {
    this.uniqueDeviceID.get().then((uuid: any) => {
      console.log("genera el ID::::")
      console.log(uuid)
      let idCell = uuid
      this.saveDataCellPhone(idCell, id)
      this.storage.set("ActivateApp", "1")
      this.loading.dismiss();
      this.mensaje.showAlert('Se activó correctamente la aplicación con el id de dispositivo: <strong>' + uuid + '</strong>')

    })
      .catch((error: any) => console.log(error));
  }

  async saveDataCellPhone(imei, id) {
    let name = await this.storage.get('Nombre')
    this.storage.set("IMEI", imei)
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
    let fecha = ionicDate.toISOString();
    this.storage.set('LastSession', fecha)
    this.db.collection('usersImplementta').doc(id).update({
      IMEI: imei,
      lastSession: fecha,
      isActive: true
    })

    this.db.collection('SessionRecords').doc(name + '-' + fecha).set({
      IMEI: imei,
      lastSession: fecha,
      user: name
    })

  }

  async getUser() {
    const modal = await this.modalController.create({
      component: UsersConfigPage,
    });
    await modal.present();
  }
  takePic() {

    let options: CameraOptions = {
      quality: 50,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      targetHeight: 600,
      targetWidth: 600,


    }
    this.camera.getPicture(options).then(imageData => {
      //  let rutaBase64 = imageData
      this.image = this.webview.convertFileSrc(imageData);
      this.storage.set('imgUrl', this.image)
    })
      .catch(error => {
        console.error(error);
      })

  }


}



