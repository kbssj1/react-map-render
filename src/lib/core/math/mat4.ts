import { Vec3 } from "./vec3";

export class Mat4 {

  private values = new Float32Array(16);

  constructor(values?: number[]) {
    if (values !== undefined) {
      for (let i = 0; i < 16; i++) {
        this.values[i] = values[i]
      }
    }
  }

  at(index: number): number {
    return this.values[index]
  }

  multiply(matrix: Mat4): Mat4 {
    const a00 = this.values[0]
    const a01 = this.values[1]
    const a02 = this.values[2]
    const a03 = this.values[3]
    const a10 = this.values[4]
    const a11 = this.values[5]
    const a12 = this.values[6]
    const a13 = this.values[7]
    const a20 = this.values[8]
    const a21 = this.values[9]
    const a22 = this.values[10]
    const a23 = this.values[11]
    const a30 = this.values[12]
    const a31 = this.values[13]
    const a32 = this.values[14]
    const a33 = this.values[15]

    let b0 = matrix.at(0)
    let b1 = matrix.at(1)
    let b2 = matrix.at(2)
    let b3 = matrix.at(3)

    this.values[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this.values[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this.values[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this.values[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = matrix.at(4)
    b1 = matrix.at(5)
    b2 = matrix.at(6)
    b3 = matrix.at(7)

    this.values[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this.values[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this.values[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this.values[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = matrix.at(8)
    b1 = matrix.at(9)
    b2 = matrix.at(10)
    b3 = matrix.at(11)

    this.values[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this.values[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this.values[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this.values[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    b0 = matrix.at(12)
    b1 = matrix.at(13)
    b2 = matrix.at(14)
    b3 = matrix.at(15)

    this.values[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30
    this.values[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31
    this.values[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32
    this.values[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33

    return this
  }

  translate(vector: Vec3): Mat4 {
    const x = vector.x
    const y = vector.y
    const z = vector.z

    this.values[12] += this.values[0] * x + this.values[4] * y + this.values[8] * z
    this.values[13] += this.values[1] * x + this.values[5] * y + this.values[9] * z
    this.values[14] += this.values[2] * x + this.values[6] * y + this.values[10] * z
    this.values[15] += this.values[3] * x + this.values[7] * y + this.values[11] * z

    return this
}

  array() : number[] {
    let result:number[] = new Array();
    for (let i = 0; i < 16; i++) {
      result.push(this.values[i]);
    }
    return result;
  }

}