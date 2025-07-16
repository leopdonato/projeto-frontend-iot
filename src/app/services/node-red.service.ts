import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AirQuality } from '../model/air-quality-data.interface';

@Injectable({
  providedIn: 'root'
})
export class NodeRedService {

  private readonly url = '';

  constructor(private readonly http: HttpClient) { }

  getAllData(deviceId: string = ''): Observable<AirQuality[]> {
    return this.http.get<AirQuality[]>(`${this.url}/dados-sensores/${deviceId}`);
  }

}
