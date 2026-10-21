// All tunable values for this isolated, horizontal walking laboratory.
export const VERSION='0.3.9' as const;
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
 // v0.3.9 uses a corrected walk atlas based on the approved identity.
 // Foot anchoring was recalibrated for the new sheet so the support leg stays grounded.
 footY:511,anchorX:210,
 frameBottoms:[511,511,511,511,487,487,466,475],idleFrame:1,
} as const;
