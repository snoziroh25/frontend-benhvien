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
          this.toastrService.error('Không thể lấy thông tin người tiêm!');
        }
      });
  }

  getVacxin(benhId: string): void {
    this.vacxinService.getByBenhId(benhId)
      .subscribe((res: any) =>{
        if (res && res.success) {
          this.vacxins = res.data;
        } else {
          this.toastrService.error('Không thể lấy thông tin bệnh');
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
    if (((<HTMLInputElement>document.getElementById("bacSi")).value != "Chọn người tiêm") && ((<HTMLInputElement>document.getElementById("vacxin")).value != "Chọn vaccine")) {
      (<HTMLInputElement>document.getElementById("accept-btn")).disabled = false;
    }
  }

  setValueLichSuTiem(): void{
    if ((<HTMLInputElement>document.getElementById("target")).value === "Thai phụ"){
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
          this.toastrService.success('Xóa thành công');
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      });
  }

  createThongBao(){
    this.dangKyTiemService.createThongBao(this.thongBao)
      .subscribe((res : any) => {
        if (!(res && res.success)){
          this.toastrService.error("Tạo thông báo thất bại!");
        }
      });
  }

  onAccept(): void {
    this.setValueLichSuTiem();
    this.dangKyTiemService.createLichSuTiem(this.lichSuTiem)
      .subscribe((res:any)=>{
        if (res && res.success){
          this.toastrService.success("Duyệt thành công!");
        }else{
          this.toastrService.error("Đã xảy ra lỗi trong quá trình tạo lịch sử tiêm!");
        }
      });
    this.thongBao.content = "Đăng ký tiêm thành công vào ngày: " + this.lichSuTiem.ngayTiem;
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
          this.toastrService.success('Đã gửi tin nhắn từ chối!');
        }else{
          this.toastrService.error('Xảy ra lỗi');
        }
      });
  }

  onCloseDecline(): void {
    this.thongBao.content = "Đăng ký tiêm của bạn bị từ chối với lý do: "+(<HTMLInputElement>document.getElementById("declineDescripe")).value;
    this.thongBao.type = "DECLINE";
    this.createThongBao();
    this.declineDangKy(this.selectedDangKy.id);
    this.getAllDangKy();
    this.isVisibleDecline = false;
  }
}
