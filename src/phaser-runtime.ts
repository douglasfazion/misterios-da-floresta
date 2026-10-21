/**
 * TypeScript wrapper for the Phaser 3.90.0 runtime already distributed with
 * the previous JOCA build. It loads synchronously before our ES/AMD modules.
 * Public Phaser types may replace this narrow bridge when npm is available.
 */
declare global { interface Window { Phaser: any; } }
const Phaser: any=window.Phaser;
if(!Phaser)throw new Error('Phaser runtime was not loaded.');
export default Phaser;
