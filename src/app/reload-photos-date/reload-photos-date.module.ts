
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
//import { ReloadPhotosDatePage } from './reload-photos-date.page';



const routes: Routes = [
  {
    path: '',
  //  component: ImagePreviewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
 //declarations: [ReloadPhotosDatePage]
})
export class ReloadPhotosDatePageModule {}
