import { inject, Injectable } from '@angular/core';
import { Car } from '../models/car.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CarService {

private http = inject(HttpClient);

private apiUrl = 'http://localhost:3000/cars'; // this should be read from an env variable we will leave it for now.

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl)
  }
}
