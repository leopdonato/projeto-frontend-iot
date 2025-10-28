import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SensorApiResponse } from '../model/sensor-api-response.interface';
import { AutomationStatusPayload } from '../model/automation-status-payload';

@Injectable({
  providedIn: 'root'
})
export class NodeRedService {

  private readonly url = '';

  constructor(private readonly http: HttpClient) { }

  getAllData(deviceId: string = ''): Observable<SensorApiResponse> {
    return this.http.get<SensorApiResponse>(`${this.url}/dados-sensores/${deviceId}`);
  }

  updateAutomationStatus(payload: AutomationStatusPayload): Observable<any> {
    return this.http.post<any>(`${this.url}/controle-automacao-umidade`, payload);
  }

}
