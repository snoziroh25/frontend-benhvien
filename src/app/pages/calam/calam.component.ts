import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CaLam } from 'src/app/models/calam.model';
import { CaLamService } from 'src/app/services/calam.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-calam',
  templateUrl: './calam.component.html',
  styleUrls: ['./calam.component.scss']
})
export class CaLamComponent implements OnInit {

  formGroup!: FormGroup;
  caLams: CaLam[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedCaLam!: CaLam;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;

  constructor(
    private caLamService: CaLamService,
    private fb: FormBuilder,
    private tokenService: TokenStorageService,
    private modal: NzModalService,
    private toastrService: ToastrService
  ) { 
    this.formGroup = this.fb.group({
      ten: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllCaLam();
  }

  getAllCaLam(): void{
    this.isLoading$.next(true);
    let request = {page:this.pageIndex-1,size:this.pageSize,username:this.tokenService.getUser()};
    this.caLamService.getAllPaging(request)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.caLams = response.data;
          this.totalPage = response.totalPage  * 10;
          this.caLams = this.caLams.map(caLam => {
            return {
              ...caLam,
              checked: false
            }
          });
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  onRowClick(data: any): void {
  }

  onDelete(data: CaLam): void {
    this.caLamService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCaLam();
      });
  }

  showModal(data?: CaLam): void {
    this.isVisible = true;
    if (data) {
      this.isUpdate = true;
      this.selectedCaLam = data;
      this.formGroup.patchValue({
        ten: data.ten,
        startTime: data.startTime,
        endTime: data.endTime,
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
    
    const caLam: CaLam = {ten:this.formGroup.get('ten')?.value,startTime:moment(this.formGroup.get('startTime')?.value).format("HH:mm"),endTime:moment(this.formGroup.get('endTime')?.value).format("HH:mm"),csytId:null,id:null};


    if (this.isUpdate) {
      this.caLamService.update(caLam, this.selectedCaLam.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCaLam();
      });
    } else {
      this.caLamService.create(caLam, this.tokenService.getUser())
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCaLam();
        });
    }  
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: CaLam): void {
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
    this.getAllCaLam();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllCaLam();
  }

}
