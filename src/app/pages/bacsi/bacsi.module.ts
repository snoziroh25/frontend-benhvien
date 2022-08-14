import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BacSiComponent } from './bacsi.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/share/shared/shared.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';

export const routes: Routes = [
  {
    path: '',
    component: BacSiComponent,
  },
]

@NgModule({
  declarations: [BacSiComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NzModalModule,
    SharedModule,
    NzGridModule,
    ReactiveFormsModule,
    NzSelectModule,
    NzDatePickerModule
  ]
})
export class BacSiModule { }
