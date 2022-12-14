import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account.service';
import { BacSiService } from 'src/app/services/bacsi.service';
import { DangKyTiemService } from 'src/app/services/dangkytiem.service';
import { VacxinService } from 'src/app/services/vacxin.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-danhsachdangky',
  templateUrl: './danhsachdangky.component.html',
  styleUrls: ['./danhsachdangky.component.scss']
})
export class DanhsachdangkyComponent implements OnInit {

  formGroup!: FormGroup;
  isLoading$ = new BehaviorSubject(false);
  selectedDangKy: any;
  isVisible = false;
  isVisibleDecline = false;
  dangKys: any[] = [];
  vacxins: any[] = [];
  bacSis: any[] = [];
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;
  csyt: any;
  lichSuTiem: any = {"target":"","targetId":"","coSoYTeId":"","bacSiId":"","vacxinId":"","ngayTiem":""};
  thongBao: any = {"content":"","thaiPhuId":"","status":"NEW","type":""};

  constructor(private fb: FormBuilder,
    private toastrService: ToastrService,
    private tokenService: TokenStorageService,
    private accountService: AccountService,
    private bacSiService: BacSiService,
    private vacxinService: VacxinService,
    private dangKyTiemService: DangKyTiemService) { }

  ngOnInit(): void {
    this.getAllDangKy();
  }

  getAllDangKy(): void {
    this.isLoading$.next(true);
    this.accountService.getUserInfo(this.tokenService.getUser())
      .subscribe((res : any) => {
        if (res && res.success) {
          this.csyt = res.data;
          this.dangKyTiemService.get(this.pageIndex-1, this.pageSize,this.csyt)
            .pipe(finalize(() => this.isLoading$.next(false)))
            .subscribe((res:any) => {
              if (res && res.success){
                this.dangKys = res.data;
              } else {
                this.toastrService.error("Failed to get list!")
              }
            })
        } else {
          this.toastrService.error("Failed to get info account");
        }
      });
  }

  getNguoiTiem(csytId: string): void {
    this.bacSiService.findByCSYTId(csytId)
      .subscribe((res:any) => {
        if (res && res.success){
          this.bacSis = res.data;
        } else {
          this.toastrService.error('Kh??ng th??? l???y th??ng tin ng?????i ti??m!');
        }
      });
  }

  getVacxin(benhId: string): void {
    this.vacxinService.getByBenhId(benhId)
      .subscribe((res: any) =>{
        if (res && res.success) {
          this.vacxins = res.data;
        } else {
          this.toastrService.error('Kh??ng th??? l???y th??ng tin b???nh');
        }
      });
  }

  onRowClick(data: any): void {
    this.selectedDangKy = data;
    this.getNguoiTiem(this.selectedDangKy.csytId);
    this.getVacxin(this.selectedDangKy.benhId);
    this.thongBao.thaiPhuId = this.selectedDangKy.thaiPhuId;
    this.isVisible = true;
  }

  onPageChange(pageNumber: number): void {
    this.pageIndex = pageNumber;
    this.getAllDangKy();    
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllDangKy();
  }

  onClose(): void {
    this.isVisible = false;
  }

  selectChange(): void {
    if (((<HTMLInputElement>document.getElementById("bacSi")).value != "Ch???n ng?????i ti??m") && ((<HTMLInputElement>document.getElementById("vacxin")).value != "Ch???n vaccine")) {
      (<HTMLInputElement>document.getElementById("accept-btn")).disabled = false;
    }
  }

  setValueLichSuTiem(): void{
    if ((<HTMLInputElement>document.getElementById("target")).value === "Thai ph???"){
      this.lichSuTiem.target = "THAIPHU";
    } else {
      this.lichSuTiem.target = "TRE"
    }
    this.lichSuTiem.targetId = this.selectedDangKy.targetId;
    this.lichSuTiem.coSoYTeId = this.csyt;
    this.lichSuTiem.bacSiId = (<HTMLInputElement>document.getElementById("bacSi")).value;
    this.lichSuTiem.vacxinId = (<HTMLInputElement>document.getElementById("vacxin")).value;
    this.lichSuTiem.ngayTiem = (<HTMLInputElement>document.getElementById("ngayTiem")).value;
  }

  deleteDangKy(id: string): void{
    this.dangKyTiemService.delete(id)
      .subscribe((res:any)=>{
        if (res && res.success){
          this.toastrService.success('X??a th??nh c??ng');
        }else{
          this.toastrService.error('X???y ra l???i');
        }
      });
  }

  createThongBao(){
    this.dangKyTiemService.createThongBao(this.thongBao)
      .subscribe((res : any) => {
        if (!(res && res.success)){
          this.toastrService.error("T???o th??ng b??o th???t b???i!");
        }
      });
  }

  onAccept(): void {
    this.setValueLichSuTiem();
    this.dangKyTiemService.createLichSuTiem(this.lichSuTiem)
      .subscribe((res:any)=>{
        if (res && res.success){
          this.toastrService.success("Duy???t th??nh c??ng!");
        }else{
          this.toastrService.error("???? x???y ra l???i trong qu?? tr??nh t???o l???ch s??? ti??m!");
        }
      });
    this.thongBao.content = "????ng k?? ti??m th??nh c??ng v??o ng??y: " + this.lichSuTiem.ngayTiem;
    this.thongBao.type = "ACCEPT";
    this.createThongBao();
    this.deleteDangKy(this.selectedDangKy.id);
    this.isVisible = false;
    window.location.reload();
  }

  onDecline(): void {
    this.isVisible = false;
    this.isVisibleDecline = true;
  }

  declineDangKy(id: string): void{
    this.dangKyTiemService.delete(id)
      .subscribe((res:any)=>{
        if (res && res.success){
          this.toastrService.success('???? g???i tin nh???n t??? ch???i!');
        }else{
          this.toastrService.error('X???y ra l???i');
        }
      });
  }

  onCloseDecline(): void {
    this.thongBao.content = "????ng k?? ti??m c???a b???n b??? t??? ch???i v???i l?? do: "+(<HTMLInputElement>document.getElementById("declineDescripe")).value;
    this.thongBao.type = "DECLINE";
    this.createThongBao();
    this.declineDangKy(this.selectedDangKy.id);
    this.getAllDangKy();
    this.isVisibleDecline = false;
  }
}
