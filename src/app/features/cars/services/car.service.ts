import { inject, Injectable } from '@angular/core';
import { Car, CreateCarDto, UpdateCarDto } from '../models/car.model';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CarService {

private http = inject(HttpClient);

private apiUrl = 'http://localhost:3000/api/v1/cars'; // this should be read from an env variable we will leave it for now.

getCars(): Observable<Car[]> {
  return this.http
    .get<Car[]>(this.apiUrl)
    .pipe(catchError((err) => this.handleError(err)));
}

  getCarById(id: string): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`)
     .pipe(catchError((err) => this.handleError(err)));
  }

  addCar(car: CreateCarDto): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car)
      .pipe(
        catchError((err) => this.handleError(err))
      )
  }

  updateCar(id: string, changes: UpdateCarDto): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, changes);
  }

  deleteCar(id: string): Observable<void> { 
   return this.http.delete<void>(`${this.apiUrl}/${id}`); 
  } 

 private handleError(error: HttpErrorResponse): Observable<never> {
    let message: string;

    switch (error.status) {
      case 0:
        message = 'Cannot reach the server. Check that the API is running.';
        break;
      case 400:
        message = 'Some of the data was not valid.';
        break;
      case 401:
        message = 'Please log in to continue.';
        break;
      case 403:
        message = 'You are not allowed to do that.';
        break;
      case 404:
        message = 'That car could not be found.';
        break;
      default:
        message = 'Something went wrong on the server. Please try again later.';
    }

    // Full details for the developer, a short message for the user
    console.error(`HTTP ${error.status} from ${error.url}`, error);
    return throwError(() => new Error(message));
  }
}
