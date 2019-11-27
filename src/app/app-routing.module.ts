import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { MainWindowComponent } from './main-window/main-window.component';
import { AuthGuard } from './auth.guard';
import { UserResolver } from './main-window/user.resolve';
import { PersListComponent } from './pers-list/pers-list.component';
import { CharacteristicDetailsComponent } from './characteristic-details/characteristic-details.component';
import { AbilityDetailComponent } from './ability-detail/ability-detail.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { EnamiesComponent } from './enamies/enamies.component';
import { QwestDetailComponent } from './qwest-detail/qwest-detail.component';
import { TurnirTableComponent } from './turnir-table/turnir-table.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainWindowComponent, resolve: { data: UserResolver } },
  { path: 'pers', component: PersListComponent },
  { path: 'characteristic/:id', component: CharacteristicDetailsComponent },
  { path: 'ability/:id', component: AbilityDetailComponent },
  { path: 'task/:id/:isEdit', component: TaskDetailComponent },
  { path: 'qwest/:id', component: QwestDetailComponent },
  { path: 'enamies', component: EnamiesComponent },
  { path: 'turnirtable', component: TurnirTableComponent, resolve: { data: UserResolver } },
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
