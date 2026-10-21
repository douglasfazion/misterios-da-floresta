import {test,expect} from '@playwright/test';
const snapshot=async(page:any)=>page.evaluate(()=> (window as any).__JOCA__.snapshot());
test.beforeEach(async({page})=>{
 await page.goto('/?test');await page.waitForFunction(()=> (window as any).__JOCA__?.snapshot().ready);
 await page.locator('#game').click();
});
test('loads 8-frame walk, goes both directions, stops and resets',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const start=await snapshot(page);
 expect(start.version).toBe('0.4.4');expect(start.textureReady).toBe(true);expect(start.spriteFrames).toBe(8);
 await page.keyboard.down('KeyD');await expect.poll(async()=> (await snapshot(page)).x).toBeGreaterThan(start.x+130);
 await page.keyboard.up('KeyD');await expect.poll(async()=> (await snapshot(page)).velocity).toBe(0);
 const stopped=await snapshot(page);await page.waitForTimeout(160);expect((await snapshot(page)).x).toBe(stopped.x);
 await page.keyboard.down('ArrowLeft');await expect.poll(async()=> (await snapshot(page)).x).toBeLessThan(stopped.x-50);
 expect((await snapshot(page)).facing).toBe(-1);
 await page.keyboard.up('ArrowLeft');await page.keyboard.press('KeyR');
 await expect.poll(async()=> (await snapshot(page)).x).toBe(180);
 expect((await snapshot(page)).cameraX).toBe(0);expect(errors).toEqual([]);
});
test('cycles through exactly eight poses with a stable root height',async({page})=>{
 await page.keyboard.down('KeyD');const frames=new Set<number>();const heights=new Set<number>();
 for(let i=0;i<95;i++){await page.waitForTimeout(23);const p=await snapshot(page);frames.add(p.visibleFrame);heights.add(p.groundY);}
 await page.keyboard.up('KeyD');expect([...frames].sort()).toEqual([0,1,2,3,4,5,6,7]);expect([...heights]).toEqual([582]);
});
