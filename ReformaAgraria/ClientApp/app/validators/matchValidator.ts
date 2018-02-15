import { ValidatorFn, AbstractControl } from "@angular/forms";

export function matchValidator(firstControlName: string, secondControlName: string): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        let firstValue = control.get(firstControlName).value;
        let secondValue = control.get(secondControlName).value;
        const isMatch = firstValue === secondValue;
        if (!isMatch) 
            control.get(secondControlName).setErrors({'match': true})
        else
            return null;
    }
}