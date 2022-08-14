import { Component, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexFill,
  ApexDataLabels,
  ApexLegend
} from "ng-apexcharts";
import { finalize } from 'rxjs/operators';
import { DashboardService } from 'src/app/services/dashboard.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account.model';


export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
  responsive: ApexResponsive[];
  labels: any;
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
};

var $complete = "#270877",
  $progress = "#6238ce",
  $late = "#af98e8",
  $cancel = "#eae4f9"
var themeColors = [$complete, $progress, $late, $cancel];

var $part = "#c88080",
  $module = "#6c5dcc",
  $chip = "#ad83d9",
  $product = "#f1b6e2",
  $child = "#f291a4"
var pieColors = [$part, $module, $chip, $product, $child];

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isLoading$ = new BehaviorSubject(false);
  username = "";

  

  constructor(
    private router: Router,
    private tokenService: TokenStorageService,
  ) { }

  ngOnInit(): void {
    this.getUsername();
  }

  getUsername(): void {
    this.username = this.tokenService.getUser();
  }

  navigateUrl(url: string) {
    this.router.navigateByUrl(url);
  }

}
