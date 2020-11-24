import { Component, OnInit } from '@angular/core';
import { MessagesService } from '../services/messages.service';
import { Storage } from "@ionic/storage";
import { RestService } from "../services/rest.service";
import {
  ModalController,
  Platform,
  AlertController,
  LoadingController
} from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AngularFirestore } from "@angular/fire/firestore";
import { UsersFirebaseService } from "../services/users-firebase.service";
import { Router } from "@angular/router";
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-gestion-valorescatastrales-noasignacion',
  templateUrl: './gestion-valorescatastrales-noasignacion.page.html',
  styleUrls: ['./gestion-valorescatastrales-noasignacion.page.scss'],
})
export class GestionValorescatastralesNoasignacionPage implements OnInit {

  constructor(private storage: Storage,
    private service: RestService,
    private geolocation: Geolocation,
    private router: Router,
    private webview: WebView,
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private camera: Camera,
    private mensaje: MessagesService,
    private loadingController: LoadingController,
    private db: AngularFirestore,
    private usersFirebase: UsersFirebaseService,
    private authService: AuthService) {
    this.imgs = [{ imagen: "assets/img/imgs.jpg" }]
  }

 async ngOnInit() {
    this.getFechaActual();
    this.idAspuser = await this.storage.get("IdAspUser");
  }

  // atributos
 
  supConstruccion: number;
  supTerreno: number;
  valConstruccion: number;
  valTerreno: number;
  valCatastral: number;
  idTipoSuelo: number = 0;
  observacion: string = "";

  // atributos generales
  latitud: number;
  longitud: number;
  image: string = "";
  fechaCaptura: string = "";
  idAspuser: string = "";
  loading: any;
  userInfo: any;
  imgs: any;
  takePhoto: boolean;
  indicadorImagen: number = 0;
  isPhoto: boolean = false;
  idTareaGestor: number = 0;
  account: string = '';
  fechaActual: string;
  //infoAccount: any[];
  idAccountSqlite: number;
  tareaAsignada: string;
  infoImage: any[];
  detectedChanges: boolean = null;
  fechaPromesaPago: string = '1999-09-09';
  tipoServicio: string = "";
  resultValidationObservacion: boolean = false;

  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };




  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert("La gestión no se guardará, tendras que capturar de nuevo")
    }

  }

  resultAccount() {
    this.detectedChanges = true;
  }

  cambioObservacion() {
    this.detectedChanges = true;
    this.resultValidationObservacion = false;
  }



  getFechaActual() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));

    this.fechaActual = ionicDate.toISOString();
    let fecha = this.fechaActual.split('T')
    this.fechaActual = fecha[0]
    console.log('Esta es la fecha Actual :::::::::::' + this.fechaActual)

  }



  exit() {
    this.modalController.dismiss();
  }

  async takePic(type) {
    let tipo
    if (type == 1) {
      tipo = "Evidencia"
    } else if (type == 2) {
      tipo = "Predio"
    } else if (type == 3) {
      tipo = "Acta circunstanciada"
    } else if (type == 4) {
      tipo = "Entrega de carta invitación"
    } else if (type == 5) {
      tipo = "Valores catastrales";
    }

    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    let fecha = ionicDate.toISOString();

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE

    }
    this.camera.getPicture(options).then(imageData => {
      this.indicadorImagen = this.indicadorImagen + 1
      let rutaBase64 = imageData
      console.log(rutaBase64);
      this.image = this.webview.convertFileSrc(imageData);
      console.log(this.image);
      this.isPhoto = false
      this.takePhoto = true;
      this.imgs.push({ imagen: this.image })
      if (this.indicadorImagen == 1) { this.imgs.splice(0, 1) }
      this.saveImage(this.image, this.account, fecha, rutaBase64, this.idAspuser, this.idTareaGestor, tipo);
    })
      .catch(error => {
        console.error(error);
      })

  }

  saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
    this.service.saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo).then(res => {
      console.log(res)
      this.mensaje.showToast("Se almacenó la imagen correctamente")

    })
  }





  async Verify() {
    console.log(this.detectedChanges);
    if (this.observacion == '') {
      this.resultValidationObservacion = true;
      this.mensaje.showAlert("Capturar el campo obligatorio de observacion");
    } else {
      let account = this.account
      this.loading = await this.loadingController.create({
        message: 'Obteniendo la ubicación de esta gestión....'
      });
      await this.loading.present();
      const position = await this.geolocation.getCurrentPosition()
      this.loading.dismiss()
      console.log(position)
      this.latitud = position.coords.latitude;
      this.longitud = position.coords.longitude;

      this.loading = await this.loadingController.create({
        message: 'Guardando la gestión...'
      });

      await this.loading.present();
      //   let sqlString =`'${account}',${this.idEstatus},'${this.observaciones}','${this.fechaPromesaPago}','${this.latitud}','${this.longitud}','${this.fechaCaptura}','${idAspUser}',${idTarea},'${this.fechaAsignacion}','${this.fechaVencimiento}'${this.idMotivoNoPago},'${this.motivoNoPago}',${this.idSolucionPlanteada},${this.idExpectativasContribuyente},'${this.otraExpectativaContribuyente}',${this.idCaracteristicaPredio},'${this.otraCaracteristicaPredio}',${this.idServiciosNoPago}`
      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      this.fechaCaptura = ionicDate.toISOString();
      let fecha = this.fechaPromesaPago.split('T')
      let dateString = fecha[0]
      let newDate = new Date(dateString).toISOString();
      console.log(dateString)
      console.log(newDate)

      let data = {
        account: this.account,
        supConstruccion: this.supConstruccion,
        supTerreno: this.supTerreno,
        valConstruccion: this.valConstruccion,
        valTerreno: this.valTerreno,
        valCatastral: this.valCatastral,
        idTipoSuelo: this.idTipoSuelo,
        observacion: this.observacion,
        fechaCaptura: this.fechaCaptura,
        idAspUser: this.idAspuser,
        latitud: this.latitud,
        longitud: this.longitud,
        id: this.idAccountSqlite
      };

      console.log(data);

      await this.gestionValoresCatastrales(data);
      this.loading.dismiss();
      this.exit();
    }
  } // verify


  async gestionValoresCatastrales(data) {
    await this.service.gestionValoresCatastrales(data);
    this.detectedChanges = false;
  }


  async deletePhoto(img) {
    console.log(img);
    console.log(this.imgs);

    for (let i = 0; i < this.imgs.length; i++) {
      console.log(this.imgs[i].imagen);
      if (this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      } else {
        console.log("No hay coincidencias");
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
    this.infoImage = await this.service.getImageLocal(img);
    console.log(this.infoImage[0]);
  }


}
