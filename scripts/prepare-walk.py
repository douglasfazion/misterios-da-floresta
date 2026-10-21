#!/usr/bin/env python3
"""Deterministic atlas normalization: same art, aligned sprite cells, no rig/synthesis.
Use: python3 scripts/prepare-walk.py
"""
from pathlib import Path
from PIL import Image
import numpy as np
import json

root=Path(__file__).resolve().parents[1]
src=root/'art-source/v0.3.13-walk/walk-input.png'
dst=root/'public/assets/joca-walk.png'
manifest=root/'art-source/v0.3.13-walk/registration.json'
im=Image.open(src).convert('RGBA')
assert im.size==(1448,1086),f'Unexpected source dimensions: {im.size}'
cellw,cellh=362,362
outw,outh=448,420
pad_x=43
contact_y=390
# Head/shoulder region acts as stable X coordinate. The foot baseline anchors Y.
anchor_x=291
canvas=Image.new('RGBA',(outw*4,outh*3),(0,0,0,0))
records=[]
for i in range(12):
    c,r=i%4,i//4
    tile=im.crop((c*cellw,r*cellh,(c+1)*cellw,(r+1)*cellh))
    arr=np.array(tile)
    alpha=arr[:,:,3]
    ys,xs=np.where(alpha>48)
    assert len(xs)>45000,f'Frame {i} is empty or damaged'
    bottom=int(ys.max())
    top=int(ys.min())
    yy,xx=np.indices(alpha.shape)
    headmask=(alpha>100)&(yy>=65)&(yy<=105)&(xx>150)
    headx=float(np.median(xx[headmask]))
    # Rounded integer offsets prevent filtering and keep exact original pixels.
    dx=round(248-headx)
    dy=contact_y-bottom
    x=pad_x+dx
    y=dy
    assert x>=0 and x+cellw<=outw and y>=0 and y+cellh<=outh
    canvas.alpha_composite(tile,(c*outw+x,r*outh+y))
    records.append({'frame':i,'source_xy':[c*cellw,r*cellh],
     'source_bounds':[int(xs.min()),top,int(xs.max()),bottom],
     'offset_xy':[x,y],'head_feature_x':headx,
     'contact_bottom_y':bottom+y,'head_top_y':top+y})
canvas.save(dst,optimize=True)
manifest.write_text(json.dumps({'input':src.name,'output':dst.name,'cell':[outw,outh],
 'frames':records,'contactY':contact_y,'pivotX':anchor_x,'framesCount':12},indent=2),encoding='utf-8')
print('JOCA 0.3.13 — 12 aligned frames created:',dst)
print('baseline:',[r['contact_bottom_y'] for r in records])
print('headtops:',[r['head_top_y'] for r in records])
