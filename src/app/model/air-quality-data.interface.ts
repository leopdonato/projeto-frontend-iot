export interface AirQualityData {
  count: number;
  data: AirQuality[];
}

export interface AirQuality {
  SensorID: string;
  Temperature: number;
  Humidity: number;
  Timestamp: string;
}
