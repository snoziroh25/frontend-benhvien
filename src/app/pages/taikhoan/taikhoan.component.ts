import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { Account} from 'src/app/models/account.model';
import { AccountService } from 'src/app/services/account.service';
import { matchValidator } from 'src/app/share/shared/common-function/match-pasword';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

@Component({
  selector: 'app-taikhoan',
  templateUrl: './taikhoan.component.html',
  styleUrls: ['./taikhoan.component.scss']
})
export class TaikhoanComponent implements OnInit {

  formGroup!: FormGroup;
  taiKhoans: Account[] = [];
  selectedTaiKhoan!: any;
  isLoading$ = new BehaviorSubject(false);
  isVisible = false;
  isUpdate = false;
  pageIndex = 1;
  totalPage = 1;
  pageSize = 10;

  constructor(
    private accountService: AccountService,
    private fb: FormBuilder,
    private modal: NzModalService,
    private tokenService: TokenStorageService,
    private toastrService: ToastrService,
  ) {
    this.formGroup = this.fb.group({
      oldPassword: ["", [Validators.required]],
      newPassword: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required, matchValidator('newPassword', true)]],
    })
   }

  ngOnInit(): void {
    this.getAllTaiKhoan();
  }

  getRole(roleCode : string){
    if (roleCode === "ADMIN"){
      return "Admin";
    } else if (roleCode === "SOYTE"){
      return "Sở Y Tế";
    } else if (roleCode === "COSOYTE"){
      return "Cơ Sở Y Tế";
    } else if (roleCode === "THAIPHU"){
      return "Thai Phụ";
    } else {
      return "";
    }
  }

  getAllTaiKhoan(): void {
    const username = this.tokenService.getUser();
    this.isLoading$.next(true);
    this.accountService.getAllPaging(username,this.pageIndex,this.pageSize)
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe((response: any) => {
        if (response && response.success) {
          this.taiKhoans = response.data;
          this.totalPage = response.totalPage  * 10;  
          this.taiKhoans = this.taiKhoans.map(taiKhoan => {
           return {
             ...taiKhoan,
             checked: false
           }
         });
        } else {
          this.toastrService.error('Xảy ra lỗi');
        }
      })
  }


  onDelete(data: Account): void {
    this.accountService.delete(data.id)
        .pipe(finalize(() => this.isVisible = false))
        .subscribe(response => {
          this.getAllTaiKhoan();
      });
  }
  
  showModal(data?: any): void {
    this.isVisible = true;
    this.formGroup.reset();
    this.selectedTaiKhoan = data;
  }

  handleOk(): void {

    if (this.formGroup.invalid) {
      this.toastrService.error("Mật khẩu đã nhập không trùng khớp", "Lỗi");
      return;
    }
    let request = {username:this.selectedTaiKhoan.username,oldPassword:this.formGroup.get('oldPassword')?.value,newPassword:this.formGroup.get('newPassword')?.value};
    this.accountService.changePassword1(request)
      .subscribe((res:any) => {
        if (res && res.success){
          this.toastrService.success("Đổi mật khẩu thành công!");
          this.isVisible = false;
        }
      },
      (err) => {
        if (err && err.error.message.includes("does not correct")) {
          this.toastrService.error("Vui lòng kiểm tra trường mật khẩu cũ", "Mật khẩu không chính xác")
        }
      });
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  showDeleteConfirm(data: Account): void {
    this.modal.confirm({
      nzTitle: 'Bạn có chắc chắn muốn xóa?',
      nzContent: `<b style="color: red;">${data.username}</b>`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.onDelete(data),
      nzCancelText: 'No'
    });
  }

  onPageChange(pageNumber: number): void {
    this.pageIndex = pageNumber;
    this.getAllTaiKhoan();
  }

  onPageSizeChange(pageSize: number): void {
    this.pageSize = pageSize;
    this.getAllTaiKhoan();
  }

}
