const VECTOR_END_ANGLE = 30;
const VECTOR_END_LENGTH = 20;
const VECTOR_FIRST_COLOR = "red";
const VECTOR_SECOND_COLOR = "blue";
const VECTOR_THIRD_COLOR = "green";
const VECTOR_RISK_STEP = 10;
const VECTOR_RISK_LEN = 5;
const VECTOR_RISK_COLOR = "black";

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /** @type {Vector} */
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }

    len() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalized() {
        let len = this.len();
        return new Vector(this.x / len, this.y / len);
    }

    scalarMultiply(a) {
        return new Vector(this.x * a, this.y * a);
    }

    angle() {
        // let acos = Math.acos(this.normalized().x);
        // let asin = Math.asin(this.normalized().y);
        let atan = Math.atan2(this.y, this.x);
        if (atan - Math.PI) {
            atan = Math.PI - atan;
        }
        return atan / Math.PI * 180.0 + 90.0;
    }

    static sum(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
}

/** @type {{color: String, v, start: Vector}} */
const drawVector = (color, v, num = 1, start = new Vector($('canvas').width() / 2, 30)) => {
    let canvas = $('canvas');
    start.y = canvas.height() - start.y;
    canvas
        .drawLine({ // vector line
            strokeStyle: color,
            strokeWidth: 2,
            x1: start.x, y1: start.y,
            x2: start.x + v.x, y2: start.y - v.y
        })
        .drawVector({ // first vector arrow line
            strokeStyle: color,
            strokeWidth: 2,
            x: start.x + v.x, y: start.y - v.y,
            a1: v.angle() + VECTOR_END_ANGLE, l1: VECTOR_END_LENGTH
        })
        .drawVector({ // second vector arrow line
            strokeStyle: color,
            strokeWidth: 2,
            x: start.x + v.x, y: start.y - v.y,
            a1: v.angle() - VECTOR_END_ANGLE, l1: VECTOR_END_LENGTH
        })
        .drawArc({ // vector`s angle arc
            strokeStyle: color,
            strokeWidth: 2,
            x: start.x, y: start.y,
            radius: 10 * num,
            // start and end angles in degrees
            start: v.angle() - 180, end: 90
        });
    for (let i = 0; i < v.len(); i += VECTOR_RISK_STEP) {
        let pos = v.normalized().scalarMultiply(i);
        canvas
            .drawVector({
                strokeStyle: VECTOR_RISK_COLOR,
                strokeWidth: 2,
                x: start.x + pos.x, y: start.y - pos.y,
                a1: v.angle() + 90, l1: VECTOR_RISK_LEN / 2
            })
            .drawVector({
                strokeStyle: VECTOR_RISK_COLOR,
                strokeWidth: 2,
                x: start.x + pos.x, y: start.y - pos.y,
                a1: v.angle() - 90, l1: VECTOR_RISK_LEN / 2
            })
    }
}

// $.jCanvas.extend({
//     name: "drawFunction",
//     type: "function",
//     props: { },
//     fn: function (ctx, params) {
//         let p = params;
//         $.jCanvas.transformShape(this, ctx, p);
//         ctx.beginPath();
//         let func = params.func;
//         ctx.moveTo(0, ctx.canvas.height);
//         ctx.strokeWidth = p.strokeWidth;
//         ctx.strokeStyle = p.strokeStyle;
//         for (let i = 0; i < ctx.canvas.width; i++) {
//             ctx.lineTo(i, ctx.canvas.height - func(i));
//         }
//         $.jCanvas.closePath(this, ctx, p);
//     }
// })

/**
 * @return {Vector[]} - 2 вектора, собранные из входных данных
 */
function buildVectors() {
    let e1 = $('#E0_input').val() * VECTOR_RISK_STEP;
    let e2 = $('#E1_input').val() * VECTOR_RISK_STEP;
    let q1 = $('#q1_input').val();
    let q2 = $('#q2_input').val();
    let v1 = new Vector(Math.cos(q1) * e1, Math.sin(q1) * e1);
    let v2 = new Vector(Math.cos(q2) * e2, Math.sin(q2) * e2);
    console.log(v1);
    console.log(v2);
    return [v1, v2];
}

const drawVectors = () => {
    /** @type Vector[] */
    let vectors = buildVectors();
    let canvas = $('canvas');
    canvas.clearCanvas(0, 0, canvas.width(), canvas.height());
    drawVector(VECTOR_FIRST_COLOR, vectors[0], 1);
    drawVector(VECTOR_SECOND_COLOR, vectors[1], 2);
    drawVector(VECTOR_THIRD_COLOR, Vector.sum(vectors[0], vectors[1]), 3);
}

$('.canvas_update').change(function (e) {
    drawVectors();
});

$(document).ready(function () {
    drawVectors();
});

drawVectors();
// $('canvas').drawFunction({
//     strokeStyle: "red",
//     strokeWidth: 1,
//     func: function (x) {
//         return Math.sin(x / 10) * 200;
//     }
// })