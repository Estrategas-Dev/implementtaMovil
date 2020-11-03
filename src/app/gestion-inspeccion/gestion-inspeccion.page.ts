import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selector: 'app-gestion-inspeccion',
  templateUrl: './gestion-inspeccion.page.html',
  styleUrls: ['./gestion-inspeccion.page.scss'],
})
export class GestionInspeccionPage implements OnInit {

  //atributos del modulo
  cuenta: string = '';
  clave: string = '';
  medidor: string = '';
  idTipoClandestino: number = 0; // obligatorio
  idContratada: number = 0; // obligatorio si idTipoClandestino es igual a 1
  descripcionClandestino: string = ''; // obligatorio si idTipoClandestino = 2 en adelante
  tipoServicioImplementta: string = null; // Traido desde el implementta
  idTipoServicioDetectado: number = 0;
  idCondicionesPredio: number = 0; // obligatorio
  descripcionCondicionesPredio: string = '';
  idInstalaciones: number = 0;
  idTomaMaterial: number = 0;
  diametro: string = '';
  estadoDescarga: number = 0;
  serieMedidor: string = '';
  lecturaMedidor: number = 0;
  idMarcaMedidor: number = 0;
  diametroMedidor: string = '';
  observacion: string = ''; // obligatorio

  //atributos generales 
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
  infoAccount: any[];
  idAccountSqlite: number;
  tareaAsignada: string;
  infoImage: any[];
  detectedChanges: boolean = false;
  idUser: string = '';


  // Activar o desactivar campos segun validaciones
  activaContratada: boolean = false;
  activaDescripcionClandestino: boolean = false;
  activaDescripcionCondicionesPredio: boolean = false;
  activaTomaMaterial: boolean = false;
  activaCamposMedidor: boolean = false;
  activaDescargaConectada: boolean = false;


  //Validacion de campos obligatorios
  resultClandestinoValidation: boolean = false;
  resultContratadaValidation: boolean = false;
  resultDescripcionValidation: boolean = false;
  resultDescCondicionPredio: boolean = false;
  resultObservacion: boolean = false;

  // arreglo de la cuenta que se trae del implementta
  cuentaInformacion: any = '';
  cuentaPadron: boolean;

  constructor(
    private storage: Storage,
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
    this.imgs = [{ imagen: "assets/img/imgs.jpg" }];
    this.takePhoto = false;
    //this.obtenerIdAspUser();
  }

 // @ViewChild('CampoCuenta') cuentaFoco;

  async ngOnInit() {
    let active = await this.storage.get("ActivateApp");
    if (active != 1) { 
      this.mensaje.showAlert(
        "Debes activar la aplicación para poder sincronizar"
      );
      this.router.navigate(["home/config-page"])
    }
    await this.platform.ready();
    await this.getInfoAccount();
    this.getFechaActual();
    this.idAspuser = await this.storage.get("IdAspUser");
  }

  ionViewDidEnter() {
    this.refresh();
    console.log('Entra a el didenter')
  }

 async refresh() {
    // let usuario = await this.storage.get("Email");
    // let password = await this.storage.get("Password");
    // this.authService.login(usuario, password);
    this.exit();
  }


  async obtenerIdAspUser() {
    let idAspUserObtenido;
    idAspUserObtenido = await this.storage.get("IdAspUser");
    return idAspUserObtenido;
  }

