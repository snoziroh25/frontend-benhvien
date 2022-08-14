import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SokhamService } from 'src/app/services/sokham.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AccountService } from 'src/app/services/account.service';
import { ToastrService } from 'ngx-toastr';
import { TreSoSinh } from 'src/app/models/tre_so_sinh.model';
import { TreSoSinhService } from 'src/app/services/tresosinh.service';

@Component({
  selector: 'app-sokham',
  templateUrl: './sokham.component.html',
  styleUrls: ['./sokham.component.scss']
})
export class SokhamComponent implements OnInit {

  formGroup!: FormGroup;
  soKhams: any[] = [];
  isLoading$ = new BehaviorSubject(false);
  selectedSoKham!: any;
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 5;
  isThaiPhu = false;

  isVisibleListHoSo = false;
  hoSoKhams: any[] = [];
  hoSoKhamPageIndex = 1;
  hoSoKhamPageSize = 10;
  hoSoKhamTotalPage = 1;

  isVisibleHoSo = false;
  hoSoKham: any;

  isVisibleDongSo = false;
  isXayThai = false;
  treSoSinh: any = {"ten":"","gioiTinh":"","ngaySinh":"","diTat":"","canNangsinh":"","sinhNon":"","note":"","thaiPhuId":"","coSoYTeId":""};
  

  constructor(private fb: FormBuilder,
    private treSoSinhService: TreSoSinhService,
    private modal: NzModalService,
    private soKhamService: SokhamService,
    private toastrService: ToastrService,
    private tokenService: TokenStorageService,
    private accountService: AccountService) {
      this.formGroup = this.fb.group({
        tenThaiPhu: ['', [Validators.required]],
        lanCoThaiThu: [''],
        trangThai: ['', [Validators.required]],
        ngayTao: ['', [Validators.required]],
      })
     }

  ngOnInit(): void {
    this.accountService.getRoleByUsername(this.tokenService.getUser())
      .subscribe((res : any) => {
        if (res && res.success){
          if (res.data === "THAIPHU"){
            this.isThaiPhu = true;
          }
        }
      })
    this.getAllSoKham();
  }

  getAllSoKham(): void{
    this.isLoading$.next(true);
    this.soKhamService.getAllPaging(this.pageIndex-1, this.pageSize,this.tokenService.getUser())
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.soKhams = response.data;
          this.totalPage = response.totalPage  * 10;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }

