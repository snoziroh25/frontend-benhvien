import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DangkykhamtreComponent } from './dangkykhamtre.component';
import { RouterModule, Routes } from '@angular/router';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { ReactiveFormsModule } from '@angular/forms';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { SharedModule } from 'src/app/share/shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: DangkykhamtreComponent
  }
]

@NgModule({
  declarations: [
    DangkykhamtreComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzModalModule,
    NzGridModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzBreadCrumbModule,
    NzDatePickerModule,
    NzSpinModule,
  ]
})
export class DangkykhamtreModule { }
