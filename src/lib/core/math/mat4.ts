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

  static readonly identity = new Mat4([1, 0, 0, 0, 
                                  0, 1, 0, 0,
                                  0, 0, 1, 0,
                                  0 ,0, 0, 1])

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

  rotate(angle: number, axis: Vec3): Mat4 {
    let x = axis.x
    let y = axis.y
    let z = axis.z

    let length = Math.sqrt(x * x + y * y + z * z)

    if (length !== 1) {
      length = 1 / length
      x *= length
      y *= length
      z *= length
    }

    const s = Math.sin(angle)
    const c = Math.cos(angle)

    const t = 1.0 - c

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

    const b00 = x * x * t + c
    const b01 = y * x * t + z * s
    const b02 = z * x * t - y * s

    const b10 = x * y * t - z * s
    const b11 = y * y * t + c
    const b12 = z * y * t + x * s

    const b20 = x * z * t + y * s
    const b21 = y * z * t - x * s
    const b22 = z * z * t + c

    this.values[0] = a00 * b00 + a10 * b01 + a20 * b02
    this.values[1] = a01 * b00 + a11 * b01 + a21 * b02
    this.values[2] = a02 * b00 + a12 * b01 + a22 * b02
    this.values[3] = a03 * b00 + a13 * b01 + a23 * b02

    this.values[4] = a00 * b10 + a10 * b11 + a20 * b12
    this.values[5] = a01 * b10 + a11 * b11 + a21 * b12
    this.values[6] = a02 * b10 + a12 * b11 + a22 * b12
    this.values[7] = a03 * b10 + a13 * b11 + a23 * b12

    this.values[8] = a00 * b20 + a10 * b21 + a20 * b22
    this.values[9] = a01 * b20 + a11 * b21 + a21 * b22
    this.values[10] = a02 * b20 + a12 * b21 + a22 * b22
    this.values[11] = a03 * b20 + a13 * b21 + a23 * b22

    return this;
  }

  scale(vector: Vec3): Mat4 {
    const x = vector.x
    const y = vector.y
    const z = vector.z

    this.values[0] *= x
    this.values[1] *= x
    this.values[2] *= x
    this.values[3] *= x

    this.values[4] *= y
    this.values[5] *= y
    this.values[6] *= y
    this.values[7] *= y

    this.values[8] *= z
    this.values[9] *= z
    this.values[10] *= z
    this.values[11] *= z

    return this
  }

  perspective(fieldOfViewInRadians:number, aspect:number, near:number, far:number): Mat4 {
    var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
    var rangeInv = 1.0 / (near - far);
 
    return new Mat4([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (near + far) * rangeInv, -1,
      0, 0, near * far * rangeInv * 2, 0
    ]);
  } 

  array() : number[] {
    let result:number[] = new Array();
    for (let i = 0; i < 16; i++) {
      result.push(this.values[i]);
    }
    return result;
  }

  // https://en.wikipedia.org/wiki/Invertible_matrix
  // AA-1 = A-1A = I, where I is the Identity matrix
  inverse(): Mat4 {
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

    const det00 = a00 * a11 - a01 * a10
    const det01 = a00 * a12 - a02 * a10
    const det02 = a00 * a13 - a03 * a10
    const det03 = a01 * a12 - a02 * a11
    const det04 = a01 * a13 - a03 * a11
    const det05 = a02 * a13 - a03 * a12
    const det06 = a20 * a31 - a21 * a30
    const det07 = a20 * a32 - a22 * a30
    const det08 = a20 * a33 - a23 * a30
    const det09 = a21 * a32 - a22 * a31
    const det10 = a21 * a33 - a23 * a31
    const det11 = a22 * a33 - a23 * a32

    let det = (det00 * det11 - det01 * det10 + det02 * det09 + det03 * det08 - det04 * det07 + det05 * det06)
    det = 1.0 / det

    this.values[0] = (a11 * det11 - a12 * det10 + a13 * det09) * det
    this.values[1] = (-a01 * det11 + a02 * det10 - a03 * det09) * det
    this.values[2] = (a31 * det05 - a32 * det04 + a33 * det03) * det
    this.values[3] = (-a21 * det05 + a22 * det04 - a23 * det03) * det
    this.values[4] = (-a10 * det11 + a12 * det08 - a13 * det07) * det
    this.values[5] = (a00 * det11 - a02 * det08 + a03 * det07) * det
    this.values[6] = (-a30 * det05 + a32 * det02 - a33 * det01) * det
    this.values[7] = (a20 * det05 - a22 * det02 + a23 * det01) * det
    this.values[8] = (a10 * det10 - a11 * det08 + a13 * det06) * det
    this.values[9] = (-a00 * det10 + a01 * det08 - a03 * det06) * det
    this.values[10] = (a30 * det04 - a31 * det02 + a33 * det00) * det
    this.values[11] = (-a20 * det04 + a21 * det02 - a23 * det00) * det
    this.values[12] = (-a10 * det09 + a11 * det07 - a12 * det06) * det
    this.values[13] = (a00 * det09 - a01 * det07 + a02 * det06) * det
    this.values[14] = (-a30 * det03 + a31 * det01 - a32 * det00) * det
    this.values[15] = (a20 * det03 - a21 * det01 + a22 * det00) * det

    return this
  }

  transpose(): Mat4 {
    const temp01 = this.values[1]
    const temp02 = this.values[2]
    const temp03 = this.values[3]
    const temp12 = this.values[6]
    const temp13 = this.values[7]
    const temp23 = this.values[11]

    this.values[1] = this.values[4]
    this.values[2] = this.values[8]
    this.values[3] = this.values[12]
    this.values[4] = temp01
    this.values[6] = this.values[9]
    this.values[7] = this.values[13]
    this.values[8] = temp02
    this.values[9] = temp12
    this.values[11] = this.values[14]
    this.values[12] = temp03
    this.values[13] = temp13
    this.values[14] = temp23

    return this
  } 

  static lookAt(position: Vec3, target: Vec3, up: Vec3 = Vec3.up): Mat4 {
    if (position.equals(target)) {
        return this.identity
    }

    const z = Vec3.difference(position, target).normalize()

    const x = Vec3.cross(up, z).normalize()
    const y = Vec3.cross(z, x).normalize()

    return new Mat4([
        x.x,
        y.x,
        z.x,
        0,

        x.y,
        y.y,
        z.y,
        0,

        x.z,
        y.z,
        z.z,
        0,

        -Vec3.dot(x, position),
        -Vec3.dot(y, position),
        -Vec3.dot(z, position),
        1,
    ])
}
}