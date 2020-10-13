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

const sqr = (x) => { return x * x };

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
    let values = calcEres(e1, e2, q1, q2);
    $('#E_1').html(formatNumber(values.e1));
    $('#E_2').html(formatNumber(values.e2));
    $('#E_rez').html(formatNumber(values.res));
    $('#I_rez').html(formatNumber(sqr(values.res)));
    console.log(values);
    return [v1, v2];
}

function formatNumber(a) {
    a = a.toString(10);
    let dotPos =  a.indexOf('.');
    console.log(dotPos);
    return a.substring(0, dotPos + 5);
}

/**
 * Считает E по формуле E = E0cos(wt + p)
 * @param a {Number} амплитуда (E0)
 * @param q {Number} фаза
 * @return {Number} E
 */
function calcE(a, q) {
    let w = $('#w_input').val();
    let t = $('#t_input').val();
    return a * Math.cos(w * t + q);
}

function calcEres(e1, e2, q1, q2) {
    let E1 = calcE(e1, q1);
    let E2 = calcE(e2, q2);
    return {
        res: Math.sqrt(sqr(e1) + sqr(e2) + 2 * E1 * E2 * Math.cos(q2 - q1)),
        e1: E1,
        e2: E2
    };
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