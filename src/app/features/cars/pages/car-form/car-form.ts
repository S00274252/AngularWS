import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Car } from '../../models/car.model';
import { ReactiveFormsModule} from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-car-form',
  imports: [ReactiveFormsModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  carForm = this.formBuilder.group({
    make: ['', Validators.required],
    model: ['', Validators.required],
    year: ['']
  });
  carService: CarService = inject(CarService);

onSubmit(): void {
      const carData: Car = this.carForm.value as Car;
      console.log('Submitted Car:', carData);
      this.router.navigate(['/cars']); 

      this.router.navigate(['/cars']); 

      this.carService.addCar(carData).subscribe({
        next: (response) => {
          console.log('Car added successfully:', response);
        },
        error: (error) => {
          console.error('Error adding car:', error);
        }
      });
    }
  }

