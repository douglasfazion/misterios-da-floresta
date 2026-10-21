import {test,expect} from '@playwright/test';
const snapshot=async(page:any)=>page.evaluate(()=> (window as any).__JOCA__.snapshot());
test.beforeEach(async({page})=>{
 await page.goto('/?test');
 await page.waitForFunction(()=> (window as any).__JOCA__?.snapshot().ready);
 await page.locator('#game').click();
});
test('loads the 13-part original Joca rig; walks, stops, reverses and resets',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const initial=await snapshot(page);
 expect(initial.version).toBe('0.3.12');expect(initial.textureReady).toBe(true);
 expect(initial.rigPieces).toBe(13);
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).x).toBeGreaterThan(initial.x+130);
 await page.keyboard.up('KeyD');
 await expect.poll(async()=> (await snapshot(page)).velocity).toBe(0);
 const stopped=await snapshot(page);
 await page.waitForTimeout(150);expect((await snapshot(page)).x).toBe(stopped.x);
 await page.keyboard.down('ArrowLeft');
 await expect.poll(async()=> (await snapshot(page)).x).toBeLessThan(stopped.x-50);
 expect((await snapshot(page)).facing).toBe(-1);
 await page.keyboard.up('ArrowLeft');
 await page.keyboard.press('KeyR');
 await expect.poll(async()=> (await snapshot(page)).x).toBe(180);
 expect((await snapshot(page)).cameraX).toBe(0);
 expect(errors).toEqual([]);
});
test('both elbows, wrists and knees animate while the body remains grounded',async({page})=>{
 await page.keyboard.down('KeyD');
 const values:any[]=[];
 for(let i=0;i<90;i++){
  await page.waitForTimeout(25);values.push(await snapshot(page));
 }
 await page.keyboard.up('KeyD');
 const unique=(k:string)=>new Set(values.map(s=>Math.round(s[k]))).size;
 for(const k of ['nearWristX','rearWristX','nearKneeX','rearKneeX','nearAnkleX','rearAnkleX'])expect(unique(k)).toBeGreaterThan(8);
 expect(values.every(s=>s.groundY===582)).toBe(true);
 expect(values.some(s=>s.nearLift>10)).toBe(true);
 expect(values.some(s=>s.rearLift>10)).toBe(true);
});
test('blur releases held direction',async({page})=>{
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).velocity).toBeGreaterThan(205);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect.poll(async()=> (await snapshot(page)).velocity).toBe(0);
 const x=(await snapshot(page)).x;await page.keyboard.up('KeyD');
 await page.locator('#game').click();await page.waitForTimeout(180);
 expect((await snapshot(page)).x).toBe(x);
});
test('camera follows and reset button restores position',async({page})=>{
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).cameraX,{timeout:7000}).toBeGreaterThan(30);
 await page.keyboard.up('KeyD');await page.locator('#reset').click();
 expect((await snapshot(page)).x).toBe(180);
 expect((await snapshot(page)).cameraX).toBe(0);
});
