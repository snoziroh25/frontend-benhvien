import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LichKham } from 'src/app/models/lichkham.model';
import { QuanHuyen } from 'src/app/models/quanhuyen.model';
import { ThaiPhu } from 'src/app/models/thai_phu.model';
import { TinhThanh } from 'src/app/models/tinhthanh.model';
import { XaPhuong } from 'src/app/models/xaphuong.model';
import { differenceInCalendarDays } from 'date-fns';
import { Router } from '@angular/router';
import { DiachiService } from 'src/app/services/diachi.service';
import { CoSoYTeService } from 'src/app/services/cosoyte.service';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { BenhService } from 'src/app/services/benh.service';
import { ThaiPhuService } from 'src/app/services/thaiphu.service';
import { DangKyTiemService } from 'src/app/services/dangkytiem.service';
import { TreSoSinhService } from 'src/app/services/tresosinh.service';

export const doiTuongs = [
  {
    value: "THAIPHU",
    title: "Thai phụ"
  },
  {
    value: "TRE",
    title: "Trẻ sơ sinh"
  },
]

@Component({
  selector: 'app-dangkytiem',
  templateUrl: './dangkytiem.component.html',
  styleUrls: ['./dangkytiem.component.scss']
})
export class DangkytiemComponent implements OnInit {

  formGroup: FormGroup;
  dangKy: any = {"csytId":"","ngayTiem":"","thaiPhuId":"","benhId":"","target":"","targetId":""};
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  tinhThanhs: TinhThanh[] = [];
  quanHuyens: QuanHuyen[] = [];
  xaPhuongs: XaPhuong[] = [];
  coSoYTes: any[] = [];
  ngayKham?: string;
  bacSis: any[]= [];
  benhs: any[] = [];
  tres: any[] = [];
  isTre = false;

  
  get doiTuongs() {
    return doiTuongs;
  }


  lichKhamAvailable: any[] = [];
  thaiPhu: ThaiPhu = new ThaiPhu();
  disableQuan: boolean = true;
  disableXa: boolean = true;
  disableCSYT: boolean = true;
  thongBao: any = {"content":"","thaiPhuId":"","status":"NEW","type":"REQUEST"};


  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) < 1;

  constructor(private fb: FormBuilder,
    private router: Router,
    private diaChiService: DiachiService,
    private coSoYTeService: CoSoYTeService,
    private toastService: ToastrService,
    private benhService: BenhService,
    private tokenService: TokenStorageService,
    private thaiPhuService: ThaiPhuService,
    private treService: TreSoSinhService,
    private dangKyTiemService: DangKyTiemService) {

    this.formGroup = this.fb.group({
      xaPhuong: [null, [Validators.required]],
      quanHuyen: [null, [Validators.required]],
      tinhThanh: [null, [Validators.required]],
      ngayTiem: [null, [Validators.required]],
      benh: [null, [Validators.required]],
      coSoYTe: [null, [Validators.required]],
      doiTuong: [null],
      tre: [null],
    });
   }

  ngOnInit(): void {
    this.getAllTinhThanh();
    this.getBenhByTarget("tatca");
    this.getThaiPhu();
  }

  getThaiPhu(): void {
    this.isLoading$.next(true);
    const username = this.tokenService.getUser();
    this.thaiPhuService.findByUsername(username)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.thaiPhu = res.data;
      }
    })
  }

  getBenhByTarget(target: string): void {
    this.benhService.getBenhByTarget(target)
    .subscribe((res:any) => {
      if (res && res.success){
        this.benhs = res.data;
      } else {
        this.toastService.error('Xảy ra lỗi');
      }
    });
  }


  getAllTinhThanh(): void {
    this.diaChiService.getTinh()
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.tinhThanhs = response.data;
        }else{
          this.toastService.error('Xảy ra lỗi');
        }
      });
  }

  getAllQuanHuyen(tinhThanhId: string): void {
    this.diaChiService.getQuanHuyen(tinhThanhId)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.quanHuyens = response.data;
        }else{
          this.toastService.error('Xảy ra lỗi');
        }
      });
  }

  getAllXaPhuong(quanHuyenId: string): void {
    this.diaChiService.getXaPhuong(quanHuyenId)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.xaPhuongs = response.data;
        }else{
          this.toastService.error('Xảy ra lỗi');
        }
      });
  }

  getAllCoSoYTe(xaPhuongId: string): void{
    this.coSoYTeService.getByXaPhuongId(xaPhuongId)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if(response && response.success){
          this.coSoYTes = response.data;
        }else{
          this.toastService.error('Xảy ra lỗi');
        }
      });
  }
  

  onTinhThanh(data: any): void {
    this.getAllQuanHuyen(data);
    this.disableQuan = false;
  }

  onQuanHuyen(data: any): void {
    this.getAllXaPhuong(data);
    this.disableXa = false;
  }

  onXaPhuong(data: any): void {
    this.getAllCoSoYTe(data);
    this.disableCSYT = false;
  }

  createThongBao(){
    this.thongBao.content = "Có đăng ký tiêm vào ngày " + moment(this.formGroup.get('ngayTiem')?.value).format('YYYY-MM-DD');
    this.thongBao.type = "ACCEPT";
    this.thongBao.thaiPhuId = this.formGroup.get('coSoYTe')?.value;
    this.dangKyTiemService.createThongBao(this.thongBao)
      .subscribe((res : any) => {
        if (!(res && res.success)){
          this.toastService.error("Tạo thông báo thất bại!");
        }
      });
  }


  onSubmit(): void {
    this.dangKy.csytId = this.formGroup.get('coSoYTe')?.value;
    this.dangKy.ngayTiem = moment(this.formGroup.get('ngayTiem')?.value).format('YYYY-MM-DD');
    this.dangKy.thaiPhuId = this.thaiPhu.id;
    this.dangKy.benhId = this.formGroup.get('benh')?.value;
    this.dangKy.target = this.formGroup.get('doiTuong')?.value;
    if (this.dangKy.target === "TRE"){
      this.dangKy.targetId = this.formGroup.get('tre')?.value;
    } else if (this.dangKy.target === "THAIPHU") {
      this.dangKy.targetId = this.thaiPhu.id;
    }

    this.dangKyTiemService.create(this.dangKy)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe( res => {
      if (res && res.success){
        this.toastService.success('Đăng ký thành công !');
        this.createThongBao();
        this.router.navigateByUrl("");
      } else {
        this.toastService.error('Đăng ký thất bại !');
      }
    });
  }

  getTre(): void {
    this.treService.getByThaiPhuId(this.tokenService.getUser())
      .subscribe((res:any) => {
        if (res && res.success){
          this.tres = res.data;
        } else {
          this.toastService.error('Lấy thông tin trẻ sơ sinh thất bại!');
        }
      });
  }

  onDoiTuong(data:any): void {
    this.getBenhByTarget(data);
    this.getTre();
    if (data === "TRE"){
      this.isTre = true;
    } else {
      this.isTre = false;
    }
  }

}
