import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { LichKham } from 'src/app/models/lichkham.model';
import { LichkhamService } from 'src/app/services/lichkham.service';
import { differenceInCalendarDays } from 'date-fns';
import { CaLamService } from 'src/app/services/calam.service';
import { BacSiService } from 'src/app/services/bacsi.service';
import * as moment from 'moment';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-lichkham',
  templateUrl: './lichkham.component.html',
  styleUrls: ['./lichkham.component.scss']
})
export class LichkhamComponent implements OnInit {

  formGroup!: FormGroup;
  lichKhams: LichKham[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedLichKham!: LichKham;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;
  caLams: any[] = [];
  nguoiKhams: any[] = [];
  lichKham: LichKham = new LichKham();

  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) < 1;

  constructor(
    private lichKhamService: LichkhamService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private caLamService: CaLamService,
    private bacSiService: BacSiService,
    private tokenService: TokenStorageService,
    private accountService: AccountService,
    private toastrService: ToastrService
  ) { 
    this.formGroup = this.fb.group({
      ngayKham: ['', [Validators.required]],
      tenCa: ['', [Validators.required]],
      nguoiKham: ['', [Validators.required]],
      tenThaiPhu: [''],
    })
    
  }

  ngOnInit(): void {
    this.getAllLichKham();
  }

  
  getAllLichKham(): void{
    this.isLoading$.next(true);

    let request = {page:this.pageIndex-1,size:this.pageSize,username:this.tokenService.getUser()}

    this.lichKhamService.getAllPaging(request)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.lichKhams = response.data;
          this.totalPage = response.totalPage  * 10;
          this.lichKhams = this.lichKhams.map(lichKham => {
            return {
              ...lichKham,
              checked: false
            }
          });
          this.lichKhams.forEach(element => {
            element.ngayKham = moment(element.ngayKham).format("DD/MM/YYYY");
          })
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  onRowClick(data: any): void {
  }

  onDelete(data: any): void {
    this.lichKhamService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllLichKham();
      });
  }

  showModal(data?: any): void {
    this.isVisible = true;

    if (data) {
      this.isUpdate = true;
      this.selectedLichKham = data;
      this.formGroup.patchValue({
        ngayKham: moment(data?.ngayKham).format("DD/MM/YYYY"),
        tenCa: data?.tenCa,
        nguoiKham: data?.nguoiKham,
        tenThaiPhu: data?.tenThaiPhu,
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
      this.caLamService.getByUsername(this.tokenService.getUser())
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.caLams = response.data;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
    }
  }

  onCaLam(data?: any): void {
    this.getNguoiKham(data);
  }

  onNgayKham(): void{
    this.getNguoiKham(this.formGroup.get('tenCa')?.value);
  }

  getNguoiKham(caLamId: string): void {
    if (this.formGroup.get('tenCa')?.value != null && this.formGroup.get('ngayKham')?.value != null)
    {
    let request = {date:moment(this.formGroup.get('ngayKham')?.value).format('YYYY-MM-DD'),caLamId:caLamId,csytId:localStorage.getItem('infoId')}
    this.bacSiService.getToCreateLichKham(request)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.nguoiKhams = response.data;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
    }
  }


  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error('Vui lòng nhập đúng và đầy đủ trường!');
      return;
    }
    this.accountService.getUserInfo(this.tokenService.getUser())
      .subscribe((res:any) => {
        if (res && res.success){
          this.lichKham.coSoYTeId = res.data;
          this.lichKham.ngayKham = moment(this.formGroup.get('ngayKham')?.value).format('YYYY-MM-DD');
          this.lichKham.bacSiId = this.formGroup.get('nguoiKham')?.value;
          this.lichKham.caLamId = this.formGroup.get('tenCa')?.value;

          if (this.isUpdate) {
            this.lichKhamService.update(this.lichKham, this.selectedLichKham.id)
              .pipe(finalize(() => this.isVisible = false))
              .subscribe(() => {
                this.getAllLichKham();
            });
          } else {
            this.lichKhamService.create(this.lichKham)
              .pipe(finalize(() => this.isVisible = false))
              .subscribe(() => {
                this.getAllLichKham();
              });
          } 

        } else {
          this.toastrService.error('Xảy ra lỗi');
        }
      })

    
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: any): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
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
    this.getAllLichKham();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllLichKham();
  }



}
