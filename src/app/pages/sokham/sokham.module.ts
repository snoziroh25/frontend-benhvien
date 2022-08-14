import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SokhamComponent } from './sokham.component';

import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/share/shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { NzTableModule } from 'ng-zorro-antd/table';
import { BrowserModule } from '@angular/platform-browser';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

const routes: Routes = [
  {
    path: '',
    component: SokhamComponent
  }
]

@NgModule({
  declarations: [
    SokhamComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzTableModule,
    NzModalModule,
    NzGridModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule,
    NzBreadCrumbModule,
  ]
})
export class SokhamModule { }
