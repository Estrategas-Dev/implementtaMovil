import { Component, OnInit, NgZone, ComponentRef, Injector, ComponentFactoryResolver, ApplicationRef } from '@angular/core';
import {RestService} from '../services/rest.service'
import { Storage } from '@ionic/storage';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  MarkerCluster,
  Marker,
  LatLng,
  GoogleMapOptions,
  GoogleMapsMapTypeId,
  MyLocation,
  HtmlInfoWindow
} from "@ionic-native/google-maps/ngx";
import { Platform, LoadingController } from '@ionic/angular';
import { Router, NavigationExtras } from '@angular/router';
import { MessagesService } from '../services/messages.service';


@Component({
  selector: 'custom-tag',
  template: `

    <div style = "width:190px;  height:200px ;"> 
    <div><ion-label> 
    <p style="font-size:8px;word-wrap: break-word; white-space : normal;">
    <strong>Cuenta:</strong>{{account}}
    <strong>Propietario:</strong>{{owner}}
    <strong>Deuda:$</strong>{{debt}}</p>
    </ion-label>
    </div>
   <ion-button size="small" color="secondary" expand="block" (click)="goDetail() ">Detalles</ion-button>
   <ion-button size="small" color="secondary" expand="block" (click)="goPhotos(account)">Fotos</ion-button>
   <ion-button size="small" color="secondary" expand="block" (click)="goPanoramaView(position)">StreetView</ion-button>
   <ion-button  size="small" color="secondary" expand="block" (click)="goArcgis(account)">ArcGis</ion-button>
    </div>
   
  `
})
export class CustomTag {
 constructor( private router : Router, private storage : Storage, private ngZone : NgZone,private iab : InAppBrowser){}
  account: string;
  owner: string;
  debt : string;
  position:any

  goDetail() {
    this.storage.set("accountNumber",this.account)
    this.ngZone.run(()=>{
    this.router.navigateByUrl("/detail")
    })
     
  }
  goPhotos(account) {
    this.storage.set("accountNumber",account)
    this.ngZone.run(()=>{
    this.router.navigateByUrl("/photos-detail")
    })
    
  }
  
    async goPanoramaView(position){
      let latlong = position
      console.log("Entra a ver la position")
    console.log(position)
    this.ngZone.run(()=>{
    
      let navigationExtras: NavigationExtras = {
        state: {
          position: latlong
        }
      };  
  this.router.navigate(['streetview'],navigationExtras)
      })

    }

    async goArcgis(account){
      var url =''
      const idPlaza = await this.storage.get('IdPlaza')
      switch(idPlaza){
        case '4': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find='+account; break;
        case '7': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=4ffee4123fa84fe2b4b88d2dc9aec1ba&find='+account; break;
        case '3': url = 'http://oscarvazquez.maps.arcgis.com/apps/webappviewer/index.html?id=632ea1dc115c4d3fa9960f80b88e37d1&find='+account; break;
        case '8': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=bde50fa89665458ab23aca1323b980c4&find='+account; break;
        case '10': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=1ff1f324e54e4b1eac49517ee239567f&find='+account; break;
        case '9':  url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=6ce8f192dd3a415e94793f48054ea92b&find='+account; break;
        case '13': url = 'https://cartoestrategas.maps.arcgis.com/apps/webappviewer/index.html?id=09d157d58e464c57875e0b7e590d9b69&find='+account; break;
        case '12': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find='+account; break;
        case '11': url = 'https://carto2estrategas.maps.arcgis.com/apps/webappviewer/index.html?id=e2aa3190ed0245b596e6e890e84e15bc&find='+account; break;
      }
      
   console.log(url)
       this.iab.create(url,"_system",{location : 'yes', zoom : 'yes'});

    }




}




@Component({
  selector: 'app-main-mapcluster',
  templateUrl: './main-mapcluster.page.html',
  styleUrls: ['./main-mapcluster.page.scss'],
})
export class MainMapclusterPage implements OnInit {
htmlInfoWindow = new HtmlInfoWindow();
  map: GoogleMap;
markersArrayInfo : any;
loading : any;
accountString: string="";
  result: any[];

  constructor( private  ngZone:NgZone,
    private injector: Injector,
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private storage : Storage,
    private router : Router, 
    private platform: Platform,
    private service : RestService,
    private loadingCtrl : LoadingController,
    private mensaje : MessagesService) { }

