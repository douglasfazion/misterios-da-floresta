// Only the walking laboratory is in scope. All coordinates use game-world pixels.
export const VERSION='0.4.1' as const;
export const WORLD={width:4200,height:720,ground:582,minX:86,maxX:4100,startX:180} as const;
export const MOVE={
 speed:210,
 response:13,
 stopThreshold:0.4,
 stride:136, // One four-pose cycle per 136 pixels actually traversed.
 fixedStep:1/120,
} as const;
export const ART={
 frames:4,
 frameWidth:700,
 frameHeight:700,
 anchorX:430,
 footY:675,
 height:300,
 idleFrame:0,
} as const;
