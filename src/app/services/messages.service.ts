import { Injectable } from '@angular/core';
import { AlertController, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(private alertCtrl : AlertController, private toastCtrl : ToastController) { }

  async showAlert(mensaje:string){

    {
      const alert = await this.alertCtrl.create({
        header: 'Mensaje',
        //subHeader: 'Subtitle',
        message: mensaje,
        buttons: ['Aceptar']
      });
  
      await alert.present();
    }
  

  }
  
  async showAlertConfirm(mensaje:string){

 
    const alert = await this.alertCtrl.create({
      header: 'Mensaje',
      message: 'Message <strong>text</strong>!!!',
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
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }
  async showToast(message : string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 1000,
      position: 'bottom'
    });
    toast.present();
  }
  async showToastSync(message : string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 500,
      position: 'bottom'
    });
    toast.present();
  }

  async showToastLarge(message : string) {
    let toast = await this.toastCtrl.create({
      message: message,
      duration: 7000,
      position: 'bottom'
    });
    toast.present();
  }
}
