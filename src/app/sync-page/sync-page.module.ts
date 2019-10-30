import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SyncPagePage } from './sync-page.page';
import { SyncPhotosPage } from '../sync-photos/sync-photos.page';
import { SyncGestorPage } from '../sync-gestor/sync-gestor.page';
import { ImagePreviewPage } from '../image-preview/image-preview.page';


const routes: Routes = [
  {
    path: '',
    component: SyncPagePage
  },
  {
    path: '',
    component: SyncPhotosPage
  },
  {
    path: '',
    component: ImagePreviewPage
  },
  {
    path: '',
    component: SyncGestorPage
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SyncPagePage,SyncPhotosPage,SyncGestorPage,ImagePreviewPage]
})
export class SyncPagePageModule {}
