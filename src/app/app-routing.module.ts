import { Component } from '@angular/core';
// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
import LoginComponent from './demo/authentication/login/login.component';
import { AuthGuard } from './theme/shared/guards/auth.guard';
import { MasterModule } from './master/master.module';
import { ReportMtnModule } from './report-mtn/report-mtn.module';
import { TmsInCheckProposalComponent } from './tms-operation/components/tms-in-check-proposal/tms-in-check-proposal.component';
import { WServiceBillComponent } from './report-mtn/components/wservice-bill/wservice-bill.component';

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
      },
      {
        path:'tms-operation/in-check-doc',
        loadComponent:()=>import('./tms-operation/components/in-check-doc/in-check-doc.component').then((c)=>c.InCheckDocComponent)
      },
      {
        path:'tms-operation/in-check',
        loadComponent:()=>import('./tms-operation/components/in-check/in-check.component').then((c)=>c.InCheckComponent)
      },
      {
        path:'tms-operation/proposal',
        loadComponent:()=>import('./tms-operation/components/proposal/proposal.component').then((c)=>c.ProposalComponent)
      },
      {
        path:'tms-operation/proposal-form',
        loadComponent:()=>import('./tms-operation/components/proposal-form/proposal-form.component').then((c)=>c.ProposalFormComponent)
      },
      {
        path:'tms-operation/proposal-detail',
        loadComponent:()=>import('./tms-operation/components/proposal-detail/proposal-detail.component').then((c)=>c.ProposalDetailComponent)
      },
      {
        path:'tms-operation/out-check-doc',
        loadComponent:()=>import('./tms-operation/components/out-check-doc/out-check-doc.component').then((c)=>c.OutCheckDocComponent)
      },
      {
        path:'tms-operation/out-check',
        loadComponent:()=>import('./tms-operation/components/out-check/out-check.component').then((c)=>c.OutCheckComponent)
      },
      {
        path:'tms-operation/tms-in-check-proposal',
        loadComponent:()=>import('./tms-operation/components/tms-in-check-proposal/tms-in-check-proposal.component').then((c)=>c.TmsInCheckProposalComponent)
      },
      {
        path:'tms-operation/tms-in-check-proposal-doc',
        loadComponent:()=>import('./tms-operation/components/tms-in-check-proposal-doc/tms-in-check-proposal-doc.component').then((c)=>c.TmsInCheckProposalDocComponent)
      },
      {
        path:'tms-operation/tms-in-check',
        loadComponent:()=>import('./tms-operation/components/tms-in-check/tms-in-check.component').then((c)=>c.TmsInCheckComponent)
      },
      {
        path:'tms-operation/tms-out-check',
        loadComponent:()=>import('./tms-operation/components/tms-out-check/tms-out-check.component').then((c)=>c.TmsOutCheckComponent)
      },
      {
        path:'tms-operation/tms-out-check-doc',
        loadComponent:()=>import('./tms-operation/components/tms-out-check-doc/tms-out-check-doc.component').then((c)=>c.TmsOutCheckDocComponent)
      },
      {
        path:'master/waiting-area',
        loadComponent:()=>import('./master/components/waiting-area/waiting-area.component').then((c)=>c.WaitingAreaComponent)
      },
      {
        path:'master/category',
        loadComponent:()=>import('./master/components/category/category.component').then((c)=>c.CategoryComponent)
      },
      {
        path:'master/card',
        loadComponent:()=>import('./master/components/card/card.component').then((c)=>c.CardComponent)
      },
      {
        path:'master/document-setting',
        loadComponent:()=>import('./master/components/document-setting/document-setting.component').then((c)=>c.DocumentSettingComponent)
      },
      {
        path:'master/operation-area',
        loadComponent:()=>import('./master/components/operation-area/operation-area.component').then((c)=>c.OperationAreaComponent)
      },

      {
        path:'report-mtn/truck-in',
        loadComponent:()=>import('./report-mtn/components/truck-status/truck-status.component').then((c)=>c.TruckStatusComponent)
      },
      {
        path:'report-mtn/weight-bill',
        loadComponent:()=>import('./report-mtn/components/wservice-bill/wservice-bill.component').then((c)=>WServiceBillComponent)
      },
      {
        path:'report-mtn/truckin-yard',
        loadComponent:()=>import('./report-mtn/components/truck-in-yard/truck-in-yard.component').then((c)=>c.TruckInYardComponent)
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