  // ionViewWillLeave() {
  //   if (this.detectedChanges) {
  //     this.mensaje.showAlert(
  //       "La gestión no se guardará, tendras que capturar de nuevo"
  //     );
  //   }
  // }

  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  getFechaActual() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );

    this.fechaActual = ionicDate.toISOString();
    let fecha = this.fechaActual.split("T");
    this.fechaActual = fecha[0];
    console.log("Esta es la fecha Actual :::::::::::" + this.fechaActual);
  }

  // metodo que trae la informacio de la cuenta seleccionada
  async getInfoAccount() {
    //this.account = await this.storage.get("accountNumber");
    this.idAspuser = await this.storage.get("IdAspUser");
    console.log("Este es el idaspuser ", this.idAspuser);
    const idRol = await this.storage.get('IdRol')
    console.log("this is the account to be proccessed");
    this.infoAccount = await this.service.getInfoAccount(this.account);
    console.log(this.infoAccount);
    //this.idAccountSqlite = this.infoAccount[0].id;
    //this.idTareaGestor = this.infoAccount[0].id_tarea;
    //let gestionada = this.infoAccount[0].gestionada;
    //this.tareaAsignada = this.infoAccount[0].tareaAsignada;
    //this.tipoServicioImplementta = this.infoAccount[0].tipoServicio;
    if (idRol == '2') {
      this.idTareaGestor = 47;
      this.tareaAsignada = "Notificar adeudo a domicilio 3ra Carta"
    }
    // if (gestionada == 1) {
    //   this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
    //   this.modalController.dismiss();
    // }
  }


  async verificarCuenta( event ) {
    console.log("La cuenta es la ", this.cuenta);
    let cuentaInvestigada = this.cuenta
    // llamar al api con el store para sabes si esta cuenta esta o no en el padron 
    this.cuentaInformacion = await this.service.getCuentaPadron(cuentaInvestigada);
    console.log(this.cuentaInformacion);
    if (this.cuentaInformacion.length > 0) {
      this.cuentaPadron = true;
      console.log(this.cuentaInformacion[0].TipoServicio);
      console.log(this.cuentaPadron);
    } else {
      this.cuentaPadron = false;
      console.log(this.cuentaPadron);
    }
  }


  // ---------------------- metodos para activar o desactivar campos ---------------------------- 
  resultClandestino(event) {
    this.resultClandestinoValidation = false;
    console.log(event.detail.value);
    if (event.detail.value == 1) {
      this.activaContratada = true;
      this.activaDescripcionClandestino = false;
      console.log(`Idtipoclandestino = ${event.detail.value} y activaContratada = ${this.activaContratada}`);
    } else if (event.detail.value == 2 || event.detail.value == 3 || event.detail.value == 4 || event.detail.value == 5 || event.detail.value == 6 || event.detail.value == 7) {
      this.activaContratada = false;
      this.activaDescripcionClandestino = true;
    }
  }


  resultCondicionesPredio(event) {
    console.log(event.detail.value);
    if (event.detail.value == 9) {
      this.detectedChanges = true;
      this.activaDescripcionCondicionesPredio = true;
    } else {
      this.activaDescripcionCondicionesPredio = false;
      this.detectedChanges = true;
    }
  }

  resultInstalaciones(event) {
    console.log(event.detail.value);
    if (event.detail.value == 1) { // tiene toma
      this.detectedChanges = true;
      this.activaTomaMaterial = true;
      this.activaCamposMedidor = false;
      this.activaDescargaConectada = false;
      this.serieMedidor = '';
      this.lecturaMedidor = 0;
      this.estadoDescarga = 0;
    } else if (event.detail.value == 2) { // tiene medidor 
      this.detectedChanges = true;
      this.activaTomaMaterial = false;
      this.activaCamposMedidor = true;
      this.activaDescargaConectada = false;
      this.estadoDescarga = 0;
      this.idTomaMaterial = 0;
      this.diametro = '';
    } else if (event.detail.value == 3) { // tiene descarga
      this.detectedChanges = true;
      this.activaDescargaConectada = true;
      this.activaTomaMaterial = false;
      this.activaCamposMedidor = false;
      this.idTomaMaterial = 0;
      this.diametro = '';
      this.serieMedidor = '';
      this.lecturaMedidor = 0;
    } else if (event.detail.value == 4) { // tiene toma, medidor y descarga
      this.detectedChanges = true;
      this.activaTomaMaterial = true;
      this.activaCamposMedidor = true;
      this.activaDescargaConectada = true;
    }
  }

  // ---------------------------------------------------------------------------------------------------------

  // ---------------------------- Metodos para validar campos obligatorios ------------------------------------

  // el campo tipo de clandestino se controla en el metodo resultClandestino()

  // campo toma contratada o no contratada
  contratadaValidation() {
    this.resultContratadaValidation = false;
  }

  descripcionClandestinoValidation() {
    this.resultDescripcionValidation = false;
  }

  descCondicionPredioValidation() {
    this.resultDescCondicionPredio = false;
  }

  observacionValidation() {
    this.resultObservacion = false;
  }

  // --------------------------------------------------------------------------------------------------------------------

  exit() {
    // Damos por hecho que la informacion ya se guardo correctamente en la tabla de gestionInspeccion por ende borrarmos toda la informacion de los campos asi como los campos de las imagenes
    this.cuenta = '';
    this.clave = '';
    this.medidor = '';
    this.idTipoClandestino = 0; // obligatorio
    this.idContratada = 0; // obligatorio si idTipoClandestino es igual a 1
    this.descripcionClandestino = ''; // obligatorio si idTipoClandestino = 2 en adelante
    this.tipoServicioImplementta = null; // Traido desde el implementta
    this.idTipoServicioDetectado = 0;
    this.idCondicionesPredio = 0; // obligatorio
    this.descripcionCondicionesPredio = '';
    this.idInstalaciones = 0;
    this.idTomaMaterial = 0;
    this.diametro = '';
    this.estadoDescarga = 0;
    this.serieMedidor = '';
    this.lecturaMedidor = 0;
    this.idMarcaMedidor = 0;
    this.diametroMedidor = '';
    this.observacion = ''; // obligatorio

    //atributos generales 
    this.latitud = 0;
    this.longitud = 0;
    this.image = "";
    this.fechaCaptura = "";
    //this.idAspuser = "";
    
    //userInfo: any;
    this.imgs = '';
    this.imgs = [{ imagen: "assets/img/imgs.jpg" }];
    this.takePhoto = false;
    this.indicadorImagen = 0;
    this.isPhoto = false;
    this.idTareaGestor = 0;
    this.account = '';
    this.fechaActual = '';
    //this.infoAccount = '';
    //idAccountSqlite: number;
    this.tareaAsignada = '';
    this.infoImage = [];
    this.detectedChanges = false;



    // Activar o desactivar campos segun validaciones
    this.activaContratada = false;
    this.activaDescripcionClandestino = false;
    this.activaDescripcionCondicionesPredio = false;
    this.activaTomaMaterial = false;
    this.activaCamposMedidor = false;
    this.activaDescargaConectada = false;


    //Validacion de campos obligatorios
    this.resultClandestinoValidation = false;
    this.resultContratadaValidation = false;
    this.resultDescripcionValidation = false;
    this.resultDescCondicionPredio = false;
    this.resultObservacion = false;

    // arreglo de la cuenta que se trae del implementta
    this.cuentaInformacion = '';
    this.cuentaPadron = undefined;
    //this.cuentaFoco.setFocus();
  }

  async takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "inspeccion";
    }
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

    let options: CameraOptions = {
      quality: 40,
      correctOrientation: true,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        console.log(rutaBase64, this.image);
        this.isPhoto = false;
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image });
        if (this.indicadorImagen == 1) {
          this.imgs.splice(0, 1);
        }

        this.saveImage(
          this.image,
          this.cuenta,
          fecha,
          rutaBase64,
          this.idAspuser,
          this.idTareaGestor,
          tipo
        );
      })
      .catch(error => {
        console.error(error);
      });
  }
  async saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
    this.idUser = await this.storage.get('IdAspUser');
    this.service
      .saveImage(
        image,
        accountNumber,
        fecha,
        rutaBase64,
        this.idUser,
        90,
        tipo
      )
      .then(res => {
        console.log(res);
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
  }




  async Verify() {

    // validaciones
    if (this.verificarCampos() == false) {
      console.log("No paso validacion");
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
    } else {
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
      // let fecha = this.fechaPromesaPago.split('T')
      // let dateString = fecha[0]
      // let newDate = new Date(dateString).toISOString();
      // console.log(dateString)
      //console.log(newDate)
      this.idUser = await this.storage.get('IdAspUser');
      let data = {
        cuenta: this.cuenta,
        clave: this.clave,
        medidor: this.medidor,
        tipoClandestino: this.idTipoClandestino,
        contratada: this.idContratada,
        descripcionClandestino: this.descripcionClandestino,
        idTipoServicioDetectado: this.idTipoServicioDetectado,
        idCondicionesPredio: this.idCondicionesPredio,
        descripcionCondicionesPredio: this.descripcionCondicionesPredio,
        idinstalaciones: this.idInstalaciones,
        idTomaMaterial: this.idTomaMaterial,
        diametro: this.diametro,
        serieMedidor: this.serieMedidor,
        lecturaMedidor: this.lecturaMedidor,
        idMarcaMedidor: this.idMarcaMedidor,
        diametroMedidor: this.diametroMedidor,
        estadoDescarga: this.estadoDescarga,
        observacion: this.observacion,
        tareaAsignada: '90',
        idaspuser: this.idUser,
        fechaCaptura: this.fechaCaptura,
        latitud: this.latitud,
        longitud: this.longitud,
      };
      console.log(data);
      console.log(this.idUser);

      await this.gestionInspeccion(data);
      console.log("Este es el idaspuser ", this.idAspuser);
      this.loading.dismiss();
      this.exit();
    }
  }

  async gestionInspeccion(data) {
    await this.service.gestionInspeccion(data);
    this.detectedChanges = false;
  }

  verificarCampos() {
    if (this.idTipoClandestino == 0 || (this.idTipoClandestino.toString() == '1' && this.idContratada == 0)
      || (this.idTipoClandestino.toString() == '2' && this.descripcionClandestino.toString() == '')
      || (this.idTipoClandestino.toString() == '3' && this.descripcionClandestino.toString() == '')
      || (this.idTipoClandestino.toString() == '4' && this.descripcionClandestino.toString() == '')
      || (this.idTipoClandestino.toString() == '5' && this.descripcionClandestino.toString() == '')
      || (this.idTipoClandestino.toString() == '6' && this.descripcionClandestino.toString() == '')
      || (this.idTipoClandestino.toString() == '7' && this.descripcionClandestino.toString() == '')
      || (this.idCondicionesPredio.toString() == '9' && this.descripcionCondicionesPredio.toString() == '')
      || this.observacion.toString() == ''
    ) {
      console.log("Primer validacion");

      if (this.idTipoClandestino == 0) {
        this.resultClandestinoValidation = true;
      }

      if (this.idTipoClandestino.toString() == '1' && this.idContratada == 0) {
        this.resultContratadaValidation = true;
      }

      if ((this.idTipoClandestino.toString() == '2' && this.descripcionClandestino.toString() == '')
        || (this.idTipoClandestino.toString() == '3' && this.descripcionClandestino.toString() == '')
        || (this.idTipoClandestino.toString() == '4' && this.descripcionClandestino.toString() == '')
        || (this.idTipoClandestino.toString() == '5' && this.descripcionClandestino.toString() == '')
        || (this.idTipoClandestino.toString() == '6' && this.descripcionClandestino.toString() == '')
        || (this.idTipoClandestino.toString() == '7' && this.descripcionClandestino.toString() == '')
        || (this.idCondicionesPredio.toString() == '9' && this.descripcionCondicionesPredio.toString() == '')) {
        this.resultDescripcionValidation = true;
      }


      if (this.idCondicionesPredio.toString() == '9' && this.descripcionCondicionesPredio.toString() == '') {
        this.resultDescCondicionPredio = true;
      }

      if (this.observacion.toString() == '') {
        this.resultObservacion = true;
      }

      return false;
    } else {
      console.log("Paso las validaciones");
      return true;
    }

  }// verificar campos

  async getPosition() {
    this.loading = await this.loadingController.create({
      message: "Obteniendo la ubicación de esta gestión...."
    });
    await this.loading.present();
    const position = await this.geolocation.getCurrentPosition();
    this.loading.dismiss();
    console.log(position);
    this.latitud = position.coords.latitude;
    this.longitud = position.coords.longitude;

    if (this.latitud === undefined || this.latitud == 0) {
      return false;
    } else {
      return true;
    }
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





} // clase
