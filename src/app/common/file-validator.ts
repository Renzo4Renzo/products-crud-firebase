import { ValidationErrors, ValidatorFn } from '@angular/forms';
import { Global } from 'src/app/common/global';

export class FileValidator {
  sizeValidator($this: any, file: string): ValidatorFn {
    return (): ValidationErrors | null => {
      let validSize = true;
      //console.log('$this[file]: ', $this[file]);
      if ($this[file]) {
        validSize = true;
        if ($this[file].size > Global.maxImageSize) {
          validSize = false;
        }
      }
      //console.log('validSize: ', validSize);
      return validSize ? null : { size: validSize };
    };
  }

  typeValidator($this: any, file: string): ValidatorFn {
    return (): ValidationErrors | null => {
      let validType = true;
      //console.log('$this[file]: ', $this[file]);
      if ($this[file]) {
        validType = true;
        let type = $this[file].type.substring(
          $this[file].type.indexOf('/') + 1,
          $this[file].type.length
        );
        if (type != 'png' && type != 'jpg' && type != 'jpeg' && type != 'gif') {
          validType = false;
        }
      }
      //console.log('validType: ', validType);
      return validType ? null : { type: validType };
    };
  }
}
