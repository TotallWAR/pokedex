import {Context} from "koa";
import {CheckAuth} from './AuthHelpers';

/**
 * Register new user
 */
export async function checkUserAuth(context: Context, next: any) {
    await CheckAuth(context, next);
}