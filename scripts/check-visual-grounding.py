"""Visual regression for 8-frame atlas; requires Pillow.

Ensures every frame has virtually the same head / foot vertical placement
and that each shifted RGBA frame is otherwise pixel-identical to its source.
"""
import json
from pathlib import Path
from PIL import Image

root=Path(__file__).resolve().parent.parent
art=root/'art-source'/'v0.3.11-source'
original=Image.open(art/'joca-walk-before-alignment.png').convert('RGBA')
aligned=Image.open(root/'public/assets/joca-walk.png').convert('RGBA')
shifts=json.loads((art/'alignment.json').read_text())['verticalOffsetsPx']
assert original.size==aligned.size==(1536,1024)

def box_at(i):
    x=(i%4)*384;y=(i//4)*512
    return (x,y,x+384,y+512)
heads,feet=[],[]
for i,shift in enumerate(shifts):
    prev=original.crop(box_at(i))
    expected=Image.new('RGBA',(384,512))
    expected.paste(prev,(0,shift))
    actual=aligned.crop(box_at(i))
    assert expected.tobytes()==actual.tobytes(), f'Frame {i}: art outside translation changed'
    # threshold strips alpha fringe that may otherwise destabilize bounding boxes
    a=actual.getchannel('A').point(lambda x:255 if x>=128 else 0)
    bounds=a.getbbox()
    assert bounds
    heads.append(bounds[1]);feet.append(bounds[3]-1)
assert max(heads)-min(heads)<=6,(heads,feet)
assert max(feet)-min(feet)<=3,(heads,feet)
print('PASS: 8 source-identical translated poses, head spread=',max(heads)-min(heads),'px; foot spread=',max(feet)-min(feet),'px')
print('heads=',heads,'feet=',feet,'offsets=',shifts)
