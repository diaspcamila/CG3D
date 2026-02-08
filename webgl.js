var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png", "chao.jpg", "parede.jpg", "lousa.jpg", "cinza.jpg", "madeira.jpg", "coluna.jpg", "janela.jpg", "arcondicionado.jpg", "jan-porta.jpg", "jan-cima.jpg", "projetor.jpg", "preto.jpg", "mesa.jpg"]
var loadTexs = 0;
var gl;
var prog;

var u_modelPtr, u_viewPtr, u_projectionPtr;
var lightposPtr, camposPtr;

// ====== CÂMERA (VISÃO DE CACHORRO) ======
var camPos = [0, -1.3, 3];   // >>> ALTERAÇÃO <<<
var yaw = -90;             // >>> ALTERAÇÃO <<<
var pitch = 0;             // >>> ALTERAÇÃO <<<

var speed = 0.08;
var turnSpeed = 2;

var keys = {};

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
    var transposed = math.transpose(matrix);
    var flatArray = transposed.toArray().flat(); 
    gl.uniformMatrix4fv(location, false, new Float32Array(flatArray));
}

function draw()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // ===== MOVIMENTO =====
    var rad = yaw * Math.PI / 180;

    if (keys["w"]) {
        camPos[0] += Math.cos(rad) * speed;
        camPos[2] += Math.sin(rad) * speed;
    }
    if (keys["s"]) {
        camPos[0] -= Math.cos(rad) * speed;
        camPos[2] -= Math.sin(rad) * speed;
    }
    if (keys["a"]) {
        camPos[0] += Math.sin(rad) * speed;
        camPos[2] -= Math.cos(rad) * speed;
    }
    if (keys["d"]) {
        camPos[0] -= Math.sin(rad) * speed;
        camPos[2] += Math.cos(rad) * speed;
    }

    // ===== ROTACAO =====
    if (keys["arrowleft"])  yaw -= turnSpeed;
    if (keys["arrowright"]) yaw += turnSpeed;
    if (keys["arrowup"])    pitch += turnSpeed;
    if (keys["arrowdown"])  pitch -= turnSpeed;
    

    // limita pra não virar de cabeça pra baixo
    pitch = Math.max(-89, Math.min(89, pitch));

    // ====== DIREÇÃO DA CÂMERA ======
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

    var viewMatrix = lookAt(camPos, camTarget, camUp);
    sendMathJSMatrix(gl, u_viewPtr, viewMatrix);

    var aspect = gl.canvas.width / gl.canvas.height;
    var projMatrix = createPerspective(45, aspect, 0.1, 100);
    sendMathJSMatrix(gl, u_projectionPtr, projMatrix);

    sendMathJSMatrix(gl, u_modelPtr, math.identity(4));

    var texPtr = gl.getUniformLocation(prog, "tex");

    for (let i = 0; i < objetos.length; i++){
        for (let j = 0; j < objetos[i].indexes_triang.length; j++){
            let tex_code = texSrc.indexOf(objetos[i].list_tex[j]);
            if(tex_code < 0) tex_code = 0;
            gl.uniform1i(texPtr, tex_code);
            gl.drawArrays(gl.TRIANGLES, objetos[i].indexes_triang[j], 3);
        }
    }

    requestAnimationFrame(draw);
}

function audioLatido(){
    latido = new Audio('latido.mp3');
    latido.preload = "auto";

    const btn = document.getElementById('btnLatido');
    if(!btn) return;

    btn.addEventListener('click', () => {
        latido.currentTime = 0;
        latido.play().catch(function () {});
    });
}