import { Component, OnInit } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { GestionGestorPage } from '../gestion-gestor/gestion-gestor.page';
import { Storage } from '@ionic/storage';
import { GestionAbogadoPage } from '../gestion-abogado/gestion-abogado.page';
import { GestionReductorPage } from '../gestion-reductor/gestion-reductor.page';
import { GestionCallPage } from '../gestion-call/gestion-call.page';
import { Router, NavigationExtras } from '@angular/router';
import { UsersFirebaseService } from '../services/users-firebase.service';
import { runInThisContext } from 'vm';
import { GestionCartaInvitacionPage } from '../gestion-carta-invitacion/gestion-carta-invitacion.page';
import { NavController } from '@ionic/angular';
import { GestionInspeccionPage } from '../gestion-inspeccion/gestion-inspeccion.page';
import { GestionValorescatastralesPage } from '../gestion-valorescatastrales/gestion-valorescatastrales.page';
import { InspeccionAguaPage } from '../inspeccion-agua/inspeccion-agua.page';
import { InspeccionPredioPage } from '../inspeccion-predio/inspeccion-predio.page';

@Component({
  selector: 'app-gestion-page',
  templateUrl: './gestion-page.page.html',
  styleUrls: ['./gestion-page.page.scss'],
})
export class GestionPagePage implements OnInit {
  gestor: boolean = false;
  abogado: boolean = false;
  callcenter: boolean = false;
  reductor: boolean = false;
  carta: boolean = false;
  valores: boolean = false;
  inspeccionMostrar: boolean = false;

  constructor(private modalController: ModalController, private storage: Storage, private platform: Platform, private router: Router, private firebase: UsersFirebaseService, private nav: NavController) { }

  async ngOnInit() {
    await this.platform.ready();

    await this.checkRole();

    await this.checkProfile();
  }
  async checkRole() {
    this.firebase.getUserInfoAccount().subscribe(user => {
      console.log(user)
    })


  }
  async checkProfile() {

    let profile = await this.storage.get("IdRol")
    let EstatusCartaInvitacion = await this.storage.get("EstatusCartaInvitacion");
    let estatusValoresCatastrales = await this.storage.get("estatusValores");
    let estatusInspeccion = await this.storage.get("EstatusInspeccion");
    if (EstatusCartaInvitacion == 'Activado') {
      this.carta = true
    }

    if (estatusValoresCatastrales == 'Activado') {
      this.valores = true;
    }

    if( estatusInspeccion == 'Activado') {
      this.inspeccionMostrar = true;
    }

    console.log("this is the profile :" + profile)
    switch (profile) {
      case "2": this.abogado = true; break;
      case "5": this.gestor = true; break;
      case "4": this.callcenter = true; break;
      case "7": this.reductor = true; break;
      //case "8" : this.carta = true; break;
      case "1": this.abogado = true; this.reductor = true; this.gestor = true; this.callcenter = true; break;
    }
  }

  async gestionGestor() {
    // Data = 1;
    const modal = await this.modalController.create({
      component: GestionGestorPage,
      // componentProps: {
      //  Data:Data }

    });

    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir');
      this.router.navigate(['/home/main-list']);
    })

  }

  async cartaInvitacion() {
    console.log("Entrando a carta invitacion");
    const modal = await this.modalController.create({
      component: GestionCartaInvitacionPage,
      // componentProps: {
      //  Data:Data }

    });

    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')

      this.router.navigate(['/home/main-list']);
    })

  }



  async valoresCatastrales() {
    const modal = await this.modalController.create({
      component: GestionValorescatastralesPage,
      // componentProps: {
      //  Data:Data }

    });

    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')

      this.router.navigate(['/home/main-list']);
    })

  }

  async inspeccion() {
    // checar si tenemos en el storage el estatus de si es plaza de agua o predio y de ahi mandar al page correspondiente
    let estatusPlaza = await this.storage.get('TipoPlazaServicio');

    if (estatusPlaza === 'Agua') {

      // es agua la plaza
      console.log("Es una plaza de agua");
      const modal = await this.modalController.create({
        component: InspeccionAguaPage
      });

      modal.present()

      modal.onDidDismiss().then( data => {
        //console.log(data)
        console.log('trata de salir')

        this.router.navigate(['/home/main-list']);
      })

    } else {
      const modal = await this.modalController.create({
        component: InspeccionPredioPage
      });

      modal.present()

      modal.onDidDismiss().then( data => {
        console.log("Saliendo de inspección predio");

        this.router.navigate(['/home/main-list']);
      })
    }

  }


  async gestionAbogado() {
    const modal = await this.modalController.create({
      component: GestionAbogadoPage,
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')
      this.router.navigate(['/home/main-list']);
    })
  }

  async gestionReductor() {
    const modal = await this.modalController.create({
      component: GestionReductorPage,
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')
      this.router.navigate(['/']);
    })

  }
  async gestionCall() {
    const modal = await this.modalController.create({
      component: GestionCallPage,
    });
    await modal.present();
    modal.onDidDismiss().then(data => {
      //console.log(data)
      console.log('trata de salir')
      this.router.navigate(['home']);

    })
  }


}
