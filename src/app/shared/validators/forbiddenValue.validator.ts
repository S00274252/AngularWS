import { AbstractControl, ValidationErrors } from '@angular/forms';

// Fails if the value is a forbidden word
export function forbiddenValue(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
  if (typeof value === 'string' && value.length > 0) {
    const forbiddenValues = ['test'];
    if (forbiddenValues.includes(value.toLowerCase())) {
      return { forbiddenValue: true };
    }
  }
  return null;
}