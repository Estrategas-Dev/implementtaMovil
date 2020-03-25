import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RestService } from '../services/rest.service';
declare var google;
@Component({
  selector: 'app-show-route',
  templateUrl: './show-route.page.html',
  styleUrls: ['./show-route.page.scss'],
})
export class ShowRoutePage implements OnInit {
  @ViewChild('mapa-route') mapContainer: ElementRef;
  map: any;
mapEle : HTMLElement;
  constructor(private service: RestService) { }

  ngOnInit() {
    this.getPoints()
  }


  async getPoints(){
    let points = await this.service.getUserLocation()
    console.log(points)
    
    this.loadMap(points)
   }


   loadMap(data){
console.log("Entra a cargar los puntos::::::::")
    const position = new google.maps.LatLng(parseFloat(data[0].latitud),parseFloat(data[0].longitud));
    this.mapEle = document.getElementById('mapa-route');
  
  
    // create map
    this.map = new google.maps.Map(this.mapEle, {
      center:position,
      disableDefaultUI: false,
      zoom: 16
    });

    this.mapEle.classList.add('show-map');
    this.getMarkers(data);
  
   
   
  }
  getMarkers(data) {
  console.log("entra a cargar los markesr:::::::::")
    for (let i = 0; i < data.length; i++) {
      if (i > 0) {
        this.addMarkersToMap(data[i]);
      }
    }
  }

  addMarkersToMap(point) {
 
    const position = new google.maps.LatLng(parseFloat(point.latitud),parseFloat(point.longitud));
    const pointMarker = new google.maps.Marker({ position:position, title:'Punto N'});

    pointMarker.setMap(this.map);
  }
}
