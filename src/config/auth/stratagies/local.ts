'use strict';
const jwt = require('jsonwebtoken');
import passport = require('koa-passport');
import {Context} from "koa";
import {Strategy as LocalStrategy} from 'passport-local';
import {getManager} from "typeorm";
import {User} from "../../../entity/User";

import config from '../auth.config';
import hash from '../hash';

export default () => {
    const userRepository = getManager().getRepository(User);
    passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: true,
            passReqToCallback: true
        },
        async function (ctx, email, password, done) {
            try {
                const user = await userRepository.findOne({email: email as string});
                if (!user) {
                    return done(null, false, {
                        message: 'Incorrect email.'
                    });
                }
                let hashedPassword = hash.sha512(password, user.salt);
                if (hashedPassword.passwordHash !== user.password) {
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
                //new for jwt token
                const payload = {
                    sub: user.id
                };

                // create a token string
                const token = jwt.sign(payload, config.jwtSecret);
                const data = {
                    user: user
                };

                return done(null, token, data);
            } catch (err) {
                console.log(err);
                return done(err);
            }
        }));
};
