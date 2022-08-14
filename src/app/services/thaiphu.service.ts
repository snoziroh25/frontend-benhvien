import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ThaiPhu } from '../models/thai_phu.model';
import { API_URL } from '../utils/const';

export const THAIPHU_URL = API_URL + 'thaiphu';

@Injectable({
  providedIn: 'root'
})
export class ThaiPhuService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<any> {
    return this.http.get<ThaiPhu>(THAIPHU_URL + "/getall");
  }

  getAllPaging(page: number, size: number): Observable<any> {
    return this.http.get<ThaiPhu>(`${THAIPHU_URL}/get?page=${page}&size=${size}`);
  }

  create(thaiPhu: ThaiPhu): Observable<any> {
    return this.http.post<ThaiPhu>(THAIPHU_URL + "/create", thaiPhu);
  }

  update(thaiPhu: ThaiPhu, id: string): Observable<any> {
    return this.http.put<ThaiPhu>(`${THAIPHU_URL}/update/${id}`, thaiPhu);
  }

  delete(id: string): Observable<ThaiPhu> {
    return this.http.delete<ThaiPhu>(`${THAIPHU_URL}/delete/${id}`);
  }

  findById(id: string): Observable<any> {
    return this.http.get<ThaiPhu>(`${THAIPHU_URL}/getbyid/${id}`);
  }

  findByUsername(username: string): Observable<any> {
    return this.http.get<ThaiPhu>(`${THAIPHU_URL}/getbyusername/${username}`);
  }
}
