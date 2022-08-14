import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AnyObject } from "chart.js/types/basic";
import { Observable } from "rxjs";
import { API_URL } from "../utils/const";

export const THONGBAO_URL = API_URL + 'thongbao';

@Injectable({
    providedIn: 'root'
  })
export class ThongBaoService {

    constructor(
        private http: HttpClient
      ) { }

    getByThaiPhuId(thaiPhuId: string): Observable<any> {
        return this.http.get<any>(`${THONGBAO_URL}/getbythaiphuid?thaiPhuId=${thaiPhuId}`);
    }

    update(thongBao : any, id: any): Observable<any> {
      return this.http.put<any>(`${THONGBAO_URL}/update/${id}`, thongBao);
    }

}