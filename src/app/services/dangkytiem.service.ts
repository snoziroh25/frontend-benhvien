import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../utils/const";


export const DANGKYTIEM_URL = API_URL + 'dangkytiem';
export const LICHSUTIEM_URL = API_URL + 'lichsutiem';
export const THONGBAO_URL = API_URL + 'thongbao';

@Injectable({
    providedIn: 'root'
  })
  export class DangKyTiemService {

    constructor(private http: HttpClient) { }

    get(page: number, size: number, csytId: String): Observable<any> {
        return this.http.get<any>(`${DANGKYTIEM_URL}/get?page=${page}&size=${size}&csytId=${csytId}`);
      }

    create(dangKy: any): Observable<any> {
    return this.http.post<any>(DANGKYTIEM_URL + "/create", dangKy);
    }

    delete(id: string): Observable<any> {
      return this.http.delete<any>(`${DANGKYTIEM_URL}/delete/${id}`);
    }

    createLichSuTiem(lichSuTiem: any): Observable<any> {
      return this.http.post<any>(LICHSUTIEM_URL + "/create", lichSuTiem);
    }
    
    createThongBao(thongBao: any): Observable<any> {
      return this.http.post<any>(THONGBAO_URL + "/create", thongBao);
    }
  }