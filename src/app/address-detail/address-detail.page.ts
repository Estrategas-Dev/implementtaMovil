import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { RestService } from '../services/rest.service';
import { AccountMapPage } from '../account-map/account-map.page';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { NativeGeocoderOptions, NativeGeocoderResult, NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { MessagesService } from '../services/messages.service';


@Component({
  selector: 'app-address-detail',
  templateUrl: './address-detail.page.html',
  styleUrls: ['./address-detail.page.scss'],
})
export class AddressDetailPage implements OnInit {
latitud: string;
longitud:string;
accountNumber : string
loading : any
infoAccount : any;
predio : boolean= true;
notificacion: boolean = false;
mapa : boolean = false
  cpPredio: string;
  estadoPredio: string;
  poblacionPredio: string;
  coloniaPredio: string;
  callePredio: string;
  numeroIntPredio: string;
  manzanaPredio: string;
  lotePredio: string;
  numeroExtPredio: string;
  numIntPredio: string;
  referenciaPredio: string;
  entreCalle1: string;
  entreCalle2: string;
  cpNotificacion: string;
  estadoNotificacion: string;
  poblacionNotificacion: string;
  coloniaNotificacion: string;
  calleNotificacion: string;
  numeroIntNotificacion: string;
  manzanaNotificacion: string;
  loteNotificacion: string;
  numeroExtNotificacion: string;
  numIntNotificacion: string;
  referenciaNotificacion: string;
  entreCalle1Notificacion: string;
  entreCalle2Notificacion: string;
  isChanges: boolean;
  fechaActual: string = "";
  idaspUser: string;
  user_role: string;
  
  constructor(private loadingCtrl : LoadingController, private storage :Storage, private service : RestService, 
   private geolocation : Geolocation, private modalController : ModalController, private iab : InAppBrowser,
   private nativeGeocoder: NativeGeocoder, private alertController : AlertController,private mensaje : MessagesService) { 

  }

  async ngOnInit() {
   await this.getAccountNumber();
   await this.getCrendentials();
    this.getFechaActual();
   this.isChanges = false
  }
  ionViewDidEnter(){
    this.isActivated(0);

  }
    
  async getAccountNumber(){

    this.loading = await this.loadingCtrl.create({
    message: 'Cargando información de la cuenta...'
    });
    await this.loading.present(); 
  
        this.accountNumber = await this.storage.get("accountNumber");
        this.infoAccount = await this.service.getInfoAccount(this.accountNumber);
        this.callePredio = this.infoAccount[0].calle_predio
        this.manzanaPredio = this.infoAccount[0].manzana_predio
        this.lotePredio = this.infoAccount[0].lote_predio
        this.numeroExtPredio = this.infoAccount[0].num_exterior_predio
        this.numIntPredio = this.infoAccount[0].num_interior_predio
        this.coloniaPredio = this.infoAccount[0].colonia_predio
        this.poblacionPredio = this.infoAccount[0].poblacion_predio
        this.cpPredio = this.infoAccount[0].cp_predio
        this.latitud = this.infoAccount[0].latitud;
        this.longitud = this.infoAccount[0].longitud;
        this.referenciaPredio = this.infoAccount[0].referencia_predio
        this.entreCalle1 = this.infoAccount[0].entre_calle1_predio
        this.entreCalle2 = this.infoAccount[0].entre_calle2_predio
        this.calleNotificacion = this.infoAccount[0].calle_notificacion
        this.manzanaNotificacion = this.infoAccount[0].manzana_notificacion
        this.loteNotificacion = this.infoAccount[0].lote_notificacion
        this.numeroExtNotificacion = this.infoAccount[0].num_exterior_notificacion
        this.numeroIntNotificacion = this.infoAccount[0].num_interior_notificacion
        this.coloniaNotificacion = this.infoAccount[0].colonia_notificacion
        this.poblacionNotificacion = this.infoAccount[0].poblacion_notificacion
        this.cpNotificacion = this.infoAccount[0].cp_notificacion
        this.referenciaNotificacion = this.infoAccount[0].referencia_notificacion
        this.entreCalle1Notificacion = this.infoAccount[0].entre_calle1_notificacion
        this.entreCalle2Notificacion = this.infoAccount[0].entre_calle2_notificacion


        console.log(this.infoAccount) 
        
        this.loading.dismiss();
  
   }
   isActivated(id: number){
    switch(id){
      case 1 : this.predio = true; this.notificacion = false; this.mapa = false; break;
      case 2 :  this.predio = false; this.notificacion = true;this.mapa = false; break;
      case 3 :  this.predio = false; this.notificacion = false;this.mapa = true; break;
      default : this.predio = true; this.notificacion = false;this.mapa = false; break;
    }
    
    }
      

    async goArcgis(){
      var url =''
      const idPlaza = await this.storage.get('IdPlaza')
      switch(idPlaza){
        case '4': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find='+this.accountNumber; break;
        case '7': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=4ffee4123fa84fe2b4b88d2dc9aec1ba&find='+this.accountNumber; break;
        case '3': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find='+this.accountNumber; break;
        case '8': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=bde50fa89665458ab23aca1323b980c4&find='+this.accountNumber; break;
        case '10': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=1ff1f324e54e4b1eac49517ee239567f&find='+this.accountNumber; break;
        case '9':  url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=1ff1f324e54e4b1eac49517ee239567f&find='+this.accountNumber; break;
        case '13': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=09d157d58e464c57875e0b7e590d9b69&find='+this.accountNumber; break;
        case '12': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find='+this.accountNumber; break;
        case '11': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find='+this.accountNumber; break;
      }
      
   console.log(url)
       this.iab.create(url,"_system",{location : 'yes', zoom : 'yes'});

    }

goMapsModal(){
               let position = { lat: this.latitud, lng: this.longitud };
               this.modalController
                 .create({
                   component: AccountMapPage,
                   componentProps: {
                     position: position
                   }
                 })
                 .then(modal => {
                   modal.present();
                 });
             }

async openLink(){
  this.loading = await this.loadingCtrl.create({
    message: 'Obteniendo tu ubicación...'
  });
  await this.loading.present(); 
  const position = await this.geolocation.getCurrentPosition()
  this.loading.dismiss()
  let myLatitude = position.coords.latitude
  let myLongitude = position.coords.longitude
   let latitud = parseFloat(this.latitud)
   let longitud = parseFloat(this.longitud)
   
   let link = `https://www.google.com/maps/dir/'${myLatitude},${myLongitude}'/${latitud},${longitud}`

 console.log(link)
  this.iab.create(link,"_system",{location : 'yes', zoom : 'yes'});
}





     async getDirection(type){
  
  this.loading = await this.loadingCtrl.create({
    message: 'Buscando dirección'
    });
    await this.loading.present(); 
 
  this.geolocation.getCurrentPosition().then(response => {
    console.log(response)
  let latitud = response.coords.latitude;
 let  longitud = response.coords.longitude;
 this.getGeoData(latitud,longitud,type)
  })
  .catch(async error =>{
    
    console.log(error);
  })


}
getGeoData(lat, lng,type){

  let options: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
};
console.log(lat,lng)
this.nativeGeocoder.reverseGeocode(lat, lng, options)
  .then((result: NativeGeocoderResult[]) => {

    let data ={
cp:result[0].postalCode,
estado:result[0].administrativeArea,
poblacion : result[0].locality,
colonia : result[0].subLocality,
calle : result[0].thoroughfare,
numero :result[0].subThoroughfare
    }
    
    this.presentResult(data,type)
    this.loading.dismiss();
  }

  ).catch((error: any) =>{
    console.log(error);
    alert(error);
    this.loading.dismiss();
  } );



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
  console.log("Esta es la fecha Actual :::::::::::" + this.fechaActual);
}

async getCrendentials() {
  this.user_role = await this.storage.get("IdRol");
  this.idaspUser = await this.storage.get("IdAspUser");
}




async presentResult(data,type) {
  
  const alert = await this.alertController.create({
    header: 'Direccion encontrada',
    message: 'Calle: <strong>'+data.calle+'</strong><br>Numero: <strong>'+data.numero+'</strong><br>Colonia: <strong>'+data.colonia+'</strong><br> Poblacion:<strong> '+data.poblacion+'</strong><br>Codigo postal: <strong>'+data.cp+'</strong>',
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
          this.setNewAddress(data,type)
          console.log('Confirm Okay');
        }
      }
    ]
  });

  await alert.present();
}
setNewAddress(data,type){
  if(type == 1){
  this.cpPredio = data.cp
  this.estadoPredio= data.estado
  this.poblacionPredio= data.poblacion
  this.coloniaPredio= data.colonia
  this.callePredio= data.calle
  this.numeroExtPredio= data.numero
} else{
    this.cpNotificacion = data.cp
    this.estadoNotificacion= data.estado
    this.poblacionNotificacion= data.poblacion
    this.coloniaNotificacion= data.colonia
    this.calleNotificacion= data.calle
    this.numeroExtNotificacion= data.numero
  }
  this.isChanges = true
}

  async saveChanges(type){
    console.log(this.isChanges)
    if(this.isChanges){
      
  this.loading = await this.loadingCtrl.create({
    message: 'Guardando los datos...'
    });
    await this.loading.present(); 
  if(type == 1){
    let data ={
      cuenta : this.accountNumber,
      cp:this.cpPredio,
      estado: this.estadoPredio,
      poblacion : this.poblacionPredio,
      colonia : this.coloniaPredio,
      calle : this.callePredio,
      numExt :this.numeroExtPredio,
      numInt: this.numeroIntPredio,
      calle1 : this.entreCalle1,
      calle2 : this.entreCalle2,
      lote : this.lotePredio,
      manzana : this.manzanaPredio,
      referencia : this.referenciaPredio,
      fechaCaptura: this.fechaActual,
      idaspUser: this.idaspUser,
      idRol: this.user_role,
      type : 1
          }
  
          this.service.setDireccion(data);
  }else {
    let data ={
      cuenta : this.accountNumber,
      cp:this.cpNotificacion,
      estado: this.estadoNotificacion,
      poblacion : this.poblacionNotificacion,
      colonia : this.coloniaNotificacion,
      calle : this.calleNotificacion,
      numExt :this.numeroExtNotificacion,
      numInt: this.numeroIntNotificacion,
      calle1 : this.entreCalle1Notificacion,
      calle2 : this.entreCalle2Notificacion,
      lote : this.loteNotificacion,
      manzana : this.manzanaNotificacion,
      referencia : this.referenciaNotificacion,
      fechaCaptura: this.fechaActual,
      idaspUser: this.idaspUser,
      idRol: this.user_role,
      type : 2
          }
  
          this.service.setDireccion(data);
  }
this.loading.dismiss();
this.mensaje.showAlert('Los cambios almacenados se veran reflejados despues de sincronizar la aplicación')
} else{
  this.mensaje.showAlert('No hay cambios detectados en el formulario :(')
}
}

detectedChanges(){
  console.log('Hay Cambios')
  this.isChanges = true;
}
}
