import { PLATFORMS } from './constants.js';
export function platformBelow(x, feet, platforms = PLATFORMS) {
    let best = Infinity;
    for (const p of platforms)
        if (x >= p.x && x <= p.x + p.w && p.y >= feet - 8 && p.y < best)
            best = p.y;
    return Number.isFinite(best) ? best : null;
}
export function horizontalOverlap(x, width, p) { return x + width > p.x && x < p.x + p.w; }
