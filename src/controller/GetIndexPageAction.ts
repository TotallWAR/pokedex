import {Context} from "koa";
import fs = require ('fs');

/**
    get index page
 */
export async function getIndexPageAction(context: Context) {
    try {
        context.type = 'html';
        let body = await fs.readFileSync('./src/assets/index.html', 'utf8');

        // paste csrf token
        body = await body.replace('{csrfToken}', context.csrf);
        context.body = await body.replace('%PUBLIC_URL%', '/');
        context.status = 200;
    } catch (e) {
        context.throw(404, "Not Found");
    }
}