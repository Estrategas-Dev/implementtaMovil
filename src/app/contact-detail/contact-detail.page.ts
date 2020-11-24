import { Component, Input, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { RestService } from "../services/rest.service";
import { LoadingController, AlertController } from "@ionic/angular";
import { MessagesService } from '../services/messages.service';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.page.html',
  styleUrls: ['./contact-detail.page.scss'],
})
export class ContactDetailPage implements OnInit {

  // atributos del modulo
  @Input() account;

  nombrePropietario: string = "";
  telefonoPropietario: string = "";
  celularPropietario: string = "";
  correoPropietario: string = "";
  fechaLocalizacion: string = '1999-09-09';
  nombreUsuario: string = "";
  telefonoUsuario: string = "";
  celularUsuario: string = "";
  correoUsuario: string = "";

  fechaActual: string = ''
  idaspUser: string;


  callePredio: string = "";
  manzanaPredio: string = "";
  lotePredio: string = "";
  numeroExtPredio: string = "";
  numeroIntPredio: string = "";
  coloniaPredio: string = "";
  poblacionPredio: string = "";
  cpPredio: string = "";
  entreCalle1: string = "";
  entreCalle2: string = "";
  referenciaPredio: string = "";
  estadoPredio: string;


  calleNotificacion: string = "";
  manzanaNotificacion: string = "";
  loteNotificacion: string = "";
  numeroExtNotificacion: string = "";
  numeroIntNotificacion: string = "";
  coloniaNotificacion: string = "";
  poblacionNotificacion: string = "";
  cpNotificacion: string = "";
  entreCalle1Notificacion: string = "";
  entreCalle2Notificacion: string = "";
  referenciaNotificacion: string = "";
  estadoNotificacion: string;

  mostrarCamposDomicilios: boolean = false;

  isChange: boolean = false;
  role: number;
  user_role: string;
  userName: string;
  isChanges: boolean = false;
  loading: any

  constructor(
    private mensaje: MessagesService,
    private storage: Storage,
    private service: RestService,
    public loadingCtrl: LoadingController,
    private alertController: AlertController,
    private nativeGeocoder: NativeGeocoder,
    private geolocation: Geolocation
  ) {

  }

  async ngOnInit() {
    await this.getCrendentials();
    // this.setRole();
    this.getFechaActual();
    console.log(this.account);
  }




  getFechaActual() {
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

    this.fechaActual = ionicDate.toISOString();
    console.log('Esta es la fecha Actual :::::::::::' + this.fechaActual)

  }

  // setRole() {
  //   switch (this.role) {
  //     case 1:
  //       this.user_role = "Administrador";
  //       break;
  //     case 2:
  //       this.user_role = "Gestor ejecutivo";
  //       break;
  //     case 5:
  //       this.user_role = "Gestor cobranza";
  //       break;
  //     case 7:
  //       this.user_role = "Reductor";
  //       break;
  //     default:
  //       this.user_role = "Superman";
  //   }
  // }


  async getCrendentials() {
    this.userName = await this.storage.get("UserName");
    this.user_role = await this.storage.get("IdRol");
    this.idaspUser = await this.storage.get("IdAspUser");
  }



  // --------------------------------------------------------------------------------------//
  // validacion de datos de propietario y usuarios 

  isChanged() {
    this.isChange = true
  }


  async saveConfirm(type) {
    console.log(this.isChange)
    if (this.isChange == true) {

      if (this.fechaLocalizacion == '1999-09-09' && type == 1) { this.mensaje.showAlert('Ingresa la fecha de localización') }
      else {
        const alert = await this.alertController.create({
          header: "Confirmar!",
          message:
            "La información editada se guardará y se verá reflejada despues de sincronizar con el servidor de implementta!!!",
          buttons: [
            {
              text: "Cancelar",
              role: "cancel",
              cssClass: "secondary",
              handler: blah => {
                console.log("Confirm Cancel: blah");
                this.isChange = false
              }
            },
            {
              text: "Guardar",
              handler: () => {
                this.saveDataPropietario(type);
                this.isChange = false
              }
            }
          ]
        });

        await alert.present();
      }
    }
    else { this.mensaje.showAlert('No hay cambios detectados para guardar :(') }
  }


  saveDataPropietario(type) {
    let fecha = this.fechaLocalizacion.split("T");
    let dateString = fecha[0];
    let newDate = new Date(dateString).toISOString();
    console.log(dateString);
    console.log(newDate);
    let data
    if (type == 2) {
      data = {
        cuenta: this.account,
        nombre: this.nombreUsuario,
        telefono: this.telefonoUsuario,
        celular: this.celularUsuario,
        correo: this.correoUsuario,
        fecha: newDate,
        fechaCaptura: this.fechaActual,
        idaspUser: this.idaspUser,
        idRol: this.user_role,
        type: type
      };
    } else {
      data = {
        cuenta: this.account,
        nombre: this.nombrePropietario,
        telefono: this.telefonoPropietario,
        celular: this.celularPropietario,
        correo: this.correoPropietario,
        fecha: newDate,
        fechaCaptura: this.fechaActual,
        idaspUser: this.idaspUser,
        idRol: this.user_role,
        type: type
      };
    }
    console.log(data);
    this.service.setPropietario(data);
  }

