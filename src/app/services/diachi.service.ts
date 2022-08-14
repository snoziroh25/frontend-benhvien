import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/const';

export const TINHTHANH_URL = API_URL + 'tinhthanh';
export const QUANHUYEN_URL = API_URL + 'quanhuyen';
export const XAPHUONG_URL = API_URL + 'xaphuong';


@Injectable({
  providedIn: 'root'
})
export class DiachiService {

  constructor(private http: HttpClient) { }

  getTinh(): Observable<any> {
    return this.http.get<any>(TINHTHANH_URL + "/getall");
  }

  getQuanHuyen(tinhThanhId: string): Observable<any> {
    return this.http.get<any>(`${QUANHUYEN_URL}/get?tinhThanhId=${tinhThanhId}`);
  }

  getXaPhuong(quanHuyenId: string): Observable<any> {
    return this.http.get<any>(`${XAPHUONG_URL}/get?quanHuyenId=${quanHuyenId}`);
  }

  getListByXaPhuongId(xaPhuongId: string): Observable<any> {
    return this.http.get<any>(`${XAPHUONG_URL}/getlistbyid?xaPhuongId=${xaPhuongId}`);
  }

  getListByQuanHuyenId(quanHuyenId: string): Observable<any> {
    return this.http.get<any>(`${QUANHUYEN_URL}/getlistbyid?quanHuyenId=${quanHuyenId}`);
  }

  getTinhById(tinhThanhId: string): Observable<any> {
    return this.http.get<any>(`${TINHTHANH_URL}/getbyid/=${tinhThanhId}`);
  }

  getQuanHuyenById(quanHuyenId: string): Observable<any> {
    return this.http.get<any>(`${QUANHUYEN_URL}/getbyid/${quanHuyenId}`);
  }

  getXaPhuongById(xaPhuongId: string): Observable<any> {
    return this.http.get<any>(`${XAPHUONG_URL}/getbyid/${xaPhuongId}`);
  }

  getToUpdate(xaPhuongId: string): Observable<any>{
    return this.http.get<any>(`${XAPHUONG_URL}/getlistquanhuyenandxaphuong?xaPhuongId=${xaPhuongId}`);
  }
}
