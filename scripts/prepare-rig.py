"""Recria as 13 partes de JOCA a partir do spritesheet aprovado v0.3.3.
Requer Pillow (pip install pillow). Não é necessário para jogar.
"""
from PIL import Image,ImageDraw,ImageFilter
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
source=Image.open(ROOT/'art-source/v0.3.3-original/joca-walk.png').convert('RGBA').crop((0,0,384,512))
dest=ROOT/'art-source/v0.3.12-rig'
dest.mkdir(parents=True,exist_ok=True)
playable=ROOT/'public/assets/rig'
playable.mkdir(parents=True,exist_ok=True)
parts={
 'tail':[(26,340),(55,314),(93,305),(139,317),(175,309),(179,341),(163,362),(123,375),(82,401),(47,417),(28,392)],
 'rear_upper_arm':[(181,165),(213,181),(212,205),(197,225),(171,262),(142,261),(140,240),(153,215)],
 'rear_forearm':[(150,239),(178,248),(170,286),(173,317),(157,330),(120,327),(113,308),(122,285)],
 'near_upper_arm':[(236,188),(254,199),(262,226),(273,253),(267,271),(250,277),(236,247),(222,218)],
 'near_forearm':[(248,246),(267,245),(288,263),(310,294),(326,312),(308,326),(285,316),(269,299),(255,279)],
 'rear_thigh':[(164,286),(211,299),(208,339),(171,369),(153,397),(119,407),(122,381),(132,344)],
 'rear_calf':[(120,357),(160,367),(155,399),(145,433),(115,442),(99,423)],
 'rear_foot':[(94,423),(118,412),(148,418),(164,426),(181,442),(175,465),(151,470),(111,470),(87,457)],
 'near_thigh':[(210,283),(250,303),(276,331),(291,369),(281,400),(248,410),(223,374),(209,339)],
 'near_calf':[(245,358),(278,359),(291,404),(302,432),(282,450),(250,438),(239,412)],
 'near_foot':[(248,413),(277,412),(306,420),(327,426),(345,444),(343,463),(318,472),(266,473),(238,457)],
 'torso':[(199,106),(229,97),(260,101),(281,116),(299,144),(290,163),(272,181),(263,204),(262,231),(258,259),(269,277),(258,291),(235,294),(214,283),(199,284),(183,274),(168,290),(157,283),(157,258),(163,235),(164,210),(161,178),(177,157),(184,131)],
 'cloth':[(183,227),(226,223),(252,236),(265,250),(269,285),(293,325),(279,351),(251,344),(231,355),(214,343),(184,368),(157,390),(139,383),(160,347),(129,339),(143,301),(146,271),(166,247)],
}
# geometry pivot + anchor: used in runtime, x,y are source-space
pivots={
 'rear_upper_arm':(185,188),'rear_forearm':(153,247),'near_upper_arm':(244,203),'near_forearm':(262,258),
 'rear_thigh':(180,301),'rear_calf':(141,371),'rear_foot':(127,426),'near_thigh':(226,305),'near_calf':(261,376),'near_foot':(280,422),
 'tail':(170,333),'torso':(210,300),'cloth':(211,280)
}
# end joints for segments and reference feet
ends={'rear_upper_arm':(153,247),'rear_forearm':(143,306),'near_upper_arm':(262,258),'near_forearm':(296,308),
      'rear_thigh':(141,371),'rear_calf':(127,426),'near_thigh':(261,376),'near_calf':(280,422)}
meta={}
for name,poly in parts.items():
 mask=Image.new('L',source.size,0);d=ImageDraw.Draw(mask);d.polygon(poly,fill=255)
 # don't feather too much or image edges look semi-transparent
 mask=mask.filter(ImageFilter.GaussianBlur(.7))
 alpha=source.getchannel('A')
 from PIL import ImageChops
 alpha=ImageChops.multiply(alpha,mask)
 output=source.copy();output.putalpha(alpha)
 bbox=alpha.getbbox()
 if bbox is None: raise ValueError(name)
 # bbox clamp and keep +2 pixels
 x0=max(0,bbox[0]-2); y0=max(0,bbox[1]-2);x1=min(source.width,bbox[2]+2);y1=min(source.height,bbox[3]+2)
 output.crop((x0,y0,x1,y1)).save(dest/f'{name}.png')
 output.crop((x0,y0,x1,y1)).save(playable/f'{name}.png')
 p=pivots[name]; e=ends.get(name)
 meta[name]={'pivot':[p[0]-x0,p[1]-y0], 'at':[p[0],p[1]],'bounds':[x0,y0,x1-x0,y1-y0]}
 if e:meta[name]['end']=[e[0],e[1]]
(dest/'rig.json').write_text(json.dumps(meta,indent=2))
# static composite in approximate layer order
canvas=Image.new('RGBA',source.size)
for name in ['tail','rear_upper_arm','rear_forearm','rear_thigh','rear_calf','rear_foot','near_thigh','near_calf','near_foot','torso','cloth','near_upper_arm','near_forearm']:
 part=Image.open(dest/f'{name}.png'); b=meta[name]['bounds'];canvas.alpha_composite(part,(b[0],b[1]))
canvas.save(dest/'rest_composite.png')
print('13 recortes produzidos a partir de joca-walk.png original da v0.3.3')
