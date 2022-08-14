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
import { ThaiPhuService } from 'src/app/services/thaiphu.service';
import { CoSoYTeService } from 'src/app/services/cosoyte.service';
import { LichkhamService } from 'src/app/services/lichkham.service';
import { ToastrService } from 'ngx-toastr';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';
import { TreSoSinhService } from 'src/app/services/tresosinh.service';

@Component({
  selector: 'app-dangkykhamtre',
  templateUrl: './dangkykhamtre.component.html',
  styleUrls: ['./dangkykhamtre.component.scss']
})
export class DangkykhamtreComponent implements OnInit {

  formGroup: FormGroup;
  lichKham: LichKham = new LichKham();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  tinhThanhs: TinhThanh[] = [];
  quanHuyens: QuanHuyen[] = [];
  xaPhuongs: XaPhuong[] = [];
  coSoYTes: any[] = [];
  caLams: string[] = [];
  ngayKham?: string;
  bacSis: string[] = [];
  lichKhamAvailable: any[] = [];
  disableQuan: boolean = true;
  disableXa: boolean = true;
  disableCSYT: boolean = true;
  disableKham: boolean = true;
  tres: any[] = [];

  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) < 1;

  constructor(private fb: FormBuilder,
    private router: Router,
    private diaChiService: DiachiService,
    private treService: TreSoSinhService,
    private coSoYTeService: CoSoYTeService,
    private lichKhamService: LichkhamService,
    private toastService: ToastrService,
    private tokenService: TokenStorageService
    ) {
      this.formGroup = this.fb.group({
      xaPhuong: [null, [Validators.required]],
      quanHuyen: [null, [Validators.required]],
      tinhThanh: [null, [Validators.required]],
      caLam: [null, [Validators.required]],
      thoiGian: [null],
      ngayKham: [null, [Validators.required]],
      coSoYTe: [null, [Validators.required]],
      coSoYTeId: [null],
      tre: [null, [Validators.required]],
    }); }

  ngOnInit(): void {
    this.getAllTinhThanh();
    this.getAllTre();
  }


  getAllTre(): void {
    this.isLoading$.next(true);
    this.treService.getByThaiPhuId(this.tokenService.getUser())
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((res: any) => {
        if (res && res.success) {
          this.tres = res.data;
        } else {
          this.toastService.error('Xảy ra lỗi');
        }
      })
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
      })
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
      })
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
      })
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
      })
  }


  getLichKhamAvailable():void {
    if (this.formGroup.get('coSoYTe')?.value != null && this.formGroup.get('ngayKham')?.value != null)
    {
      this.disableKham = false;
      const coSoYTeId = this.formGroup.get('coSoYTe')?.value;
      const ngayKham = moment(this.formGroup.get('ngayKham')?.value).format('YYYY-MM-DD');
      this.lichKhamService.findByCSYTandNgayKham(coSoYTeId,ngayKham)
        .pipe(finalize(() => this.isLoading$.next(false)))
        .subscribe((response: any) => {
          if (response && response.success){
            this.lichKhamAvailable = response.data;
          }else{
            this.toastService.error('Xảy ra lỗi');
          }
        })
    }

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

  onCoSoYTe(data: any): void {
    this.getLichKhamAvailable();
  }

  onSubmit(): void {
    this.lichKham.ngayKham = moment(this.formGroup.get('ngayKham')?.value).format('YYYY-MM-DD');
    this.lichKham.bacSiId = this.formGroup.get('caLam')?.value.split(",")[1];
    this.lichKham.caLamId = this.formGroup.get('caLam')?.value.split(",")[0];
    this.lichKham.thaiPhuId = this.formGroup.get('tre')?.value;
    this.lichKham.coSoYTeId = this.formGroup.get('coSoYTe')?.value;
    this.lichKham.doiTuong = "tre";
    this.isLoading$.next(true);
    this.lichKhamService.set(this.lichKham)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((res : any) => {
        if (res && res.success){
          this.toastService.success("Cập nhật thành công", "Thông tin user");
          this.router.navigateByUrl('');
        }
      })
  }
}
