import { Component } from '@angular/core';
// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import { MasterModule } from './master/master.module';
import { GateComponent } from './master/components/gate/gate.component';
import LoginComponent from './demo/authentication/login/login.component';
import { AuthGuard } from './theme/shared/guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  ,
  {
    path: '',
    component: AdminComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'master/gate',
        loadComponent: () => import('./master/components/gate/gate.component').then((c) => c.GateComponent)
      },
      {
        path: 'master/truck-type',
        loadComponent: () => import('./master/components/truck-type/truck-type.component').then((c) => c.TruckTypeComponent)
      },
      // {
      //   path: 'typography',
      //   loadComponent: () => import('./demo/ui-component/typography/typography.component')
      // },
      // {
      //   path: 'color',
      //   loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      // },
      // {
      //   path: 'sample-page',
      //   loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      // }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      // {
      //   path: 'login',
      //   loadComponent: () => import('./demo/authentication/login/login.component')
      // },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
