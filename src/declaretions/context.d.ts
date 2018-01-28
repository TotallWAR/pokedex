import * as Koa from "koa";

declare module 'koa' {
    interface Context {
        csrf: string
    }
}
