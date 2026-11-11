import { Component, inject, input, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CreateCarDto } from '../../models/car.model';
import { ReactiveFormsModule} from '@angular/forms';
import { CarService } from '../../services/car.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { notBlank } from '../../../../shared/validators/not-blank.validator'; 
import { forbiddenValue } from '../../../../shared/validators/forbiddenValue.validator';

@Component({
  selector: 'app-car-form',
  imports: [
    ReactiveFormsModule, 
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly currentYear = new Date().getFullYear();
  readonly id = input<string>();

  carForm = this.formBuilder.nonNullable.group({
    make: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), notBlank, forbiddenValue]],
    model: ['', [Validators.required, Validators.maxLength(30), notBlank, forbiddenValue]],
    year: this.formBuilder.control<number | null>(null, [Validators.min(1950), Validators.max(this.currentYear + 1),]),
  });

  carService: CarService = inject(CarService);
    
  saving = signal(false);
  saveError = signal<string | null>(null);

  ngOnInit(): void {
    const id = this.id();
    if (!id) return;

    this.carService.getCarById(id).subscribe({
      next: (car) => 
        this.carForm.patchValue({
          make: car.make,
          model: car.model,
          year: car.year ?? null
        }),
      error: (err: Error) => this.saveError.set(err.message),
    });
  }
  
  onSubmit(): void {
    const { make, model, year } = this.carForm.getRawValue();
    const newCar: CreateCarDto = {
      make,
      model,
      year: year === null ? undefined : Number(year),
    };

    const id = this.id();

    const request = id ? this.carService.updateCar(id, newCar) : this.carService.addCar(newCar);

    this.saving.set(true);
    this.saveError.set(null);

    this.carForm.disable();

    request.subscribe({
      next: (response) => {
        this.snackBar.open(`${newCar.make} ${newCar.model} saved`, 'Close', { duration: 10000 });
        console.log('Car added successfully:', response);
        this.router.navigate(['/cars']);
      },
    error: (err: Error) => {
      this.saveError.set(err.message);
      this.saving.set(false);
      this.carForm.enable();
    },
    });
  }

}

