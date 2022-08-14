import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from './token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  adminRouter = ["/soyte", "/taikhoan"]
  soyteRouter = ["/cosoyte","/benh","/vacxin","/baocao"]
  cosoyteRouter = ["/thaiphu","/danhsachdangky","/bacsi","/calam","/lichkham"]
  thaiphuRouter = ["/dangkykham","/dangkykhamtre","/dangkytiem"]
  sumRouter = ["/tresosinh", "/sokham"]

  constructor(private router: Router,
    private tokenService: TokenStorageService) {
   }

  canActivate(route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      if (!this.tokenService.getToken()) {
        this.router.navigateByUrl('login');
        return false;
      }
      if ((this.tokenService.getRole() != "ADMIN") && this.adminRouter.includes(window.location.pathname)) {
        this.router.navigateByUrl('dashboard');
        return false;
      }
      if ((this.tokenService.getRole() != "SOYTE") && this.soyteRouter.includes(window.location.pathname)) {
        this.router.navigateByUrl('dashboard');
        return false;
      }
      if ((this.tokenService.getRole() != "COSOYTE") && this.cosoyteRouter.includes(window.location.pathname)) {
        this.router.navigateByUrl('dashboard');
        return false;
      }
      if ((this.tokenService.getRole() != "THAIPHU") && this.thaiphuRouter.includes(window.location.pathname)) {
        this.router.navigateByUrl('dashboard');
        return false;
      }
      return true;
  }
}
