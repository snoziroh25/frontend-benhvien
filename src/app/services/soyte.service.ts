import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SoYTe } from '../models/soyte.model';
import { API_URL } from '../utils/const';

export const SOYTE_URL = API_URL + 'soyte';

@Injectable({
  providedIn: 'root'
})
export class SoYTeService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<SoYTe> {
    return this.http.get<SoYTe>(SOYTE_URL + "/getall");
  }

  getAllPaging(page: number, size: number): Observable<any> {
    return this.http.get<any>(`${SOYTE_URL}/get?page=${page}&size=${size}`);
  }

  create(soYTe: any): Observable<SoYTe> {
    return this.http.post<SoYTe>(SOYTE_URL + "/create", soYTe);
  }

  update(soYTe: any, id: string): Observable<SoYTe> {
    return this.http.put<SoYTe>(`${SOYTE_URL}/update/${id}`, soYTe);
  }

  delete(id: string): Observable<SoYTe> {
    return this.http.delete<SoYTe>(`${SOYTE_URL}/delete/${id}`);
  }

  findById(id: string): Observable<SoYTe> {
    return this.http.get<SoYTe>(`${SOYTE_URL}/getbyid/${id}`);
  }
}
