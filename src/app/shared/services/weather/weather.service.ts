import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor() { }

  async getWeather(latitude: number, longitude: number, startDate: string, endDate: string) {

    const params = {
      "latitude": latitude,
      "longitude": longitude,
      "start_date": startDate,
      "end_date": endDate,
      "hourly": ["temperature_2m", "rain"],
      "timeformat": "unixtime"
    };
    const url = "https://archive-api.open-meteo.com/v1/archive";
    const responses = await fetchWeatherApi(url, params);

    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    const response = responses[0];
    const utcOffsetSeconds = response.utcOffsetSeconds();
    const hourly = response.hourly();
    const weatherData: { [key: number]: WeatherDataEntry } = {};

    if (hourly) {
      const time = range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
        (t) => new Date((t + utcOffsetSeconds))
      );
      const temperature2m = hourly.variables(0)!.valuesArray()!;
      const rain = hourly.variables(1)!.valuesArray()!;

      for (let i = 0; i < time.length; i++) {
        const roundedTemperature = parseFloat(temperature2m[i].toFixed(1));
        const roundedRain = parseFloat(rain[i].toFixed(3));

        weatherData[time[i].getTime()] = {
          rain: roundedRain,
          temperature: roundedTemperature,
        };
      }
    }

    return weatherData;
  }
}

interface WeatherDataEntry {
  rain: number;
  temperature: number;
}
