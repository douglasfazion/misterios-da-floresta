// Existing gameplay parameters preserved from v0.3.12.
export const VERSION='0.3.13' as const;
export const WORLD={width:4200,height:720,ground:582,minX:86,maxX:4100,startX:180} as const;
export const MOVE={
 speed:210,
 response:13,
 stopThreshold:0.4,
 stride:168,
 fixedStep:1/120,
} as const;
// Twelve full-body drawings, normalized into identical transparent cells.
// The selected anchor is tied to the same world-space ground plane every frame.
export const ART={
 frames:12,
 frameWidth:448,
 frameHeight:420,
 anchorX:291,
 footY:390,
 height:300,
 idleFrame:0,
} as const;
