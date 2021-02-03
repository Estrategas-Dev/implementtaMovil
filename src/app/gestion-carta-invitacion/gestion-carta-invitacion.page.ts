import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { RestService } from '../services/rest.service'
import { ModalController, LoadingController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { MessagesService } from '../services/messages.service';
import { TasksLawyerPage } from '../tasks-lawyer/tasks-lawyer.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';

@Component({
  selector: 'app-gestion-carta-invitacion',
  templateUrl: './gestion-carta-invitacion.page.html',
  styleUrls: ['./gestion-carta-invitacion.page.scss'],
})
export class GestionCartaInvitacionPage implements OnInit {

  account: string = '';
  idAspuser: string = '';
  latitud: number;
  longitud: number;
  fechaCaptura: string = '1999-09-09';
  image: string = '';
  isPhoto: boolean = false;
  loading: any
  imgs: any
  indicadorImagen: number = 0
  fechaActual: string = '';
  takePhoto: boolean;
  infoAccount: any[];
  idAccountSqlite: any;
  idTareaGestor: any;
  idEstatus: number = 0;
  tareaAsignada: string = '';
  fechaPromesaPago: string = '1999-09-09';
  detectedChanges: boolean = false;
  infoImage:any[];
  idTipoServicio:number = 0;
  tipoServicioImplementta: string = '';


  constructor(private mensaje: MessagesService, private camera: Camera, private storage: Storage, private webview: WebView,
    private modalController: ModalController, private service: RestService, private loadingController: LoadingController, private geolocation: Geolocation) {
    this.takePhoto = false;
    this.imgs = [{ imagen: 'assets/img/imgs.jpg' }]
  }

  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };


  ngOnInit() {
    this.getInfoAccount();
    this.getFechaActual();
  }  

  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert("La gestión no se guardará, tendras que capturar de nuevo")
    }

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

  async getInfoAccount() {
    this.account = await this.storage.get("accountNumber");
    this.idAspuser = await this.storage.get("IdAspUser");
    const idRol = await this.storage.get('IdRol')
    console.log("this is the account to be proccessed");
    this.infoAccount = await this.service.getInfoAccount(this.account);
    this.idAccountSqlite = this.infoAccount[0].id;
    this.idTareaGestor = this.infoAccount[0].id_tarea;
    this.tipoServicioImplementta = this.infoAccount[0].tipoServicio;
    let gestionada = this.infoAccount[0].gestionada;
    this.tareaAsignada = this.infoAccount[0].tareaAsignada;
    // if (idRol == '2') {
    //   this.idTareaGestor = 47;
    //   this.tareaAsignada = "Notificar adeudo a domicilio 3ra Carta"
    // }
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss();
    }
  }
  exit() {
    this.modalController.dismiss();
  }

 async takePic(type) {
    let tipo
    if (type == 1) {
      tipo = "Entrega de carta invitación evidencia"
    } else if (type == 2) {
      tipo = "Entrega de carta invitación predio"
    } else if (type == 3) {
      tipo = "Acta circunstanciada"
    } else if (type == 4) {
      tipo = "Entrega de carta invitación"
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

  
  async validaDatos() {

    if (this.takePhoto == false) {
      this.mensaje.showAlert("Verifica que haya minimo una foto");
      this.loading.dismiss();
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
          account: account,
          idTarea: this.idTareaGestor,
          idaspuser: this.idAspuser,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud,
          idTipoServicio: this.idTipoServicio,
          id: this.idAccountSqlite
        }

        console.log(data);
        await this.gestionCartaInvitacion(data);
        this.loading.dismiss();
        this.exit();

    }

  }


  async gestionCartaInvitacion(data) {

    await this.service.gestionCartaInvitacion(data);
    this.detectedChanges = false;
  }


  async deletePhoto(img) {
    console.log(img);
    console.log(this.imgs);

    for (let i = 0; i< this.imgs.length; i++) {
      console.log(this.imgs[i].imagen);
      if(this.imgs[i].imagen == img) {
        this.imgs.splice(i, 1);
      } else {
        console.log("No hay coincidencias...");
      }
    }
    //borrara la foto trayendo la imagen de la tabla y mandando a llamar al metodo delete del restservice
     this.infoImage = await this.service.getImageLocal(img);
    console.log(this.infoImage[0]);
  }

}
