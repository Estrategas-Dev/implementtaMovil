import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes, NoPreloading } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { NologinGuard } from './guards/nologin.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home',pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule',canActivate : [AuthGuard] },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule',canActivate : [NologinGuard] },
  { path: 'graphics', loadChildren: './graphics/graphics.module#GraphicsPageModule',canActivate : [AuthGuard]  },
  { path: 'detail', loadChildren: './detail/detail.module#DetailPageModule' },
  { path: 'sync-page', loadChildren: './sync-page/sync-page.module#SyncPagePageModule',canActivate : [AuthGuard]  },
  { path: 'gestion-page', loadChildren: './gestion-page/gestion-page.module#GestionPagePageModule' },
  { path: 'user-add', loadChildren: './user-add/user-add.module#UserAddPageModule' },
  { path: 'image-modal', loadChildren: './image-modal/image-modal.module#ImageModalPageModule' },
  { path: 'config-page', loadChildren: './config-page/config-page.module#ConfigPagePageModule' },
  { path: 'ver-perfil', loadChildren: './ver-perfil/ver-perfil.module#VerPerfilPageModule' },
  { path: 'photos-detail', loadChildren: './photos-detail/photos-detail.module#PhotosDetailPageModule' },
  { path: 'account-map', loadChildren: './account-map/account-map.module#AccountMapPageModule' },
  { path: 'main-mapcluster', loadChildren: './main-mapcluster/main-mapcluster.module#MainMapclusterPageModule' },
  { path: 'gestion-gestor', loadChildren: './gestion-gestor/gestion-gestor.module#GestionGestorPageModule' },
  { path: 'gestion-abogado', loadChildren: './gestion-abogado/gestion-abogado.module#GestionAbogadoPageModule' },
  { path: 'gestion-reductor', loadChildren: './gestion-reductor/gestion-reductor.module#GestionReductorPageModule' },
  { path: 'gestion-call', loadChildren: './gestion-call/gestion-call.module#GestionCallPageModule' },
  { path: 'main-menu', loadChildren: './main-menu/main-menu.module#MainMenuPageModule' },
  { path: 'main-list', loadChildren: './main-list/main-list.module#MainListPageModule' },
  { path: 'sync-photos', loadChildren: './sync-photos/sync-photos.module#SyncPhotosPageModule' },
  { path: 'checador-home', loadChildren: './checador-home/checador-home.module#ChecadorHomePageModule' },
  { path: 'historico-asistencia', loadChildren: './historico-asistencia/historico-asistencia.module#HistoricoAsistenciaPageModule' },
  { path: 'account-map-list', loadChildren: './account-map-list/account-map-list.module#AccountMapListPageModule' },
  { path: 'streetview', loadChildren: './streetview/streetview.module#StreetviewPageModule' },
  { path: 'users-config', loadChildren: './users-config/users-config.module#UsersConfigPageModule' },
  { path: 'show-route', loadChildren: './show-route/show-route.module#ShowRoutePageModule' },
  { path: 'sync-gestor', loadChildren: './sync-gestor/sync-gestor.module#SyncGestorPageModule' },
  { path: 'get-direction', loadChildren: './get-direction/get-direction.module#GetDirectionPageModule' },
  { path: 'map-indications', loadChildren: './map-indications/map-indications.module#MapIndicationsPageModule' },
  { path: 'statits', loadChildren: './statits/statits.module#StatitsPageModule' },
  { path: 'tasks-lawyer', loadChildren: './tasks-lawyer/tasks-lawyer.module#TasksLawyerPageModule' },
  { path: 'sync-update', loadChildren: './sync-update/sync-update.module#SyncUpdatePageModule' },
  { path: 'image-preview', loadChildren: './image-preview/image-preview.module#ImagePreviewPageModule' },
  { path: 'reload-photos-date', loadChildren: './reload-photos-date/reload-photos-date.module#ReloadPhotosDatePageModule' },




];

@NgModule({
  imports: [
   RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  // RouterModule.forRoot(routes, { preloadingStrategy : NoPreloading })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
