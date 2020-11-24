import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionPagePage } from './gestion-page.page';
import { GestionGestorPage } from '../gestion-gestor/gestion-gestor.page';
import { GestionAbogadoPage } from '../gestion-abogado/gestion-abogado.page';
import { GestionReductorPage } from '../gestion-reductor/gestion-reductor.page';
import { GestionCallPage } from '../gestion-call/gestion-call.page';
import { TasksLawyerPage } from '../tasks-lawyer/tasks-lawyer.page';
import { GestionCartaInvitacionPage } from '../gestion-carta-invitacion/gestion-carta-invitacion.page';
import { GestionInspeccionPage } from '../gestion-inspeccion/gestion-inspeccion.page';
import { GestionValorescatastralesPage } from '../gestion-valorescatastrales/gestion-valorescatastrales.page';


const routes: Routes = [
  {
    path: '',
    component: GestionPagePage
  },
  {
    path: '',
    component: GestionGestorPage
  },
  {
    path: '',
    component: GestionCallPage
  },
  {
    path: '',
    component: GestionAbogadoPage
  },
  {
    path: '',
    component: GestionReductorPage
  },
  {
    path: '',
    component: GestionCartaInvitacionPage
  },
  {
    path: '',
    component: GestionValorescatastralesPage
  },
  // {
  //   path: '',
  //   component: GestionInspeccionPage
  // },
  {
    path: '',
    component: TasksLawyerPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
  ],
  declarations: [GestionPagePage,GestionGestorPage,GestionReductorPage,GestionAbogadoPage,GestionCallPage,TasksLawyerPage,GestionCartaInvitacionPage,GestionValorescatastralesPage]
})
export class GestionPagePageModule {}
