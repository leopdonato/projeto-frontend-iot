import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NodeRedService } from '../../services/node-red.service';
import { ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTooltip,
  ApexStroke,
  ChartType,
  NgApexchartsModule} from 'ng-apexcharts';
import { AirQualityData } from '../../model/air-quality-data.interface';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart & { type: ChartType };
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private intervalId: any;
  qualityData!: AirQualityData;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private readonly nodeRedService: NodeRedService) {
    this.chartOptions = {
      series: [
        {
          name: "Temperatura",
          data: []
        },
        {
          name: "Umidade",
          data: []
        }
      ],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit(): void {
    this.getAllData();

    this.intervalId = setInterval(() => {
      this.getAllData();
    }, 1200000);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private getAllData(): void {
    this.nodeRedService.getAllData().subscribe({
      next: (data) => {
        this.qualityData = data;

        // if (this.chartOptions.series && this.chartOptions.series[0] && this.qualityData.data) {
        //   this.chartOptions.series[0].data = this.qualityData.data.map((item) => item.Temperature);
        // }
        // if (this.chartOptions.series && this.chartOptions.series[1] && this.qualityData.data) {
        //   this.chartOptions.series[1].data = this.qualityData.data.map((item) => item.Humidity);
        // }
        // if (this.chartOptions.xaxis && this.qualityData.data) {
        //   this.chartOptions.xaxis.categories = this.qualityData.data.map((item) => item.Timestamp);
        // }

        if (this.chart && this.qualityData.data) {
          this.chart.updateSeries([
            {
              name: "Temperatura",
              data: this.qualityData.data.map((item) => item.Temperature)
            },
            {
              name: "Umidade",
              data: this.qualityData.data.map((item) => item.Humidity)
            }
          ]);

          this.chart.updateOptions({
            xaxis: {
              categories: this.qualityData.data.map((item) => item.Timestamp)
            }
          });
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
