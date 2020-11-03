import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionInspeccionPage } from './gestion-inspeccion.page';

const routes: Routes = [
  {
    path: '',
    component: GestionInspeccionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GestionInspeccionPage]
})
export class GestionInspeccionPageModule {}
