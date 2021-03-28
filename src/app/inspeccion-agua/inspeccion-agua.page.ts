import { Component, OnInit, ViewChild } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Storage } from "@ionic/storage";
import { MessagesService } from '../services/messages.service';
import { ModalController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { WebView } from '@ionic-native/ionic-webview/ngx';
import { UsersFirebaseService } from '../services/users-firebase.service';
import { Camera, CameraOptions } from "@ionic-native/camera/ngx";
import { Geolocation } from "@ionic-native/geolocation/ngx";

@Component({
  selector: 'app-inspeccion-agua',
  templateUrl: './inspeccion-agua.page.html',
  styleUrls: ['./inspeccion-agua.page.scss'],
})
export class InspeccionAguaPage implements OnInit {

  account: string = "";
  cuentaCapturada: string = '';
  clave: string = '';
  ordenInspeccion: string = '';
  numeroMedidor: string = ''
  idTipoServicio: number = 0
  pozoConagua: string = '';
  idTipoHallazgo: number = 0;
  otroHallazgo: string = ''
  observacion: string = '';
  imgs: any;
  nombreInspectores = []; // donde se guardaran todos los inspectores de la plaza
  nombreInspectorLogueado: string = '';
  inspector2: string = '';
  inspector3: string = '';
  inspector4: string = '';
  tipoServicioImplementta: string = '';

  // campos generales
  latitud: number;
  longitud: number;
  fechaCaptura: string = "";
  idAspuser: string = "";
  idTareaGestor: number = 0;
  fechaActual: string;
  g: any;
  t: any;
  infoAccount: any[];
  image: string = "";
  isPhoto: boolean = false;
  isMotive: boolean = false;
  tareaAsignada: string;
  idAccountSqlite: number;
  loading: any;
  userInfo: any;
  indicadorImagen: number = 0;
  infoImage: any[];
  //takePhoto: boolean;


  // validaciones de campos
  activaOtrosHallazgos: boolean = false;
  mostrarInspectores: boolean = false;
  inspectores: boolean = false; // para mostrar la lista de inspectores
  detectedChanges: boolean = false;

  constructor(
    private service: RestService,
    private storage: Storage,
    private mensaje: MessagesService,
    private geolocation: Geolocation,
    private webview: WebView,
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private camera: Camera,
    private usersFirebase: UsersFirebaseService
  ) {
    this.imgs = [{ imagen: "assets/img/imgs.jpg" }];
  }

  async ngOnInit() {
    await this.platform.ready();
    await this.getInfoAccount();
    this.getTotals();
    this.getFechaActual();
  }


  sliderOpts = {
    zoom: true,
    slidesPerView: 1.55,
    spaceBetween: 10,
    centeredSlides: true
  };

  ionViewWillLeave() {
    if (this.detectedChanges) {
      this.mensaje.showAlert(
        "La gestión no se guardará, tendras que capturar de nuevo"
      );
    }
  }


  resultHallazgo(event) {
    this.detectedChanges = true;
    console.log(event.detail.value);
    if (event.detail.value === '7') {
      this.activaOtrosHallazgos = true;
    } else {
      this.activaOtrosHallazgos = false;
    }
  }

  async muestraInspectores() {
    this.mostrarInspectores = true;
    this.inspectores = true;
    const idPlaza = await this.storage.get('IdPlaza');
    this.nombreInspectorLogueado = await this.storage.get('Nombre');
    console.log(idPlaza);
    try {
      this.service.getNombreInspectores(idPlaza).subscribe(resp => {
        console.log(resp);
        this.nombreInspectores = resp;
      })
    } catch (error) {
      console.log("Error al traer los datos de los inspectores")
    }
  }

  ocultaInspectores() {
    this.mostrarInspectores = false;
    this.inspectores = false;
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
    if (gestionada == 1) {
      this.mensaje.showAlert("Esta cuenta ya ha sido gestionada");
      this.modalController.dismiss();
    }
  }

  async getTotals() {
    this.usersFirebase.getTotals().subscribe(async user => {
      this.userInfo = user;
      this.g = this.userInfo.managedAccounts;
      this.t = this.userInfo.totalAccounts;
    });
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


  exit() {
    this.modalController.dismiss();
  }

  async takePic(type) {
    let tipo;
    if (type == 1) {
      tipo = "Inspección evidencia";
    } else if (type == 2) {
      tipo = "Predio";
    } else if (type == 4) {
      tipo = "Inspección acta"
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
        //this.takePhoto = true;
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


  async verify() {
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

        let data = {
          account: this.account,
          cuenta: this.cuentaCapturada,
          clave: this.clave,
          ordenInspeccion: this.ordenInspeccion,
          numeroMedidor: this.numeroMedidor,
          pozoConagua: this.pozoConagua,
          idTipoServicio: this.idTipoServicio,
          idHallazgo: this.idTipoHallazgo,
          otroHallazgo: this.otroHallazgo,
          idAspUser: this.idAspuser,
          inspector2: this.inspector2,
          inspector3: this.inspector3,
          inspector4: this.inspector4,
          idTarea: this.idTareaGestor,
          fechaCaptura: this.fechaCaptura,
          latitud: this.latitud,
          longitud: this.longitud,
          id: this.idAccountSqlite
        };
        await this.gestionInspeccion(data);
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

      let data = {
        account: this.account,
        cuenta: this.cuentaCapturada,
        clave: this.clave,
        ordenInspeccion: this.ordenInspeccion,
        numeroMedidor: this.numeroMedidor,
        pozoConagua: this.pozoConagua,
        idTipoServicio: this.idTipoServicio,
        idHallazgo: this.idTipoHallazgo,
        otroHallazgo: this.otroHallazgo,
        idAspUser: this.idAspuser,
        inspector2: this.inspector2,
        inspector3: this.inspector3,
        inspector4: this.inspector4,
        idTarea: this.idTareaGestor,
        fechaCaptura: this.fechaCaptura,
        latitud: this.latitud,
        longitud: this.longitud,
        id: this.idAccountSqlite
      };
      await this.gestionInspeccion(data);
      this.loading.dismiss();
      this.exit();

    }); // catch

  }


  async gestionInspeccion(data) {
    this.detectedChanges = false;
    await this.service.gestionInspeccionAgua(data);
    console.log(data);
  }


}
