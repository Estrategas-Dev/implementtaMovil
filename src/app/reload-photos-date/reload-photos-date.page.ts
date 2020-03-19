import { Component, OnInit } from '@angular/core';

import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-reload-photos-date',
  templateUrl: './reload-photos-date.page.html',
  styleUrls: ['./reload-photos-date.page.scss'],
})
export class ReloadPhotosDatePage implements OnInit {

  fechaMinima: string = '2020-02-14';
  fechaInicio: string = '2020-02-14';
  fechaFinal: string = '2020-02-14';

  constructor( private modalController: ModalController) { }

  ngOnInit() {
  }

  mandarFechas() {

    let fechaI = this.fechaInicio.split("T");
    let dateStringI = fechaI[0];
    let newDateI = new Date(dateStringI).toISOString();

    let fechaF = this.fechaFinal.split("T");
    let dateStringF = fechaF[0];
    let newDateF = new Date(dateStringF).toISOString();

    this.modalController.dismiss( {
      fechaInicio: newDateI,
      fechaFinal: newDateF
    });
  }



}
