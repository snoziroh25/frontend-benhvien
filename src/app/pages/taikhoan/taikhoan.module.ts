import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaikhoanComponent } from './taikhoan.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/share/shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';

export const routes: Routes = [
  {
    path: '',
    component: TaikhoanComponent,
  },
]

@NgModule({
  declarations: [
    TaikhoanComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzModalModule,
    SharedModule,
    NzGridModule,
    ReactiveFormsModule,
    NzSelectModule,
  ]
})
export class TaikhoanModule { }
