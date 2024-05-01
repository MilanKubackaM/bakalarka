import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AddressData, Data } from '../../models/data.model';
import { getDatabase } from "firebase/database";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore'; // Import AngularFirestore
import { ToastrService } from 'ngx-toastr';
import * as firebase from 'firebase/app';
import 'firebase/firestore';



@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private http: HttpClient,
    private firestore: AngularFirestore,
    private toastr: ToastrService
  ) { }

  // private apiUrl = 'http://localhost:8086/query?db=sensor_data&q=SELECT * FROM sensor_data';


  // ---------------------------------------------------------//
  // ------------------- SENSOR OPERATIONS -------------------//
  // ---------------------------------------------------------//

  getSensorData(url: string): Observable<Data[]> {
    const apiURL = `http://${url}/query?db=sensor_data&q=SELECT * FROM sensor_data`;
    return this.http.get<any>(apiURL).pipe(
      map(response => this.mapToDataModel(response))
    );
  }

  private mapToDataModel(response: any): Data[] {
    const data: Data[] = [];

    const values = response.results[0]?.series[0]?.values || [];
    values.forEach((value: any) => {
      const [time, atm_tlak, cyklisti, id, nabitie, teplota, vlhkost] = value;
      const dataItem: Data = {
        id: id,
        date: time,
        pressure: atm_tlak,
        cyclists: cyklisti,
        battery: nabitie,
        temperature: teplota,
        humidity: vlhkost
      };
      data.push(dataItem);
    });
    return data;
  }

  testApiConnection(APIurl: string): Observable<boolean> {
    return this.http.get<any>(APIurl).pipe(
      map(() => true), // V prípade úspechu vráti true
      catchError(() => of(false)) // V prípade chyby vráti false
    );
  }

  // ---------------------------------------------------------//
  // ------------------- F I R E B A S E ---------------------//
  // ---------------------------------------------------------//

  // private database = getDatabase();
  getFirebaseDatabase() {
    return getDatabase();
  }

  setDataForUser(uid: string, apiUrl: string, name: string, location: AddressData): Promise<string> {

    const userCollectionRef = this.firestore.collection('users').doc(uid).collection('records');

    const query = userCollectionRef.ref.where('name', '==', name);

    return query.get()
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          this.toastr.error('Záznam s týmto názvom už existuje. Zadajte prosím iný názov', "Neplatne udaje");
          return Promise.resolve('nameDuplicated-error');
        } else {
          return userCollectionRef.add({
            name,
            apiUrl,
            location
          })
            .then(() => {
              this.toastr.success('Pridanie scitaca bolo úspešné!', 'Pripojene');
              return Promise.resolve('');
            })
            .catch((error) => {
              this.toastr.error('Chyba pri ukladaní údajov!', error);
              return Promise.resolve('upload-error');
            });
        }
      })
      .catch((error) => {
        this.toastr.error('Chyba pri získavaní údajov!', error);
        return Promise.resolve('getting-error');
      });
  }

  getDataFromUser(uid: string): Observable<any[]> {
    const userCollectionRef = this.firestore.collection('users').doc(uid).collection('records');
    return userCollectionRef.valueChanges();
  }

  deleteDevice(uid: string, name: string): Promise<void> {
    const userCollectionRef = this.firestore.collection('users').doc(uid).collection('records');
    const query = userCollectionRef.ref.where('name', '==', name);

    return query.get().then((querySnapshot) => {
      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          doc.ref.delete();
        });
        this.toastr.success('Zariadenie bolo úspešne vymazané!', 'Vymazané');
      } else {
        this.toastr.error('Zariadenie nebolo nájdené!', 'Chyba');
      }
    }).catch((error) => {
      this.toastr.error('Chyba pri vymazávaní zariadenia!', error);
    });
  }

  getGlobalData(): Promise<{ cities: number; devices: number }> {
    const globalDataDocRef = this.firestore.doc('globalData/globalData');
    return globalDataDocRef.get().toPromise()
      .then((globalDataSnapshot) => {
        if (globalDataSnapshot?.exists) {
          // Získajte údaje o počte miest a zariadení z globálnych údajov
          const globalData = globalDataSnapshot.data() as { numberOfCities: number; numberOfDevices: number };
  
          // Spočítajte počet zariadení zo všetkých miest
          return globalDataDocRef.collection('cities').get().toPromise()
            .then((citiesSnapshot) => {
              let totalDevices = 0;
              citiesSnapshot!.forEach((cityDoc) => {
                const cityData = cityDoc.data() as { numberOfDevices: number };
                totalDevices += cityData.numberOfDevices || 0;
              });
              const numberOfCitiesInCollection = citiesSnapshot!.size;
              return { cities: numberOfCitiesInCollection, devices: totalDevices };
            });
        } else {
          // Ak neexistujú údaje o globálnych údajoch, vráťte nulové hodnoty
          return { cities: 0, devices: 0 };
        }
      })
      .catch((error) => {
        console.error('Chyba pri získavaní globálnych údajov:', error);
        return { cities: 0, devices: 0 }; // Vráťte nulové hodnoty v prípade chyby
      });
  }

  getAllDevices(): Observable<string[]> {
    return this.firestore.collection('users').doc('globalData').collection('cities').get().pipe(
      map(querySnapshot => {
        const cities: string[] = [];
        querySnapshot.forEach(doc => {
          cities.push(doc.id);
        });
        console.log("Cities: ", cities);
        
        return cities;
      })
    );
  }

  
  getAllUserData(): Observable<any[]> {
    return this.firestore.collectionGroup('records').get().pipe(
      map(querySnapshot => {
        const userDataList: any[] = [];
        querySnapshot.forEach(doc => {
          // Prečítajte údaje zo záznamu a pridajte ich do pola userDataList
          const data = doc.data();
          userDataList.push(data);
        });
        // console.log("toto chcem: ", userDataList);
        
        return userDataList;
      })
    );
  }
  
  

  addToGlobalData(city: string): Promise<void> {
    const globalDataDocRef = this.firestore.doc('globalData/globalData');
    const cityDocRef = globalDataDocRef.collection('cities').doc(city);

    return this.firestore.firestore.runTransaction(async (transaction) => {
      const globalDataSnapshot = await transaction.get(globalDataDocRef.ref);

      if (globalDataSnapshot.exists) {
        const cityDataSnapshot = await transaction.get(cityDocRef.ref);
        if (cityDataSnapshot.exists) {
          transaction.update(cityDocRef.ref, {
            numberOfDevices: (cityDataSnapshot.data() as any).numberOfDevices + 1
          });
        } else {
          transaction.set(cityDocRef.ref, {
            numberOfDevices: 1
          });
        }
      } else {
        transaction.set(globalDataDocRef.ref, {
          cities: {
            [city]: {
              numberOfDevices: 1
            }
          }
        });
      }
    })
    .then(() => {
      this.toastr.success('Údaje boli úspešne aktualizované!', 'Úspech');
    })
    .catch((error) => {
      this.toastr.error('Chyba pri aktualizovaní údajov!', error);
    });
  }

  removeFromGlobalData(){

  }







  // ---------------------------------------------------------//
  // ------- https://opendata.bratislava.sk/en/page/doc ------//
  // ---------------------------------------------------------//

  private openDataUrl = "http://opendata.bratislava.sk/api";

  getOpenDataCategories() {
    return this.http.get(`${this.openDataUrl}/category`);
  }


  // ---------------------------------------------------------//
  // --------------- https://openweathermap.org --------------//
  // ---------------------------------------------------------//

  public lat = "48.14151279961679";
  public lon = "17.09201244055292";
  public apiKeyOpenWeather = "60a1d896c5e7d2442a2bc3e350a66464";
  private openWeatherUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${this.lat}&lon=${this.lon}&dt={time}&appid={API key}`;

  getWeatherHistoryFromOpenWeather(start: number | null, end: number | null, lat: string, lon: string): Observable<any[]> {
    const openWeatherHistory = `https://history.openweathermap.org/data/2.5/history/city?lat=${lat}&lon=${lon}&type=hour&start=${start}&end=${end}&appid=${this.apiKeyOpenWeather}`;
    // const openWeatherHistory = `https://history.openweathermap.org/data/2.5/history/city?lat=41.85&lon=-87.65&appid=${this.apiKeyOpenWeather}`;
    
    return this.http.get<any[]>(openWeatherHistory);
  }
  // ---------------------------------------------------------//
  // ----------------- https://emeteo.sk ---------------------//
  // ---------------------------------------------------------//

  private api_id = "753f0b9fccc49d44";
  private api_key = "3be68d9bc9de4dff61389ec949e504d8";
  private emeteoUrl = `https://emeteo.sk/api/get/current_weather?api_id=${this.api_id}&api_key=${this.api_key}&station_url=vajnory`;

  getEmeteoData(stationUrl: string): Observable<any> {
    const headers = new HttpHeaders()
      .set('api_id', this.api_id)
      .set('api_key', this.api_key)
      .set('station_url', stationUrl);

    const options = {
      headers: headers,
    };

    return this.http.get<any>(this.emeteoUrl, options);
  }




  checkCurrentLocation() {
    return new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(`Error getting location: ${error.message}`);
          }
        );
      } else {
        reject('Geolocation is not supported by your browser');
      }
    });
  }





}
