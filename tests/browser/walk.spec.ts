import {test,expect} from '@playwright/test';
const snapshot=async(page:any)=>page.evaluate(()=> (window as any).__JOCA__.snapshot());
test.beforeEach(async({page})=>{
 await page.goto('/?test');
 await page.waitForFunction(()=> (window as any).__JOCA__?.snapshot().ready);
 await page.locator('#game').click();
});
test('loads 12-frame sheet, walks, stops, reverses and resets',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const start=await snapshot(page);
 expect(start.version).toBe('0.3.13');expect(start.textureReady).toBe(true);
 expect(start.spriteFrames).toBe(12);
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).x).toBeGreaterThan(start.x+130);
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
test('all 12 full-body poses are displayed and no vertical root hopping occurs',async({page})=>{
 await page.keyboard.down('KeyD');
 const frames=new Set<number>();
 const ground=new Set<number>();
 for(let i=0;i<100;i++){
  await page.waitForTimeout(29);
  const shot=await snapshot(page);
  frames.add(shot.visibleFrame);ground.add(shot.groundY);
 }
 await page.keyboard.up('KeyD');
 expect(frames.size).toBe(12);
 expect([...ground]).toEqual([582]);
});
