import { Component } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SQLiteObject, SQLite } from '@ionic-native/sqlite/ngx';
import { RestService } from '../app/services/rest.service';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation/ngx';
import { QuerysService } from './services/querys.service';
//import * as firebase from 'firebase'

import { AngularFirestore } from '@angular/fire/firestore';
import { MessagesService } from './services/messages.service';
import { Storage } from '@ionic/storage';
import { auth } from 'firebase';
import { UsersFirebaseService } from './services/users-firebase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {


  constructor(
    private query: QuerysService,
    private backgroundGeolocation: BackgroundGeolocation,
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private sqlite: SQLite,
    private service: RestService,
    private androidPermissions: AndroidPermissions,
    private db: AngularFirestore,
    private auth: AuthService,
    private mensaje: MessagesService,
    private storage: Storage,
    private firebase: UsersFirebaseService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.splashScreen.hide();
      this.statusBar.styleDefault();

      this.createDB();
      this.BackGroundGeolation()
      this.getPermission()

    });
  }

  //////////////////////solicita los fucking permisos
  async getPermission() {
    this.androidPermissions.requestPermissions(
      [
        this.androidPermissions.PERMISSION.CAMERA,
        this.androidPermissions.PERMISSION.READ_PHONE_STATE,
        this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      ])
  }

  //Creacion de las tablas de la app
  createDB() {
    let table = this.query.getTables()
    this.sqlite.create({
      name: 'implementtaMovil.db',
      location: 'default'
    })
      .then(async (db: SQLiteObject) => {
        this.service.setDatabase(db);

        await db.executeSql(table.tableAbogado, []);
        await db.executeSql(table.tableGestor, []);
        await db.executeSql(table.tableRecorrido, []);
        await db.executeSql(table.tableFotos, []);
        await db.executeSql(table.tableImplementta, [])
        await db.executeSql(table.tablePropietario, [])
        await db.executeSql(table.tableReductor, [])
        await db.executeSql(table.tableCarta, [])
        await db.executeSql(table.tableValores, []);
        await db.executeSql(table.tableInspeccion, []);
        await db.executeSql(table.tableDomicilios, [])
      })
      .catch(e => console.log(e));
  }

  createTables() {

  }
  BackGroundGeolation() {

    const config: BackgroundGeolocationConfig = {

      desiredAccuracy: 10,
      stationaryRadius: 20,
      distanceFilter: 10,
      interval: 300000, //300000
      fastestInterval: 5000,
      notificationTitle: 'Implementta Móvil',
      notificationText: 'Activado',
      debug: false, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: true, // enable this to clear background location settings when the app terminates
    };

    this.backgroundGeolocation.configure(config)
      .then(() => {
        this.backgroundGeolocation
          .on(BackgroundGeolocationEvents.location)
          .subscribe((location: BackgroundGeolocationResponse) => {
            console.log(location);

            const user = auth().currentUser;
            if (user != null) {
              console.log("Entra a checar el status de activacion")
              console.log(user);
              this.checkStatus(user.uid)
            }
            this.saveLocation(location)
          });

      });

    // start recording location
    this.backgroundGeolocation.start();
    // If you wish to turn OFF background-tracking, call the #stop method.
    this.backgroundGeolocation.stop();
  }
  async saveLocation(location) {
    let lat = location.latitude;
    let lng = location.longitude
    let idAspuser = await this.storage.get('IdAspUser')
    let idPlaza = await this.storage.get('IdPlaza')
    if (idAspuser == null || idAspuser == undefined) {
      console.log(idAspuser, 'el idaspuser del recorrido')
      console.log(idPlaza, 'el id de la plaza')
      console.log('Sesion inactiva')

    } else {
      console.log(idAspuser, 'el idaspuser del recorrido')
      console.log(idPlaza, 'el id de la plaza')
      console.log('Sesion activa')

      var dateDay = new Date().toISOString();
      let date: Date = new Date(dateDay);
      let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()));
      let fecha = ionicDate.toISOString();

      this.service.saveLocation(lat, lng, idAspuser, fecha)//guarda localmente
      this.service.guardarSQl(lat, lng, idAspuser, fecha);
      this.firebase.subirLatLong(lat, lng);
    }

  }
  checkStatus(uid) {
    this.db.collection('usersImplementta').doc(uid).valueChanges().subscribe((res: any) => {

      console.log("imprime el array donde viene el status")
      console.log(res.isActive)
      if (!res.isActive) {

        this.auth.logout();
        this.mensaje.showAlert("Tu usuario ha sido desactivado, por favor contacta con tu coordinador")
      }
    })
  }
}
