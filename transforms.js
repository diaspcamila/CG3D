var mId = [[1, 0, 0],
           [0, 1, 0],
           [0, 0, 1] ];

// webgl le coluna por coluna


function matrotZ(angle){
    return [Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0, 0.0,
    Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0, 0.0,
    0.0,    0.0,   1.0, 0.0,
    0.0,    0.0,   0.0, 1.0];
}

function matrotY(angle){
    return [Math.cos(angle*Math.PI/180.0), 0.0, -Math.sin(angle*Math.PI/180.0), 0.0,
    0.0, 1.0, 0.0, 0.0,
    Math.sin(angle*Math.PI/180.0),  0.0, Math.cos(angle*Math.PI/180.0), 0.0,
    0.0,    0.0,   0.0, 1.0];
}

function matrotX(angle){
    return [ 1.0, 0.0, 0.0, 0.0,
    0.0, Math.cos(angle*Math.PI/180.0), -Math.sin(angle*Math.PI/180.0), 0.0,
    0.0, Math.sin(angle*Math.PI/180.0),  Math.cos(angle*Math.PI/180.0), 0.0,
    0.0,    0.0,   0.0 ,1.0];
}

function mattrans(tx, ty, tz){
    return Math.matrix([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]);
}

function matescala(sx, sy, sz){
    return Math.matrix([
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ]);
}

function normalMat(modelMatrix){
    const inv = Math.inv(modelMatrix);

    const trans = Math.transpose(inv);

    return trans;
}

function sendMat(gl, uniformLocation, matrixMathJs){
    const flatArray = matrixMathJs.toArray().flat();

    const data = new Float32Array(flatArray);

    gl.uniformMatrix4fv(uniformLocation, true, data);
}