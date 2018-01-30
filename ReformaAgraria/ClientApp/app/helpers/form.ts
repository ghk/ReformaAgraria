export class FormHelper {
    static serialize(model: object): FormData {
        let formData = new FormData();
        for (var key in model) {
            if (model.hasOwnProperty(key)) {
                formData.append(key, model[key])
            }
        }
        return formData;
    }
}