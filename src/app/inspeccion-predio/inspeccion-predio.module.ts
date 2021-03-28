import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InspeccionPredioPage } from './inspeccion-predio.page';

const routes: Routes = [
  {
    path: '',
    //component: InspeccionPredioPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  //declarations: [InspeccionPredioPage]
})
export class InspeccionPredioPageModule {}
