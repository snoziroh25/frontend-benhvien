import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CoSoYTe } from '../models/cosoyte.model';
import { API_URL } from '../utils/const';

export const COSOYTE_URL = API_URL + 'cosoyte';

@Injectable({
  providedIn: 'root'
})
export class CoSoYTeService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<CoSoYTe> {
    return this.http.get<CoSoYTe>(COSOYTE_URL + "/getall");
  }

  getByXaPhuongId(xaPhuongId: string): Observable<CoSoYTe> {
    return this.http.get<CoSoYTe>(`${COSOYTE_URL}/getbyxaphuong?xaPhuongId=${xaPhuongId}`);
  }

  getByUsername(username: string, page: number, size: number): Observable<any> {
    return this.http.get<CoSoYTe>(`${COSOYTE_URL}/getbyusername?username=${username}&page=${page}&size=${size}`);
  }

  getAllPaging(page: number, size: number): Observable<CoSoYTe> {
    return this.http.get<CoSoYTe>(`${COSOYTE_URL}/get?page=${page}&size=${size}`);
  }

  create(coSoYTe: any): Observable<CoSoYTe> {
    return this.http.post<CoSoYTe>(COSOYTE_URL + "/create", coSoYTe);
  }

  update(coSoYTe: any, id: string): Observable<any> {
    return this.http.put<any>(`${COSOYTE_URL}/update/${id}`, coSoYTe);
  }

  delete(id: string): Observable<CoSoYTe> {
    return this.http.delete<CoSoYTe>(`${COSOYTE_URL}/delete/${id}`);
  }

  findById(id: string): Observable<CoSoYTe> {
    return this.http.get<CoSoYTe>(`${COSOYTE_URL}/getbyid/${id}`);
  }
}
