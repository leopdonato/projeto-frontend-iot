import { AirQuality } from './air-quality-data.interface';
import { AutomationStatus } from './automation-status.enum';

export interface SensorApiResponse {
  air_quality: AirQuality[];
  automation_status_humidity: AutomationStatus;
}
