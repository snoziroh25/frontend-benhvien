import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BacSi } from '../models/bacsi.model';
import { API_URL } from '../utils/const';

export const BACSI_URL = API_URL + "bacsi"

@Injectable({
  providedIn: 'root'
})
export class BacSiService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<BacSi> {
    return this.http.get<BacSi>(BACSI_URL + "/getall");
  }

  getToCreateLichKham(request: any): Observable<any> {
    return this.http.post<any>(`${BACSI_URL}/gettocreatelichkham`,request)
  }

  getAllBacSi(page: number, size: number): Observable<BacSi> {
    return this.http.get<BacSi>(`${BACSI_URL}/get?page=${page}&size=${size}`);
  }

  create(bacSi: BacSi): Observable<BacSi> {
    return this.http.post<BacSi>(BACSI_URL + "/create", bacSi);
  }

  update(bacSi: BacSi, id: string): Observable<BacSi> {
    return this.http.put<BacSi>(`${BACSI_URL}/update/${id}`, bacSi);
  }

  delete(id: string): Observable<BacSi> {
    return this.http.delete<BacSi>(`${BACSI_URL}/delete/${id}`);
  }

  findById(id: string): Observable<BacSi> {
    return this.http.get<BacSi>(`${BACSI_URL}/getbyid/${id}`);
  }

  findByCSYTId(id: string): Observable<any> {
    return this.http.get<any>(`${BACSI_URL}/getByCsytId?csytId=${id}`)
  }

  getPage(request: any): Observable<any> {
    return this.http.post<any>(`${BACSI_URL}/getPageByCsytId`,request)
  }

}
