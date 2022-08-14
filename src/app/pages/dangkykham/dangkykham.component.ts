import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { LichKham } from 'src/app/models/lichkham.model';
import { ThaiPhu } from 'src/app/models/thai_phu.model';
import { ThaiPhuService } from 'src/app/services/thaiphu.service';
import { differenceInCalendarDays } from 'date-fns';
import { CoSoYTeService } from 'src/app/services/cosoyte.service';
import { LichkhamService } from 'src/app/services/lichkham.service';
import { DiachiService } from 'src/app/services/diachi.service';
import { finalize } from 'rxjs/operators';
import { TinhThanh } from 'src/app/models/tinhthanh.model';
import { QuanHuyen } from 'src/app/models/quanhuyen.model';
import { XaPhuong } from 'src/app/models/xaphuong.model';
import * as moment from 'moment';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dangkykham',
  templateUrl: './dangkykham.component.html',
  styleUrls: ['./dangkykham.component.scss']
})
export class DangkykhamComponent implements OnInit {

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
  thaiPhu: ThaiPhu = new ThaiPhu();
  disableQuan: boolean = true;
  disableXa: boolean = true;
  disableCSYT: boolean = true;
  disableKham: boolean = true;


  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) < 1;

  constructor(private fb: FormBuilder,
    private router: Router,
    private diaChiService: DiachiService,
    private thaiPhuService: ThaiPhuService,
    private coSoYTeService: CoSoYTeService,
    private lichKhamService: LichkhamService,
    private toastService: ToastrService,
    private tokenService: TokenStorageService) {
    this.formGroup = this.fb.group({
      xaPhuong: [null, [Validators.required]],
      quanHuyen: [null, [Validators.required]],
      tinhThanh: [null, [Validators.required]],
      caLam: [null, [Validators.required]],
      thoiGian: [null],
      ngayKham: [null, [Validators.required]],
      thaiPhu: [null],
      coSoYTe: [null, [Validators.required]],
      thaiPhuId: [null],
      coSoYTeId: [null],
    });
   }

  ngOnInit(): void {
    this.getAllTinhThanh();
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
        this.formGroup.patchValue({
          thaiPhuId: this.thaiPhu.id
        });
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
    this.lichKham.thaiPhuId = this.formGroup.get('thaiPhuId')?.value;
    this.lichKham.coSoYTeId = this.formGroup.get('coSoYTe')?.value;
    this.lichKham.doiTuong = "thaiphu";
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
