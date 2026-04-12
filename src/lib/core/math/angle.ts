export const PI = Math.PI;

export function degToRad(degree: number): number {
  return degree * (PI / 180);
}

export function radToDeg(radian: number): number {
  return radian * (180 / PI);
}
