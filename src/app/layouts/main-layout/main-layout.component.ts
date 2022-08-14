import { Component, OnInit } from "@angular/core";
import { NavigationEnd, NavigationStart, Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { finalize } from "rxjs/operators";
import { AccountService } from "src/app/services/account.service";
import { ThongBaoService } from "src/app/services/thongbao.service";
import { TokenStorageService } from "src/app/_services/token-storage.service";

@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html',
    styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
    isCollapsed = false;
    isDashboard = true;
    isLoading = false;
    userId : any;
    parentBreadcum: string = "Dashboard";
    childBreadcum: string = "";
    accountRole?: string;
    thongBaos: any[]=[];
    countThongBao = 0;
    visibleDrawer = false;
    safeHtml: any;


    isDisableDashboard = true;
    isDisableInfo = true;
    isDisableDangKyKham = true;
    isDisableDangKyKhamTre = true;
    isDisableDangKyTiem = true;
    isDisableListThaiPhu = true;
    isDisableSoKham = true;
    isDisableListBaBy = true;
    isDisableCSYT = true;
    isDisableSYT = true;
    isDisableBenh = true;
    isDisableVacxin = true;
    isDisableBacSi = true;
    isDisableCaLam = true;
    isDisableLichKham = true;
    isDisableTaiKhoan = true;
    isDisableBaoCao = true;
    isDisableDanhSachDangKy = true;
    isVisibaleThongTin = true;

    constructor(private router: Router,
        private tokenService: TokenStorageService,
        private accountService: AccountService,
        private thongBaoService: ThongBaoService) {
            router.events.subscribe((val) => {
                if (val instanceof NavigationStart) {
                   this.isDashboard = (val.url == '/dashboard') ? true : false; 
                }
              });
    }

    ngOnInit() {
        this.getAccountRole();
        this.getUserId();
    }

    getUserId(){
        this.accountService.getUserInfo(this.tokenService.getUser())
            .subscribe((res: any) => {
                if (res && res.success){
                    this.userId = res.data;
                    this.getAllThongBao();
                } else{
                    console.log("Failed To Get User Id!!");
                }
            });
    }

    getAllThongBao() {
        this.isLoading = true;
        this.thongBaoService.getByThaiPhuId(this.userId)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe((res:any) => {
                if (res && res.success) {
                    this.thongBaos = res.data;
                    this.countThongBao = 0;
                    for (let i=0;i<this.thongBaos.length;i++){
                        if (this.thongBaos[i].status === "NEW"){
                            this.countThongBao ++;
                        }
                    }
                }
            });
    }

    getStyle(status:any){
        if (status === "NEW"){
            return "#000000"
        } else {
            return "#B3B3B3"
        }
    }

    onThongBao(item: any){
        if (item.status === "NEW"){
            item.status = "SEEN";
            this.thongBaoService.update(item,item.id)
                .subscribe((res : any) => {
                    if ((res && res.success)){
                        this.countThongBao --;
                    }
                });
        }
    }

    openDrawer(): void{
        this.getAllThongBao();
        this.visibleDrawer = true;
    }

    closeDrawer(): void{
        this.visibleDrawer = false;
    }

    getAccountRole(){
        const username = this.tokenService.getUser();
        this.accountService.getRoleByUsername(username)
            .subscribe(res => {
                if(res && res.success){
                    this.accountRole = res.data;
                    this.tokenService.saveRole(res.data);
                    switch(res.data){
                        case "THAIPHU":
                            this.isDisableDashboard = false;
                            this.isDisableInfo = false;
                            this.isDisableDangKyKham = false;
                            this.isDisableDangKyKhamTre = false;
                            this.isDisableListBaBy = false;
                            this.isDisableSoKham = false;
                            this.isDisableDangKyTiem = false;
                            break;
                        case "COSOYTE":
                            this.isDisableListThaiPhu = false;
                            this.isDisableListBaBy = false;
                            this.isDisableBacSi = false;
                            this.isDisableCaLam = false;
                            this.isDisableLichKham = false;
                            this.isDisableSoKham = false;
                            this.isDisableDanhSachDangKy = false;
                            break;
                        case "SOYTE":
                            this.isDisableBenh = false;
                            this.isDisableCSYT = false;
                            this.isDisableVacxin = false;
                            this.isDisableBaoCao = false;
                            break;
                        default:
                            this.isVisibaleThongTin = false;
                            this.isDisableSYT = false;
                            this.isDisableTaiKhoan = false;
                            break;
                    }
                }
            })
    }

    navigateLink(router: string): void {
        this.router.navigateByUrl(router);
    }

    isSelected(route: string): boolean {
        return route === this.router.url;
    }

    signOut(): void {
        this.tokenService.signOut();
    }

}