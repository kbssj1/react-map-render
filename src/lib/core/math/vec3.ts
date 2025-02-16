
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

}