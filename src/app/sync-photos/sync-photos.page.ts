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

    await this.service.uploadPhotos();
    this.modalController.getTop().then(res=>{
      this.getInfo();
    })
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
   reDo(){
    this.service.reloadAllPhotos().then(res=>{
      this.getInfo();
    })
   }
}
