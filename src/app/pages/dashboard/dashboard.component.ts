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
import { AirQuality } from '../../model/air-quality-data.interface';
import { NgxGaugeModule } from 'ngx-gauge';
import { DatePipe } from '@angular/common';

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
  imports: [NgApexchartsModule, NgxGaugeModule, DatePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {
  private intervalId: any;
  qualityData!: AirQuality[];
  @ViewChild("chart") chart!: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  averageTemperature: number = 0;
  averageHumidity: number = 0;
  averageCO: number = 0;
  averageGases: number = 0;

  lastTemperature: number = 0;
  lastHumidity: number = 0;
  lastCO: number = 0;
  lastGases: number = 0;

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

  gaugeOptionsCO = {
    value: 0,
    label: 'Monóxido de Carbono (CO)',
    appendText: 'ppm',
    max: 200
  };

  gaugeOptionsGases = {
    value: 0,
    label: 'Gases Inflamáveis',
    appendText: 'ppm',
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
        },
        {
          name: "Monóxido de Carbono (CO)",
          data: []
        },
        {
          name: "Gases Inflamáveis",
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
    }, 300000); // <-5 minutes / 1200000 <-20 minutes
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private getAllData(): void {
    this.nodeRedService.getAllData()
    .subscribe({
      next: (data) => {
        this.qualityData = data;

        if (this.chart && this.qualityData) {
          const temperatures = this.qualityData.map((item) => item.temperature);
          const humidities = this.qualityData.map((item) => item.humidity);
          const co = this.qualityData.map((item) => item.co);
          const gases = this.qualityData.map((item) => item.gases);

          this.averageTemperature = this.calculateAverage(temperatures);
          this.averageHumidity = this.calculateAverage(humidities);
          this.averageCO = this.calculateAverage(co);
          this.averageGases = this.calculateAverage(gases);

          const lastData = data[0];
          this.lastTemperature = lastData.temperature;
          this.lastHumidity = lastData.humidity;
          this.lastCO = Number(lastData.co.toFixed(2));
          this.lastGases = Number(lastData.gases.toFixed(2));

          this.gaugeOptionsTemperature.value = this.lastTemperature;
          this.gaugeOptionsHumidity.value = this.lastHumidity;
          this.gaugeOptionsCO.value = this.lastCO;
          this.gaugeOptionsGases.value = this.lastGases;

          this.chart.updateSeries([
            {
              name: "Temperatura",
              data: temperatures
            },
            {
              name: "Umidade",
              data: humidities
            },
            {
              name: "Monóxido de Carbono (CO)",
              data: co
            },
            {
              name: "Gases Inflamáveis",
              data: gases
            },
          ]);

          this.chart.updateOptions({
            xaxis: {
              categories: this.qualityData.map((item) => item.timestamp)
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
