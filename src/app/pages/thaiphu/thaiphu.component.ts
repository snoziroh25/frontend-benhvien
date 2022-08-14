import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ThaiPhu } from 'src/app/models/thai_phu.model';
import { ThaiPhuService } from 'src/app/services/thaiphu.service';


@Component({
  selector: 'app-thaiphu',
  templateUrl: './thaiphu.component.html',
  styleUrls: ['./thaiphu.component.scss']
})
export class ThaiPhuComponent implements OnInit {

  formGroup!: FormGroup;
  thaiPhus: ThaiPhu[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedThaiPhu!: ThaiPhu;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;

  constructor(
    private thaiPhuService: ThaiPhuService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private toastrService: ToastrService
  ) { 
    this.formGroup = this.fb.group({
      username: ['',[Validators.required]],
      ten: ['', [Validators.required]],
      ngaySinh: [''],
      sdt: ['',[Validators.required]],
      cccd: ['',[Validators.required]],
      email: ['',[Validators.required]],
      diaChi: ['']
    })
  }

  ngOnInit(): void {
    this.getAllThaiPhu();
  }

  getAllThaiPhu(): void{
    this.isLoading$.next(true);
    this.thaiPhuService.getAllPaging(this.pageIndex-1, this.pageSize)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.thaiPhus = response.data;
          this.totalPage = response.totalPage  * 10;          
          this.thaiPhus = this.thaiPhus.map(thaiPhu => {
            return {
              ...thaiPhu,
              checked: false
            }
          });
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  onDelete(data: ThaiPhu): void {
    this.thaiPhuService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe((res:any) => {
          if (res.success){
            this.getAllThaiPhu();
            this.toastrService.success("Xóa thành công!")
          }
      });
  }

  showModal(data?: ThaiPhu): void {
    this.isVisible = true;
    
    if (data) {
      this.isUpdate = true;
      this.selectedThaiPhu = data;
      this.formGroup.patchValue({
        username: data?.username,
        ten: data?.ten,
        ngaySinh: data?.ngaySinh,
        sdt: data?.sdt,
        cccd: data?.cccd,
        email: data?.email,
        diaChi: data?.diaChi
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
  }

  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error('Vui lòng nhập đúng và đầy đủ trường!');
      return;
    }
    
    const thaiPhu: ThaiPhu = this.formGroup.getRawValue();

    if (this.isUpdate) {
      this.thaiPhuService.update(thaiPhu, this.selectedThaiPhu.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe((res:any) => {
          if (res.success){
            this.getAllThaiPhu();
            this.toastrService.success("Cập nhật thai phụ thành công!")
          }
      });
    } else {
      this.thaiPhuService.create(thaiPhu)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe((res:any) => {
          if (res.success){
            this.getAllThaiPhu();
            this.toastrService.success("Tạo mới thai phụ thành công!")
          }
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: ThaiPhu): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
      nzContent: `<b style="color: red;">${data.ten}</b>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onDelete(data),
      nzCancelText: 'No',
      nzOnCancel: () => {}
    });
  }

  onPageChange(pageNumber: number): void {
    this.pageIndex = pageNumber;
    this.getAllThaiPhu();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllThaiPhu();
  }

  // thaiPhuOnRowClick(data: any):void{
  //   this.isUpdate = true;
  //   this.selectedThaiPhu = data;
  //   this.isVisible = true;
  //   this.formGroup.patchValue({
  //     username: data?.username,
  //     ten: data?.ten,
  //     ngaySinh: data?.ngaySinh,
  //     sdt: data?.sdt,
  //     cccd: data?.cccd,
  //     email: data?.email,
  //     diaChi: data?.diaChi
  //   })
  // }
}
