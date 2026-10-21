#!/usr/bin/env python3
"""Build an eight-frame walking atlas from the supplied 4×2 picture.
Only pixel translation/cropping is performed. No resynthesis, stretching, or rigging.
"""
from pathlib import Path
import json
import numpy as np
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'art-source/v0.4.5-eight-frame/source-8poses.png'
DEST=ROOT/'public/assets/joca-walk.png'
MANIFEST=ROOT/'art-source/v0.4.5-eight-frame/registration.json'
CELL_W=CELL_H=560
GROUND_Y=530
HEAD_CENTER_X=280
COLS=4
ROWS=2

im=Image.open(SOURCE).convert('RGBA')
w,h=im.size
cell_w=w//COLS
cell_h=h//ROWS
cells=[]
for i in range(COLS*ROWS):
    c=i%COLS; r=i//COLS
    x0=c*cell_w; x1=(c+1)*cell_w if c<COLS-1 else w
    y0=r*cell_h; y1=(r+1)*cell_h if r<ROWS-1 else h
    crop=im.crop((x0,y0,x1,y1))
    a=np.asarray(crop.getchannel('A'))
    valid=np.where(a>20)
    if len(valid[0])==0:
        raise ValueError(f'empty source cell {i}')
    top=int(valid[0].min()); bottom=int(valid[0].max())
    left=int(valid[1].min()); right=int(valid[1].max())
    ylo=min(a.shape[0]-1,top+40); yhi=min(a.shape[0],top+110)
    head=np.where(a[ylo:yhi]>160)[1]
    head_mid=float(np.median(head)) if len(head) else float((left+right)/2)
    dx=int(round(HEAD_CENTER_X-head_mid))
    dy=GROUND_Y-bottom
    tight=crop.crop((left,top,right+1,bottom+1))
    px=dx+left; py=dy+top
    if px<0 or px+tight.width>CELL_W or py<0 or py+tight.height>CELL_H:
        raise ValueError(f'frame {i} exceeds cell boundaries ({px},{py}) size {tight.width}×{tight.height}')
    cells.append((tight,px,py,top,bottom,head_mid,[x0,y0,x1-x0,y1-y0]))

atlas=Image.new('RGBA',(CELL_W*COLS,CELL_H*ROWS),(0,0,0,0))
manifest=[]
for i,(crop,dx,dy,top,bottom,head_mid,srect) in enumerate(cells):
    frame=Image.new('RGBA',(CELL_W,CELL_H),(0,0,0,0))
    frame.alpha_composite(crop,(dx,dy))
    atlas.alpha_composite(frame,((i%COLS)*CELL_W,(i//COLS)*CELL_H))
    a=np.asarray(frame.getchannel('A'))
    ys,xs=np.where(a>20)
    if int(ys.max())!=GROUND_Y:
        raise AssertionError(f'bad ground line for frame {i}')
    manifest.append({
      'index':i,
      'source_rect':srect,
      'offset':[dx,dy],
      'source_head_center_x':round(head_mid,1),
      'head_top_y':int(ys.min()),
      'ground_contact_y':int(ys.max()),
      'bbox':[int(xs.min()),int(ys.min()),int(xs.max()),int(ys.max())]
    })
DEST.parent.mkdir(parents=True,exist_ok=True)
atlas.save(DEST,optimize=True)
MANIFEST.write_text(json.dumps({'source_file':SOURCE.name,'source_size':list(im.size),'columns':COLS,'rows':ROWS,'frame_size':[CELL_W,CELL_H],'pivot':[HEAD_CENTER_X,GROUND_Y],'frames':manifest},indent=2,ensure_ascii=False)+'\n')
print('Prepared eight-frame walk:',DEST,'grid',COLS,'x',ROWS,'cell',CELL_W,CELL_H)
for m in manifest:
    print(m)
