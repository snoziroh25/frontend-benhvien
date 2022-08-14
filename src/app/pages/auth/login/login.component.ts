import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_services/auth.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import {finalize} from "rxjs/operators"
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  roles: string[] = [];
  loginForm: FormGroup;
  checked = false;
  isSpinning = false;

  constructor(private authService: AuthService, 
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private tokenStorage: TokenStorageService,
    private accountService: AccountService,) { 
      this.loginForm = this.fb.group({
        username: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(6)]],
        checked: [false]
      })
    }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.roles = this.tokenStorage.getUser().roles;
    }
  }

  onRegister(): void {
    this.router.navigateByUrl('register');
  }

  onSubmit(): void {
    if (this.loginForm.get('username')?.hasError('required')) {
      this.toastr.error("Tên đăng nhập không được để trống", "Đăng nhập");
      return;
    } else if (this.loginForm.get('password')?.hasError('required')) {
      this.toastr.error("Mật khẩu không được để trống", "Đăng nhập");
      return;
    } else if (this.loginForm.get('password')?.hasError('minlength')) {
      this.toastr.error("Mật khẩu tối thiểu 6 ký tự", "Đăng nhập");
      return;
    }
    const { username, password } = this.loginForm.getRawValue();
    this.isSpinning = true;
    this.authService.login(username, password).
    pipe(finalize(() => this.isSpinning = false))
    .subscribe(
      response => {
        const token = response.data.accessToken;
        this.tokenStorage.saveToken(token);
        this.tokenStorage.saveUser(username);
        this.navigateToHome();
        this.accountService.getIdByUsername(username)
          .subscribe((res:any)=>{
            if (res && res.success){
              localStorage.setItem('userId', res.data);
            }
          });
        this.accountService.getRoleByUsername(username)
          .subscribe(res =>{
            this.roles = res.data;
            this.tokenStorage.saveRole(res.data);
            if (res.data != "ADMIN"){
              this.accountService.getUserInfo(username)
                .subscribe((res:any)=>{
                  if (res && res.success){
                    localStorage.setItem('infoId', res.data);
                  }
              })
            }
          })
      },
      err => {
        this.toastr.error('Username hoặc mật khẩu không chính xác', 'Đăng nhập');
      }
    );
  }

  navigateToHome(): void {
    this.router.navigateByUrl('dashboard');
  }
}