  async ngOnInit() {
    await this.platform.ready();
    await this.getAccountInfo()
   

  }

 async loadMap(data) {
   //////////opciones del mapa
  let options: GoogleMapOptions ={
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
/////////////////////////
this.map = GoogleMaps.create('map_canvas',options);


this.map.getMyLocation().then(async (location: MyLocation) => {
//  this.loading.dismiss();
  console.log(JSON.stringify(location, null ,2));

  // Move the map camera to the location with animation

})
.catch(err => {

});
//////////////////////////
    this.addCluster(data);

    let latLng = data[0].position
    this.map.animateCamera({
      target: latLng,
      zoom: 12,
      tilt: 30
    });

    this.loading.dismiss();
  }

  addCluster(data) {
    console.log("entra")
    console.log(data)
    let markerCluster: MarkerCluster = this.map.addMarkerClusterSync({
      markers: data,
      icons: [
        {
          min: 5,
          max: 20,
          url: "./assets/markercluster/small.png",
          label: {
            color: "white"
          }
        },
        {
          min: 21,
          max: 50,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        },
        {
          min: 51,
          url: "./assets/markercluster/large.png",
          label: {
            color: "white"
          }
        }
      ]


      
    });


  
    markerCluster.on(GoogleMapsEvent.MARKER_CLICK).subscribe((params) => {

      let marker: Marker = params.pop();

      // Create a component
      const compFactory = this.resolver.resolveComponentFactory(CustomTag);
      let compRef: ComponentRef<CustomTag> = compFactory.create(this.injector);
      compRef.instance.account = marker.get("cuenta");
      compRef.instance.owner=marker.get("propietario");
      compRef.instance.debt = marker.get("deuda");
      compRef.instance.position = marker.get("position");
     // compRef.instance.lng = marker.get("longitud");

      this.appRef.attachView(compRef.hostView);
  
      let div = document.createElement('div');
      div.appendChild(compRef.location.nativeElement);
  
      // Dynamic rendering
      this.ngZone.run(() => {
        this.htmlInfoWindow.setContent(div);
        this.htmlInfoWindow.open(marker);
      });
  
      // Destroy the component when the htmlInfoWindow is closed.
      this.htmlInfoWindow.one(GoogleMapsEvent.INFO_CLOSE).then(() => {
        compRef.destroy();
      });


    }); 
  
  }

setMarkers(data){//realiza un ciclo para la carga de los markers 
    let array = []
 
  for(let markers of data){
     let latlng = new LatLng(parseFloat(markers.latitud),parseFloat(markers.longitud))
     let marker  = {position:latlng,cuenta:markers.cuenta,propietario:markers.nombre_propietario,deuda:markers.adeudo}
     array.push(marker)
    
  }
this.loadMap(array)
  }

async getAccountInfo(){//realiza la carga de informacion que existe en la base interna sqlite


  this.markersArrayInfo =  await  this.service.getDataVisitPosition();

     if(this.markersArrayInfo.length <= 0){
     // await this.setMarkers(this.markersArrayInfo);  
     this.mensaje.showAlert('Debes sincronizar primero para comenzar con las gestiones!!')
      // this.toggleMenu();
     }else{
      this.loading = await this.loadingCtrl.create({
        message: 'Cargando cuentas en el mapa...'
      });
      await this.loading.present(); 
      await this.setMarkers(this.markersArrayInfo);  
     }
      
   
      }


goDetail(){
  this.router.navigateByUrl("/detail");
}
async getDetail(accountNumber){
  console.log("this is account to be saved: "+ accountNumber)
await this.storage.set("accountNumber",accountNumber);
this.goDetail();

}


async find(){
  if(this.accountString ==""){
    alert ("Ingresa una cuenta")
  }else{

   this.result = await this.service.getDataVisitPositionByAccount(this.accountString);
   console.log(this.result)
   if(this.result.length == 0){
     alert ("No hay resultados")
   }else{
   let latLng = new LatLng (this.result[0].latitud, this.result[0].longitud)
   console.log(latLng)
    this.map.setCameraTarget(latLng)
    this.map.setCameraZoom(20)}
  }
}
}
