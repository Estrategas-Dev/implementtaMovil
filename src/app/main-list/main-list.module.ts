import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { MainListPage } from './main-list.page';
import { GestionValorescatastralesNoasignacionPage } from '../gestion-valorescatastrales-noasignacion/gestion-valorescatastrales-noasignacion.page';
import { GestionNoasignacionPage } from '../gestion-noasignacion/gestion-noasignacion.page';
import { GestionInspeccionPage } from '../gestion-inspeccion/gestion-inspeccion.page';
import { ContactDetailPage } from '../contact-detail/contact-detail.page';


const routes: Routes = [
  {
    path: '',
    component: MainListPage
  }, 
  {
    path: '',
    component: GestionNoasignacionPage
  }, 
  {
    path: '',
    component: GestionValorescatastralesNoasignacionPage
  },
  {
    path: '',
    component: GestionInspeccionPage
  },
  {
    path: '',
    component: ContactDetailPage
  } 

];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MainListPage, GestionNoasignacionPage, GestionValorescatastralesNoasignacionPage, GestionInspeccionPage, ContactDetailPage]
})
export class MainListPageModule {}
