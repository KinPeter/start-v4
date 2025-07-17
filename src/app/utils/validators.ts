import { AbstractControl, ValidationErrors } from '@angular/forms';
import { FLEXIBLE_URL_REGEX, STRICT_URL_REGEX } from './regex';

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

  static strictUrl(control: AbstractControl): ValidationErrors | null {
    if (
      !control.value ||
      (typeof control.value === 'string' &&
        control.value !== '' &&
        STRICT_URL_REGEX.test(control.value.trim()))
    ) {
      return null;
    }
    return { url: true };
  }
}
