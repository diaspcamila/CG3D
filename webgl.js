var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png", "chao.jpg", "parede.jpg", "lousa.jpg", "cinza.jpg", "madeira.jpg", "coluna.jpg", "janela.jpg", "arcondicionado.jpg", "jan-porta.jpg", "jan-cima.jpg", "projetor.jpg", "preto.jpg", "mesa.jpg", "macaneta.jpg", "luz.jpg"]
var loadTexs = 0;
var gl;
var prog;

var u_modelPtr, u_viewPtr, u_projectionPtr;
var lightposPtr, camposPtr;

// ====== CÂMERA (VISÃO DE CACHORRO) ======
var camPos = [-4.3, -1.5, 4.5];   
var yaw = -45;             
var pitch = 0;             

var speed = 0.08;
var turnSpeed = 2;

var limitesSala = {
    minX: -largura + 0.3,
    maxX:  largura - 0.3,
    minZ: -profundidade + 0.3,
    maxZ:  profundidade - 0.3,
    alturaCam: 0.6
};

var keys = {};

var tempo = 0;

var Latido = null;

document.addEventListener("keydown", function(e) {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener("keyup", function(e) {
    keys[e.key.toLowerCase()] = false;
});

function getGL(canvas)
{
    var gl = canvas.getContext("webgl");
    if(gl) return gl;

    gl = canvas.getContext("experimental-webgl");
    if(gl) return gl;

    alert("Contexto WebGL inexistente! Troque de navegador!");
    return false;
}

function createShader(gl, shaderType, shaderSrc)
{
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSrc);
    gl.compileShader(shader);

    if(gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        return shader;

    alert("Erro de compilação: " + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

function createProgram(gl, vtxShader, fragShader)
{
    var prog = gl.createProgram();
    gl.attachShader(prog, vtxShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);

    if(gl.getProgramParameter(prog, gl.LINK_STATUS))
        return prog;

    alert("Erro de linkagem: " + gl.getProgramInfoLog(prog));
    gl.deleteProgram(prog);
}

// ====== TECLADO (SETAS) ======
document.addEventListener("keydown", function(e) {   // >>> ALTERAÇÃO <<<
    const step = 3;

    if (e.key === "ArrowLeft")  yaw -= step;
    if (e.key === "ArrowRight") yaw += step;

    if (e.key === "ArrowUp")    pitch += step;
    if (e.key === "ArrowDown")  pitch -= step;

    pitch = Math.max(-89, Math.min(89, pitch));
});

function init()
{
    for(i = 0; i < texSrc.length; i++)
    {
        teximg[i] = new Image();
        teximg[i].src = texSrc[i];
        teximg[i].onload = function()
        {
            loadTexs++;
            loadTextures();
        }

        teximg[i].onerror = function() {
            console.error("Erro ao carregar imagem: " + this.src);
            loadTexs++;
            loadTextures();
        }
    }
}

function loadTextures()
{
    if(loadTexs == texSrc.length)
    {
        initGL();
        configScene();
        draw();
    }
}

function initGL()
{
    var canvas = document.getElementById("glcanvas1");
    gl = getGL(canvas);

    audioLatido();

    var vtxShSrc = document.getElementById("vertex-shader").text;
    var fragShSrc = document.getElementById("frag-shader").text;

    var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
    var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
    prog = createProgram(gl, vtxShader, fragShader);

    gl.useProgram(prog);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.5, 0.5, 0.5, 1);
    gl.enable(gl.DEPTH_TEST);
}

function configScene()
{
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    var positionPtr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionPtr);
    gl.vertexAttribPointer(positionPtr, 3, gl.FLOAT, false, 5*4, 0);

    var texcoordPtr = gl.getAttribLocation(prog, "texCoord");
    gl.enableVertexAttribArray(texcoordPtr);
    gl.vertexAttribPointer(texcoordPtr, 2, gl.FLOAT, false, 5*4, 3*4);

    var normalsCoords = [];
    for(let i=0; i<objetos.length; i++) {
        normalsCoords.push(...objetos[i].list_norm);
    }

    var normBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalsCoords), gl.STATIC_DRAW);

    var normalPtr = gl.getAttribLocation(prog, "normal");
    gl.enableVertexAttribArray(normalPtr);
    gl.vertexAttribPointer(normalPtr, 3, gl.FLOAT, false, 0, 0);

    for(let i=0; i<teximg.length; i++) {
        let tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[i]);
    }

    u_modelPtr = gl.getUniformLocation(prog, "u_model");
    u_viewPtr = gl.getUniformLocation(prog, "u_view");
    u_projectionPtr = gl.getUniformLocation(prog, "u_projection");
    lightposPtr = gl.getUniformLocation(prog, "lightpos");
    camposPtr = gl.getUniformLocation(prog, "campos");
}

function sendMathJSMatrix(gl, location, matrix) {

    const flat = math.transpose(matrix).toArray().flat();

    gl.uniformMatrix4fv(
        location,
        false,
        new Float32Array(flat)
    );
}


