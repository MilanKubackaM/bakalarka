import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, tap, switchMap, forkJoin, mergeMap } from 'rxjs';
import { Data, Graph, CyclistDataset, WeatherDataset, FinalData, DataSortedForGraph, WeatherDataSortedForGraph } from 'src/app/shared/models/data.model';
import { DataService } from 'src/app/shared/services/data/data.service';
import { WeatherService } from 'src/app/shared/services/weather/weather.service';
import { Location } from 'src/app/shared/models/data.model';


@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private weatherService: WeatherService
  ) { }

  selectedTime: string = 'today'; // Predvolená hodnota "Dnes"
  graphs: Graph[] = [];
  pickedLocations: Location[] = [];
  locations: Location[] = [];
  form = new FormControl('');
  data: FinalData[] = [];
  datasets: { high: CyclistDataset[], low: CyclistDataset[] , average: CyclistDataset[]} = { high: [], low: [] , average: []};
  maxAndMinDays: any;
  weather: any;
  showWeather: boolean = false;

  start!: number;
  end!: number;

  ngOnInit() {
    this.dataService.getAllUserData().subscribe(data => {
      this.locations = this.setLocations(data);
    });
  }

  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // --------- I N P U T S  &  L I S T N E R S  ------------ //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //  

  resetInputs() {
    this.graphs = [];
    this.datasets = { high: [], low: [] , average: []};
    this.data = [];
  }

  onSelectionChange(event: any) {
    this.resetInputs();
    this.pickedLocations = event.value;
    this.getDataForSelectedLocations();
  }


  onTimeChange(event: any) {
    this.selectedTime = event;
    this.resetInputs();
    this.getDataForSelectedLocations();
  }

  getSelectedLocations(): string {
    if (!this.form.value || !Array.isArray(this.form.value)) {
      return '';
    }
    return this.form.value.map((location: any) => location.location).join(', ');
  }

 
  


  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // ---------  S E N S O R   H A N D L I N G  ------------- //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //


  getDataForSelectedLocations() {
    this.data = [];
    const observables: Observable<any>[] = [];
    this.pickedLocations.forEach((location: any) => {
      observables.push(
        this.dataService.getSensorData(location.url).pipe(
          mergeMap(async (data: Data[]) => {
            const indexedData: { [key: string]: { cyclists: number; temperature: number } } = {};
            for (const dataPoint of data) {
              const formattedDate = this.getSingleStringDateMethod(dataPoint.date);
              indexedData[formattedDate] = { cyclists: dataPoint.cyclists, temperature: dataPoint.temperature };
            }
            const record = {
              location: location,
              sensorData: indexedData
            };
         
            const updatedRecord = await this.appendWeatherToRecord(record);
            this.data.push(updatedRecord);

          }),
        )
      );
    });

    forkJoin(observables).subscribe(() => {
      this.setDataPointsForFirstTwo();
    });
  }


  getTopDay(averages: { highestDay: string; lowestDay: string; }) {
    const data = this.data;
    let result: DataSortedForGraph[] = [];
    

    data.forEach((locationData: any) => {
      const locationName = locationData.location.location;
      const sensorData = locationData.sensorData;
      const highestDay = averages.highestDay;
      const lowestDay = averages.lowestDay;
      const highestDayData: { time: string; cyclists: number; temperature: number; rain: number }[] = [];
      const lowestDayData: { time: string; cyclists: number; temperature: number; rain: number }[] = [];
      const averageDayData: { time: string; cyclists: number; temperature: number; rain: number }[] = [];

      // Objekty pre ukladanie hodnôt pre neskôršie výpočty priemeru
      const highDataByTime: { [key: string]: { cyclists: number[]; temperature: number[]; rain: number[] } } = {};
      const lowDataByTime: { [key: string]: { cyclists: number[]; temperature: number[]; rain: number[] } } = {};
      const averageDataByTime: { [key: string]: { cyclists: number[]; temperature: number[]; rain: number[] } } = {};

      for (const timestamp in sensorData) {
        if (Object.prototype.hasOwnProperty.call(sensorData, timestamp)) {
          const recordTimestamp = parseInt(timestamp);
          const dayOfWeek = this.getDayOfWeekFromUnixTimestamp(recordTimestamp);
          const time = this.formatTimestampToHour(recordTimestamp);
          const cyclists = sensorData[timestamp].cyclists;
          const temperature = sensorData[timestamp].temperature;
          const rain = sensorData[timestamp].rain;

          // Kontrola, či je čas menší ako 19:00 (7:00 PM)
          if(parseInt(time.split(':')[0]) <= 19){
            // Uloženie dát podľa dňa v týždni
            switch (dayOfWeek){
              case highestDay:
                highestDayData.push({ time, cyclists, temperature, rain });
                this.addToTimeData(highDataByTime, time, cyclists, temperature, rain);
                break;
              case lowestDay:
                lowestDayData.push({ time, cyclists, temperature, rain });
                this.addToTimeData(lowDataByTime, time, cyclists, temperature, rain);
                break;
              default:
                this.addToTimeData(averageDataByTime, time, cyclists, temperature, rain);
            }
          }
        }
      }

      // Výpočet priemeru pre "high"
      this.calculateAverageForTimeData(highestDayData, highDataByTime);

      // Výpočet priemeru pre "low"
      this.calculateAverageForTimeData(lowestDayData, lowDataByTime);

      // Výpočet priemeru pre "average"
      this.calculateAverageForTimeData(averageDayData, averageDataByTime);

      result.push({
        location: locationName,
        data: {
          high: highestDayData,
          low: lowestDayData,
          average: averageDayData
        }
      });
    });

    console.log("Result in top day: ", result);
    

    
    return result;
  }

  // Pomocná metóda pre pridávanie hodnôt do objektu podľa času
  addToTimeData(timeData: { [key: string]: { cyclists: number[]; temperature: number[]; rain: number[] } }, time: string, cyclists: number, temperature: number, rain: number) {
    if (!timeData[time]) {
      timeData[time] = { cyclists: [], temperature: [], rain: [] };
    }
    timeData[time].cyclists.push(cyclists);
    timeData[time].temperature.push(temperature);
    timeData[time].rain.push(rain);
  }

  // Pomocná metóda pre výpočet priemeru pre jednotlivé časy
  calculateAverageForTimeData(dayData: { time: string; cyclists: number; temperature: number; rain: number }[], timeData: { [key: string]: { cyclists: number[]; temperature: number[]; rain: number[] } }) {
    for (const time in timeData) {
      if (Object.prototype.hasOwnProperty.call(timeData, time)) {
        const averageCyclists = this.calculateAverage(timeData[time].cyclists);
        const averageTemperature = this.calculateAverage(timeData[time].temperature);
        const averageRain = this.calculateAverage(timeData[time].rain);
        dayData.push({ time, cyclists: averageCyclists, temperature: averageTemperature, rain: averageRain });
      }
    }
  }

  // Pomocná metóda pre výpočet priemeru z poľa čísel
  calculateAverage(values: number[]) {
    const sum = values.reduce((acc, val) => acc + val, 0);
    return sum / values.length;
  }


  makeAverages(daysOverview: any): { highestDay: string, lowestDay: string } {
    const averages: { [key: string]: { cyclists: number, temperature: number, rain: number } } = {};

    daysOverview.forEach((dayData: any) => {
      console.log("Day in averages:", dayData);
      
      for (const day in dayData) {

        if (!averages.hasOwnProperty(day)) {
          averages[day] = { cyclists: 0, temperature: 0, rain: 0 };
        }
        averages[day].cyclists += dayData[day];
      }
    });

    for (const day in averages) {
      averages[day].cyclists /= daysOverview.length;
    }

    let highestDay = '';
    let lowestDay = '';
    let highestAverage = Number.MIN_VALUE;
    let lowestAverage = Number.MAX_VALUE;
    for (const day in averages) {
      if (averages[day].cyclists > highestAverage) {
        highestDay = day;
        highestAverage = averages[day].cyclists;
      }
      if (averages[day].cyclists < lowestAverage) {
        lowestDay = day;
        lowestAverage = averages[day].cyclists;
      }
    }
    return { highestDay, lowestDay };
  }




  findBusyDays(timeFrom: number, sensor_data: { [key: string]: { cyclists: number; temperature: number, rain: number } }) {
    let dataset: number[] = [];
    let numberOfCyclistInDay: any = {};

    for (const date in sensor_data) {
      if (Object.prototype.hasOwnProperty.call(sensor_data, date)) {
        const recordTimestamp = parseInt(date);


        if (recordTimestamp >= timeFrom && recordTimestamp <= Date.now()) {
          const recordDate = new Date(recordTimestamp);

          const dayOfWeek = this.getDayOfWeekFromUnixTimestamp(recordTimestamp);

          if (!numberOfCyclistInDay[dayOfWeek]) {
            numberOfCyclistInDay[dayOfWeek] = 0;
          }

          numberOfCyclistInDay[dayOfWeek] += sensor_data[date].cyclists;
          const hour = recordDate.getHours();
          const cyclists = sensor_data[date].cyclists;
          if (hour === 8) {
            dataset.push(cyclists);
          }
        } else {
          delete sensor_data[date];
        }
      }
    }
    return numberOfCyclistInDay;
  }


  setLocations(data: any) {
    let locations: any = [];
    data.forEach((device: any) => {
      const location = device.location.city + " - " + device.location.route + " " + device.location.streetNumber;
      locations.push({
        location: location,
        longitude: device.location.longitude,
        latitude: device.location.latitude,
        url: device.apiUrl
      });
    });
    return locations;
  }


  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // ---------  W E A T H E R  H A N D L I N G  ------------ //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //

  async appendWeatherToRecord(record: any) {
    const longitude = record.location.longitude.toString();
    const latitude = record.location.latitude.toString();
    let start = this.getFirstTimestamp(record.sensorData);
    const end = this.getLastTimestamp(record.sensorData);
    this.weather = await this.weatherService.getWeather(parseInt(latitude), parseInt(longitude), this.unixTimeToDateFormat(start), this.unixTimeToDateFormat(end));
    return await this.updateRecordWithWeather(record, this.weather);
  }

  async updateRecordWithWeather(record: FinalData, weather: any) {
    
    const updatedRecord: FinalData = { ...record };
    for (const timestamp in updatedRecord.sensorData) {
      if (updatedRecord.sensorData.hasOwnProperty(timestamp)) {
        const roundedTimestamp = Math.round(parseInt(timestamp) / 3600) * 3600;
        if (weather[roundedTimestamp]) {
          updatedRecord.sensorData[timestamp].rain = parseFloat(weather[roundedTimestamp].rain.toFixed(2)) * 100;
          updatedRecord.sensorData[timestamp].temperature = parseFloat(weather[roundedTimestamp].temperature.toFixed(1));
        }
      }
    }
    return updatedRecord;
  }


  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // -----------  G R A P H  I N I T I A Z E R  ------------ //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //


  setDataPointsForFirstTwo() {
    const today = new Date();
    today.setHours(8, 0, 0, 0);
    let timestamp = this.getSingleStringDateMethod(today)
    this.end = timestamp;

    switch (this.selectedTime) {
      case 'today':
        break;
      case 'yesterday':
        timestamp -= 86400;
        break;
      case 'week':
        timestamp -= 86400 * 7;
        break;
      case 'month':
        timestamp -= 86400 * 30;
        break;
      case 'year':
        timestamp -= 86400 * 365;
        break;
      default:
        break;
    }

    this.start = timestamp;
    let daysOverview: any = [];
    this.data.forEach((record: any) => {
      const data = this.findBusyDays(timestamp, record.sensorData);
      daysOverview.push(data);
    });

    const maxAndMinDays: { highestDay: string; lowestDay: string; } = this.makeAverages(daysOverview);
    const clearData: DataSortedForGraph[] = this.getTopDay(maxAndMinDays);

    this.setGraphsValues(clearData);

    const weatherDataset = this.setWeatherValues(clearData);



    this.initGraphs(this.datasets, weatherDataset, maxAndMinDays);
  }

  initGraphs(cyclistsDataset: any, weatherDataset: WeatherDataSortedForGraph, maxAndMinDays: { highestDay: string; lowestDay: string;}) {

    const labels = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

    console.log("Cyclist dataset: ", cyclistsDataset);
    console.log("Weather dataset: ", weatherDataset);
    
    
    this.graphs = [
      {
        chartId: "ComparisonGraph3",
        chartHeading: 'Priemerne najviac vytazeny den - ' + maxAndMinDays.highestDay,
        dataset: cyclistsDataset.high,
        weather: weatherDataset.high,
        labels: labels
      },
      {
        chartId: "ComparisonGraph4",
        chartHeading: 'Priemerne najmenej vytazeny den - ' + maxAndMinDays.lowestDay,
        dataset: cyclistsDataset.low,
        weather: weatherDataset.low,
        labels: labels
      },
      {
        chartId: "ComparisonGraph1",
        chartHeading: 'Priemer',
        dataset: cyclistsDataset.average,
        weather: weatherDataset.average,
        labels: labels
      }
    ]
  }

  setWeatherValues(clearData: any) {
    let weatherDatasets: WeatherDataSortedForGraph = { high: [], low: [], average: [] };

    clearData.forEach((record: any) => {
        let weather = this.setWeather(record.data.high);

        const weatherDatasetHigh: WeatherDataset = {
            label: "Teplota" + record.location,
            type: 'bar',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            data: weather.temperature,
            borderWidth: 1
        };

        weatherDatasets.high.push(weatherDatasetHigh);

        const precipitationDatasetHigh: WeatherDataset = {
            label: "Zrazky" + record.location,
            type: 'bar',
            data: weather.rain,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        };

        weatherDatasets.high.push(precipitationDatasetHigh);

        weather = this.setWeather(record.data.low);

        const weatherDatasetLow: WeatherDataset = {
            label: "Teplota" + record.location,
            type: 'bar',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            data: weather.temperature,
            borderWidth: 1
        };

        weatherDatasets.low.push(weatherDatasetLow);

        const precipitationDatasetLow: WeatherDataset = {
            label: "Zrazky" + record.location,
            type: 'bar',
            data: weather.rain,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        };

        weatherDatasets.low.push(precipitationDatasetLow);

        weather = this.setWeather(record.data.average);

        const weatherDatasetAverage: WeatherDataset = {
            label: "Teplota" + record.location,
            type: 'bar',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            data: weather.temperature,
            borderWidth: 1
        };

        weatherDatasets.average.push(weatherDatasetAverage);

        const precipitationDatasetAverage: WeatherDataset = {
            label: "Zrazky" + record.location,
            type: 'bar',
            data: weather.rain,
            backgroundColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        };

        weatherDatasets.average.push(precipitationDatasetAverage);
    });

    return weatherDatasets;
}



  setWeather(data: any) {
    let dataset: any = {
      temperature: [],
      rain: []
    };
    data.forEach((record: any) => {
      if (record.temperature === undefined) {
        record.temperature = 0;
      }
      dataset.temperature.push(record.temperature);
      if (record.rain === undefined) {
        record.rain = 0;
      }
      dataset.rain.push(record.rain);
    });
    return dataset;
  }


  setGraphsValues(data: any) {

    let colors = ["red", "green", "blue", "yellow", "purple", "brown", "pink",];
    data.forEach((record: any, index: number) => {
      let counts: number[] = [];
      record.data.high = this.fillMissingTimes(record.data.high);
      record.data.low = this.fillMissingTimes(record.data.low);
      record.data.average = this.fillMissingTimes(record.data.average);

      
      record.data.high.forEach((data: any) => {
        counts.push(data.cyclists)
      });

      const datasetHigh = {
        label: record.location,
        borderColor: colors[index],
        data: counts,
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      };

      counts = [];
      record.data.low.forEach((data: any) => {
        counts.push(data.cyclists)
      });

      const datasetLow = {
        label: record.location,
        borderColor: colors[index],
        data: counts,
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      };

      counts = [];
      record.data.average.forEach((data: any) => {
        counts.push(data.cyclists)
      });

      const datasetAverage = {
        label: record.location,
        borderColor: colors[index],
        data: counts,
        fill: false,
        cubicInterpolationMode: 'monotone',
        tension: 0.4
      };

      this.datasets.high.push(datasetHigh);
      this.datasets.low.push(datasetLow);
      this.datasets.average.push(datasetAverage);

    });
  }


  // ------------------------------------------------------- //
  // ------------------------------------------------------- //
  // --------- F O R M A T I N G  &  U T I L S ------------- //
  // ------------------------------------------------------- //
  // ------------------------------------------------------- //

  fillMissingTimes(data: { time: string; cyclists: number; }[]) {
    const filledData: { time: string; cyclists: number; }[] = [];
    let index = 0;

    for (let hour = 8; hour <= 19; hour++) {
      const time = `${hour.toString().padStart(2, '0')}:00`;

      if (data[index]?.time === time) {
        filledData.push(data[index]);
        index++;
      } else {
        filledData.push({ time: time, cyclists: 0 });
      }
    }

    return filledData;
  }



  formatTimestampToHour(timestamp: number): string {
    // Konvertuj sekundy na milisekundy
    const milliseconds = timestamp * 1000;
    // Vytvor nový Date objekt so zadanými milisekundami
    const date = new Date(milliseconds);
    // Získaj hodinu z dátumu
    const hours = date.getHours();
    // Zaokrúhli hodinu na najbližšiu celú hodinu
    const roundedHours = Math.round(hours);
    // Vytvor reťazec reprezentujúci čas vo formáte HH:mm
    const formattedTime = `${roundedHours < 10 ? '0' : ''}${roundedHours}:00`;
    return formattedTime;
  }

  getRandomTemperature(count: number): number[] {
    const temperatures: number[] = [];
    const halfCount = Math.floor(count / 2);
    let temperature = Math.floor(Math.random() * 16) + 15;
    temperatures.push(temperature);

    for (let i = 1; i < halfCount; i++) {
      temperature += Math.floor(Math.random() * 6);
      temperatures.push(temperature);
    }

    for (let i = halfCount; i < count; i++) {
      temperature -= Math.floor(Math.random() * 6);
      temperatures.push(temperature);
    }
    return temperatures;
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };

    return new Intl.DateTimeFormat('en-US', options).format(date);
  }

  unixTimeToDateFormat(unixTime: number): string {
    const date = new Date(unixTime * 1000);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  dateToUnixTime(dateString: string): number {
    const date = new Date(dateString);
    const unixTime = date.getTime() / 1000;
    return unixTime;
  }

  getDayOfWeekFromUnixTimestamp(unixTimestamp: number): string {
    const date = new Date(unixTimestamp * 1000);
    const dayOfWeekIndex = date.getDay();
    const daysOfWeek = ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'];
    return daysOfWeek[dayOfWeekIndex];
  }


  private getFirstTimestamp(sensorData: any): number {
    const timestamps = Object.keys(sensorData).map(Number);
    return timestamps[0];
  }

  private getLastTimestamp(sensorData: any): number {
    const timestamps = Object.keys(sensorData).map(Number);
    return timestamps[timestamps.length - 1];
  }

  getSingleStringDateMethod(date: any): number {
    const dateObject = new Date(date);
    const timestamp = dateObject.getTime(); // Timestamp v milisekundách
    const timestampInSeconds = Math.floor(timestamp / 1000); // Prevod na sekundy s odstráneným desatinným miestom
    return timestampInSeconds;
  }


}


