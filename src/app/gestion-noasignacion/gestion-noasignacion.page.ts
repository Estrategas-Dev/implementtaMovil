import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, Platform } from '@ionic/angular';
import { GestionValorescatastralesNoasignacionPage } from '../gestion-valorescatastrales-noasignacion/gestion-valorescatastrales-noasignacion.page';
import { GestionInspeccionPage } from '../gestion-inspeccion/gestion-inspeccion.page';

@Component({
  selector: 'app-gestion-noasignacion',
  templateUrl: './gestion-noasignacion.page.html',
  styleUrls: ['./gestion-noasignacion.page.scss'],
})
export class GestionNoasignacionPage implements OnInit {

  constructor(private platform: Platform,
    private modalController: ModalController, private router: Router) { }

  async ngOnInit() {
    await this.platform.ready();
  }

  async valoresCatastrales() {
    console.log("Entrando a carta valores catastrales sin asignacion");
    const modal = await this.modalController.create({
      component: GestionValorescatastralesNoasignacionPage,
      // componentProps: {
      //  Data:Data }

    });

    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')
      console.log("vamos al main-list");
      this.router.navigate(['/home/main-list']);
    })

  }

  async clandestino() {
    console.log("Entrando a carta valores catastrales sin asignacion");
    const modal = await this.modalController.create({
      component: GestionInspeccionPage,
      // componentProps: {
      //  Data:Data }

    });

    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')
      console.log("vamos al main-list");
      this.router.navigate(['/home/main-list']);
    })
  }


}
