// All tunable values for this isolated, horizontal walking laboratory.
export const VERSION='0.3.11' as const;
export const WORLD={width:4200,height:720,ground:582,minX:86,maxX:4100,startX:180} as const;
export const MOVE={
 speed:210,
 response:13,
 stopThreshold:0.4,
 stride:168,
 fixedStep:1/120,
} as const;
export const ART={
 height:300,frameWidth:384,frameHeight:512,frames:8,
 // Frame positions normalized inside atlas in v0.3.11; fixed world anchor.
 footY:512,anchorX:210,
 frameBottoms:[509,509,509,509,509,509,509,509],idleFrame:1,
} as const;
