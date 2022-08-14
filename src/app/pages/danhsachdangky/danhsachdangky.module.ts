import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DanhsachdangkyComponent } from './danhsachdangky.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/share/shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';

const routes: Routes = [
  {
    path: '',
    component: DanhsachdangkyComponent
  }
]

@NgModule({
  declarations: [
    DanhsachdangkyComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzModalModule,
    NzGridModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzBreadCrumbModule
  ]
})
export class DanhsachdangkyModule { }
