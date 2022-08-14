import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { CoSoYTe } from 'src/app/models/cosoyte.model';
import { QuanHuyen } from 'src/app/models/quanhuyen.model';
import { TinhThanh } from 'src/app/models/tinhthanh.model';
import { XaPhuong } from 'src/app/models/xaphuong.model';
import { AccountService } from 'src/app/services/account.service';
import { CoSoYTeService } from 'src/app/services/cosoyte.service';
import { DiachiService } from 'src/app/services/diachi.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-cosoyte',
  templateUrl: './cosoyte.component.html',
  styleUrls: ['./cosoyte.component.scss']
})
export class CoSoYTeComponent implements OnInit {

  formGroup!: FormGroup;
  coSoYTes: CoSoYTe[] = [];
  isLoading = false;
  selectedCoSoYTe!: any;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;
  disableQuan: boolean = true;
  disableXa: boolean = true;
  tinhThanhs: TinhThanh[] = [];
  quanHuyens: QuanHuyen[] = [];
  xaPhuongs: XaPhuong[] = [];
  quanHuyenSelected!: any;
  response = "";

  constructor(
    private coSoYTeService: CoSoYTeService,
    private accountService: AccountService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private tokenService: TokenStorageService,
    private diaChiService: DiachiService,
    private toastrService: ToastrService,
  ) { 
    this.formGroup = this.fb.group({
      ten: ['', [Validators.required]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      diaChi: ['', [Validators.required]],
      tinhThanh: [null, [Validators.required]],
      xaPhuong: [null, [Validators.required]],
      quanHuyen: [null, [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.getAllCoSoYTe();
    this.getAllTinhThanh();
  }

  getAllCoSoYTe(): void{
    this.isLoading=true;
    const username = this.tokenService.getUser();
    this.coSoYTeService.getByUsername(username,this.pageIndex-1, this.pageSize)
      .pipe(finalize(() => this.isLoading=false))
      .subscribe((response: any) => {
        if(response && response.success){
          this.coSoYTes = response.data;
          this.totalPage = response.totalPage  * 10;
          this.coSoYTes = this.coSoYTes.map(coSoYTe => {
            return {
              ...coSoYTe,
              checked: false
            }
          });
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  onDelete(data: CoSoYTe): void {
    this.coSoYTeService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCoSoYTe();
      });
  }

  async getSelectedXaPhuong(xaPhuongId: string) {
    await this.diaChiService.getToUpdate(xaPhuongId).toPromise()
      .then((res:any) => {
        if(res && res.success){
          this.xaPhuongs = res.xaPhuongs;
          this.quanHuyens = res.quanHuyens;
          this.quanHuyenSelected = res.quanHuyenSelected;
        }else{
          this.toastrService.error("Không thể lấy thông tin xã phường!!")
        }
      });
  }

  async showModal(data?: any) {
    if (data) {

      await this.getSelectedXaPhuong(data?.xaPhuongId);

      this.selectedCoSoYTe = data;
      this.isUpdate = true;
      this.disableXa = false;
      this.disableQuan = false;

      this.formGroup.patchValue({
        ten: data?.ten,
        diaChi: data?.diaChi,
        username: data?.username,
        password: "1",
        xaPhuong: data?.xaPhuongId,
        quanHuyen: this.quanHuyenSelected.id,
        tinhThanh: this.quanHuyenSelected.tinhThanhId,
      })

    } else {
      this.isUpdate = false;
      this.formGroup.reset();
    }
    
    this.isVisible = true;
  }

  handleOk(): void {
    if (this.formGroup.invalid) {
      this.toastrService.error("Vui lòng nhập đầy đủ trường!")
      return;
    }

    const coSoYTe = { username:this.formGroup.get('username')?.value,
                      password:this.formGroup.get('password')?.value,
                      ten:this.formGroup.get('ten')?.value,
                      diaChi:this.formGroup.get('diaChi')?.value,
                      xaPhuongId:this.formGroup.get('xaPhuong')?.value,
                      soYTeId:window.localStorage.getItem('infoId')};

    if (this.isUpdate) {
      this.coSoYTeService.update(coSoYTe, this.selectedCoSoYTe.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCoSoYTe();
      });
    } else {
      this.coSoYTeService.create(coSoYTe)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllCoSoYTe();
        });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: CoSoYTe): void {
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
    this.getAllCoSoYTe();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllCoSoYTe();
  }

  onTinhThanh(data: any): void {
    this.getAllQuanHuyen(data);
    this.formGroup.controls["quanHuyen"].reset();
    this.formGroup.controls["xaPhuong"].reset();
    this.disableQuan = false;
  }

  onQuanHuyen(data: any): void {
    this.getAllXaPhuong(data);
    this.formGroup.controls["xaPhuong"].reset();
    this.disableXa = false;
  }

  onXaPhuong(data: any): void {
  }

  getAllTinhThanh(): void {
    this.diaChiService.getTinh()
      .subscribe((response: any) => {
        if(response && response.success){
          this.tinhThanhs = response.data;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      });
  }

  getAllQuanHuyen(tinhThanhId: string): void {
    this.diaChiService.getQuanHuyen(tinhThanhId)
      .subscribe((response: any) => {
        if(response && response.success){
          this.quanHuyens = response.data;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      });
  }

  getAllXaPhuong(quanHuyenId: string): void {
    if (quanHuyenId != null){
      this.diaChiService.getXaPhuong(quanHuyenId)
        .subscribe((response: any) => {
          if(response && response.success){
            this.xaPhuongs = response.data;
          }else{
            this.toastrService.error('Xảy ra lỗi');
          }
        });
    }
  }

}
