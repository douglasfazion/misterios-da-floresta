/** JOCA articulated walk. World-motion-independent, deterministic source-pixel geometry. */
import {MOVE} from './config';
export type Point={x:number;y:number};
export type LimbPose={upper:Point;knee:Point;ankle:Point;upperAngle:number;lowerAngle:number;footAngle:number;lift:number};
export type ArmPose={shoulder:Point;elbow:Point;wrist:Point;upperAngle:number;lowerAngle:number};
export type RigPose={nearLeg:LimbPose;rearLeg:LimbPose;nearArm:ArmPose;rearArm:ArmPose;cycle:number;strength:number};
export const JOINTS={
 nearLeg:{hip:{x:226,y:305},knee:{x:261,y:376},ankle:{x:280,y:422},sole:464},
 rearLeg:{hip:{x:180,y:301},knee:{x:141,y:371},ankle:{x:127,y:426},sole:466},
 nearArm:{shoulder:{x:244,y:203},elbow:{x:262,y:258},wrist:{x:296,y:308}},
 rearArm:{shoulder:{x:185,y:188},elbow:{x:153,y:247},wrist:{x:143,y:306}},
} as const;
const TAU=Math.PI*2;
export function rotate(v:Point,a:number):Point{
 const s=Math.sin(a),c=Math.cos(a);return {x:v.x*c-v.y*s,y:v.x*s+v.y*c};
}
export function subtract(a:Point,b:Point):Point{return {x:a.x-b.x,y:a.y-b.y};}
export function add(a:Point,b:Point):Point{return {x:a.x+b.x,y:a.y+b.y};}
function angle(a:Point,b:Point):number{return Math.atan2(b.y-a.y,b.x-a.x);}
function dist(a:Point,b:Point):number{return Math.hypot(b.x-a.x,b.y-a.y);}
/** Two-bone IK, reach-constrained; stance ankle y never changes with body bob. */
export function solveKnee(hip:Point,ankle:Point,l1:number,l2:number,side:1|-1):Point{
 const dx=ankle.x-hip.x,dy=ankle.y-hip.y;
 const requested=Math.hypot(dx,dy);
 const d=Math.max(Math.abs(l1-l2)+1e-6,Math.min(l1+l2-1e-6,requested));
 const ux=(requested>1e-8?dx/requested:0),uy=(requested>1e-8?dy/requested:1);
 const along=(l1*l1-l2*l2+d*d)/(2*d);
 const off=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {x:hip.x+ux*along+side*(-uy)*off,y:hip.y+uy*along+side*ux*off};
}
function leg(kind:'nearLeg'|'rearLeg',theta:number,strength:number):LimbPose{
 const ref=JOINTS[kind];const near=kind==='nearLeg';
 const local=theta+(near?0:Math.PI);
 const offset=(near?54:53)*Math.cos(local);
 const ankleX=ref.hip.x+offset;
 const lift=Math.max(0,-Math.sin(local))*24*strength;
 const ankle={x:ref.ankle.x+(ankleX-ref.ankle.x)*strength,y:ref.ankle.y-lift};
 const l1=dist(ref.hip,ref.knee),l2=dist(ref.knee,ref.ankle);
 const knee=solveKnee(ref.hip,ankle,l1,l2,near?-1:1);
 return {
  upper:ref.hip,knee,ankle,lift,
  upperAngle:angle(ref.hip,knee)-angle(ref.hip,ref.knee),
  lowerAngle:angle(knee,ankle)-angle(ref.knee,ref.ankle),
  footAngle:Math.max(0,-Math.sin(local))*.08*strength*(near?1:-1),
 };
}
function arm(kind:'nearArm'|'rearArm',theta:number,strength:number):ArmPose{
 const ref=JOINTS[kind];
 // Arms counter-swing the legs. The second joint has a small delayed flex.
 const dir=kind==='nearArm'?1:-1;
 const a=dir*.43*Math.sin(theta)*strength;
 const b=a+dir*.15*Math.sin(theta+.5)*strength;
 const elbow=add(ref.shoulder,rotate(subtract(ref.elbow,ref.shoulder),a));
 const wrist=add(elbow,rotate(subtract(ref.wrist,ref.elbow),b));
 return {shoulder:ref.shoulder,elbow,wrist,upperAngle:a,lowerAngle:b};
}
/** Phase tracks travel distance, not elapsed time. Always continuous at phase=1->0. */
export function resolveRig(phase:number,velocity:number):RigPose{
 const finite=Number.isFinite(phase)?phase:0;
 const cycle=((finite%1)+1)%1;
 const strength=Math.max(0,Math.min(1,Math.abs(velocity)/MOVE.speed));
 const theta=cycle*TAU;
 return {cycle,strength,nearLeg:leg('nearLeg',theta,strength),rearLeg:leg('rearLeg',theta,strength),nearArm:arm('nearArm',theta,strength),rearArm:arm('rearArm',theta,strength)};
}
