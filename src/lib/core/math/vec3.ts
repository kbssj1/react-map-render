// https://github.com/matthiasferch/tsm

export class Vec3 {
  private values = new Float32Array(3);

  constructor(values?: [number, number, number]) {
    if (values) {
      this.xyz = values
    }
  }

  get x(): number {
    return this.values[0]
  }

  get y(): number {
      return this.values[1]
  }

  get z(): number {
      return this.values[2]
  }

  set x(value: number) {
    this.values[0] = value
  }

  set y(value: number) {
      this.values[1] = value
  }

  set z(value: number) {
      this.values[2] = value
  }

  set xyz(values: [number, number, number]) {
    this.values[0] = values[0]
    this.values[1] = values[1]
    this.values[2] = values[2]
  }

  get xyz(): [number, number, number] {
    return [
      this.values[0],
      this.values[1],
      this.values[2],
    ]
  }

  squaredLength(): number {
    const x = this.x
    const y = this.y
    const z = this.z

    return (x * x + y * y + z * z)
  }

  length(): number {
    return Math.sqrt(this.squaredLength())
  }

  normalize(dest?: Vec3): Vec3 {
    if (!dest) { dest = this }

    let length = this.length()

    if (length === 1) {
        return this
    }

    if (length === 0) {
        dest.x = 0
        dest.y = 0
        dest.z = 0

        return dest
    }

    length = 1.0 / length

    dest.x *= length
    dest.y *= length
    dest.z *= length

    return dest
  }

  equals(vector: Vec3, threshold = 0.00001): boolean {
    if (Math.abs(this.x - vector.x) > threshold) {
        return false
    }

    if (Math.abs(this.y - vector.y) > threshold) {
        return false
    }

    if (Math.abs(this.z - vector.z) > threshold) {
        return false
    }

    return true
  }

  static readonly zero = new Vec3([0, 0, 0])
  static readonly one = new Vec3([1, 1, 1])

  static readonly up = new Vec3([0, 1, 0])
  static readonly right = new Vec3([1, 0, 0])
  static readonly forward = new Vec3([0, 0, 1])

  static difference(vector: Vec3, vector2: Vec3, dest?: Vec3): Vec3 {
    if (!dest) { dest = new Vec3() }
    dest.xyz = [vector.x - vector2.x, vector.y - vector2.y, vector.z - vector2.z];

    return dest
  }

  static cross(vector: Vec3, vector2: Vec3, dest?: Vec3): Vec3 {
    if (!dest) { dest = new Vec3() }

    const x = vector.x
    const y = vector.y
    const z = vector.z

    const x2 = vector2.x
    const y2 = vector2.y
    const z2 = vector2.z

    dest.x = y * z2 - z * y2
    dest.y = z * x2 - x * z2
    dest.z = x * y2 - y * x2

    return dest
  }

  static dot(vector: Vec3, vector2: Vec3): number {
    const x = vector.x
    const y = vector.y
    const z = vector.z

    const x2 = vector2.x
    const y2 = vector2.y
    const z2 = vector2.z

    return (x * x2 + y * y2 + z * z2)
  }

}