import {Context} from "koa";
import {getManager} from "typeorm";
import {User} from "../../entity/User";
import hash from "../../config/auth/hash";
import passport = require('koa-passport');

/**
 * Login user
 */
export async function loginUser(context: Context, next: any) {
    try {
        const userRepository = getManager().getRepository(User);

        const user = await userRepository.findOne({email: context.request.body.email});

        if (!user) {
            context.status = 404;
            context.body = 'Not found';
            return;
        }
        let hashObject = hash.sha512(context.request.body.password, user.salt);
        //compare hashed passwords
        if (user.password === hashObject.passwordHash) {
            return await passport.authenticate('local', function (err, token, userData) {
                if (err) {
                    if (err.name === 'IncorrectCredentialsError') {
                        context.status = 401;
                        context.body = {
                            success: false,
                            message: err.message
                        };
                        return
                    }
                    context.status = 400;
                    context.body = {
                        success: false,
                        message: 'Could not process the form.'
                    };
                    return
                }
                context.status = 200;
                context.body = {
                    success: true,
                    message: 'You have successfully logged in!',
                    jwt: token,
                    user: {
                        email: userData.user.email,
                        phone: userData.user.phone,
                        id: userData.user.id
                    }
                    // user: userData.user
                };
            })(context, next);
        } else {
            context.status = 401;
            context.body = 'Invalid password';
        }
    }
    catch (e) {
        context.throw(500);
    }
}