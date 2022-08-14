import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TreSoSinh } from 'src/app/models/tre_so_sinh.model';
import { AccountService } from 'src/app/services/account.service';
import { HoSoKhamService } from 'src/app/services/hosokham.service';
import { TreSoSinhService } from 'src/app/services/tresosinh.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ThaiPhuService } from 'src/app/services/thaiphu.service';

@Component({
  selector: 'app-tresosinh',
  templateUrl: './tresosinh.component.html',
  styleUrls: ['./tresosinh.component.scss']
})
export class TreSoSinhComponent implements OnInit {

  formGroup: FormGroup;
  treSoSinhs: TreSoSinh[] = [];
  isLoading$ = new BehaviorSubject(false);
  pageIndex = 1;
  pageSize = 10;
  totalPage = 1;
  isVisible = false;
  selectedTreSoSinh: any;
  
  isThaiPhu = false;
  isVisibleTre = false;
  hoSoKhams: any[] = [];
  hoSoKhamPageIndex = 1;
  hoSoKhamPageSize = 10;
  hoSoKhamTotalPage = 1;

  isVisibleHoSo = false;
  isVisibleInfo = false;
  selectedHoSo: any;
  selectedMom: any;


  
  constructor(private fb: FormBuilder,
    private modal: NzModalService,
    private treSoSinhService: TreSoSinhService,
    private tokenService: TokenStorageService,
    private hoSoKhamService: HoSoKhamService,
    private toastrService: ToastrService,
    private thaiPhuService: ThaiPhuService,
    private accountService: AccountService) { 
    this.formGroup = this.fb.group({
      id: [null, [Validators.required]],
      ten: [null],
      ngaySinh: [null],
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
    this.getListTreSoSinh();
  }

  getListTreSoSinh(): void {
    this.isLoading$.next(true);
    const username = this.tokenService.getUser();
    this.treSoSinhService.getByUsername(username, this.pageIndex-1, this.pageSize)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.treSoSinhs = res.data;
        this.treSoSinhs = this.treSoSinhs.map(c => {
          return {
            ...c,
            checked: false
          }
        })
      }
    });
  }
  
  onRowClick(data: any): void {
    this.selectedTreSoSinh = data;
    if (data.gioiTinh === "male"){
      this.selectedTreSoSinh.gioiTinh = "Nam";
    } else if (data.gioiTinh === "female") {
      this.selectedTreSoSinh.gioiTinh = "Nữ";
    }
    this.getAllHoSo(data.id);
    this.isVisibleTre = true;
  }

  getAllHoSo(id: string): void{
    this.hoSoKhamService.getByTreId(this.hoSoKhamPageIndex-1, this.hoSoKhamPageSize,id)
    .subscribe((res:any) =>{
      if (res && res.success){
        this.hoSoKhams = res.data;
      } else {
        this.toastrService.error('Xảy ra lỗi');
      }
    })
  }

  onDelete(data: TreSoSinh): void {
    this.treSoSinhService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getListTreSoSinh();
      });
  }

  showModal(data?: TreSoSinh): void {
    this.isVisible = true;
    
  }


  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: TreSoSinh): void {
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
    this.getListTreSoSinh();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getListTreSoSinh();
  }

  treCancel(): void {
    this.isVisibleTre = false;
  }

  onRowHoSoClick(data: any): void {
    this.selectedHoSo = data;
    this.isVisibleHoSo = true;
  }

  onUpdateTre(): void {
    this.selectedTreSoSinh.ten = (<HTMLInputElement>document.getElementById("ten")).value;
    this.selectedTreSoSinh.ngaySinh = (<HTMLInputElement>document.getElementById("ngaySinh")).value;
    this.selectedTreSoSinh.diTat = (<HTMLInputElement>document.getElementById("diTat")).value;
    this.selectedTreSoSinh.sinhNon = (<HTMLInputElement>document.getElementById("sinhNon")).value;
    this.selectedTreSoSinh.canNangSinh = (<HTMLInputElement>document.getElementById("canNangSinh")).value;
    this.selectedTreSoSinh.note = (<HTMLInputElement>document.getElementById("note")).value;
    this.selectedTreSoSinh.gioiTinh = (<HTMLInputElement>document.getElementById("gioiTinh")).value;

    this.treSoSinhService.update(this.selectedTreSoSinh,this.selectedTreSoSinh.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.getListTreSoSinh();
        this.toastrService.success("Cập nhật thành công");
      }
    });
  }

  onUpdateHoSoKham(): void {
    this.selectedHoSo.ngayKham = (<HTMLInputElement>document.getElementById("ngayKham")).value;
    this.selectedHoSo.canNang = (<HTMLInputElement>document.getElementById("canNang")).value;
    this.selectedHoSo.chieuCao = (<HTMLInputElement>document.getElementById("chieuCao")).value;
    this.selectedHoSo.ghiChu = (<HTMLInputElement>document.getElementById("ghiChu")).value;
    this.hoSoKhamService.updateKhamTre(this.selectedHoSo,this.selectedHoSo.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.getListTreSoSinh();
        this.toastrService.success("Cập nhật thành công");
      }
    });
  }

  getYesNo(boo:string){
    if (boo === "no"){
      return "Không";
    } else if (boo === "yes"){
      return "Có";
    } else {
      return "Không xác định";
    }
  }

  getColorText(status: string) {
    if (status === "UPDATED" || status === "CLOSED") {
      return "#34a5da"
    } else if (status === "NEW" || status === "OPEN") {
      return "#52cf71"
    } else {
      return "";
    }
  }

  onCloseHoSo(): void {
    this.isVisibleHoSo = false;
  }

  onCloseInfo(): void {
    this.isVisibleInfo = false;
  }

  onInfo(thaiPhuId: string): void {
    this.isLoading$.next(true);
    this.thaiPhuService.findById(thaiPhuId)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe(res => {
        if (res && res.success){
          this.selectedMom = res.data;
        }
      },
      err => {
        if (err){
          this.toastrService.error(err.error.message);
        }
      })
    this.isVisibleInfo = true;
  }

}
