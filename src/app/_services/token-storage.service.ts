import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export const TOKEN_KEY = 'auth-token';
export const ROLE_KEY = 'role-token';
export const USER_KEY = 'auth-user';
export const USER_INFO_KEY = 'user-info';
export const THEMESS = 'theme';


@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  constructor(private router: Router) { }

  signOut(): void {
    window.localStorage.clear();
    this.router.navigateByUrl("login");
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY);
  }

  public saveRole(token: string): void {
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.setItem(ROLE_KEY, token);
  }

  public getRole(): string | null {
    return window.localStorage.getItem(ROLE_KEY);
  }

  public saveUserInfo(userInfo: any): void {
    window.localStorage.removeItem(USER_INFO_KEY);
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
  }

  public getUserInfo(): string | null {
    return window.localStorage.getItem(USER_INFO_KEY);
  }

  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  public getUser(): any {
    const user = window.localStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }

    return {};
  }
}