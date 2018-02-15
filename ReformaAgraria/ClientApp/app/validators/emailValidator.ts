import { ValidatorFn, AbstractControl } from "@angular/forms";

export function emailValidator(emailRegex: RegExp): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const isEmailValid = emailRegex.test(control.value);
        return isEmailValid ? null : {'email': { value: control.value }};
    }
}