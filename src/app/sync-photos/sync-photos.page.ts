import { Component, OnInit } from "@angular/core";
import { RestService } from "../services/rest.service";
import {
  LoadingController,
  ModalController,
  NavParams
} from "@ionic/angular";
import { MessagesService } from "../services/messages.service";
import { ImagePreviewPage } from '../image-preview/image-preview.page';
import { Router } from '@angular/router';
import { ReloadPhotosDatePage } from '../reload-photos-date/reload-photos-date.page';



@Component({
  selector: "app-sync-photos",
  templateUrl: "./sync-photos.page.html",
  styleUrls: ["./sync-photos.page.scss"]
})
export class SyncPhotosPage implements OnInit {
  infoImages: any;
  loading: HTMLIonLoadingElement;
  isSelected: boolean;
  contadorFotos: number = 0;
  totalFotos : number = 0;
  isHide : boolean= false


  constructor(
    private service: RestService,
    private loadingCtrl: LoadingController,
    private mensaje: MessagesService,
    private modalController: ModalController,
    private router : Router,
    private navParams : NavParams,
  ) {}

  ngOnInit() {
    this.getInfo();
  this.getStatus();
  }
 
  async getInfo() {
    this.loading = await this.loadingCtrl.create({
      message: "Cargando las fotos....."
    });
    await this.loading.present();

    this.infoImages = await this.service.getImagesLocal();

    this.totalFotos = this.infoImages.length;
    if (this.infoImages.length == 0) {
      this.mensaje.showAlert("Aun no hay fotos capturadas o para sincronizar");
    }
    this.loading.dismiss();
  }
  exit() {
    this.modalController.dismiss();
  }
  async uploadPhotos() {

    await this.service.uploadPhotos().then( () => {
      this.exit();
    });
    // this.modalController.getTop().then(res=>{
    //   this.getInfo();
    // });
  }

  deletePhoto(id,rutaBase64){
this.service.deletePhoto(id,rutaBase64);
this.getInfo();
  }
  openPreview(img) {
    console.log("esta es la imagen que se va al modal: "+img)
    this.modalController.create({
      component: ImagePreviewPage,
      componentProps: {
        img: img
      }
    }).then(modal => {
      modal.present();
    });
  }
  async uploadPhoto(id){
await this.service.uploadPhoto(id);
this.modalController.getTop().then(res=>{
  this.getInfo();
})
  }
  getStatus(){
    this.isHide = this.navParams.get('isHide');
    console.log('se trajo el parametro', this.isHide)
 console.log(this.isHide)
 
   }
   async reDo(){
    
    /*this.service.reloadAllPhotos().then(res=>{
      this.getInfo();
    })
    */

   console.log("esta es la imagen que se va al modal: ")
   /*this.modalController.create({
     component: ReloadPhotosDatePage
   }).then(modal => {
     modal.present();
   });
*/
   const modal = await this.modalController.create( {
     component: ReloadPhotosDatePage
   });

   await modal.present();

   const { data } = await modal.onDidDismiss();

   this.service.reloadPhotosDate( data.fechaInicio, data.fechaFinal).then( res => {
     this.getInfo();
   });

   }



}
