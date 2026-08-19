/**
 * The no-flash theme script.
 *
 * This string is injected into <head> as a blocking inline script, so it runs
 * BEFORE the browser paints anything. Without it, a reader who chose dark gets
 * a white flash on every navigation and reload: React cannot help here, because
 * the stored preference lives in localStorage, which the server cannot read —
 * the server-rendered HTML is always the default theme, and any correction made
 * in an effect happens after first paint.
 *
 * Three constraints shaped it:
 *
 * 1. It must be synchronous and inline. A `<script src>` — even one marked
 *    blocking — costs a request before first paint, which is exactly the budget
 *    an LCP-sensitive page cannot spend.
 * 2. `localStorage` access throws in Safari's private mode and wherever storage
 *    is blocked by policy, so the whole body is wrapped in try/catch. A theme
 *    preference is not worth a blank page.
 * 3. Light is the fallback when nothing is stored. The OS preference is
 *    deliberately NOT consulted: these are long-form articles, light is what
 *    they are designed for, and the user asked for light to be the default.
 *
 * It is minified by hand rather than by a build step because it ships inline in
 * every document, so every byte is paid 77+ times over.
 */
export const THEME_STORAGE_KEY = 'aih-theme';

export const themeScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');if(t==='dark'||t==='light'){document.documentElement.dataset.theme=t}}catch(e){}})();`;
