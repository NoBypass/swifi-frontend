import { defineMiddleware } from 'astro:middleware';
import {getSetupStep} from "@api/user";
import type {APIContext, MiddlewareNext} from "astro";

export const onRequest = defineMiddleware((context, next): Promise<Response> => {
    const m = new Middleware(context, next);

    m.use(/^\/dashboard/, async (context, next) => {
        const session = context.cookies.get('session');
        if (!session) return m.redirect('/login')

        const step = await getSetupStep(session.value) || 0;
        if (step > 3) return next();
        return m.redirect('/setup/step1')
    });

    m.use(/^\/setup/, async (context, next) => {
        const actualStep = parseInt(context.url.pathname[context.url.pathname.length - 1]);
        const session = context.cookies.get('session');

        if (session) {
            const step = await getSetupStep(session.value);
            if (!step) {
                if (actualStep <= 2) return next();
                return m.redirect('/setup/step1'); // TODO handle error better
            }

            if (step > 3) return m.redirect('/home');
            else return m.redirect(`/setup/step${step}`);
        }

        if (actualStep <= 2) return next();
        return m.redirect('/setup/step1');
    });

    m.use(/^\/login/, async (context, next) => {
        const session = context.cookies.get('session');
        if (session) return m.redirect('/home');
        return next();
    });

    return m.run();
});

class Middleware {
    private readonly context: APIContext;
    private readonly next: MiddlewareNext;
    private readonly middlewares: {
        at: RegExp,
        fn: (context: APIContext, next: MiddlewareNext) => Promise<Response>
    }[] = [];

    constructor(context: APIContext, next: MiddlewareNext) {
        this.context = context;
        this.next = next;
    }

    use(at: RegExp, fn: (context: APIContext, next: MiddlewareNext) => Promise<Response>) {
        this.middlewares.push({
            at,
            fn
        });
    }

    run(): Promise<Response> {
        for (const m of this.middlewares) {
            if (m.at.test(this.context.url.pathname)) {
                return m.fn(this.context, this.next);
            }
        }

        return this.next();
    }

    redirect(url: string): Promise<Response> | Response {
        if (this.context.url.pathname === url) {
            return this.next();
        }

        return new Response(null, { status: 302, headers: { Location: url } });
    }
}
