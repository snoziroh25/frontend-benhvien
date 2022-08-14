import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { API_URL } from "../utils/const";

export const HOSOKHAMTRE_URL = API_URL + "hosokhamtre";

@Injectable({
    providedIn: 'root'
  })
export class HoSoKhamService {

    constructor(private http: HttpClient) { }

    getByTreId(page: number, size: number, id: string): Observable<any>{
        return this.http.get<any>(`${HOSOKHAMTRE_URL}/getbytreid?page=${page}&size=${size}&id=${id}`);
    }

    updateKhamTre(hoSoKham: any, id: string): Observable<any>{
        return this.http.put<any>(`${HOSOKHAMTRE_URL}/update/${id}`, hoSoKham);
      }
}