var tempo = 0;
var lastTime = 0;

function draw(time){

    // ===== DELTA TIME (animação suave) =====
    if(!time) time = 0;

    let delta = (time - lastTime) * 0.001;
    lastTime = time;

    tempo += delta * 2; // velocidade da animação


    // ===== LIMPA TELA =====
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    // ===== MOVIMENTO DA CÂMERA =====
    var rad = yaw * Math.PI / 180;

    if (keys["w"]) {
        let novoX = camPos[0] + Math.cos(rad) * speed;
        let novoZ = camPos[2] + Math.sin(rad) * speed;

        if (novoX > limitesSala.minX && novoX < limitesSala.maxX)
            camPos[0] = novoX;

        if (novoZ > limitesSala.minZ && novoZ < limitesSala.maxZ)
            camPos[2] = novoZ;
    }

    if (keys["s"]) {
        let novoX = camPos[0] - Math.cos(rad) * speed;
        let novoZ = camPos[2] - Math.sin(rad) * speed;

        if (novoX > limitesSala.minX && novoX < limitesSala.maxX)
            camPos[0] = novoX;

        if (novoZ > limitesSala.minZ && novoZ < limitesSala.maxZ)
            camPos[2] = novoZ;
    }

    if (keys["a"]) {
        let novoX = camPos[0] + Math.sin(rad) * speed;
        let novoZ = camPos[2] - Math.cos(rad) * speed;

        if (novoX > limitesSala.minX && novoX < limitesSala.maxX)
            camPos[0] = novoX;

        if (novoZ > limitesSala.minZ && novoZ < limitesSala.maxZ)
            camPos[2] = novoZ;
    }

    if (keys["d"]) {
        let novoX = camPos[0] - Math.sin(rad) * speed;
        let novoZ = camPos[2] + Math.cos(rad) * speed;

        if (novoX > limitesSala.minX && novoX < limitesSala.maxX)
            camPos[0] = novoX;

        if (novoZ > limitesSala.minZ && novoZ < limitesSala.maxZ)
            camPos[2] = novoZ;
    }


    // ===== ROTAÇÃO =====
    if (keys["arrowleft"])  yaw -= turnSpeed;
    if (keys["arrowright"]) yaw += turnSpeed;
    if (keys["arrowup"])    pitch += turnSpeed;
    if (keys["arrowdown"])  pitch -= turnSpeed;

    pitch = Math.max(-89, Math.min(89, pitch));


    // ===== DIREÇÃO DA CÂMERA =====
    var radYaw = yaw * Math.PI / 180;
    var radPitch = pitch * Math.PI / 180;

    var camDir = [
        Math.cos(radPitch) * Math.cos(radYaw),
        Math.sin(radPitch),
        Math.cos(radPitch) * Math.sin(radYaw)
    ];

    var camTarget = [
        camPos[0] + camDir[0],
        camPos[1] + camDir[1],
        camPos[2] + camDir[2]
    ];

    var camUp = [0,1,0];
    var lightPos = [5,5,5];

    gl.uniform3fv(lightposPtr, lightPos);
    gl.uniform3fv(camposPtr, camPos);


    // ===== MATRIZES VIEW E PROJECTION =====
    var viewMatrix = lookAt(camPos, camTarget, camUp);
    sendMathJSMatrix(gl, u_viewPtr, viewMatrix);

    var aspect = gl.canvas.width / gl.canvas.height;
    var projMatrix = createPerspective(45, aspect, 0.1, 100);
    sendMathJSMatrix(gl, u_projectionPtr, projMatrix);


    // ===== DESENHO DOS OBJETOS =====
    var texPtr = gl.getUniformLocation(prog, "tex");

    for (let i = 0; i < objetos.length; i++){

        // identidade REAL
        let model = math.identity(4);


        if(i === paArIndex){

            let angle = Math.sin(tempo) * 10;

            let px = 4.4;
            let py = 1.35;
            let pz = 0;

            let T1 = mattrans(-px, -py, -pz); // leva pivô pra origem
            let R  = matrotZ(angle);
            let T2 = mattrans(px, py, pz);    // volta

            model = math.multiply(T2,
                    math.multiply(R, T1));
        }



        sendMathJSMatrix(gl, u_modelPtr, model);


        for (let j = 0; j < objetos[i].indexes_triang.length; j++){

            let tex_code = texSrc.indexOf(objetos[i].list_tex[j]);
            if(tex_code < 0) tex_code = 0;

            gl.uniform1i(texPtr, tex_code);

            gl.drawArrays(
                gl.TRIANGLES,
                objetos[i].indexes_triang[j],
                3
            );
        }
    }

    requestAnimationFrame(draw);
}


function audioLatido() {
    const latido = new Audio('latido.mp3');
    latido.preload = "auto";

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'l') {
            latido.currentTime = 0;
            latido.play().catch(() => {});
        }
    });
}
