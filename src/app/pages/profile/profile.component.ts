import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { ThaiPhu } from 'src/app/models/thai_phu.model';
import { ThaiPhuService } from 'src/app/services/thaiphu.service';
import { differenceInCalendarDays } from 'date-fns';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userForm: FormGroup;
  thaiPhu: ThaiPhu = new ThaiPhu();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
 
  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) > 0;

  get emailF() {
    return this.userForm.controls.email;
  }

  get nameF() {
    return this.userForm.controls.ten;
  }

  get phoneF() {
    return this.userForm.controls.sdt;
  }

  constructor(private fb: FormBuilder,
    private thaiPhuService: ThaiPhuService,
    private toastService: ToastrService,
    private tokenService: TokenStorageService) {
    this.userForm = this.fb.group({
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      ten: [null, [Validators.required]],
      cccd: [null, [Validators.required]],
      sdt: [null, [Validators.required, Validators.pattern("^0[3|5|7|8|9]+[0-9]{8}$")]],
      ngaySinh: [null, [Validators.required]],
      diaChi: [null],
    });
   }

  ngOnInit(): void {
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
        this.setValueForm(this.thaiPhu);
      }
    })
  }

  setValueForm(thaiPhu: ThaiPhu): void {
    this.userForm.patchValue({
      ten: thaiPhu.ten,
      cccd: thaiPhu.cccd,
      sdt: thaiPhu.sdt,
      ngaySinh: thaiPhu.ngaySinh,
      email: thaiPhu.email,
      diaChi: thaiPhu.diaChi
    });
  }

  onSubmit(): void {
   
    this.thaiPhu.ten = this.userForm.get('ten')?.value;
    this.thaiPhu.diaChi = this.userForm.get('diaChi')?.value;
    this.thaiPhu.email = this.userForm.get('email')?.value;
    this.thaiPhu.sdt = this.userForm.get('sdt')?.value;
    this.thaiPhu.ngaySinh = moment(this.userForm.get('ngaySinh')?.value).format('YYYY/MM/DD');
    this.thaiPhu.cccd = this.userForm.get('cccd')?.value;
    
    this.isLoading$.next(true);
    this.thaiPhuService.update(this.thaiPhu, this.thaiPhu.id)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.toastService.success("Cập nhật thành công", "Thông tin user");
      }
    })
  }

}
