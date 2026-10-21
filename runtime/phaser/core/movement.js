import { MOVEMENT } from './constants.js';
export const INITIAL_MOTION = { velocityX: 0, facing: 1, traveled: 0 };
export function direction(input) { return Number(input.right) - Number(input.left); }
export function approach(current, target, amount) { return Math.abs(current - target) <= amount ? target : current + Math.sign(target - current) * amount; }
export function advanceHorizontal(state, input, deltaSec) {
    const dt = Math.max(0, Math.min(deltaSec, 0.05));
    const dir = direction(input);
    const target = dir * (input.run ? MOVEMENT.runSpeed : MOVEMENT.walkSpeed);
    const v = approach(state.velocityX, target, (dir ? MOVEMENT.acceleration : MOVEMENT.friction) * dt);
    return { velocityX: v, facing: dir === 0 ? state.facing : dir, traveled: state.traveled + Math.abs(v) * dt };
}
export function frameForGround(traveled, running) {
    const pixelsPerFrame = running ? 36 : 24;
    return Math.floor(Math.max(0, traveled) / pixelsPerFrame) % (running ? 6 : 8);
}
export function jumpFrame(velocityY) { return velocityY < -660 ? 1 : velocityY < -240 ? 2 : velocityY < 300 ? 3 : velocityY < 720 ? 4 : 5; }
export function attackFrame(elapsedMs) { return Math.min(11, Math.max(0, Math.floor(elapsedMs / MOVEMENT.attackMilliseconds * 12))); }
export function spriteKey(motion, index) {
    const pref = motion === 'run' ? 'joca_run' : motion === 'jump' || motion === 'fall' ? 'joca_jump' : motion === 'attack' ? 'joca_strike' : 'joca_walk';
    return `${pref}_${String(index).padStart(2, '0')}`;
}
