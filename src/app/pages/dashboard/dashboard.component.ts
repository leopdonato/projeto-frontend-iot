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
import { NgxGaugeModule } from 'ngx-gauge';

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
  imports: [NgApexchartsModule, NgxGaugeModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private intervalId: any;
  qualityData!: AirQualityData;
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  averageTemperature: number = 0;
  averageHumidity: number = 0;

  lastTemperature: number = 0;
  lastHumidity: number = 0;

  gaugeOptionsTemperature = {
    value: 0,
    label: 'Temperatura',
    appendText: 'ºC',
    max: 100
  };

  gaugeOptionsHumidity = {
    value: 0,
    label: 'Umidade',
    appendText: '%',
    max: 100
  };

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

        if (this.chart && this.qualityData.data) {
          const temperatures = this.qualityData.data.map((item) => item.Temperature);
          const humidities = this.qualityData.data.map((item) => item.Humidity);

          this.averageTemperature = this.calculateAverage(temperatures);
          this.averageHumidity = this.calculateAverage(humidities);

          const lastData = data.data[data.data.length - 1];
          this.lastTemperature = lastData.Temperature;
          this.lastHumidity = lastData.Humidity;

          this.gaugeOptionsTemperature.value = this.lastTemperature;
          this.gaugeOptionsHumidity.value = this.lastHumidity;

          this.chart.updateSeries([
            {
              name: "Temperatura",
              data: temperatures
            },
            {
              name: "Umidade",
              data: humidities
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

  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    const sum = values.reduce((a, b) => a + b, 0);
    return parseFloat((sum / values.length).toFixed(2));
  }

}
