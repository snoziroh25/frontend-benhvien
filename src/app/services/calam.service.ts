import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CaLam } from '../models/calam.model';
import { API_URL } from '../utils/const';

export const CALAM_URL = API_URL + 'calam';

@Injectable({
  providedIn: 'root'
})
export class CaLamService {

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<CaLam> {
    return this.http.get<CaLam>(CALAM_URL + "/getall");
  }

  getAllPaging(request:any): Observable<any> {
    return this.http.post<any>(`${CALAM_URL}/get`, request);
  }

  getByUsername(username : any):Observable<any> {
    return this.http.get<any>(`${CALAM_URL}/getbyusername?username=${username}`)
  }

  create(caLam: CaLam, username: String): Observable<CaLam> {
    return this.http.post<CaLam>(`${CALAM_URL}/create?username=${username}`, caLam);
  }

  update(caLam: CaLam, id: string): Observable<CaLam> {
    return this.http.put<CaLam>(`${CALAM_URL}/update/${id}`, caLam);
  }

  delete(id: string): Observable<CaLam> {
    return this.http.delete<CaLam>(`${CALAM_URL}/delete/${id}`);
  }

  findById(id: string): Observable<CaLam> {
    return this.http.get<CaLam>(`${CALAM_URL}/getbyid/${id}`);
  }
}
