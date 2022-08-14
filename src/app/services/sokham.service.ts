import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/const';

export const SOKHAM_URL = API_URL + 'sokham';

@Injectable({
  providedIn: 'root'
})
export class SokhamService {

  constructor( private http: HttpClient ) { }

  getAll(): Observable<any> {
    return this.http.get<any>(SOKHAM_URL + "/getall");
  }

  getAllPaging(page: number, size: number, username: string): Observable<any> {
    return this.http.get<any>(`${SOKHAM_URL}/getbyrole?page=${page}&size=${size}&username=${username}`);
  }

  create(soKham: any): Observable<any> {
    return this.http.post<any>(SOKHAM_URL + "/create", soKham);
  }

  update(soKham: any, id: string): Observable<any> {
    return this.http.put<any>(`${SOKHAM_URL}/update/${id}`, soKham);
  }

  delete(id: string): Observable<any> {
    return this.http.delete<any>(`${SOKHAM_URL}/delete/${id}`);
  }

  findById(id: string): Observable<any> {
    return this.http.get<any>(`${SOKHAM_URL}/getbyid/${id}`);
  }

  findHoSoKhamBySoKhamId(page: number, size: number, id: string): Observable<any> {
    return this.http.get<any>(`${API_URL}hosokham/getbysokham?page=${page}&size=${size}&soKhamId=${id}`);
  }

  updateHoSoKham(hoSoKham: any, id: string): Observable<any>{
    return this.http.put<any>(`${API_URL}hosokham/update/${id}`, hoSoKham);
  }
}
