'use strict'

class Matrix {
    constructor(r, c) {
        this.m = []
        for (let i = 0; i < r; i++) {
            let res = []
            for (let j = 0; j < c; j++) {
                if (i == j) {
                    res[j] = 1
                } else {
                    res[j] = 0
                }
            }
            this.m[i] = res
        }
    }

    value(a) {
        this.m = a
        return this
    }

    valueOf() {
        return this.m
    }

    multiply(a) {
        if (a instanceof Matrix) {
            let m = this.m;
            let row1 = m.length
            let col1 = m[0].length
            let col2 = a.m[0].length
            let i, j, k, res;
            let ret = []
            for (i = 0; i < row1; i++) {
                ret.push([])
                for (j = 0; j < col2; j++) {
                    res = 0;
                    for (k = 0; k < col1; k++) {
                        res += m[i][k] * a.m[k][j]
                    }
                    ret[i][j] = res
                }
            }
            this.m = ret
        }
        return this
    }
}


class TransformationMatrix extends Matrix {
    constructor(m, s, r) {
        super()
        this.m = [1, 0, 0, 1, 0, 0]
        this.scaleFactor = { x: 1, y: 1 }
        this.rotationAngle = 0;
        //SHALLOW COPY, VALUE ARE REFERENCE
        if (m) {
            this.m = m
        }
        if (s) {
            this.scaleFactor = s
        }
        if (r) {
            this.rotationAngle = r
        }
    }

    valueOf() {
        return this.m
    }

    toMatrix() {
        let n = new Matrix()
        let m = this.m
        n.value([[m[0], m[2], m[4]], [m[1], m[3], m[5]], [0, 0, 1]])
        return n
    }

    clone() {
        let r = new TransformationMatrix();
        r.m = this.m.slice(0);
        r.scaleFactor.x = this.scaleFactor.x
        r.scaleFactor.y = this.scaleFactor.y
        r.rotationAngle = this.rotationAngle
        return r
    }

    value(a, b, c, d, e, f) {
        this.m = [a, b, c, d, e, f]
    }

    translate(x, y) {
        return this.multiply([1, 0, 0, 1, x, y])
    }

    translateAdd(x, y) {
        return this.add([0, 0, 0, 0, x, y])
    }

    scale(w, h) {
        this.scaleFactor.x *= w
        this.scaleFactor.y *= h
        return this.multiply([w, 0, 0, h, 0, 0])
    }

    getScaleMatrix(w, h) {
        return new TransformationMatrix([w, 0, 0, h, 0, 0], { x: w, y: h })
    }

    scaleOnPoint(w, h, cx, cy) {
        let c = this.scale(w, h).getScaleMatrix(w, h).inv().multiplyPoint(cx, cy)
        return this.translate(c[0] - cx, c[1] - cy)
    }

    rotate(teta) {
        this.rotationAngle += teta
        let cos = Math.cos(teta);
        let sin = Math.sin(teta);
        return this.multiply([cos, -sin, sin, cos, 0, 0])
    }

    getRotateMatrix(teta) {
        let cos = Math.cos(teta);
        let sin = Math.sin(teta);
        return new TransformationMatrix([cos, -sin, sin, cos, 0, 0], null, teta)
    }

    rotateOnPoint(teta, cx, cy) {
        let c = this.rotate(teta).getRotateMatrix(teta).inv().multiplyPoint(cx, cy)
        return this.translate(c[0] - cx, c[1] - cy)
    }

    reflectX() {
        this.m[0] = -this.m[0]
        return this
    }

    reflectY() {
        this.m[3] = -this.m[3]
        return this
    }

    reflectXY() {
        return this.reflectX().reflectY();
    }

    shearX(psi) {
        return this.multiply([1, Math.tan(psi), 0, 1, 0, 0])
    }

    getShearXMatrix(psi) {
        return new TransformationMatrix([1, Math.tan(psi), 0, 1, 0, 0])
    }

    shearXOnPoint(psi, cx, cy) {
        let c = this.shearX(psi).getShearXMatrix(psi).inv().multiplyPoint(cx, cy)
        return this.translate(c[0] - cx, c[1] - cy)
    }

    shearY(psi) {
        return this.multiply([1, 0, Math.tan(psi), 1, 0, 0])
    }

    getShearYMatrix(psi) {
        return new TransformationMatrix([1, 0, Math.tan(psi), 1, 0, 0])
    }

    shearYOnPoint(psi, cx, cy) {
        let c = this.shearY(psi).getShearYMatrix(psi).inv().multiplyPoint(cx, cy)
        return this.translate(c[0] - cx, c[1] - cy)
    }

    shearXY(psix, psiy) {
        return this.shearX(psix).shearY(psiy);
    }

    shearXYOnPoint(psix, psiy, cx, cy) {
        return this.shearXOnPoint(psix, cx, cy).shearYOnPoint(psiy, cx, cy)
    }

    add(e) {
        let m = this.m
        this.m = [m[0] + e[0],
        m[1] + e[1],
        m[2] + e[2],
        m[3] + e[3],
        m[4] + e[4],
        m[5] + e[5]
        ]
        return this
    }

    subtract(e) {
        let m = this.m
        this.m = [m[0] + e[0],
        m[1] - e[1],
        m[2] - e[2],
        m[3] - e[3],
        m[4] - e[4],
        m[5] - e[5]
        ]
        return this
    }

    multiply(e) {
        let m = this.m
        this.m = [m[0] * e[0] + m[2] * e[1],
        m[1] * e[0] + m[3] * e[1],
        m[0] * e[2] + m[2] * e[3],
        m[1] * e[2] + m[3] * e[3],
        m[0] * e[4] + m[2] * e[5] + m[4],
        m[1] * e[4] + m[3] * e[5] + m[5]
        ]
        return this
    }

    multiplyTM(a) {
        let m = this.m
        let e = a.m
        this.scaleFactor.x *= a.scaleFactor.x
        this.scaleFactor.y *= a.scaleFactor.y
        this.rotationAngle += a.rotationAngle
        this.multiply(e)
        return this
    }

    static multiply(a, b) {
        return a.clone().multiplyTM(b)
    }

    multiplyChain(...args) {
        let l = args.length
        for (let i = 0; i < l; i++) {
            this.multiply(args[i])
        }
        return this
    }

    multiplyPoint(x, y) {
        let m = this.m
        return [
            m[0] * x + m[2] * y + m[4],
            m[1] * x + m[3] * y + m[5]
        ]
    }

    det() {
        let m = this.m
        return m[0] * m[3] - m[1] * m[2]
    }

    inv() {
        let m = this.m
        let det = this.det()

        this.m = [m[3] / det,
        -m[1] / det,
        -m[2] / det,
        m[0] / det,
        (m[2] * m[5] - m[3] * m[4]) / det,
        (m[1] * m[4] - m[0] * m[5]) / det
        ]
        return this
    }
}