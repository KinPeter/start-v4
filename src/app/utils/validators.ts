import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FLEXIBLE_URL_REGEX } from '../constants/regex';

export class CustomValidators {
  static url(control: AbstractControl): ValidationErrors | null {
    if (
      !control.value ||
      (typeof control.value === 'string' &&
        control.value !== '' &&
        FLEXIBLE_URL_REGEX.test(control.value.trim()))
    ) {
      return null;
    }
    return { url: true };
  }
}
