import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionValorescatastralesPage } from './gestion-valorescatastrales.page';

const routes: Routes = [
  {
    path: '',
    //component: GestionValorescatastralesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  //declarations: [GestionValorescatastralesPage]
})
export class GestionValorescatastralesPageModule {}
