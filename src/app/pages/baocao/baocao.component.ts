import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ChartComponent } from 'ng-apexcharts';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { ReportService } from 'src/app/services/report.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  tooltip: any;
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
};

export const defaultDoneLineChart = {
  series: [],
  chart: {
    width: 1400,
    height: 500,
    type: "line",
    toolbar: {
      show: false
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 5,
    curve: "straight",
    dashArray: [0, 8, 5]
  },
  legend: {
    show: true,
    position: "right",
    offsetY: 20,
    offSetX: 0,
    fontSize: '13px',
    fontFamily: 'Montserrat',
    fontWeight: 500,
    markers: {
      width: 12,
      height: 12,
      radius: 2,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 10
    },
  },
  markers: {
    size: 0,
    hover: {
      sizeOffset: 6
    }
  },
  xaxis: {
    categories: []
  },
  fill: {
    opacity: 1
  },
  
  tooltip: {
    y: [
      {
        title: {
          formatter: function(val:any) {
            return val;
          }
        }
      },
      {
        title: {
          formatter: function(val:any) {
            return val;
          }
        }
      },
      {
        title: {
          formatter: function(val:any) {
            return val;
          }
        }
      }
    ]
  },
  grid: {
    borderColor: "#f1f1f1"
  },
};

@Component({
  selector: 'app-baocao',
  templateUrl: './baocao.component.html',
  styleUrls: ['./baocao.component.scss']
})
export class BaocaoComponent implements OnInit {

  baoCaoGroup: FormGroup;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isSubmited = false;
  data: any;
  names: string[] = [];
  sum = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  totalTiem : any;
  totalKham: any;
  totalKhamTre: any;
  

  @ViewChild("chart") chart!: ChartComponent;
  public LineChartOptions: any;

  constructor(private fb: FormBuilder,
      private reportService: ReportService,
      private tokenService: TokenStorageService,
      private toastrService: ToastrService) {
    this.baoCaoGroup = this.fb.group({
      year: [null, [Validators.required]],
    });
   }

  ngOnInit(): void {
  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type});
    let url = window.URL.createObjectURL(blob);
    var fileLink = document.createElement('a'); 
    fileLink.href = url; 
    fileLink.download = 'BaoCao.xlsx';
    document.body.appendChild(fileLink);
    fileLink.click();
  }

  onExport(): void {
    let request = [this.tokenService.getUser(),moment(this.baoCaoGroup.get('year')?.value).format("yyyy")]
    this.reportService.exportExcel(request).subscribe(res => {
      this.downLoadFile(res, "application/ms-excel");
    })
  }

  onSubmit(): void {
    this.reportService.getReportByUsername(this.tokenService.getUser(),moment(this.baoCaoGroup.get('year')?.value).format("yyyy"))
    .pipe(finalize(() => this.isLoading$.next(false)))
    .subscribe((res:any) => {
      if (res && res.success){
        this.data = res.data;
        this.names = res.data.name;
        this.sum = res.data.countByMonth;
        this.totalKham = res.data.totalKham;
        this.totalKhamTre = res.data.totalKhamTre;
        this.totalTiem = res.data.totalTiem;
        let series = [];
        this.LineChartOptions = defaultDoneLineChart;
        for (let i=0;i<res.data.count.length;i++){
          let data = res.data.count[i];
          data.pop();
          series.push({'name':res.data.name[i],'data':data})
        }
        this.LineChartOptions.series = series;
        this.LineChartOptions.xaxis.categories = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12']
        this.isSubmited = true;
      } else {
        this.toastrService.error('Lấy dữ liệu thất bại!');
      }
    });
  }

}
