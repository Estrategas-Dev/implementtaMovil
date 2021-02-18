import { Component, OnInit } from "@angular/core";
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
import { MessagesService } from "../services/messages.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { AngularFirestore } from "@angular/fire/firestore";
import { UsersFirebaseService } from "../services/users-firebase.service";
import { Router } from "@angular/router";
import { ImagePreviewPage } from '../image-preview/image-preview.page';
@Component({
  selector: "app-gestion-gestor",
  templateUrl: "./gestion-gestor.page.html",
  styleUrls: ["./gestion-gestor.page.scss"]
})
export class GestionGestorPage implements OnInit {
  ////////////////Variables sincronizacion gestor/////////////////////////////
  account: string = "";
  idEstatus: number = 3;
  observaciones: string = "";
  fechaPromesaPago: string = "1999-09-09";
  latitud: number;
  longitud: number;
  fechaCaptura: string = "";
  idAspuser: string = "";
  idTareaGestor: number = 0;
  fechaAsignacion: string = "1999-09-09";
  fechaVencimiento: string = "1999-09-09";
  idMotivoNoPago: number = 0;
  motivoNoPago: string = "";
  idSolucionPlanteada: number = 0;
  idExpectativasContribuyente: number = 0;
  otraExpectativaContribuyente: string = "";
  idCaracteristicaPredio: number = 0;
  otraCaracteristicaPredio: string = "";
  idServiciosNoPago: number = 0;
  fechaActual: string;
  isExpectativa: boolean = false;
  indicadorImagen: number = 0;
  //////////////////////////////
  infoAccount: any[];
  image: string = "";
  activateMotivo: boolean = false;
  activateResult: boolean = true;
  detectedChanges: boolean = false;
  isPhoto: boolean = false;
  isMotive: boolean = false;
  isDescripcion: boolean = false;
  tareaAsignada: string;
  idAccountSqlite: number;
  g: any;
  t: any;
  loading: any;
  userInfo: any;
  imgs: any;
  takePhoto: boolean;
  resultVisitValidation: boolean = false
  nCaracteristica: boolean = false;

  isAgua: boolean = false;
  idTipoServicio: number = 0;
  idTipoToma: number = 0;
  idEstatusToma: number = 0;
  activaEstatusToma: boolean = false;
  isEstatusToma: boolean = false;
  isTipoToma: boolean = false;

