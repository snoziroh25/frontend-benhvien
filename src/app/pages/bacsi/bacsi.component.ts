import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BacSi } from 'src/app/models/bacsi.model';
import { AccountService } from 'src/app/services/account.service';
import { BacSiService } from 'src/app/services/bacsi.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-bacsi',
  templateUrl: './bacsi.component.html',
  styleUrls: ['./bacsi.component.scss']
})
export class BacSiComponent implements OnInit {

  formGroup!: FormGroup;
  bacSis: BacSi[] = [];
  selectedBacSi!: BacSi;
  isLoading$ = new BehaviorSubject(false);
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;

  constructor(
    private bacSiService: BacSiService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private toastrService: ToastrService
  ) {
    this.formGroup = this.fb.group({
      ten: ['', [Validators.required]],
      sdt: ['', [Validators.required]],
    })
   }

  ngOnInit(): void {
    this.getAllBacSi();
  }

  getAllBacSi(): void {
    this.isLoading$.next(true); // Hiển thị loading khi đang đang gửi request
    let request = {csytId : localStorage.getItem('infoId'),page:this.pageIndex-1,size:this.pageSize}
    this.bacSiService.getPage(request)
      .pipe(finalize(() => this.isLoading$.next(false))) // Ẩn loading khi request gọi thành công
      .subscribe((response: any) => {
        if (response && response.success) {
          this.bacSis = response.data;
          this.totalPage = response.totalPage  * 10;
         this.bacSis = this.bacSis.map(bacSi => {
           return {
             ...bacSi,
             checked: false
           }
         });
        } else {
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }


  onDelete(data: BacSi): void {
    this.bacSiService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBacSi();
      });
  }
  
  showModal(data?: BacSi): void {
    this.isVisible = true;
  
    if (data) {
      this.isUpdate = true;
      this.selectedBacSi = data;
      this.formGroup.patchValue({
        ten: data.ten,
        sdt: data.sdt,
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
  }

  handleOk(): void {

    if (this.formGroup.invalid) {
      this.toastrService.error('Vui lòng nhập đúng và đầy đủ trường!')
      return;
    }
    
    const bacSi: BacSi = this.formGroup.getRawValue();

    if (this.isUpdate) {
      this.bacSiService.update(bacSi, this.selectedBacSi.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBacSi();
      });
    } else {
      this.bacSiService.create(bacSi)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBacSi();
        });
    }  
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: BacSi): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
      nzContent: `<b style="color: red;">${data.ten}</b>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onDelete(data),
      nzCancelText: 'No'
    });
  }
}
