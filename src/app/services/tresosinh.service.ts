import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Account } from '../models/account.model';
import { TreSoSinh } from '../models/tre_so_sinh.model';
import { API_URL } from '../utils/const';

export const TRESOSINH_URL = API_URL + "tresosinh"

@Injectable({
  providedIn: 'root'
})
export class TreSoSinhService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get<any>(TRESOSINH_URL + "/getall");
  }

  getByUsername(username: string, page: number, size: number): Observable<any> {
    return this.http.get<any>(`${TRESOSINH_URL}/getbyrole?username=${username}&page=${page}&size=${size}`);
  }

  getByThaiPhuId(username: string): Observable<any> {
    return this.http.get<any>(`${TRESOSINH_URL}/getbythaiphuid?username=${username}`);
  }

  getAllPaging(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${TRESOSINH_URL}/get?page=${page}&size=${size}`);
  }

  create(tresosinh: TreSoSinh): Observable<any> {
    return this.http.post<any>(TRESOSINH_URL + "/create", tresosinh);
  }

  update(tresosinh: TreSoSinh, id: string): Observable<any> {
    return this.http.put<any>(`${TRESOSINH_URL}/update/${id}`, tresosinh);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${TRESOSINH_URL}/delete/${id}`);
  }

  findById(id: string): Observable<any> {
    return this.http.get<any>(`${TRESOSINH_URL}/getbyid/${id}`);
  }

}
