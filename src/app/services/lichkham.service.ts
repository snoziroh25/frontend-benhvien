import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LichKham } from '../models/lichkham.model';
import { API_URL } from '../utils/const';

export const LICHKHAM_URL = API_URL + 'lichkham';

@Injectable({
  providedIn: 'root'
})

export class LichkhamService {

  constructor( private http: HttpClient) { }

  getAll(): Observable<LichKham> {
    return this.http.get<LichKham>(LICHKHAM_URL + "/getall");
  }

  getAllPaging(request: any): Observable<LichKham> {
    return this.http.post<LichKham>(`${LICHKHAM_URL}/get`, request);
  }

  create(lichKham: LichKham): Observable<LichKham> {
    return this.http.post<LichKham>(LICHKHAM_URL + "/create", lichKham);
  }

  update(lichKham: LichKham, id: string): Observable<LichKham> {
    return this.http.put<LichKham>(`${LICHKHAM_URL}/update/${id}`, lichKham);
  }

  delete(id: string): Observable<LichKham> {
    return this.http.delete<LichKham>(`${LICHKHAM_URL}/delete/${id}`);
  }

  findById(id: string): Observable<LichKham> {
    return this.http.get<LichKham>(`${LICHKHAM_URL}/getbyid/${id}`);
  }

  set(lichKham: LichKham): Observable<LichKham> {
    return this.http.put<LichKham>(LICHKHAM_URL + "/set", lichKham);
  }

  findByCSYTandNgayKham(coSoYTeId: string, ngayKham: string): Observable<any> {
    return this.http.get<any>(`${LICHKHAM_URL}/gettoregister?coSoYTeId=${coSoYTeId}&ngayKham=${ngayKham}`)
  }
}
