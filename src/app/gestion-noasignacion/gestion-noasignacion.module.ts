import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionNoasignacionPage } from './gestion-noasignacion.page';

const routes: Routes = [
  {
    path: '',
    //component: GestionNoasignacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  //declarations: [GestionNoasignacionPage]
})
export class GestionNoasignacionPageModule {}
