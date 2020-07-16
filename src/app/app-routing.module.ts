import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { AuthGuard } from './auth.guard';
import { UserResolver } from './main-window/user.resolve';
import { TurnirTableComponent } from './turnir-table/turnir-table.component';
//import { PersListComponent } from './pers-list/pers-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full', resolve: { data: UserResolver } },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainWindowComponent, resolve: { data: UserResolver } },
  { path: 'pers/:isFirst', loadChildren: () => import('./pers/pers.module').then(m => m.PersModule) },
  { path: 'pers', loadChildren: () => import('./pers/pers.module').then(m => m.PersModule) },
  { path: 'turnirtable', component: TurnirTableComponent },
  { path: 'mind-map', loadChildren: () => import('./mind-map/mind-map.module').then(m => m.MindMapModule) },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload',
    scrollPositionRestoration: 'enabled',
    scrollOffset: [0, 64]
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
