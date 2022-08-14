import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BenhService } from 'src/app/services/benh.service';
import { VacxinService } from 'src/app/services/vacxin.service';

@Component({
  selector: 'app-vacxin',
  templateUrl: './vacxin.component.html',
  styleUrls: ['./vacxin.component.scss']
})
export class VacxinComponent implements OnInit {

  formGroup!: FormGroup;
  vacxins: any[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedVacxin!: any;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;
  benhs : any[] = [];
  isThaiPhu = false;

  constructor(
    private vacxinService: VacxinService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private benhService: BenhService,
    private toastrService: ToastrService,
  ) { 
    this.formGroup = this.fb.group({
      ten: ['', [Validators.required]],
      benh: ['', [Validators.required]],
      doTuoiTiem: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllVacxin();
    this.getAllBenh();
  }

  getAllBenh(): void {
    this.benhService.getAll()
      .subscribe((res:any) => {
        if (res && res.success){
          this.benhs = res.data;
        }else{
          this.toastrService.error('Tải lên bệnh lỗi!');
        }
      });
  }

  getAllVacxin(): void{
    this.isLoading$.next(true);
    this.vacxinService.getAllPaging(this.pageIndex-1, this.pageSize)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.vacxins = response.data;
          this.totalPage = response.totalPage * 10;
        }else{
          this.toastrService.error('Tải danh sách vắc xin lỗi!');
        }
      })
  }

  onDelete(data: any): void {
    this.vacxinService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllVacxin();
      });
  }

  showModal(data?: any): void {
    this.isVisible = true;

    if (data) {
      this.onBenh(data?.benhId);
      this.isUpdate = true;
      this.selectedVacxin = data;
      this.formGroup.patchValue({
        ten: data.ten,
        benh: data?.benhId,
        doTuoiTiem: data?.doTuoiTiem,
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
  }

  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    const vacxin: any = this.formGroup.getRawValue();

    if (this.isUpdate) {
      this.vacxinService.update(vacxin, this.selectedVacxin.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllVacxin();
      });
    } else {
      this.vacxinService.create(vacxin)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllVacxin();
        });
    }  
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: any): void {
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
    this.getAllVacxin();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllVacxin();
  }

  onBenh(data:any){
    for (var i=0;i<this.benhs.length;i++){
      if (this.benhs[i].id === data){
        if (this.benhs[i].benhOThaiPhu){
          this.isThaiPhu = true;
        } else {
          this.isThaiPhu = false;
        }
        break;
      }
    }
  }

}
