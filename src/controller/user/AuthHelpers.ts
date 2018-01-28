'use strict';
import passport = require('koa-passport');
import jwt = require('jsonwebtoken');
import * as PromiseBB from 'bluebird';
import {getManager} from 'typeorm';
import {Context} from "koa";

import {User} from "../../entity/User";
import config from '../../config/auth.config';

/**
 *  The Auth Checker middleware function.
 *  It set response status by itself
 */
export async function CheckAuth(ctx: Context, next) {
    if (!ctx.headers.authorization) {
        ctx.status = 401;
        return;
    }
    const userRepository = getManager().getRepository(User);

    // get the last part from a authorization header string like "bearer token-value"
    const token = ctx.headers.authorization.split(' ')[1];
    let decoded: any = null;
    // decode the token using a secret key-phrase
    PromiseBB.promisify(jwt.verify);
    try {
        decoded = await jwt.verify(token, config.jwtSecret);
        if (!decoded) {
            ctx.status = 401;
            return;
        }
    }
    catch (err) {
        // the 401 code is for unauthorized status
        ctx.status = 401;
        return;
    }

    const userId = decoded.sub;

    // check if a user exists
    try {
        let user = await userRepository.findOneById(userId);
        if (!user) {
            ctx.status = 401;
            return;
        }
        ctx.status = 200;
        ctx.body = {
            user: {
                email: user.email,
                phone: user.phone,
                id: user.id
            }
        };
        return;
    }
    catch (err) {
        ctx.status = 401;
        return;
    }
}
