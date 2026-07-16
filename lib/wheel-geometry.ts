export const WHEEL_START_ANGLE=-90;
export const POINTER_ANGLE=-90;

export function normalizeAngle(angle:number){return((angle%360)+360)%360}
export function getSegmentAngle(itemCount:number){return itemCount>0?360/itemCount:0}
export function getSegmentCenterAngle(index:number,itemCount:number){return WHEEL_START_ANGLE+(index+.5)*getSegmentAngle(itemCount)}
export function getRotationForIndex(index:number,itemCount:number,extraTurns=6){if(itemCount<=0)return 0;return extraTurns*360+normalizeAngle(POINTER_ANGLE-getSegmentCenterAngle(index,itemCount))}
export function getIndexAtPointer(rotation:number,itemCount:number){if(itemCount<=0)return-1;const unrotatedPointer=normalizeAngle(POINTER_ANGLE-normalizeAngle(rotation));const relative=normalizeAngle(unrotatedPointer-WHEEL_START_ANGLE);return Math.floor(relative/getSegmentAngle(itemCount))%itemCount}

const pointAt=(angle:number,radius=50)=>{const radians=angle*Math.PI/180;return{x:50+radius*Math.cos(radians),y:50+radius*Math.sin(radians)}};
export function getSegmentPath(index:number,itemCount:number){const angle=getSegmentAngle(itemCount);const start=WHEEL_START_ANGLE+index*angle;const end=start+angle;const a=pointAt(start);const b=pointAt(end);return`M 50 50 L ${a.x} ${a.y} A 50 50 0 ${angle>180?1:0} 1 ${b.x} ${b.y} Z`}
