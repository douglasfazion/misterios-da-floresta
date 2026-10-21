from pathlib import Path
from playwright.sync_api import sync_playwright
import json
root=Path(__file__).resolve().parent.parent
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1360,'height':800},device_scale_factor=1)
    errors=[];network=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('request',lambda r:network.append(r.url) if r.url.startswith(('http://','https://')) else None)
    page.evaluate('window.__JOCA_TEST_MODE__=true')
    page.set_content((root/'JOGAR.html').read_text(encoding='utf-8'),wait_until='load',timeout=30000)
    page.wait_for_function('window.__JOCA__ && window.__JOCA__.snapshot().ready',timeout=20000)
    get=lambda:page.evaluate('window.__JOCA__.snapshot()')
    init=get();assert init['version']=='0.3.11' and init['textureReady'] and init['visualY']==582
    page.locator('#game').click()
    page.keyboard.down('KeyD')
    all_frames=set();heights=[];opacities=[]
    for i in range(160):
        page.wait_for_timeout(20)
        s=get();all_frames.add(s['frame']);heights.append(s['visualY']);opacities.append(s['seamOpacity'])
        if len(all_frames)==8 and i>110:break
    page.screenshot(path=str(root/'docs'/'browser-walking-v0.3.11.png'))
    page.keyboard.up('KeyD')
    assert len(all_frames)==8,(all_frames,init)
    assert all(h==582 for h in heights),set(heights)
    assert any(0<x<1 for x in opacities),opacities
    page.wait_for_function('window.__JOCA__.snapshot().velocity===0',timeout=4000)
    rest=get();assert rest['visualY']==582 and rest['seamOpacity']==0
    page.keyboard.down('ArrowLeft');page.wait_for_timeout(850);page.keyboard.up('ArrowLeft')
    assert get()['facing']==-1
    page.keyboard.press('KeyR');page.wait_for_timeout(180)
    s=get();assert s['x']==180 and s['visualY']==582 and s['cameraX']==0
    page.screenshot(path=str(root/'docs'/'browser-idle-v0.3.11.png'))
    assert not errors,errors
    assert not network,network
    print(json.dumps({'version':init['version'],'path':'embedded standalone HTML','frames':sorted(all_frames),'visualY_unique':sorted(set(heights)),'blend_samples':sum(0<x<1 for x in opacities),'idle_after_release':rest['moving']==False,'left_and_reset':True,'js_errors':errors,'web_requests':network},ensure_ascii=False))
    browser.close()
