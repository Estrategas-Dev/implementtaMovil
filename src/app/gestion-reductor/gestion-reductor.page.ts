import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { RestService } from "../services/rest.service";
import { ModalController, LoadingController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { MessagesService } from "../services/messages.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: "app-gestion-reductor",
  templateUrl: "./gestion-reductor.page.html",
  styleUrls: ["./gestion-reductor.page.scss"]
})
export class GestionReductorPage implements OnInit {
  infoAccount: any[];
  image: string = "";
  isPhoto: boolean = false;
  account: string;
  idAspuser: string;
  idAccountSqlite: number;
  idTarea: number;
  tareaAsignada: string;
  opcion68: boolean = false;
  opcion69: boolean = false;
  opcion70: boolean = false;
  opcion71: boolean = false;
  noInstalo: boolean = false;
  noRetiro: boolean = false;
  noSuperviso: boolean = false;
  noTaponeo: boolean = false;
  horas: boolean = false;
  niple: boolean = false;
  loading: any;
  fechaActual: string = "";
  ///////////////////////////////////Variables de la gestion///////////////////

  idDescripcion: number = 0;
  idObservacion: number = 0;
  lectura: string = "";
  conclusiones: string = "";
  personaContacto: string = "";
  telefonoContacto: string = "";
  fechaPromesa: string = "1999-09-09";
  fechaCaptura: string = "";
  fechaProximaVisita: string = "1999-09-09";
  horaIni: string = "00:00:00";
  horaFin: string = "00:00:00";
  latitud: number;
  longitud: number;
  idNiple: number = 0;
  imgs : any

  isDescription: boolean = false;
  isObservacion: boolean = false;
  isFecha: boolean = false;
  indicadorImagen: number=0;

  constructor(
    private camera: Camera,
    private service: RestService,
    private storage: Storage,
    private modalController: ModalController,
    private mensaje: MessagesService,
    private webview: WebView,
    private loadingController: LoadingController,
    private geolocation: Geolocation
  ) {  this.imgs = [{imagen:'assets/img/imgs.jpg'}]}
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
    console.log("this is the account to be proccessed");
    this.infoAccount = await this.service.getInfoAccount(this.account);
    console.log(this.infoAccount);
    this.idAccountSqlite = this.infoAccount[0].id;
    this.idTarea = this.infoAccount[0].id_tarea;
    let gestionada = this.infoAccount[0].gestionada;
    this.tareaAsignada = this.infoAccount[0].tareaAsignada;
   
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss();
    }
    this.activateAction(this.idTarea, 1);
  }
  exit() {
    this.modalController.dismiss();
  }
  takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "Evidencia";
    } else {
      tipo = "predio";
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
      quality: 60,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 1000,
      targetWidth: 1000,
      saveToPhotoAlbum: true
    };
    this.camera
      .getPicture(options)
      .then(imageData => {
        this.indicadorImagen = this.indicadorImagen + 1;
        let rutaBase64 = imageData;
        this.image = this.webview.convertFileSrc(imageData);
        
        this.imgs.push({imagen:this.image})

        if (this.indicadorImagen == 1 ){ this.imgs.splice(0,1)}
        this.saveImage(
          this.image,
          this.account,
          fecha,
          rutaBase64,
          this.idAspuser,
          this.idTarea,
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
  activateAction(event, i) {
    var action;
    if (i == 0) {
      action = event.detail.value;
    } else {
      action = event.toString();
    }
    switch (action) {
      case "68":
        this.opcion68 = true;
        this.opcion69 = false;
        this.opcion70 = false;
        this.opcion71 = false;
        break;
      case "69":
        this.opcion68 = false;
        this.opcion69 = true;
        this.opcion70 = false;
        this.opcion71 = false;
        break;
      case "70":
        this.opcion68 = false;
        this.opcion69 = false;
        this.opcion70 = true;
        this.opcion71 = false;
        break;
      case "71":
        this.opcion68 = false;
        this.opcion69 = false;
        this.opcion70 = false;
        this.opcion71 = true;
        break;
    }
  }
  activateDescription(event) {
    this.isDescription = false;
    const action = event.detail.value;
    switch (action) {
      case "1":
        this.niple = true;
        this.horas = true;
        break;
      case "2":
        this.noInstalo = true;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = false;
        this.horas = false;
        this.niple = false;
        break;
      case "4":
        this.noInstalo = false;
        this.noRetiro = true;
        this.noSuperviso = false;
        this.noTaponeo = false;
        this.horas = false;
        this.niple = false;
        break;
      case "6":
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = true;
        this.noTaponeo = false;
        this.horas = false;
        this.niple = false;
        break;
      case "8":
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = true;
        this.horas = false;
        this.niple = false;
        break;
      default:
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = false;
        this.horas = false;
        break;
    }
  }

  async Verify() {
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

    

    if (
      this.idDescripcion == 0 ||
      this.fechaProximaVisita === "1999-09-09"
     
    ) {
    
      if (this.idDescripcion == 0) {
        this.isDescription = true;
      }
      if (this.fechaProximaVisita === "1999-09-09") {
        this.isFecha = true;
      }
      this.mensaje.showAlert("Verifica todos los campos con *");
    } else {
      if (
        (this.idDescripcion.toString() == "2" ||
          this.idDescripcion.toString() == "4" ||
          this.idDescripcion.toString() == "6" ||
          this.idDescripcion.toString() == "8") &&
        this.idObservacion == 0
      ) {
        this.isObservacion = true;
        this.mensaje.showAlert("Verifica todos los campos con *");
      } else {
        /////////////////////Aqui se hace el proceso de gestion ya validados todos los campos
        this.fechaCaptura = ionicDate.toISOString();
        let fecha = this.fechaPromesa.split("T");
        let dateString = fecha[0];
        let newDate = new Date(dateString).toISOString();

        let fecha1 = this.fechaPromesa.split("T");
        let dateString1 = fecha1[0];
        let newDate1 = new Date(dateString1).toISOString();
        console.log(dateString);
        console.log(newDate);
         await this.getPosition()



          let data = {
            id : this.idAccountSqlite,
            account : this.account,
            idtarea: this.idTarea,
            idObservacion: this.idObservacion,
            idAspUser: this.idAspuser,
            idDescripcion: this.idDescripcion,
            idNiple: this.idNiple,
            conclusiones: this.conclusiones,
            fechaCaptura: this.fechaCaptura,
            fechaPromesa: newDate,
            fechaProximaVisita: newDate1,
            horaFin: this.horaFin,
            horaIni: this.horaIni,
            latitud: this.latitud,
            longitud: this.longitud,
            lectura: this.lectura,
            telefonoContacto: this.telefonoContacto,
            personaContacto : this.personaContacto
          };
console.log(data)

         await this.gestionReductor(data); 
         this.exit()
         
        
      }
    }
  }

  
  async gestionReductor(data) {
    await this.service.gestionReductor(data);
   // this.detectedChanges = false;
  }
  activateObservacion() {
    this.isObservacion = false;
  }
  activateFecha() {
    this.isFecha = false;
  }
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
}
