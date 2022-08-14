import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/const';

export const VACXIN_URL = API_URL + 'vacxin';

@Injectable({
  providedIn: 'root'
})
export class VacxinService {

  constructor( private http: HttpClient ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(VACXIN_URL + "/getall");
  }

  getAllPaging(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${VACXIN_URL}/get?page=${page}&size=${size}`);
  }

  getByBenhId(benhId: string): Observable<any> {
    return this.http.get<any>(`${VACXIN_URL}/getbybenh?benhId=${benhId}`);
  }

  create(vacxin: any): Observable<any> {
    return this.http.post<any>(VACXIN_URL + "/create", vacxin);
  }

  update(vacxin: any, id: string): Observable<any> {
    return this.http.put<any>(`${VACXIN_URL}/update/${id}`, vacxin);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${VACXIN_URL}/delete/${id}`);
  }

  findById(id: string): Observable<any> {
    return this.http.get<any>(`${VACXIN_URL}/getbyid/${id}`);
  }
}
