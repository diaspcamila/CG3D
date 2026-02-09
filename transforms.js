var mId = [[1, 0, 0],
           [0, 1, 0],
           [0, 0, 1] ];

// webgl le coluna por coluna


function matrotZ(angle){
    return math.matrix([
        [math.cos(angle*Math.PI/180), -math.sin(angle*Math.PI/180), 0, 0],
        [math.sin(angle*Math.PI/180),  math.cos(angle*Math.PI/180), 0, 0],
        [0,0,1,0],
        [0,0,0,1]
    ]);
}

function matrotY(angle){
    return math.matrix([
        [ math.cos(angle*Math.PI/180),0,math.sin(angle*Math.PI/180),0],
        [0,1,0,0],
        [-math.sin(angle*Math.PI/180),0,math.cos(angle*Math.PI/180),0],
        [0,0,0,1]
    ]);
}

function matrotX(angle){
    return math.matrix([
        [1,0,0,0],
        [0,math.cos(angle*Math.PI/180),-math.sin(angle*Math.PI/180),0],
        [0,math.sin(angle*Math.PI/180), math.cos(angle*Math.PI/180),0],
        [0,0,0,1]
    ]);
}


function mattrans(tx, ty, tz){
    return math.matrix([
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]);
}

function matescala(sx, sy, sz){
    return math.matrix([
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ]);
}

function normalMat(modelMatrix){
    const inv = math.inv(modelMatrix);

    const trans = math.transpose(inv);

    return trans;
}

function sendMat(gl, uniformLocation, matrixMathJs){
    const flatArray = matrixMathJs.toArray().flat();

    const data = new Float32Array(flatArray);

    gl.uniformMatrix4fv(uniformLocation, true, data);
}