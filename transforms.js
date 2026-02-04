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
