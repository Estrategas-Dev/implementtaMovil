import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionValorescatastralesNoasignacionPage } from './gestion-valorescatastrales-noasignacion.page';

const routes: Routes = [
  {
    path: '',
    //component: GestionValorescatastralesNoasignacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 // declarations: [GestionValorescatastralesNoasignacionPage]
})
export class GestionValorescatastralesNoasignacionPageModule {}
