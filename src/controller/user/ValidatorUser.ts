import {User} from "../../entity/User";

export default class UserRegisterCreditsValidator {
    /**
     * If valid return true
     * @param {User} user
     * @returns {UserErrors | boolean}
     */
    public static isValid(user: User) {
        let errors = new UserErrors();
        UserRegisterCreditsValidator.validateEmail(user.email, errors);
        UserRegisterCreditsValidator.validatePhone(user.phone, errors);
        return (errors.email || errors.phone) ? errors : true;
    }

    private static validateEmail(value: string, errors: UserErrors) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            errors.email = 'Invalid email format';
        }
        return errors;
    }

    private static validatePhone(value: string, errors: UserErrors) {
        value = value.trim().replace(/\(|\)|\-| +/g, '');
        if (!/^((\+7|7|8)+([0-9]){10})$/i.test(value)) {
            errors.phone = 'Invalid phone format';
        }
        return errors;
    }
};

class UserErrors {
    phone: string;
    email: string;
}