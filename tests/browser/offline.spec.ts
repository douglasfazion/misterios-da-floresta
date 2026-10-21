import {test,expect} from '@playwright/test';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
test('JOGAR.html opens directly with embedded Phaser and all images',async({page})=>{
 const errors:string[]=[];const requests:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});
 await page.goto(pathToFileURL(resolve('JOGAR.html')).href+'?test');
 await page.waitForFunction(()=> (window as any).__JOCA__?.snapshot().ready);
 const p=await page.evaluate(()=> (window as any).__JOCA__.snapshot());
 expect(p.version).toBe('0.3.9');expect(p.textureReady).toBe(true);
 await page.locator('#game').click();await page.keyboard.down('KeyD');
 await expect.poll(()=>page.evaluate(()=> (window as any).__JOCA__.snapshot().x)).toBeGreaterThan(230);
 await page.keyboard.up('KeyD');
 await expect.poll(()=>page.evaluate(()=> (window as any).__JOCA__.snapshot().velocity)).toBe(0);
 expect(errors).toEqual([]);expect(requests).toEqual([]);
});
