import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { API_URL } from '../utils/const';

export const ACCOUNT_URL = API_URL + 'account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(ACCOUNT_URL + "/getall");
  }

  getAllPaging(username: string,page: number, size: number): Observable<Account> {
    return this.http.get<Account>(`${ACCOUNT_URL}/get?username=${username}&page=${page}&size=${size}`);
  }

  create(account: Account): Observable<Account> {
    return this.http.post<Account>(ACCOUNT_URL + "/create", account);
  }

  update(account: Account, id: string): Observable<any> {
    return this.http.put<any>(`${ACCOUNT_URL}/update/${id}`, account);
  }

  changePassword(account: Account, id: string): Observable<any> {
    return this.http.put<any>(`${ACCOUNT_URL}/change-password/${id}`, account);
  }

  delete(id: string): Observable<Account> {
    return this.http.delete<Account>(`${ACCOUNT_URL}/delete/${id}`);
  }

  findById(id: string): Observable<Account> {
    return this.http.get<Account>(`${ACCOUNT_URL}/getbyid/${id}`);
  }
  
  getRoleByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${ACCOUNT_URL}/getrolebyusername/${username}`);
  }

  getUserInfo(username: string): Observable<any> {
    return this.http.get<any>(`${ACCOUNT_URL}/getinfoid/${username}`);
  }

  getIdByUsername(username: string): Observable<any> {
    return this.http.get<any>(`${ACCOUNT_URL}/getId/${username}`);
  }

  changePassword1(request: any): Observable<any> {
    return this.http.put<any>(`${ACCOUNT_URL}/changepass`,request);
  }

}
