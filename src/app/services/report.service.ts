import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../utils/const';

export const REPORT_URL = API_URL + 'report';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http: HttpClient) {
   }
   
   getReportByUsername(username:string, year:string): Observable<any> {
    return this.http.get<any>(`${REPORT_URL}/tresosinh?username=${username}&year=${year}`);
  }

  exportExcel(request : any[]): Observable<any> {
    return this.http.post(`${REPORT_URL}/excel`,request, {
      responseType: 'arraybuffer'
    });
  }
}