  tipoServicioImplementta: string;
  infoImage: any[];


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

  ) {
    this.imgs = [{ imagen: "assets/img/imgs.jpg" }];
    this.takePhoto = false;
  }
  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert(
        "La gestión no se guardará, tendras que capturar de nuevo"
      );
    }
  }
  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };
  async ngOnInit() {
    await this.platform.ready();
    await this.getInfoAccount();
    this.getTotals();
    this.getFechaActual();
    this.getIdPlaza();
  }
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

  async getInfoAccount() {
    this.account = await this.storage.get("accountNumber");
    this.idAspuser = await this.storage.get("IdAspUser");
    const idRol = await this.storage.get('IdRol')
    console.log("this is the account to be proccessed");
    this.infoAccount = await this.service.getInfoAccount(this.account);
    console.log(this.infoAccount);
    this.idAccountSqlite = this.infoAccount[0].id;
    this.idTareaGestor = this.infoAccount[0].id_tarea;
    let gestionada = this.infoAccount[0].gestionada;
    this.tareaAsignada = this.infoAccount[0].tareaAsignada;
    this.tipoServicioImplementta = this.infoAccount[0].tipoServicio;
    if (idRol == '2') {
      this.idTareaGestor = 47;
      this.tareaAsignada = "Notificar adeudo a domicilio 3ra Carta"
    }
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss();
    }
  }

  exit() {
    this.modalController.dismiss();
  }
  async takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "Evidencia";
    } else if (type == 2) {
      tipo = "Predio";
    } else if (type == 3) {
      tipo = "Acta circunstanciada"
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
          this.account,
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
  saveImage(image, accountNumber, fecha, rutaBase64, idAspuser, idTarea, tipo) {
    this.service
      .saveImage(
        image,
        accountNumber,
        fecha,
        rutaBase64,
        idAspuser,
        idTarea,
        tipo
      )
      .then(res => {
        console.log(res);
        this.mensaje.showToast("Se almacenó la imagen correctamente");
      });
  }
  resultVisit(event) {
    this.detectedChanges = true;
    this.resultVisitValidation = false
    console.log(event.detail.value);
    if (event.detail.value == 1) {
      this.activateResult = false;
      this.idServiciosNoPago = 0;
      this.idMotivoNoPago = 100;
      this.motivoNoPago = "X";
      this.image = "X";
      this.takePhoto = true;
      this.isEstatusToma = false;
      this.isTipoToma = false;
      this.idEstatusToma = 100;
      this.idTipoToma = 100;
    } else {
      this.idMotivoNoPago == 0;
      this.motivoNoPago == "";
      this.image == "";

      this.activateResult = true;
    }
  }
  activateMotive(event) {
    this.isMotive = false;
    this.detectedChanges = true;
    console.log(event.detail.value);
    if (event.detail.value == 1) {
      this.activateMotivo = true;
    } else {
      this.idServiciosNoPago = 0;

      this.activateMotivo = false;
    }
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


  activateExpectativa() {
    this.isExpectativa = false;
  }
  activateDescripcion() {
    this.isDescripcion = false;
  }

  otraCaracteristicaValidate() {
    this.nCaracteristica = false;
  }

  async validaDatosGestion() {

    if (
      this.idMotivoNoPago == 0 ||
      //this.motivoNoPago == "" ||
      this.otraCaracteristicaPredio == "" ||
      this.idEstatusToma == 0 ||
      this.idTipoToma == 0 ||
      (this.fechaPromesaPago != "1999-09-09" &&
        this.idExpectativasContribuyente == 0) || this.takePhoto == false || this.idCaracteristicaPredio == 0
    ) {
      if (this.idMotivoNoPago == 0) {
        this.isMotive = true;
      }
      if (this.otraCaracteristicaPredio == "") {
        this.nCaracteristica = true;
      }
      if (this.idEstatusToma == 0) {
        this.isEstatusToma = true;
      }
      if (this.idTipoToma == 0) {
        this.isTipoToma = true;
      }
      // if (this.motivoNoPago == "") {
      //   this.isDescripcion = true;
      // }
      if (this.idExpectativasContribuyente == 0) {
        this.isExpectativa = true;
      } if (this.idCaracteristicaPredio == 0) {
        this.resultVisitValidation = true;
      }

      this.mensaje.showAlert("Verifica los campos marcados con * y que minimo haya una foto capturada");
      this.loading.dismiss();
    } else {


      let account = this.account;
      this.loading = await this.loadingController.create({
        message: "Obteniendo la ubicación de esta gestión y guardando...."
      });

      await this.loading.present();


      this.geolocation.getCurrentPosition().then(async (resp) => {

        if (resp) {
          this.latitud = resp.coords.latitude;
          this.longitud = resp.coords.longitude
          console.log("La latitud es", this.latitud);
          console.log("La longitud es ", this.longitud);
          this.loading.dismiss();


          this.loading = await (this.loadingController.create({
            message: 'Guardando la gestión...'
          }));

          await this.loading.present();

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

          this.fechaCaptura = ionicDate.toISOString();
          let fecha = this.fechaPromesaPago.split("T");
          let dateString = fecha[0];
          let newDate = new Date(dateString).toISOString();
          console.log(dateString);
          console.log(newDate);

          let data = {
            account: account,
            idEstatus: this.idEstatus,
            observaciones: this.observaciones,
            fechaPromesaPago: newDate,
            latitud: this.latitud,
            longitud: this.longitud,
            fechaCaptura: this.fechaCaptura,
            idAspuser: this.idAspuser,
            idTareaGestor: this.idTareaGestor,
            fechaAsignacion: this.fechaAsignacion,
            fechaVencimiento: this.fechaVencimiento,
            idMotivoNoPago: this.idMotivoNoPago,
            motivoNoPago: this.motivoNoPago,
            idSolucionPlanteada: this.idSolucionPlanteada,
            idExpectativasContribuyente: this.idExpectativasContribuyente,
            otraExpectativaContribuyente: this.otraExpectativaContribuyente,
            idCaracteristicaPredio: this.idCaracteristicaPredio,
            otraCaracteristicaPredio: this.otraCaracteristicaPredio,
            idServiciosNoPago: this.idServiciosNoPago,
            idTipoServicio: this.idTipoServicio,
            idEstatusToma: this.idEstatusToma,
            idTipoToma: this.idTipoToma,
            id: this.idAccountSqlite
          };
          console.log(data);
          await this.gestionGestor(data);
          this.loading.dismiss();
          this.exit();

        } // if
      }).catch(async (error) => {
        console.log("No se pudo obtener la geolocalizacion " + error);
        this.latitud = this.infoAccount[0].latitud;
        this.longitud = this.infoAccount[0].longitud;
        console.log(`La latitud de implementta es ${this.latitud} y la longitud de implementta es ${this.longitud}`);
        this.loading.dismiss();

        this.loading = await this.loadingController.create({
          message: 'Guardando la gestión...'
        });

        await this.loading.present();

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

        this.fechaCaptura = ionicDate.toISOString();
        let fecha = this.fechaPromesaPago.split("T");
        let dateString = fecha[0];
        let newDate = new Date(dateString).toISOString();
        console.log(dateString);
        console.log(newDate);

        let data = {
          account: account,
          idEstatus: this.idEstatus,
          observaciones: this.observaciones,
          fechaPromesaPago: newDate,
          latitud: this.latitud,
          longitud: this.longitud,
          fechaCaptura: this.fechaCaptura,
          idAspuser: this.idAspuser,
          idTareaGestor: this.idTareaGestor,
          fechaAsignacion: this.fechaAsignacion,
          fechaVencimiento: this.fechaVencimiento,
          idMotivoNoPago: this.idMotivoNoPago,
          motivoNoPago: this.motivoNoPago,
          idSolucionPlanteada: this.idSolucionPlanteada,
          idExpectativasContribuyente: this.idExpectativasContribuyente,
          otraExpectativaContribuyente: this.otraExpectativaContribuyente,
          idCaracteristicaPredio: this.idCaracteristicaPredio,
          otraCaracteristicaPredio: this.otraCaracteristicaPredio,
          idServiciosNoPago: this.idServiciosNoPago,
          idTipoServicio: this.idTipoServicio,
          idEstatusToma: this.idEstatusToma,
          idTipoToma: this.idTipoToma,
          id: this.idAccountSqlite
        };
        console.log(data);
        await this.gestionGestor(data);
        this.loading.dismiss();
        this.exit();

      }); // catch

    } // else
  }  // validaDatosGestion

  async gestionGestor(data) {
    await this.service.gestionGestor(data);
    this.detectedChanges = false;
    // this.mensaje.showAlert("Gestion guardada correctamente");
    // 
    // let uid = await this.storage.get("idFireBase");
    //  this.changeTotals(uid);


  }
  async getTotals() {
    this.usersFirebase.getTotals().subscribe(async user => {
      this.userInfo = user;
      this.g = this.userInfo.managedAccounts;
      this.t = this.userInfo.totalAccounts;
    });
  }
  changeTotals(uid) {
    this.db
      .collection("usersImplementta")
      .doc(uid)
      .update({
        managedAccounts: this.g + 1,
        totalAccounts: this.t - 1
      });
  }
  async changeTask() {
    const alert = await this.alertController.create({
      header: "Tarea gestor",
      subHeader: "Notificar ...",
      inputs: [
        {
          name: "radio1",
          type: "radio",
          label: "domicilio 1ra Carta",
          value: "11",
          checked: true
        },
        {
          name: "radio1",
          type: "radio",
          label: "por correo postal",
          value: "12",
          checked: false
        },
        {
          name: "radio1",
          type: "radio",
          label: "domicilio 2da Carta",
          value: "46",
          checked: false
        },
        {
          name: "radio1",
          type: "radio",
          label: "domicilio 3ra Carta",
          value: "47",
          checked: false
        }
      ],
      buttons: [
        {
          text: "Cancelar",
          role: "cancel",
          cssClass: "secondary",
          handler: () => {
            console.log("Confirm Cancel");
          }
        },
        {
          text: "Aceptar",
          handler: (data: string) => {
            let idTarea = data;
            this.idTareaGestor = parseInt(idTarea);
            switch (this.idTareaGestor) {
              case 11:
                this.tareaAsignada = "Notificar adeudo a domicilio 1ra Carta";
                break;
              case 12:
                this.tareaAsignada = "Notificar adeudo por correo postal";
                break;
              case 46:
                this.tareaAsignada = "Notificar adeudo a domicilio 2da Carta";
                break;
              case 47:
                this.tareaAsignada = "Notificar adeudo a domicilio 3ra Carta";
                break;
            }
            this.mensaje.showAlert(
              "se ha cambiado la tarea a: <strong>" +
              this.tareaAsignada +
              "</strong>"
            );
          }
        }
      ]
    });

    await alert.present();
  }


  // async getIdPlaza() {
  //   console.log("obteniendo el id de la plaza");
  //   let tipoPlaza = await this.service.getIdPlazaUser();
  //   console.log(tipoPlaza);
  //   if (tipoPlaza[0].TipoPlaza === 'Agua') {
  //     console.log('Esta es una plaza de agua');
  //     this.isAgua = true;
  //   } else {
  //     console.log("Esta es una plaza de predio");
  //     this.isAgua = false;
  //     this.isTipoToma = false;
  //     this.isEstatusToma = false;
  //     this.idTipoServicio = 100;
  //     this.idEstatusToma = 100;
  //     this.idTipoToma = 100;
  //   }
  // }


  async getIdPlaza() {
    let tipoPlaza = await this.storage.get("TipoPlazaServicio");
    console.log(tipoPlaza);
    if (tipoPlaza === 'Agua') {
      console.log('Esta es una plaza de agua');
      this.isAgua = true;
    }
    // esta opcion es para que la plaza de mexicali tenga cambios en el formulario 
    else if (tipoPlaza === 'Agua Mexicali') {
      console.log("Esta plaza es Mexicali agua");
      this.isAgua = true;
    } else if (tipoPlaza === 'Agua Tijuana') {
      console.log("Esta plaza es Tijuana agua");
      this.isAgua = true;
    }
    else {
      console.log("Esta es una plaza de predio");
      this.isAgua = false;
      this.isTipoToma = false;
      this.isEstatusToma = false;
      this.idTipoServicio = 100;
      this.idEstatusToma = 100;
      this.idTipoToma = 100;
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


}
