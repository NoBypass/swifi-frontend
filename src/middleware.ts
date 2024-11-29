import { defineMiddleware } from 'astro:middleware';
import {getSetupStep} from "@api/user";
import {redirectResponse} from "@util/astro";
import type {APIContext, MiddlewareNext} from "astro";

const basePaths = [
    '/login',
    '/login/password',
    '/setup/step1',
    '/setup/password',
]

export const onRequest = defineMiddleware(async (context, next) => {
    const m = new Middleware(context, next);

    m.use(/^\/dashboard/, async (context, next) => {
        const session = context.cookies.get('session');
        if (!session) return redirectResponse('/login');

        const step = await getSetupStep(session.value);
        if (step === -1) return next();
        return redirectResponse('/setup/step1');
    });

    m.use(/^\/setup/, async (context, next) => {
        const session = context.cookies.get('session');
        if (!session) {
            if (context.url.pathname === '/setup/step1') return next();
            return redirectResponse('/setup/step1');
        }

        const step = await getSetupStep(session.value);
        if (!step) {
            if (context.url.pathname === '/setup/step1') return next();
            return redirectResponse('/setup/step1');
        }

        if (step === -1) {
            return redirectResponse('/dashboard/overview');
        } else {
            const setupStepPath = `/setup/step${step}`;
            if (context.url.pathname === setupStepPath) return next();
            return redirectResponse(setupStepPath);
        }
    });

    m.use(/^\/login/, async (context, next) => {
        const session = context.cookies.get('session');
        if (session) return redirectResponse('/dashboard/overview');
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

    run() {
        for (const m of this.middlewares) {
            if (m.at.test(this.context.url.pathname)) {
                return m.fn(this.context, this.next);
            }
        }
    }
}
