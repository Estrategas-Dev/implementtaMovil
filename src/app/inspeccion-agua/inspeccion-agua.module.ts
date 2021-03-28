import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { InspeccionAguaPage } from './inspeccion-agua.page';

const routes: Routes = [
  {
    path: '',
    //component: InspeccionAguaPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  //declarations: [InspeccionAguaPage]
})
export class InspeccionAguaPageModule {}
