import { Component, OnInit } from "@angular/core";
import { Storage } from "@ionic/storage";
import { RestService } from "../services/rest.service";
import { ModalController, LoadingController } from "@ionic/angular";
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import { MessagesService } from "../services/messages.service";
import { Geolocation } from "@ionic-native/geolocation/ngx";
import { IoTThingsGraph } from 'aws-sdk';

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
  siSuperviso: boolean = false;
  horas: boolean = false;
  niple: boolean = false;
  loading: any;
  fechaActual: string = "";
  ///////////////////////////////////Variables de la gestion///////////////////

  idDescripcion: number = 0;
  idObservacion: number = 0;
  lectura: string = "";
  conclusiones: string = "";
  //personaContacto: string = "";
  //telefonoContacto: string = "";
  fechaPromesa: string = "1999-09-09";
  fechaCaptura: string = "";
  fechaProximaVisita: string = "1999-09-09";
  horaIni: string = "00:00:00";
  horaFin: string = "00:00:00";
  latitud: number;
  longitud: number;
  idNiple: number = 0;
  imgs: any

  isDescription: boolean = false;
  isObservacion: boolean = false;
  isFecha: boolean = false;
  indicadorImagen: number = 0;



  isAgua: boolean = false;
  idTipoServicio: number = 0;
  idTipoToma: number = 0;
  idEstatusToma: number = 0;
  activaEstatusToma: boolean = false;
  isEstatusToma: boolean = false;
  isTipoToma: boolean = false;

  takePhoto: boolean;
  muestraCampoObservacion: boolean = false; // muestra el campo de las observaciones normales si es true
  descripcion: string = ""; // valor del campo descripcion
  muestraCampoDescripcion: boolean = false; // muestra el campo descripcion si la observacion es toma directa en la no colocacion de reductor
  isDescripcionN: boolean = false; // si el campo descripcion ya esta activo es obligatorio

  muestraDescripcionMulta: boolean = false; // muestra el campo de descripcionMulta si es true ---- Toma directa, Derivacion de toma, Restriccion infringida ...
  idDescripcionMulta: number = 0;
  isDescripcionMulta: boolean = false;
  tipoServicioImplementta: string;
  infoImage: any[];

  // estos atributos son solo para la plaza de mexicali
  mexicali: boolean = false; // para ver si la plaza es mexicali
  noInstaloMexicali: boolean = false; // se volvera true si la plaza es mexicali y si elige no instalo niple
  muestraCampoDetalle: boolean = false; // se volvera true si la plaza es mexicali y si elige medidor x dentro
  idDetalle: number = 0; // recibe el valor del campo detalle
  isDetalle: boolean = false; // para indicar que se debe de llenar el campo
  muestraCampoMedidorTapado: boolean = false; // para mostrar el campo de medidor tapado cuando sea la observacion de medidor obstruido
  idMedidorTapado: number = 0; // recibe el valor del medidor obstruido
  isMedidorTapado: boolean = false; // para indicar que debe de llenarse ese campo
  muestraCampoTipoReductor: boolean = false; // para mostrar el campo de tipoReductor cuando si instalo niple
  idTipoReductor: number = 0; // recibe el valor del tipoReductor
  isTipoReductor: boolean = false; // para indicar que se debe de llenar este campo
  muestraCampoCincho: boolean = false; // para mostrar el campo de noCincho cuando si instalo niple
  noCincho: string = ''; // recibe el valor de noCincho
  isCincho: boolean = false; // para indicar que se debe de llenar este campo
  idEstatusRequerimiento: number = 0; // recibe el valos del estatus requerimiento, siempre se tendra que llenar en mexicali  
  isEstatusRequerimiento: boolean = false; // para indicar que se debe de llenar este campo



  tijuana: boolean = false; // esta es solo para quitar el campo de niple en tijuana tambien




  constructor(
    private camera: Camera,
    private service: RestService,
    private storage: Storage,
    private modalController: ModalController,
    private mensaje: MessagesService,
    private webview: WebView,
    private loadingController: LoadingController,
    private geolocation: Geolocation
  ) {
    this.imgs = [{ imagen: 'assets/img/imgs.jpg' }];
    this.takePhoto = false;
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
    this.tipoServicioImplementta = this.infoAccount[0].tipoServicio;
    console.log(this.tipoServicioImplementta);

    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss();
    }
    this.activateAction(this.idTarea, 1);
  }
  exit() {
    this.modalController.dismiss();
  }
 async takePic(type) {
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
      quality: 40,
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
        this.takePhoto = true;
        this.imgs.push({ imagen: this.image })

        if (this.indicadorImagen == 1) { this.imgs.splice(0, 1) }
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
    console.log(action);
    console.log("muestra campo observacion", this.muestraCampoObservacion);
    switch (action) {
      case "1":
        if (this.mexicali == true) {
          this.muestraCampoTipoReductor = true; // muestra el campo de tipo de reductor (birlo o rondana)
          this.muestraCampoCincho = true;
          this.niple = false; // el campo de niple se desactiva en mexicali y tijuana
          this.horas = true;
          this.muestraCampoObservacion = false;
          this.siSuperviso = false;
          break;
        } else if (this.tijuana == true) {
          this.niple = false;
          break
        }
        else {
          this.niple = true;
          this.horas = true;
          this.muestraCampoObservacion = false;
          this.siSuperviso = false;
          this.muestraCampoTipoReductor = false;
          //this.muestraObservacionesMulta = false;
          break;
        }
      case "2":
        if (this.mexicali == true) {
          console.log("No instalo niple reductor y es mexicali debe de mostrar solo 4 items en las observaciones");
          this.noInstaloMexicali = true;
          this.noInstalo = false;
          this.noRetiro = false;
          this.noSuperviso = false;
          this.noTaponeo = false;
          this.siSuperviso = false;
          this.horas = false;
          this.niple = false;
          this.muestraCampoObservacion = true;
          this.muestraCampoTipoReductor = false;
          this.muestraCampoCincho = false;
          break
        } else {
          this.noInstalo = true;
          this.noRetiro = false;
          this.noSuperviso = false;
          this.noTaponeo = false;
          this.siSuperviso = false;
          this.horas = false;
          this.niple = false;
          this.muestraCampoObservacion = true;
          //this.muestraObservacionesMulta = false;
          break;
        }
      case "3":
        this.muestraCampoObservacion = false;
        this.siSuperviso = false;
        //this.muestraObservacionesMulta = false;
        break;
      case "4":
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = true;
        this.siSuperviso = false;
        this.horas = false;
        this.niple = false;
        this.muestraCampoObservacion = true;
        //this.muestraObservacionesMulta = false;
        break;
      case "5":
        this.muestraCampoObservacion = true;
        this.siSuperviso = true;
        this.noTaponeo = false;
        console.log("Si superviso muestra campos de multas");
        //this.muestraObservacionesMulta = true;
        break;
      case "6":
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = true;
        this.siSuperviso = false;
        this.horas = false;
        this.niple = false;
        this.muestraCampoObservacion = true;
        //this.muestraObservacionesMulta = false;
        break;
      case "7":
        this.muestraCampoObservacion = false;
        this.siSuperviso = false;
        //this.muestraObservacionesMulta = false;
        break;
      case "8":
        this.noInstalo = false;
        this.noRetiro = false;
        this.noSuperviso = false;
        this.noTaponeo = true;
        this.horas = false;
        this.niple = false;
        this.muestraCampoObservacion = true;
        this.siSuperviso = false;
        //this.muestraObservacionesMulta = false;
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


  validaDescripcionMulta() {
    this.isDescripcionMulta = false;
  }

  validaDetalle() {
    this.isDetalle = false;
  }

  validaMedidorTapado() {
    this.isMedidorTapado = false;
  }

  validaTipoReductor() {
    this.isTipoReductor = false;
  }

  validaCampoCincho() {
    this.isCincho = false;
  }

  validaCampoRequerimiento() {
    this.isEstatusRequerimiento = false;
  }



  //  async Verify() {
  //     var dateDay = new Date().toISOString();
  //     let date: Date = new Date(dateDay);
  //     let ionicDate = new Date(
  //       Date.UTC(
  //         date.getFullYear(),
  //         date.getMonth(),
  //         date.getDate(),
  //         date.getHours(),
  //         date.getMinutes(),
  //         date.getSeconds()
  //       )
  //     );


  //   // validacion para los campos de mexicali
  //   if (this.mexicali == true) {

  //     if (this.idDescripcion.toString() == '2') {
  //       console.log("Validaciones para cuando no se instalo niple reductor");
  //       if ((this.idObservacion.toString() == '3' && this.idDetalle == 0) || (this.idObservacion.toString() == '8' && this.idMedidorTapado == 0)) {
  //         if (this.idDetalle == 0) {
  //           this.isDetalle = true;
  //         }

  //         if (this.idMedidorTapado == 0) {
  //           this.isMedidorTapado = true;
  //         }
  //         this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
  //       }
  //     }
  //     else if (this.idDescripcion.toString() == '1') {
  //       console.log("Validaciones para cuando si se instalo niple reductor");
  //       if (this.idTipoReductor == 0) {
  //         this.isTipoReductor = true;
  //       }

  //       if (this.noCincho = "") {
  //         this.isCincho = true;
  //       }
  //       this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
  //     }

  //     if (this.idEstatusRequerimiento == 0) {
  //       this.isEstatusRequerimiento = true;
  //       this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
  //     }
  //   }// termina la validacion de mexicali


  //   //validacion de campos principales
  //   if (this.idDescripcion == 0 || this.fechaProximaVisita === "1999-09-09" || this.idEstatusToma == 0 ||
  //     this.idTipoToma == 0 || this.takePhoto == false) {

  //     console.log("Algunos de los campos principales no se ha llenado");

  //     if (this.idDescripcion == 0) {
  //       this.isDescription = true;
  //     }
  //     if (this.fechaProximaVisita === "1999-09-09") {
  //       this.isFecha = true;
  //     }

  //     if (this.idEstatusToma == 0) {
  //       this.isEstatusToma = true;
  //     }

  //     if (this.idTipoToma == 0) {
  //       this.isTipoToma = true;
  //     }

  //     this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");

  //   } else { // este else es el de la primer validacion de los campos principales
  //     console.log("Campos principales llenados correctamente");

  //     if ( // validacion interna o segunda validacion
  //       (this.idDescripcion.toString() == "2" ||
  //         this.idDescripcion.toString() == "4" ||
  //         this.idDescripcion.toString() == "5" ||
  //         this.idDescripcion.toString() == "6" ||
  //         this.idDescripcion.toString() == "8") &&
  //       this.idObservacion == 0
  //     ) {

  //       this.isObservacion = true;
  //       this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");

  //     }

  //     else if (this.idDescripcion.toString() == "2" && this.idObservacion.toString() == "1" && this.descripcion == "") {
  //       this.isDescripcionN = true;
  //       this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
  //     } else if (this.idDescripcion.toString() == "5" && this.idObservacion.toString() == "34" && this.idDescripcionMulta == 0) {
  //       this.isDescripcionMulta = true;
  //       this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
  //     } 

  //     else { // si pasa toda la validacion interna o segunda validacion
  //       /////////////////////Aqui se hace el proceso de gestion ya validados todos los campos
  //       console.log("Pasa la validacion de los campos secundarios por lo cual paso toda la validacion");
  //       this.fechaCaptura = ionicDate.toISOString();
  //       let fecha = this.fechaPromesa.split("T");
  //       let dateString = fecha[0];
  //       let newDate = new Date(dateString).toISOString();

  //       let fecha1 = this.fechaPromesa.split("T");
  //       let dateString1 = fecha1[0];
  //       let newDate1 = new Date(dateString1).toISOString();
  //       console.log(dateString);
  //       console.log(newDate);
  //       await this.getPosition()


  //       let data = {
  //         id: this.idAccountSqlite,
  //         account: this.account,
  //         idtarea: this.idTarea,
  //         idObservacion: this.idObservacion,
  //         idAspUser: this.idAspuser,
  //         idDescripcion: this.idDescripcion,
  //         idNiple: this.idNiple,
  //         conclusiones: this.conclusiones,
  //         fechaCaptura: this.fechaCaptura,
  //         fechaPromesa: newDate,
  //         fechaProximaVisita: newDate1,
  //         horaFin: this.horaFin,
  //         horaIni: this.horaIni,
  //         latitud: this.latitud,
  //         longitud: this.longitud,
  //         lectura: this.lectura,
  //         telefonoContacto: '',
  //         personaContacto: '',
  //         idTipoServicio: this.idTipoServicio,
  //         idEstatusToma: this.idEstatusToma,
  //         idTipoToma: this.idTipoToma,
  //         descripcionTomaDirecta: this.descripcion,
  //         idDescripcionMulta: this.idDescripcionMulta,
  //         idDetalle: this.idDetalle,
  //         idMedidorTapado: this.idMedidorTapado,
  //         idTipoReductor: this.idTipoReductor,
  //         noCincho: this.noCincho,
  //         idEstatusRequerimiento: this.idEstatusRequerimiento
  //       };
  //       console.log(data)

  //       await this.gestionReductor(data);
  //       this.exit()


  //     } // else de los campos secundarios
  //   } // else de los campos principales
  //}


  async Verify() {
    // llamar al metodo de la primera validacion que es la de los campos principales
    if (this.validaCamposPrincipales() == true) {
      // si es true verificamos si es mexicali y mandamos a traer al metodo d ela validacion de mexicali
      console.log("Datos principales llenados");
      if (this.mexicali == true) {
        console.log("Es mexicali");
        if (this.validaCamposMexicali() == true) {
          console.log("Campos de mexicali llenados");
          if (this.validaCamposSecundarios() == true) {
            // traer al metodo del envio de datos
            console.log("Campos secundarios llenados");
            this.datosValidados();
          }
        }
      } else {
        // mandamos a traer el metodo de la segunda validacion
        if (this.validaCamposSecundarios() == true) {
          console.log("Campos secundarios llenados");
          this.datosValidados();
        }
      }
    } // validaCamposPrincipales 
  } // verify



  validaCamposPrincipales() {
    console.log("Entrando a validar campos principales");
    if (this.idDescripcion == 0 || this.fechaProximaVisita === "1999-09-09" || this.idEstatusToma == 0 ||
      this.idTipoToma == 0 || this.takePhoto == false) {

      console.log("Algunos de los campos principales no se ha llenado");

      if (this.idDescripcion == 0) {
        this.isDescription = true;
      }
      if (this.fechaProximaVisita === "1999-09-09") {
        this.isFecha = true;
      }

      if (this.idEstatusToma == 0) {
        this.isEstatusToma = true;
      }

      if (this.idTipoToma == 0) {
        this.isTipoToma = true;
      }

      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else {
      return true
    }
  }

  validaCamposSecundarios() {
    if ((this.idDescripcion.toString() == "2" ||
      this.idDescripcion.toString() == "4" ||
      this.idDescripcion.toString() == "5" ||
      this.idDescripcion.toString() == "6" ||
      this.idDescripcion.toString() == "8") &&
      this.idObservacion == 0
    ) {

      this.isObservacion = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      console.log("retornando false en los campos secundarios");
      return false;
    }

    else if (this.idDescripcion.toString() == "2" && this.idObservacion.toString() == "1" && this.descripcion == "") {
      this.isDescripcionN = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else if (this.idDescripcion.toString() == "5" && this.idObservacion.toString() == "34" && this.idDescripcionMulta == 0) {
      this.isDescripcionMulta = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      console.log("retornando false en los campos secundarios");
      return false;
    } else {
      console.log("Campos secundarios validados");
      return true;
    }
  }


  validaCamposMexicali() {
    // validacion para los campos de mexicali
    if (this.idEstatusRequerimiento == 0) {
      this.isEstatusRequerimiento = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      console.log("retorna false en mexicali");
      return false;
    } else if (this.idDescripcion.toString() == '2' && this.idObservacion.toString() == '3' && this.idDetalle == 0) {
      this.isDetalle = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else if (this.idDescripcion.toString() == '2' && this.idObservacion.toString() == '8' && this.idMedidorTapado == 0) {
      this.isMedidorTapado = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else if (this.idDescripcion.toString() == '1' && this.idTipoReductor == 0) {
      this.isTipoReductor = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else if (this.idDescripcion.toString() == '1' && this.noCincho == "") {
      this.isCincho = true;
      this.mensaje.showAlert("Verifica todos los campos con * y que minimo haya una foto capturada");
      return false;
    } else {
      return true;
    }
  }



async datosValidados() {
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
    id: this.idAccountSqlite,
    account: this.account,
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
    telefonoContacto: '',
    personaContacto: '',
    idTipoServicio: this.idTipoServicio,
    idEstatusToma: this.idEstatusToma,
    idTipoToma: this.idTipoToma,
    descripcionTomaDirecta: this.descripcion,
    idDescripcionMulta: this.idDescripcionMulta,
    idDetalle: this.idDetalle,
    idMedidorTapado: this.idMedidorTapado,
    idTipoReductor: this.idTipoReductor,
    noCincho: this.noCincho,
    idEstatusRequerimiento: this.idEstatusRequerimiento
  };
  console.log(data)

  await this.gestionReductor(data);
  this.exit()
}


async gestionReductor(data) {
  await this.service.gestionReductor(data);
  // this.detectedChanges = false;
}
activateObservacion(event) {
  this.isObservacion = false;
  // si se selecciona la opcion de se encontro toma directa va a mostrar el campo nuevo descripcion a partir de la version 1.3.1
  const opcion = event.detail.value;
  console.log(opcion);
  if (this.mexicali == true) {
    if (opcion == 3) {
      console.log("Muestra el campo del medidor dentro del predio");
      this.muestraCampoDetalle = true;
      this.muestraCampoMedidorTapado = false;
    } else if (opcion == 8) {
      console.log("Muestra el campo del medidor tapado");
      this.muestraCampoMedidorTapado = true;
      this.muestraCampoDetalle = false;
    } else {
      this.muestraCampoDetalle = false;
      this.muestraCampoMedidorTapado = false;
    }
  }

  if (opcion == 1) {
    this.muestraCampoDescripcion = true;
  } else if (opcion == 34) {
    this.muestraDescripcionMulta = true;
  } else {
    this.muestraDescripcionMulta = false;
    this.muestraCampoDescripcion = false;

  }


}


validaCampoDescripcion() {
  this.isDescripcionN = false;
}

activateFecha() {
  this.isFecha = false;
}

activateEstatusToma(event) {
  this.isEstatusToma = false;
  //this.detectedChanges = true;
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





async getIdPlaza() {
  let tipoPlaza = await this.storage.get("TipoPlazaServicio");
  console.log(tipoPlaza);
  if (tipoPlaza === 'Agua') {
    console.log('Esta es una plaza de agua');
    this.isAgua = true;
    this.mexicali = false;
    // if(tipoPlaza[0].NombrePlaza == 'Tijuana') {
    //   this.version131 = true;
    // }
  }
  // esta opcion es para que la plaza de mexicali tenga cambios en el formulario 
  else if (tipoPlaza === 'Agua Mexicali') {
    console.log("Esta plaza es Mexicali agua");
    this.isAgua = true;
    this.mexicali = true;
  } else if (tipoPlaza === 'Agua Tijuana') {
    console.log("Esta plaza es Tijuana agua");
    this.isAgua = true;
    this.tijuana = true;
  }

  else {
    console.log("Esta es una plaza de predio");
    this.isAgua = false;
    this.isTipoToma = false;
    this.isEstatusToma = false;
    this.idTipoServicio = 100;
    this.idEstatusToma = 100;
    this.idTipoToma = 100;
    this.isDescripcionN = false;
    this.isDescripcionMulta = false;
    this.mexicali = false;
    this.tijuana = false;
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
