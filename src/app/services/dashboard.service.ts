import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryReport, RequestChart } from '../models/dashboard.model';
import { API_URL } from '../utils/const';

export const REPORT_URL = API_URL + 'report';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient
  ) { }

  getRequestCount(): Observable<RequestChart> {
    return this.http.get<RequestChart>(REPORT_URL + "/requestCount");
  }

  getInventoryReport(): Observable<InventoryReport> {
    return this.http.get<InventoryReport>(REPORT_URL + "/reportInventoy");
  }

}
