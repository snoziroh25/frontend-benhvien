import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Benh } from 'src/app/models/benh.model';
import { BenhService } from 'src/app/services/benh.service';

export const doiTuongs = [
  {
    value: "true",
    title: "Thai phụ"
  },
  {
    value: "false",
    title: "Trẻ sơ sinh"
  },
]

@Component({
  selector: 'app-benh',
  templateUrl: './benh.component.html',
  styleUrls: ['./benh.component.scss']
})
export class BenhComponent implements OnInit {

  formGroup!: FormGroup;
  benhs: Benh[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedBenh!: Benh;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;
  isCanTiem = false;

  get doiTuongs() {
    return doiTuongs;
  }


  constructor(
    private benhService: BenhService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private toastrService: ToastrService,
  ) { 
    this.formGroup = this.fb.group({
      ten: ['', [Validators.required]],
      moTa: [''],
      benhOThaiPhu: [''],
      canTiem: [''],
    })
  }

  ngOnInit(): void {
    this.getAllBenh();
  }

  getAllBenh(): void{
    this.isLoading$.next(true);
    this.benhService.getAllBenh(this.pageIndex-1, this.pageSize)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.benhs = response.data;
          this.totalPage = response.totalPage  * 10;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  onDelete(data: Benh): void {
    this.benhService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBenh();
      });
  }

  showModal(data?: Benh): void {
    this.isVisible = true;

    if (data) {
      this.isUpdate = true;
      this.selectedBenh = data;
      this.formGroup.patchValue({
        ten: data.ten,
        moTa: data?.moTa,
        benhOThaiPhu: data?.benhOThaiPhu,
        canTiem: data?.canTiem,
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
  }

  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error("Vui lòng nhập đầy đủ thông tin bệnh!!");
      return;
    }
    
    this.formGroup.patchValue({
      canTiem: this.isCanTiem
    });

    const benh: Benh = this.formGroup.getRawValue();

    if (this.isUpdate) {
      this.benhService.update(benh, this.selectedBenh.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBenh();
      });
    } else {
      this.benhService.create(benh)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllBenh();
        });
    }  
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: Benh): void {
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
    this.getAllBenh();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllBenh();
  }

  switched() {
    if (this.isCanTiem){
      this.isCanTiem = false;
    } else {
      this.isCanTiem = true;
    }
  }

  getDoituong(target : string){
    if (target === "TRE"){
      return "Trẻ Sơ Sinh";
    } else if (target === "THAIPHU"){
      return "Thai Phụ";
    } else {
      return "";
    }
  }

  getCanTiem(boo : boolean){
    if (boo){
      return "CẦN TIÊM";
    } else{
      return "KHÔNG CẦN TIÊM";
    }
  }

  getColorText(status: boolean){
    if (status) {
      return "#52cf71"
    } else{
      return "#34a5da"
    }
  }

}
