import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirQualityData } from '../model/air-quality-data.interface';

@Injectable({
  providedIn: 'root'
})
export class NodeRedService {

  private readonly url = 'http://ec2-18-222-156-182.us-east-2.compute.amazonaws.com:1880';

  constructor(private readonly http: HttpClient) { }

  getAllData(): Observable<AirQualityData> {
    return this.http.get<AirQualityData>(`${this.url}/all-items`);
  }

}
