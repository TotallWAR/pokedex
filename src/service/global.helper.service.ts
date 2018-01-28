// different easy methods that can be useful everywhere it program

import * as PromiseBB from 'bluebird';
import {Context} from "koa";
import {User} from "../entity/User";
import {getManager} from "typeorm";

const jwt = require('jsonwebtoken');

import config from '../config/auth/auth.config';

export async function getCurrentUser(ctx: Context): Promise<User> {
    if (!ctx.headers.authorization) {
        return null;
    }
    const userRepository = getManager().getRepository(User);
    // get the last part from a authorization header string like "bearer token-value"
    const token = ctx.headers.authorization.split(' ')[1];

    // decode the token using a secret key-phrase

    PromiseBB.promisify(jwt.verify);
    try {
        let decoded = await jwt.verify(token, config.jwtSecret);
        const userId = decoded.sub;
        let user = await userRepository.findOneById(userId);
        return user;
    }
    catch (err) {
        return null;
    }
}

/**
 * Remove all nullable or undefined properties
 * @param {Object} obj
 * @returns {Object}
 */
export function removeNullableProperties(obj: Object): Object {
    for (let prop in obj) {
        if (obj[prop] === null || obj[prop] === undefined) {
            delete obj[prop];
        }
    }
    return obj;
}
