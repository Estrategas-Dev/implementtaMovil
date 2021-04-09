import { Component, OnInit } from '@angular/core';
import { GoogleMaps, GoogleMap, Marker, GoogleMapsAnimation, MyLocation, GoogleMapOptions, GoogleMapsMapTypeId }
  from '@ionic-native/google-maps';
import { LoadingController, ToastController, Platform, ModalController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { Router } from '@angular/router';
import { HistoricoAsistenciaPage } from '../historico-asistencia/historico-asistencia.page';

@Component({
  selector: 'app-checador-home',
  templateUrl: './checador-home.page.html',
  styleUrls: ['./checador-home.page.scss'],
})
export class ChecadorHomePage implements OnInit {


  map: GoogleMap;
  loading: any;
  nombre: string;
  plaza: string
  idPlaza: string;
  email: string
  latitud: string;
  longitud: string;
  reloj: string
  constructor(public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, private platform: Platform,
    private storage: Storage, private service: RestService, private modalController: ModalController) { }
  async ngOnInit() {
    await this.platform.ready();
    await this.loadMap();

  }



  async getInfo() {
    this.nombre = await this.storage.get('Nombre')
    this.email = await this.storage.get('Email')
    this.plaza = await this.storage.get('Plaza')
    this.idPlaza = await this.storage.get('IdOficina')
    console.log(this.nombre, this.email, this.plaza, this.idPlaza)
  }
  async loadMap() { //realiza la carga del mapa
    let options: GoogleMapOptions = {
      mapType: GoogleMapsMapTypeId.ROADMAP,
      controls: {
        'compass': true,
        'myLocationButton': true,
        'myLocation': true,   // (blue dot)
        'mapToolbar': true     // android only
      },
      gestures: {
        scroll: true,
        tilt: true,
        zoom: true,
        rotate: true
      }
    }

    this.map = GoogleMaps.create('map_canvas', options);

    this.loading = await this.loadingCtrl.create({
      message: 'Cargando mapa...'
    });
    await this.loading.present();

    // Get the location of you
    this.map.getMyLocation().then((location: MyLocation) => {
      this.loading.dismiss();
      console.log(JSON.stringify(location, null, 2));
      this.latitud = location.latLng.lat.toString();
      this.longitud = location.latLng.lng.toString();
      // Move the map camera to the location with animation
      this.map.animateCamera({
        target: location.latLng,
        zoom: 12,
        tilt: 30
      });
      let marker: Marker = this.map.addMarkerSync({
        title: 'Mi ubicación actual',
        position: location.latLng,
        animation: GoogleMapsAnimation.BOUNCE
      });

      // show the infoWindow
      marker.showInfoWindow();

      // carga los markers */
    })
      .catch(err => {
        this.loading.dismiss();
        this.showToast(err.error_message);
      });
  }
  async showToast(message: string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });
    toast.present();
  }
  
  async checarEntrada() {
    if (this.latitud == "" || this.latitud == null || this.latitud == undefined) {
      alert("La ubicación no esta disponible")
    } else {
      let tipo = 1
      const iduser = await this.storage.get('IdUserChecador');
      console.log(this.latitud, this.longitud)
      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));


      let fecha = ionicDate.toISOString();

      let parametros = +tipo + ',' + iduser + ',' + '"' + fecha + '"' + ',' + this.latitud + ',' + this.longitud + ',' + '"' + fecha + '"' + ',' + this.latitud + ',' + this.longitud

      this.service.loadRegisterChecador(parametros).then(res => {
        alert(res[0].mensaje)
        console.log(res)
      })
    }

  }

  async checarSalida() {
    if (this.latitud == "" || this.latitud == null || this.latitud == undefined) {
      alert("La ubicación no esta disponible")
    } else {
      console.log(this.latitud, this.longitud);

      let tipo = 2
      const iduser = await this.storage.get('IdUserChecador');
      console.log(this.latitud, this.longitud)

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

      let fecha = ionicDate.toISOString();


      let parametros = +tipo + ',' + iduser + ',' + '"' + fecha + '"' + ',' + this.latitud + ',' + this.longitud + ',' + '"' + fecha + '"' + ',' + this.latitud + ',' + this.longitud


      this.service.loadRegisterChecador(parametros).then(res => {
        console.log(res)
        alert(res[0].mensaje)
      })
    }

  }

  async confirmarRegistroEntrada() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    let fecha = ionicDate.toISOString();
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Registrar <strong>entrada:</strong><br><strong>' + fecha + '</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.checarEntrada();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  async confirmarRegistroSalida() {
    var dateDay = new Date().toISOString();
    let date: Date = new Date(dateDay);
    let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));

    let fecha = ionicDate.toISOString();
    const alert = await this.alertController.create({
      header: 'Confirmar!',
      message: 'Registrar <strong>salida:</strong><br><strong>' + fecha + '</strong>',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Aceptar',
          handler: () => {
            this.checarSalida();
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  async historico() {
    const modal = await this.modalController.create({
      component: HistoricoAsistenciaPage,

    });

    await modal.present();
  }
}
