import { Component, OnInit } from '@angular/core';
import { RestService } from '../services/rest.service';
import { Storage } from '@ionic/storage';
import { LoadingController, ModalController } from '@ionic/angular';
import {ImageModalPage} from '../image-modal/image-modal.page'
import {WebView} from '@ionic-native/ionic-webview/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { MessagesService } from '../services/messages.service';




@Component({
  selector: 'app-photos-detail',
  templateUrl: './photos-detail.page.html',
  styleUrls: ['./photos-detail.page.scss'],
})
export class PhotosDetailPage implements OnInit {

  public imageData: string;
  public imageView: string;
  public imageName: string ="hjt4857955gdfdfjdfh";

  imgs: any;
  accountNumber: any;
  loading : any;
  image :string=""
  images = [];
  idAspuser: any;

  constructor(private modalController : ModalController,private service: RestService,
     private storage : Storage,public loadingCtrl: LoadingController, private camera: Camera,
     private webview : WebView,private mensaje : MessagesService)  { 
  
  }
  
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.5,
    spaceBetween: 20,
    centeredSlides: true
  };
 
  openPreview(img) {
    console.log("esta es la imagen que se va al modal: "+img)
    this.modalController.create({
      component: ImageModalPage,
      componentProps: {
        img: img
      }
    }).then(modal => {
      modal.present();
    });
  }

 async ngOnInit() {
    this.getInfoAccount();
  }
async getInfoAccount(){
  this.loading = await this.loadingCtrl.create({
    message: 'Cargando imagenes de la cuenta...'
  });
  await this.loading.present(); 

    this.accountNumber = await this.storage.get("accountNumber");
    this.idAspuser = await this.storage.get("IdAspUser")

    this.imgs = await this.service.getImagesImplementta(this.accountNumber);
    console.log(this.imgs)
   
    if(this.imgs.length == 0){
      this.mensaje.showAlert("Esta cuenta no tiene imagenes aún, por favor captura algunas :)");
      this.loading.dismiss();
    }else{
    this.loading.dismiss();}
  }
  takePic(){
var dateDay = new Date().toISOString();
let date: Date = new Date(dateDay);
let ionicDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())); 

let fecha = ionicDate.toISOString();

    let options : CameraOptions = {
      quality : 60,
      correctOrientation: true,
     destinationType : this.camera.DestinationType.FILE_URI,
     // destinationType : this.camera.DestinationType.DATA_URL,
      sourceType : this.camera.PictureSourceType.CAMERA,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
   
    }
    this.camera.getPicture(options).then(imageData =>{
      let rutaBase64= imageData
     this.image = this.webview.convertFileSrc(imageData);
     this.imgs.push({imagen:this.image,fecha:''})
     console.log(this.imgs)
      this.saveImage(this.image,this.accountNumber,fecha,rutaBase64,this.idAspuser,0,0);   
      })
       .catch(error =>{
         console.error( error);
       })
    
      }
saveImage(image,accountNumber,fecha,rutaBase64,idAspuser,idTarea,idTipo){
  this.service.saveImage(image,accountNumber,fecha,rutaBase64,idAspuser,idTarea,idTipo).then(res=>{
this.mensaje.showToast("Se almacenó la imagen :)")

  })
}

}