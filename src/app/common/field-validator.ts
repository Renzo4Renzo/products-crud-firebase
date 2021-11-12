import { FormGroup } from '@angular/forms';

export class FieldValidator {
  isValidField(field: any, selectedForm: FormGroup): string {
    const validatedField = selectedForm.get(field);
    if (validatedField?.touched) {
      if (!validatedField?.valid) return 'is-invalid';
      else return 'is-valid';
    } else return '';
  }
}
