// Conditional Logger - Only logs in development mode
// Usage: import { log, warn, error } from '../utils/logger';

const isDev = __DEV__ || process.env.NODE_ENV === 'development';

export const log = (...args: any[]): void => {
    if (isDev) {
        console.log('[DEV]', ...args);
    }
};

export const warn = (...args: any[]): void => {
    if (isDev) {
        console.warn('[DEV]', ...args);
    }
};

export const error = (...args: any[]): void => {
    // Always log errors, but with less detail in production
    if (isDev) {
        console.error('[DEV ERROR]', ...args);
    } else {
        console.error('[ERROR]', args[0]);
    }
};

export const group = (label: string, ...args: any[]): void => {
    if (isDev) {
        console.group(label);
        args.forEach(arg => console.log(arg));
        console.groupEnd();
    }
};

export default { log, warn, error, group };
