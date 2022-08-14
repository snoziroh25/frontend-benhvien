import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { matchValidator } from 'src/app/share/shared/common-function/match-pasword';
import { differenceInCalendarDays } from 'date-fns';
import { ThaiPhuDangKy } from 'src/app/models/dangkythaiphu.model';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  thaiPhuDangKy: ThaiPhuDangKy = new ThaiPhuDangKy();
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);


  today = new Date();
  disabledDate = (current: Date): boolean =>
  differenceInCalendarDays(current, this.today) > 0;

  get emailF() {
    return this.registerForm.controls.email;
  }

  get nameF() {
    return this.registerForm.controls.ten;
  }

  get phoneF() {
    return this.registerForm.controls.sdt;
  }


  constructor(private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: ToastrService) {
    this.registerForm = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(4)]],
      password: [null, [Validators.required, Validators.minLength(6), matchValidator('confirmPassword', true)]],
      confirmPassword: [null, [Validators.required, matchValidator('password')]],
      ten: [null, [Validators.required]],
      diaChi: [null, [Validators.required]],
      ngaySinh: [null, [Validators.required]],
      sdt: [null, [Validators.required, Validators.pattern("^0[3|5|7|8|9]+[0-9]{8}$")]],
      cccd: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    });
   }

  ngOnInit(): void {
  }

  onBack(): void{
    this.router.navigateByUrl("login");
  }

  onSubmit(): void {
   
    if (this.registerForm.invalid) {
      this.toastService.error("Vui lòng nhập đủ và đúng yêu cầu", "Lỗi");
      return;
    }
    this.thaiPhuDangKy.username = this.registerForm.get('username')?.value;
    this.thaiPhuDangKy.password = this.registerForm.get('password')?.value;
    this.thaiPhuDangKy.ten = this.registerForm.get('ten')?.value;
    this.thaiPhuDangKy.diaChi = this.registerForm.get('diaChi')?.value;
    this.thaiPhuDangKy.ngaySinh = moment(this.registerForm.get('ngaySinh')?.value).format('YYYY/MM/DD');
    this.thaiPhuDangKy.sdt = this.registerForm.get('sdt')?.value;
    this.thaiPhuDangKy.cccd = this.registerForm.get('cccd')?.value;
    this.thaiPhuDangKy.email = this.registerForm.get('email')?.value;
    
    this.isLoading$.next(true);

    this.authService.register(this.thaiPhuDangKy)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(
      (res) => {
        if (res && res.success) {
          this.toastService.success("Bạn có thể đăng nhập vào tài khoản của mình","Đăng ký thành công");
          this.router.navigateByUrl("login");
        }
      },
      (err) => {
        if (err) {
          this.toastService.error(err.error.message);
        }
      }
    )
  }

  get f() {
    return this.registerForm.controls;
  }
}