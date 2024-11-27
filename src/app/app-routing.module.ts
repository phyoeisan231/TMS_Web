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
      {
        path:'master/trailer-type',
        loadComponent:()=>import('./master/components/trailer-type/trailer-type.component').then((c)=>c.TrailerTypeComponent)
      }
      ,
      {
        path:'master/trailer',
        loadComponent:()=> import('./master/components/trailer/trailer.component').then((c)=>c.TrailerComponent)
      },
      {
        path:'master/trailer-detail',
        loadComponent:()=>import('./master/components/trailer-detail/trailer-detail.component').then((c)=>c.TrailerDetailComponent)
      },
      {
        path:'master/truck',
        loadComponent:()=>import('./master/components/truck/truck.component').then((c)=>c.TruckComponent)
      },
      {
        path:'master/truck-detail',
        loadComponent:()=>import('./master/components/truck-detail/truck-detail.component').then((c)=>c.TruckDetailComponent)
      },
      {
        path:'master/driver',
        loadComponent:()=>import('./master/components/driver/driver.component').then((c)=>c.DriverComponent)
      },
      {
        path:'master/driver-detail',
        loadComponent:()=>import('./master/components/driver-detail/driver-detail.component').then((c)=>c.DriverDetailComponent)
      },
      {
        path:'master/transporter-type',
        loadComponent:()=>import('./master/components/transporter-type/transporter-type.component').then((c)=>c.TransporterTypeComponent)
      },
      {
        path:'master/transporter',
        loadComponent:()=>import('./master/components/transporter/transporter.component').then((c)=>c.TransporterComponent)
      },
      {
        path:'master/transporter-detail',
        loadComponent:()=>import('./master/components/transporter-detail/transporter-detail.component').then((c)=>c.TransporterDetailComponent)
      },
      {
        path:'master/weight-bridge',
        loadComponent:()=>import('./master/components/weight-bridge/weight-bridge.component').then((c)=>c.WeightBridgeComponent)
      },
      {
        path:'master/yard',
        loadComponent:()=>import('./master/components/yard/yard.component').then((c)=>c.YardComponent)
      },
      {
        path:'master/truck-job-type',
        loadComponent:()=>import('./master/components/truck-job-type/truck-job-type.component').then((c)=>c.TruckJobTypeComponent)
      },
      {
        path:'master/truck-entry-type',
        loadComponent:()=>import('./master/components/truck-entry-type/truck-entry-type.component').then((c)=>c.TruckEntryTypeComponent)
      }
      
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
