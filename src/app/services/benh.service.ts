import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Benh } from '../models/benh.model';
import { API_URL } from '../utils/const';

export const BENH_URL = API_URL + 'benh';

@Injectable({
  providedIn: 'root'
})
export class BenhService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<Benh> {
    return this.http.get<Benh>(BENH_URL + "/getall");
  }

  getAllBenh(page: number, size: number): Observable<Benh> {
    return this.http.get<Benh>(`${BENH_URL}/get?page=${page}&size=${size}`);
  }

  create(benh: Benh): Observable<Benh> {
    return this.http.post<Benh>(BENH_URL + "/create", benh);
  }

  update(benh: Benh, id: string): Observable<Benh> {
    return this.http.put<Benh>(`${BENH_URL}/update/${id}`, benh);
  }

  delete(id: string): Observable<Benh> {
    return this.http.delete<Benh>(`${BENH_URL}/delete/${id}`);
  }

  findById(id: string): Observable<Benh> {
    return this.http.get<Benh>(`${BENH_URL}/getbyid/${id}`);
  }

  getBenhByTarget(target: string): Observable<Benh> {
    return this.http.get<Benh>(`${BENH_URL}/getbytarget?target=${target}`);
  }
}