  // termina validacion de datos de propietario y usuarios 

  // ------------------------------------------------------------------- // 

  // validacion de datos de domicilios 



  detectedChanges() {
    console.log('Hay Cambios en domicilios')
    this.isChanges = true;
  }

  async getDirection(type) {

    this.loading = await this.loadingCtrl.create({
      message: 'Buscando dirección'
    });
    await this.loading.present();

    this.geolocation.getCurrentPosition().then(response => {
      console.log(response)
      let latitud = response.coords.latitude;
      let longitud = response.coords.longitude;
      this.getGeoData(latitud, longitud, type)
    })
      .catch(async error => {

        console.log(error);
      })


  }
  getGeoData(lat, lng, type) {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };
    console.log(lat, lng)
    this.nativeGeocoder.reverseGeocode(lat, lng, options)
      .then((result: NativeGeocoderResult[]) => {

        let data = {
          cp: result[0].postalCode,
          estado: result[0].administrativeArea,
          poblacion: result[0].locality,
          colonia: result[0].subLocality,
          calle: result[0].thoroughfare,
          numero: result[0].subThoroughfare
        }

        this.presentResult(data, type)
        this.loading.dismiss();
      }

      ).catch((error: any) => {
        console.log(error);
        alert(error);
        this.loading.dismiss();
      });
  }



  async presentResult(data, type) {

    const alert = await this.alertController.create({
      header: 'Direccion encontrada',
      message: 'Calle: <strong>' + data.calle + '</strong><br>Numero: <strong>' + data.numero + '</strong><br>Colonia: <strong>' + data.colonia + '</strong><br> Poblacion:<strong> ' + data.poblacion + '</strong><br>Codigo postal: <strong>' + data.cp + '</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Guardar dirección',
          handler: () => {
            this.setNewAddress(data, type)
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  setNewAddress(data, type) {
    if (type == 1) {
      this.cpPredio = data.cp
      this.estadoPredio = data.estado
      this.poblacionPredio = data.poblacion
      this.coloniaPredio = data.colonia
      this.callePredio = data.calle
      this.numeroExtPredio = data.numero
    } else {
      this.cpNotificacion = data.cp
      this.estadoNotificacion = data.estado
      this.poblacionNotificacion = data.poblacion
      this.coloniaNotificacion = data.colonia
      this.calleNotificacion = data.calle
      this.numeroExtNotificacion = data.numero
    }
    this.isChanges = true
  }




  async saveChanges(type) {
    console.log(this.isChanges)
    if (this.isChanges) {

      this.loading = await this.loadingCtrl.create({
        message: 'Guardando los datos...'
      });
      await this.loading.present();
      if (type == 1) {
        let data = {
          cuenta: this.account,
          cp: this.cpPredio,
          estado: this.estadoPredio,
          poblacion: this.poblacionPredio,
          colonia: this.coloniaPredio,
          calle: this.callePredio,
          numExt: this.numeroExtPredio,
          numInt: this.numeroIntPredio,
          calle1: this.entreCalle1,
          calle2: this.entreCalle2,
          lote: this.lotePredio,
          manzana: this.manzanaPredio,
          referencia: this.referenciaPredio,
          fechaCaptura: this.fechaActual,
          idaspUser: this.idaspUser,
          idRol: this.user_role,
          type: 1
        }

        this.service.setDireccion(data);
      } else {
        let data = {
          cuenta: this.account,
          cp: this.cpNotificacion,
          estado: this.estadoNotificacion,
          poblacion: this.poblacionNotificacion,
          colonia: this.coloniaNotificacion,
          calle: this.calleNotificacion,
          numExt: this.numeroExtNotificacion,
          numInt: this.numeroIntNotificacion,
          calle1: this.entreCalle1Notificacion,
          calle2: this.entreCalle2Notificacion,
          lote: this.loteNotificacion,
          manzana: this.manzanaNotificacion,
          referencia: this.referenciaNotificacion,
          fechaCaptura: this.fechaActual,
          idaspUser: this.idaspUser,
          idRol: this.user_role,
          type: 2
        }

        this.service.setDireccion(data);
      }
      this.loading.dismiss();
      this.mensaje.showAlert('Los cambios almacenados se veran reflejados despues de sincronizar la aplicación')
    } else {
      this.mensaje.showAlert('No hay cambios detectados en domicilios :(')
    }
  }



  // termina validacion de datos de domicilios


  mostrarDomicilio() {
    this.mostrarCamposDomicilios = true;
  }

  ocultarDomicilio() {
    this.mostrarCamposDomicilios = false;
  }




}




