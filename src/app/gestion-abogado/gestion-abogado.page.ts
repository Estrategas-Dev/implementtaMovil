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
  selector: 'app-gestion-abogado',
  templateUrl: './gestion-abogado.page.html',
  styleUrls: ['./gestion-abogado.page.scss'],
})
export class GestionAbogadoPage implements OnInit {


  cuenta: string = ''
  observacion: string = ''
  idAspuser: string = ''
  idEstatus: number = 0
  fechaVencimiento: string = '1999-09-09'
  horaVencimiento: string = '00:00'
  fechaPromesaPago: string = '1999-09-09'
  idPersona: number = 0
  idResultado: number = 0;
  latitud: number
  longitud: number
  fechaAsignacion: string = '1999-09-09'
  fechaCaptura: string = '1999-09-09'
  tipoGestion: number = 0;
  isDescripcion: boolean = false
  ///////////////////////////////
  infoAccount: any[];
  image: string = '';
  tareaAsignadaAbogado: string = ''
  isPhoto: boolean = false
  idAccountSqlite: any;
  idTareaAbogado: any;
  tareaAsignadaGestor: any;
  idTareaNew: number
  tareaAsignada: string = ''
  loading: any
  imgs: any
  indicadorImagen: number = 0
  fechaActual: string = ''
  detectedChanges: boolean = false;
  isObservacion: boolean = false;
  takePhoto: boolean;
  
  isAgua: boolean = false;
  idTipoServicio: number = 0;
  idTipoToma: number = 0;
  idEstatusToma: number = 0;
  activaEstatusToma: boolean = false;
  isEstatusToma: boolean = false;
  isTipoToma: boolean = false;
  tipoServicioImplementta:string;




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
    this.getIdPlaza();
  }
  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert("La gestión no se guardará, tendras que capturar de nuevo")
    }

  }
  activateDescripcion() {
    this.isObservacion = false
    this.detectedChanges = true
  }

  activateEstatusToma(event) {
    this.isEstatusToma = false;
    this.detectedChanges = true;
    console.log(event.detail.value);
    if (event.detail.value == 2) {
      this.activaEstatusToma = true;
    } else {
      this.idTipoToma = 100;
      this.activaEstatusToma = false;
    }
  }

  activateTipoToma() {
    this.isTipoToma = false;
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
    this.cuenta = await this.storage.get("accountNumber")
    this.idAspuser = await this.storage.get("IdAspUser")
    console.log("this is the account to be proccessed")
    this.infoAccount = await this.service.getInfoAccount(this.cuenta)
    this.idAccountSqlite = this.infoAccount[0].id
    this.idTareaAbogado = this.infoAccount[0].id_tarea
    let gestionada = this.infoAccount[0].gestionada
    this.tareaAsignada = this.infoAccount[0].tareaAsignada
    this.tipoServicioImplementta = this.infoAccount[0].tipoServicio;
    this.idEstatus = this.infoAccount[0].idEstatus
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss()
    }

  }
  exit() {
    this.modalController.dismiss();
  }

  takePic(type) {
    let tipo
    if (type == 1) {
      tipo = "Evidencia"
    } else if (type == 2) {
      tipo = "Predio"
    } else if (type == 3) {
      tipo = "Acta circunstanciada"
    }
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    let fecha = ionicDate.toISOString();

    let options: CameraOptions = {
      quality: 70,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE

    }
    this.camera.getPicture(options).then(imageData => {
      this.indicadorImagen = this.indicadorImagen + 1
      let rutaBase64 = imageData
      this.image = this.webview.convertFileSrc(imageData);
      this.isPhoto = false
      this.takePhoto = true;
      this.imgs.push({ imagen: this.image })
      if (this.indicadorImagen == 1) { this.imgs.splice(0, 1) }
      this.saveImage(this.image, this.cuenta, fecha, rutaBase64, this.idAspuser, this.idTareaAbogado, tipo);
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
  async goTask() {
    this.detectedChanges = true
    const modal = await this.modalController.create({
      component: TasksLawyerPage,
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
      this.idTareaAbogado = data.data.idTarea
      this.tareaAsignada = data.data.tarea
      console.log(this.idTareaAbogado, this.tareaAsignada)
    })
  }

  async validaDatosAbogado() {

    if (this.takePhoto == false || this.idEstatusToma == 0 ||
      this.idTipoToma == 0 ) {

        if (this.idEstatusToma == 0) {
          this.isEstatusToma = true;
        }
        if (this.idTipoToma == 0) {
          this.isTipoToma = true;
        }

      this.mensaje.showAlert("Verifica los campos marcados con * y que minimo haya una foto capturada");
      this.loading.dismiss();
    } else {

      if (this.observacion == '') { this.isObservacion = true }
      else {
        let account = this.cuenta
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
          idResultado: this.idResultado,
          idPersona: this.idPersona,
          observaciones: this.observacion,
          fechaPromesaPago: newDate,
          latitud: this.latitud,
          longitud: this.longitud,
          fechaCaptura: this.fechaCaptura,
          idAspuser: this.idAspuser,
          idTareaAbogado: this.idTareaAbogado,
          fechaAsignacion: this.fechaAsignacion,
          fechaVencimiento: this.fechaVencimiento,
          idTipoServicio: this.idTipoServicio,
          idEstatusToma: this.idEstatusToma,
          idTipoToma: this.idTipoToma,
          id: this.idAccountSqlite

        }
        console.log(data)
        await this.gestionAbogado(data)
        this.loading.dismiss()
        this.exit();

      }
    }
  }

  async gestionAbogado(data) {
    await this.service.gestionAbogado(data)
    this.detectedChanges = false;

  }


  async getIdPlaza() {
    console.log("obteniendo el id de la plaza");
    let tipoPlaza = await this.service.getIdPlazaUser();
    console.log(tipoPlaza);
    if (tipoPlaza[0].TipoPlaza === 'Agua') {
      console.log('Esta es una plaza de agua');
      this.isAgua = true;
    } else {
      console.log("Esta es una plaza de predio");
      this.isAgua = false;
      this.isTipoToma = false;
      this.isEstatusToma = false;
      this.idTipoServicio = 100;
      this.idEstatusToma = 100;
      this.idTipoToma = 100;
    }
  }



}
