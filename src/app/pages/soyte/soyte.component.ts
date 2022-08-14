import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SoYTe } from 'src/app/models/soyte.model';
import { SoYTeService } from 'src/app/services/soyte.service';

@Component({
  selector: 'app-soyte',
  templateUrl: './soyte.component.html',
  styleUrls: ['./soyte.component.scss']
})
export class SoYTeComponent implements OnInit {

  formGroup!: FormGroup;
  soYTes: any[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedSoYTe!: any;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 2;
  pageSize = 10;

  constructor(
    private soYTeService: SoYTeService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private toastrService: ToastrService,
  ) { 
    this.formGroup = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      ten: ['', [Validators.required]],
      diaChi: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllSoYTe();
  }

  getAllSoYTe(): void{
    this.isLoading$.next(true);
    this.soYTeService.getAllPaging(this.pageIndex-1, this.pageSize)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.soYTes = response.data;
          this.totalPage = response.totalPage;
          this.soYTes = this.soYTes.map(soYTe => {
            return {
              ...soYTe,
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

  onDelete(data: any): void {
    this.soYTeService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllSoYTe();
      });
  }

  showModal(data?: any): void {
    this.isVisible = true;

    if (data) {
      this.isUpdate = true;
      this.selectedSoYTe = data;
      this.formGroup.patchValue({
        username: data.username,
        password: "1",
        ten: data.ten,
        diaChi: data?.diaChi
      })
    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
  }

  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error("Vui lòng nhập đầy đủ trường!");
      return;
    }
    
    

    if (this.isUpdate) {
      const soYTe = {username:this.formGroup.get('username')?.value,
                      password:this.formGroup.get('password')?.value,
                      ten:this.formGroup.get('ten')?.value,
                      diaChi:this.formGroup.get('diaChi')?.value,
                      id:this.selectedSoYTe.id};
      this.soYTeService.update(soYTe, this.selectedSoYTe.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllSoYTe();
      });
    } else {
      const soYTe = {username:this.formGroup.get('username')?.value,
                      password:this.formGroup.get('password')?.value,
                      ten:this.formGroup.get('ten')?.value,
                      diaChi:this.formGroup.get('diaChi')?.value};
      this.soYTeService.create(soYTe)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllSoYTe();
        });
    }  
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: SoYTe): void {
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
    this.getAllSoYTe();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllSoYTe();
  }


}
