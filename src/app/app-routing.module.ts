import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { LayoutModule } from './layouts/layout.module';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AuthRoutesComponent } from './routes/auth.routes.component';
import { MainRoutesComponent } from './routes/main.routes.component';
import { AuthGuardService } from './_services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: '',
    component: AuthRoutesComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/auth/auth.module').then(
            (m) => m.AuthModule
          ),
      },
    ],
  },
  {
    path: '',
    component: MainRoutesComponent,
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'dangkykham',
        loadChildren: () =>
          import('./pages/dangkykham/dangkykham.module').then(
            (m) => m.DangkykhamModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'dangkykhamtre',
        loadChildren: () =>
          import('./pages/dangkykhamtre/dangkykhamtre.module').then(
            (m) => m.DangkykhamtreModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'dangkytiem',
        loadChildren: () =>
          import('./pages/dangkytiem/dangkytiem.module').then(
            (m) => m.DangkytiemModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'taikhoan',
        loadChildren: () =>
          import('./pages/taikhoan/taikhoan.module').then(
            (m) => m.TaikhoanModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'sokham',
        loadChildren: () =>
          import('./pages/sokham/sokham.module').then(
            (m) => m.SokhamModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'vacxin',
        loadChildren: () =>
          import('./pages/vacxin/vacxin.module').then(
            (m) => m.VacxinModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'bacsi',
        loadChildren: () =>
          import('./pages/bacsi/bacsi.module').then(
            (m) => m.BacSiModule
          ),
        canActivate : [AuthGuardService]
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('./pages/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'tresosinh',
        loadChildren: () =>
          import('./pages/tresosinh/tresosinh.module').then(
            (m) => m.TreSoSinhModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'thaiphu',
        loadChildren: () =>
          import('./pages/thaiphu/thaiphu.module').then(
            (m) => m.ThaiPhuModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'cosoyte',
        loadChildren: () =>
          import('./pages/cosoyte/cosoyte.module').then(
            (m) => m.CoSoYTeModule
          ),
          canActivate : [AuthGuardService]
      },

      
      {
        path: 'calam',
        loadChildren: () =>
          import('./pages/calam/calam.module').then(
            (m) => m.CaLamModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'lichkham',
        loadChildren: () =>
          import('./pages/lichkham/lichkham.module').then(
            (m) => m.LichKhamModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'benh',
        loadChildren: () =>
          import('./pages/benh/benh.module').then(
            (m) => m.BenhModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'soyte',
        loadChildren: () =>
          import('./pages/soyte/soyte.module').then(
            (m) => m.SoYTeModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'baocao',
        loadChildren: () =>
          import('./pages/baocao/baocao.module').then(
            (m) => m.BaocaoModule
          ),
          canActivate : [AuthGuardService]
      },

      {
        path: 'danhsachdangky',
        loadChildren: () =>
          import('./pages/danhsachdangky/danhsachdangky.module').then(
            (m) => m.DanhsachdangkyModule
          ),
          canActivate : [AuthGuardService]
      },


      {
        path: 'change-password',
        loadChildren: () =>
          import('./pages/change-pass/change-pass.module').then(
            (m) => m.ChangePassModule
          ),
          canActivate : [AuthGuardService]
      },
    ],
  },
  
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
    LayoutModule,
    ],
  exports: [RouterModule],
  declarations: [AuthRoutesComponent,
    MainRoutesComponent,]
})
export class AppRoutingModule { }
