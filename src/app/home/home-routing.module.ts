import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children:
      [

        {
          path: 'sync-page',
          children:
            [
              {
                path: '',
                loadChildren: '../sync-page/sync-page.module#SyncPagePageModule'
              }
            ]
        },
        {
          path: 'main-list',
          children:
            [
              {
                path: '',
                loadChildren: '../main-list/main-list.module#MainListPageModule'
              }
            ]
        },
        {
          path: 'config-page',
          children:
            [
              {
                path: '',
                loadChildren: '../config-page/config-page.module#ConfigPagePageModule'
              }
            ]
        },
        {
          path: 'graphics',
          children:
            [
              {
                path: '',
                loadChildren: '../graphics/graphics.module#GraphicsPageModule'
              }
            ]
        },
        {
          path: 'main-mapcluster',
          children:
            [
              {
                path: '',
                loadChildren: '../main-mapcluster/main-mapcluster.module#MainMapclusterPageModule'
              }
            ]
        },
        // {
        //   path: 'gestion-inspeccion',
        //   children:
        //     [
        //       {
        //         path: '',
        //         loadChildren: '../gestion-inspeccion/gestion-inspeccion.module#GestionInspeccionPageModule'
        //       }
        //     ]
        // },
        
/*         {
          path: 'mapajs',
          children:
            [
              {
                path: '',
                loadChildren: '../mapajs/mapajs.module#MapajsPageModule'
              }
            ]
        }, */

   
        {
          path: '',
          redirectTo: '/home/main-list',
          pathMatch: 'full'
        }
      ]
  },
  {
    path: '',
    redirectTo: '/home/main-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports:
    [
      RouterModule.forChild(routes)
    ],
  exports:
    [
      RouterModule
    ]
})
export class HomePageRoutingModule {}