import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { GestionCartaInvitacionPage } from './gestion-carta-invitacion.page';

const routes: Routes = [
  {
    path: '',
    // component: GestionCartaInvitacionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  // declarations: [GestionCartaInvitacionPage]
})
export class GestionCartaInvitacionPageModule {}
