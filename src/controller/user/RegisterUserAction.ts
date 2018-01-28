import {Context} from "koa";
import {getManager} from "typeorm";
import {User} from "../../entity/User";
import UserRegisterCreditsValidator from './ValidatorUser';
import hash from "../../config/auth/hash";

/**
 * Register new user
 */
export async function registerUser(context: Context) {
    try {
        const userRepository = getManager().getRepository(User);

        // create a real user object from user json object sent over http
        const newUser: User = new User();
        newUser.email = context.request.body.email;
        newUser.phone = context.request.body.phone;
        newUser.password = context.request.body.password;
        newUser.provider = 'local';
        //password hashing
        let hashObject = hash.saltHashPassword(newUser.password);
        //hash and salt saving
        newUser.password = hashObject.passwordHash;
        newUser.salt = hashObject.salt;

        let validationResult = UserRegisterCreditsValidator.isValid(newUser);
        if (validationResult !== true) {
            context.status = 400;
            context.body = {
                error: validationResult,
                message: 'User credits are invalid',
            };
            return;
        }
        // save received user
        await userRepository.save(newUser);

        // return saved user back
        context.status = 201;
        context.body = newUser;
    } catch (err) {
        console.log(err);
        if (err.code && parseInt(err.code, 10) === 23505) {
            context.status = 409;
            context.body = 'User already exists';
            return;
        }
        context.status = 500;
    }
}