import {test,expect} from '@playwright/test';
const snapshot=async(page:any)=>page.evaluate(()=> (window as any).__JOCA__.snapshot());
test.beforeEach(async({page})=>{
 await page.goto('/?test');
 await page.waitForFunction(()=> (window as any).__JOCA__?.snapshot().ready);
 await page.locator('#game').click();
});
test('loads approved identity assets, walks, stops, reverses and resets',async({page})=>{
 const errors:string[]=[];
 page.on('pageerror',e=>errors.push(e.message));
 const initial=await snapshot(page);
 expect(initial.version).toBe('0.3.11');expect(initial.textureReady).toBe(true);
 expect(initial.frame).toBe(1);
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).x).toBeGreaterThan(initial.x+130);
 await page.keyboard.up('KeyD');
 await expect.poll(async()=> (await snapshot(page)).velocity).toBe(0);
 const stop=await snapshot(page);
 expect(stop.frame).toBe(1);
 await page.waitForTimeout(200);expect((await snapshot(page)).x).toBe(stop.x);
 await page.keyboard.down('ArrowLeft');
 await expect.poll(async()=> (await snapshot(page)).x).toBeLessThan(stop.x-50);
 expect((await snapshot(page)).facing).toBe(-1);
 await page.keyboard.up('ArrowLeft');
 await page.keyboard.press('KeyR');
 await expect.poll(async()=> (await snapshot(page)).x).toBe(180);
 expect((await snapshot(page)).cameraX).toBe(0);
 expect(errors).toEqual([]);
});
test('animation advances through distinct poses while moving',async({page})=>{
 await page.keyboard.down('KeyD');
 const frames=new Set<number>();
 for(let i=0;i<20;i++){
  await page.waitForTimeout(90);
  frames.add((await snapshot(page)).frame);
 }
 await page.keyboard.up('KeyD');
 expect(frames.size).toBeGreaterThanOrEqual(6);
});
test('blur releases held direction',async({page})=>{
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).velocity).toBeGreaterThan(205);
 await page.evaluate(()=>window.dispatchEvent(new Event('blur')));
 await expect.poll(async()=> (await snapshot(page)).velocity).toBe(0);
 const x=(await snapshot(page)).x;
 await page.keyboard.up('KeyD');await page.locator('#game').click();
 await page.waitForTimeout(200);expect((await snapshot(page)).x).toBe(x);
});
test('camera follows and button restores position',async({page})=>{
 await page.keyboard.down('KeyD');
 await expect.poll(async()=> (await snapshot(page)).cameraX,{timeout:7000}).toBeGreaterThan(30);
 await page.keyboard.up('KeyD');
 await page.locator('#reset').click();
 expect((await snapshot(page)).x).toBe(180);
 expect((await snapshot(page)).cameraX).toBe(0);
});
test('seam blend activates only during walking and stays within alpha range',async({page})=>{
 const sequence:any[]=await page.evaluate(async()=>{
  const values:any[]=[];
  const control=(window as any).__JOCA__;
  document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyD',bubbles:true}));
  // Click already focused by beforeEach, collect real frames over several gait cycles.
  await new Promise<void>(resolve=>{
   let count=0;const sample=()=>{
    values.push(control.snapshot().seamOpacity);
    if(++count<170)requestAnimationFrame(sample);else resolve();
   };requestAnimationFrame(sample);
  });
  document.dispatchEvent(new KeyboardEvent('keyup',{code:'KeyD',bubbles:true}));
  return values;
 });
 expect(sequence.every(x=>x>=0&&x<=1)).toBe(true);
 expect(sequence.some(x=>x>0&&x<1)).toBe(true);
});


test('character anchor remains fixed across all frames on-screen',async({page})=>{
 await page.keyboard.down('KeyD');
 const heights:number[]=[];const seen=new Set<number>();
 for(let i=0;i<100;i++){
  await page.waitForTimeout(22);
  const s=await snapshot(page);
  heights.push(s.visualY);seen.add(s.frame);
 }
 await page.keyboard.up('KeyD');
 expect(seen.size).toBe(8);
 expect(heights.every(y=>y===582)).toBe(true);
});
