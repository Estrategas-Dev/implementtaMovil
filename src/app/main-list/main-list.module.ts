import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { PipesModule } from 'src/app/pipes/pipes.module';

import { IonicModule } from '@ionic/angular';

import { MainListPage } from './main-list.page';


const routes: Routes = [
  {
    path: '',
    component: MainListPage
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
  declarations: [MainListPage]
})
export class MainListPageModule {}
