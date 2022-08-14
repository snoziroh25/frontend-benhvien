import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Account } from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { matchValidator } from 'src/app/share/shared/common-function/match-pasword';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-change-pass',
  templateUrl: './change-pass.component.html',
  styleUrls: ['./change-pass.component.scss']
})
export class ChangePassComponent implements OnInit {

  passwordForm: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  userInfo!: Account;

  constructor(private fb: FormBuilder,
    private toastService: ToastrService,
    private tokenService: TokenStorageService,
    private accountService: AccountService) { 
    this.passwordForm = this.fb.group({
      oldPassword: [null, [Validators.required]],
      password: [null, [Validators.required, matchValidator('confirmPassword', true)]],
      confirmPassword: [null, [Validators.required, matchValidator('password')]]
    })
  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      this.toastService.error("Mật khẩu đã nhập không trùng khớp", "Lỗi");
      return;
    }
    if (this.userInfo) {
      let user: Account = new Account();
      user.password = this.passwordForm.get('password')?.value;
      this.isLoading$.next(true);
      this.accountService.changePassword(user, this.userInfo.id)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe(res => {
        if (res && res.success) {
          this.toastService.success("Cập nhật thành công", "Thông tin user");
          this.tokenService.signOut();
        }
      },
      (err) => {
        if (err && err.error.message.includes("pasword is not correct")) {
          this.toastService.error("Vui lòng kiểm tra trường mật khẩu cũ", "Mật khẩu không chính xác")
        }
      });
    } else {
      this.toastService.error("Không tìm thấy thông tin user", "Lỗi")
    }
   
  }

  getUserInfo(): void {
    this.isLoading$.next(true);
    const username = this.tokenService.getUser();
    this.accountService.getUserInfo(username)
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe(res => {
      if (res && res.success) {
        this.userInfo = res.data;
      }
    });
  }

  get f() {
    return this.passwordForm.controls;
  }
}