  getAllHoSoKham(data: any): void {
    this.soKhamService.findHoSoKhamBySoKhamId(this.hoSoKhamPageIndex-1, this.hoSoKhamPageSize,data.id)
      .subscribe(res => {
        if (res && res.success){
          this.hoSoKhams = res.data;
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      });
  }

  onDelete(data: any): void {
    this.soKhamService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllSoKham();
      });
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
    this.getAllSoKham();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllSoKham();
  }

  hoSoKhamHandleOk(): void{
    this.isVisibleListHoSo = false;
  }

  soKhamOnRowClick(data: any):void{
    this.selectedSoKham = data;
    this.getAllHoSoKham(data);
    this.isVisibleListHoSo = true;
  }


  onHoSoKhamInfo(): void {
    this.isVisibleHoSo = false;
  }

  onRowHoSoClick(data: any): void {
    this.isVisibleHoSo = true;
    this.isVisibleListHoSo = false;
    this.hoSoKham = data;
  }

  onCloseHoSo(): void {
    this.isVisibleHoSo = false;
    this.isVisibleListHoSo = true;
  }

  onUpdateSoKham(): void{
    this.selectedSoKham.lanCoThaiThu = (<HTMLInputElement>document.getElementById("lanCoThaiThu")).value;
    this.selectedSoKham.ngayKinhCuoi = (<HTMLInputElement>document.getElementById("ngayKinhCuoi")).value;
    this.selectedSoKham.ngaySinhDuKien = (<HTMLInputElement>document.getElementById("ngaySinhDuKien")).value;

    this.soKhamService.update(this.selectedSoKham,this.selectedSoKham.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.getAllSoKham();
        this.toastrService.success("Cập nhật thành công");
      }
    });
  }

  onUpdateHoSoKham(): void{
    this.hoSoKham.ngayKham = (<HTMLInputElement>document.getElementById("ngayKham")).value;
    this.hoSoKham.tuanThai = (<HTMLInputElement>document.getElementById("tuanThai")).value;
    this.hoSoKham.trongLuongMe = (<HTMLInputElement>document.getElementById("trongLuongMe")).value;
    this.hoSoKham.chieuCaoMe = (<HTMLInputElement>document.getElementById("chieuCaoMe")).value;
    this.hoSoKham.huyetAp = (<HTMLInputElement>document.getElementById("huyetAp")).value;
    this.hoSoKham.chieuCaoTuCung = (<HTMLInputElement>document.getElementById("chieuCaoTuCung")).value;
    this.hoSoKham.vongBung = (<HTMLInputElement>document.getElementById("vongBung")).value;
    this.hoSoKham.khungChau = (<HTMLInputElement>document.getElementById("khungChau")).value;
    this.hoSoKham.thieuMau = (<HTMLInputElement>document.getElementById("thieuMau")).value;
    this.hoSoKham.proteinNieu = (<HTMLInputElement>document.getElementById("proteinNieu")).value;
    this.hoSoKham.xetNghiemHIV = (<HTMLInputElement>document.getElementById("xetNghiemHIV")).value;
    this.hoSoKham.xetNghiemKhac = (<HTMLInputElement>document.getElementById("xetNghiemKhac")).value;
    this.hoSoKham.timThai = (<HTMLInputElement>document.getElementById("timThai")).value;
    this.hoSoKham.ngoiThai = (<HTMLInputElement>document.getElementById("ngoiThai")).value;
    this.hoSoKham.ghiChu = (<HTMLInputElement>document.getElementById("ghiChu")).value;

    this.soKhamService.updateHoSoKham(this.hoSoKham,this.hoSoKham.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.toastrService.success("Cập nhật thành công");
      }
    });
    window.location.reload();
  }

  onCloseProcess(): void{
    this.isVisibleListHoSo = false;
    this.isVisibleDongSo = true;
  }

  onCloseDongSo(): void {
    this.isVisibleDongSo = false;
    this.isVisibleListHoSo = true;
  }

  onDongSo(): void {
    this.selectedSoKham.trangThai = true;
    this.isVisibleDongSo = false;
    
    this.soKhamService.update(this.selectedSoKham,this.selectedSoKham.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        window.location.reload();
        this.toastrService.success("Cập nhật thành công");
      }
    });

    if (!this.isXayThai){
      this.accountService.getUserInfo(this.tokenService.getUser())
      .subscribe((res:any) => {
        if (res && res.success) {
          this.treSoSinh.coSoYTeId = res.data;
          this.treSoSinh.ten = (<HTMLInputElement>document.getElementById("tenTre")).value;
          this.treSoSinh.canNangsinh = (<HTMLInputElement>document.getElementById("canNangSinh")).value;
          this.treSoSinh.note = (<HTMLInputElement>document.getElementById("ghiChu")).value;
          this.treSoSinh.gioiTinh = (<HTMLInputElement>document.getElementById("gioiTinh")).value;
          this.treSoSinh.sinhNon = (<HTMLInputElement>document.getElementById("sinhNon")).value;
          this.treSoSinh.diTat = (<HTMLInputElement>document.getElementById("diTat")).value;
          this.treSoSinh.ngaySinh = (<HTMLInputElement>document.getElementById("ngaySinh")).value;
          this.treSoSinh.thaiPhuId = this.selectedSoKham.thaiPhuId;
          
          this.treSoSinhService.create(this.treSoSinh)
          .pipe(finalize(() => this.isLoading$.next(false)))
          .subscribe(res => {
            if (res && res.success) {
              this.toastrService.success("Cập nhật thành công");
            }
          });
        }
      });
    }
  }

  getColorText(status: string) {
    if (status === "UPDATED") {
      return "#34a5da"
    } else if (status === "NEW") {
      return "#52cf71"
    } else {
      return "";
    }
  }

  getColorTextStatus(status: string) {
    if (status === "CLOSED") {
      return "#df5858"
    } else if (status === "OPEN") {
      return "#1da740"
    } else {
      return "";
    }
  }
  
  switched() {
    if (this.isXayThai){
      this.isXayThai = false;
    } else {
      this.isXayThai = true;
    }
  }

  isDong(): boolean {
    if ((!this.isThaiPhu) && (this.selectedSoKham.dongMo === "OPEN")){
      return true;
    } else {
      return false;
    }
  }
}
