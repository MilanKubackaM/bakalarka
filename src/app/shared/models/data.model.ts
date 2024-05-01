export interface Data {
    id: number,
    date: string,
    pressure: number,
    cyclists: number,
    battery: number,
    temperature: number,
    humidity: number
}

export interface DeviceData {
    name: string,
    location: string,
    apiUrl: string
}

export interface AddressData {
    route?: string;
    streetNumber?: string;
    latitude: number;
    longitude: number;
    city: string;
}



export interface Graph {
    chartId: string,
    chartHeading: string,
    dataset: CyclistDataset[],
    weather: WeatherDataset[],
    labels: string[]
}

export interface CyclistDataset {
    label: string,
    borderColor: string,
    data: number[],
    fill: boolean,
    cubicInterpolationMode: string,
    tension: number
}

export interface WeatherDataset {
    label: string,
    type: string,
    backgroundColor: string,
    data: number[],
    borderWidth: number
}

export interface FinalData {
    location: Location,
    sensorData: SensorData
}

export interface SensorData {
    [timestamp: string]: {
        cyclists: number,
        temperature?: number,
        rain?: number
    }
}

export interface Location {
    location: string, 
    longitude: string,
    latitude: string,
    url: string,
    deviceName?: string
}

export interface DataSortedForGraph {
    location: string,
    data: {
        high: {
            time: string,
            cyclists: number,
            temperature: number,
            rain: number
        }[],
        low: {
            time: string,
            cyclists: number,
            temperature: number,
            rain: number
        }[],
        average: {
            time: string,
            cyclists: number,
            temperature: number,
            rain: number
        }[]
    }
}

export interface WeatherDataSortedForGraph {
    high: WeatherDataset[],
    low: WeatherDataset[],
    average: WeatherDataset[]
}



