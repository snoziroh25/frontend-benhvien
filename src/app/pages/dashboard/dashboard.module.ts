import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/share/shared/shared.module';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NzIconModule } from 'ng-zorro-antd/icon';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
]

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgApexchartsModule,
    NzIconModule
  ]
})
export class DashboardModule { }
