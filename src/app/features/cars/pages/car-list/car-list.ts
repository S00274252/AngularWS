import { Component, inject} from '@angular/core';
import { CarService } from '../../services/car.service';
import { CarCard } from '../car-card/car-card';
import { toSignal } from '@angular/core/rxjs-interop';
import { withLoadState } from '../../../../shared/load-state';

@Component({
  selector: 'app-car-list',
  imports: [CarCard],
  templateUrl: './car-list.html',
  styleUrl: './car-list.scss',
})

export class CarList  {

private carService = inject(CarService);
  

   state = toSignal(withLoadState(this.carService.getCars()), { requireSync: true });
}

