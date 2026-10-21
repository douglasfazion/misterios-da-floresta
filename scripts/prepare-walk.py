#!/usr/bin/env python3
"""Build a four-frame walking atlas from the supplied 2×2 picture.
Only pixel translation/cropping is performed. No resynthesis, stretching, or rigging.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'art-source/v0.4.1-four-frame/source-4poses.png'
DEST=ROOT/'public/assets/joca-walk.png'
MANIFEST=ROOT/'art-source/v0.4.1-four-frame/registration.json'
CELL_W=CELL_H=700
GROUND_Y=675
HEAD_CENTER_X=430

im=Image.open(SOURCE).convert('RGBA')
w,h=im.size
w_left=w//2
h_top=h//2
cells=[]
for i in range(4):
    c=i%2
    r=i//2
    x0=0 if c==0 else w_left
    x1=w_left if c==0 else w
    y0=0 if r==0 else h_top
    y1=h_top if r==0 else h
    crop=im.crop((x0,y0,x1,y1))
    a=np.asarray(crop.getchannel('A'))
    valid=np.where(a>20)
    if len(valid[0])==0:
        raise ValueError(f'empty source quadrant {i}')
    top=int(valid[0].min())
    bottom=int(valid[0].max())
    ylo=min(a.shape[0]-1,top+40)
    yhi=min(a.shape[0],top+110)
    head=np.where(a[ylo:yhi]>160)[1]
    head_mid=float(np.median(head)) if len(head) else float((valid[1].min()+valid[1].max())/2)
    dx=int(round(HEAD_CENTER_X-head_mid))
    dy=GROUND_Y-bottom
    left=int(valid[1].min())
    right=int(valid[1].max())
    tight=crop.crop((left,top,right+1,bottom+1))
    px=dx+left
    py=dy+top
    if px<0 or px+tight.width>CELL_W or py<0 or py+tight.height>CELL_H:
        raise ValueError(f'frame {i} visible drawing exceeds cell boundaries ({px},{py})')
    cells.append((tight,px,py,top,bottom,head_mid))

atlas=Image.new('RGBA',(CELL_W*2,CELL_H*2),(0,0,0,0))
manifest=[]
for i,(crop,dx,dy,top,bottom,head_mid) in enumerate(cells):
    frame=Image.new('RGBA',(CELL_W,CELL_H),(0,0,0,0))
    frame.alpha_composite(crop,(dx,dy))
    atlas.alpha_composite(frame,((i%2)*CELL_W,(i//2)*CELL_H))
    a=np.asarray(frame.getchannel('A'))
    ys,xs=np.where(a>20)
    if int(ys.max())!=GROUND_Y:
        raise AssertionError(f'bad ground line for frame {i}')
    manifest.append({
      'index':i,
      'source_rect':[0 if i%2==0 else w_left,0 if i<2 else h_top,w_left if i%2==0 else w-w_left,h_top if i<2 else h-h_top],
      'offset':[dx,dy],
      'source_head_center_x':round(head_mid,1),
      'head_top_y':int(ys.min()),
      'ground_contact_y':int(ys.max()),
      'bbox':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]
    })
DEST.parent.mkdir(parents=True,exist_ok=True)
atlas.save(DEST,optimize=True)
MANIFEST.write_text(json.dumps({'source_file':SOURCE.name,'source_size':list(im.size),'columns':2,'rows':2,'frame_size':[CELL_W,CELL_H],'pivot':[HEAD_CENTER_X,GROUND_Y],'frames':manifest},indent=2,ensure_ascii=False)+'\n')
print('Prepared four-frame walk:',DEST,'quad size',CELL_W,CELL_H)
for m in manifest:
    print(m)
