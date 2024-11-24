import { defineMiddleware } from 'astro:middleware';
import {getSetupStep} from "@api/user";
import {redirectResponse} from "@util/astro";

export const onRequest = defineMiddleware(async (context, next) => {
    if (context.url.pathname.startsWith('/setup')) {
        if (context.url.pathname.endsWith('step1') ||
            context.url.pathname.endsWith('password')) return next();
        const session = context.cookies.get('session');
        if (!session) return redirectResponse('/setup/step1');

        const setupStep = await getSetupStep(session.value);
        if (setupStep === undefined) {
            context.cookies.delete('session');
            return redirectResponse('/setup/step1');
        }

        const step = parseInt(context.url.pathname.slice(-1));
        if (setupStep === -1) return redirectResponse('/dashboard/overview');
        else if (setupStep != step) return redirectResponse(`/setup/step${setupStep}`);
    }
    return next();
});