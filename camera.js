function lookAt(eye, center, up ){
    const e = math.matrix(eye);
    const c = math.matrix(center);
    const u = math.matrix(up);

    let f = math.subtract(c, e);
    f = math.divide(f, math.norm(f));

    let zAxis = math.subtract(e, c);
    zAxis = math.divide(zAxis, math.norm(zAxis));

    let xAxis = math.cross(u, zAxis);
    xAxis = math.divide(xAxis, math.norm(xAxis));

    let yAxis = math.cross(zAxis, xAxis);

    const x = xAxis.toArray();
    const y = yAxis.toArray();
    const z = zAxis.toArray();
    const eyeArr = e.toArray();

    const tx = -(x[0]*eyeArr[0] + x[1]*eyeArr[1] + x[2]*eyeArr[2]);
    const ty = -(y[0]*eyeArr[0] + y[1]*eyeArr[1] + y[2]*eyeArr[2]);
    const tz = -(z[0]*eyeArr[0] + z[1]*eyeArr[1] + z[2]*eyeArr[2]);

    return math.matrix([
        [x[0], x[1], x[2], tx],
        [y[0], y[1], y[2], ty],
        [z[0], z[1], z[2], tz],
        [0,    0,    0,    1 ]
    ]);
}

function createPerspective(fovy, aspect, near, far)
{
    fovy = fovy*(Math.PI/180.0);

    var fy = 1/math.tan(fovy/2.0);
    var fx = fy/aspect;
    var B = -2*far*near/(far-near);
    var A = -(far+near)/(far-near);

	var proj = math.matrix(
							[[ fx, 0.0,  0.0, 0.0],
							 [0.0,  fy,  0.0, 0.0],
							 [0.0, 0.0,    A,   B],
							 [0.0, 0.0, -1.0, 0.0]]
							);
							
	return proj;
}

function createCamera(pos, target, up){
    var zc = math.subtract(pos, target);
    zc = math.divide(zc, math.norm(zc));

    var yt = math.subtract(up, pos);
    yt = math.divide(yt, math.norm(yt));

    var xc = math.cross(yt, zc);
    xc = math.divide(yc, math.norm(yc));

    var mt = math.inv(math.transpose(math.matrix([xc, yc, zc])));

    mt = math.resize(mt, [4,4], 0);
    mt._data[3][3] = 1;

    var mov = math.matrix([[ 1, 0, 0, -pos[0]],
        [0, 1, 0, -pos[1]],
        [0, 0, 1, -pos[2]],
        [0, 0, 0, 1]
    ]);

    var cam = math.multiply(mt, mov);

    return cam;
}