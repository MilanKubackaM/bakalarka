import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToasterService {

  private messageSubject = new BehaviorSubject<string>('');
  private typeSubject = new BehaviorSubject<ToasterType>(ToasterType.ERROR);

  message$ = this.messageSubject.asObservable();
  type$ = this.typeSubject.asObservable();

  openToaster(message: string, type: ToasterType) {
    this.messageSubject.next(message);
    this.typeSubject.next(type);
  }

}

export enum ToasterType {
  ERROR = 'bg-danger',
  SUCCESS = 'bg-success',
  WARNING = 'bg-warning',
  INFO = 'bg-primary'
}
