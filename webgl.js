var teximg = [];
var texSrc = ["gato.jpg", "cachorro.png"]; //LISTAR TODAS AS TEXTURAS AQUI -leticia
var loadTexs = 0;
var gl;
var prog;

var u_modelPtr, u_viewPtr, u_projectionPtr;
var lightposPtr, camposPtr;

var angle = 0;

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
    if(gl)
    {
        //Inicializa shaders
        var vtxShSrc = document.getElementById("vertex-shader").text;
        var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        prog = createProgram(gl, vtxShader, fragShader);

        gl.useProgram(prog);

        //Inicializa área de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0.5, 0.5, 0.5, 1);
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );
        gl.enable(gl.DEPTH_TEST);
        //gl.enable(gl.CULL_FACE);

    }
}

function configScene()
{
    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    //Pega ponteiro para o atributo "position" do vertex shader
    var positionPtr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionPtr);

    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(
        positionPtr,
        3,        //quantidade de dados em cada processamento
        gl.FLOAT, //tipo de cada dado (tamanho)
        false,    //não normalizar
        5*4,      //tamanho do bloco de dados a processar em cada passo
                    //0 indica que o tamanho do bloco é igual a tamanho
                    //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
        0         //salto inicial (em bytes)
    );

    var texcoordPtr = gl.getAttribLocation(prog, "texCoord");
    gl.enableVertexAttribArray(texcoordPtr);

    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(texcoordPtr,
        2,        //quantidade de dados em cada processamento
        gl.FLOAT, //tipo de cada dado (tamanho)
        false,    //não normalizar
        5*4,      //tamanho do bloco de dados a processar em cada passo
                    //0 indica que o tamanho do bloco é igual a tamanho
                    //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
        3*4       //salto inicial (em bytes)
    );

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
    //submeter textura para gpu
    //(infelizmente acho q isso aqui tem q simplesmente repetir pra cada textura nova -leticia)
    var tex0 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex0);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[0]);

    var tex1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, tex1);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, teximg[1]);

    u_modelPtr = gl.getUniformLocation(prog, "u_model");
    u_viewPtr = gl.getUniformLocation(prog, "u_view");
    u_projectionPtr = gl.getUniformLocation(prog, "u_projection");
    
    lightposPtr = gl.getUniformLocation(prog, "lightpos");
    camposPtr = gl.getUniformLocation(prog, "campos");
}

function sendMathJSMatrix(gl, location, matrix) {
    // transpoe matriz, webgl le as matrizes coluna por coluna
    var transposed = math.transpose(matrix);
    var flatArray = transposed.toArray().flat(); 
    gl.uniformMatrix4fv(location, false, new Float32Array(flatArray));
}

function draw()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    var camPos = [0,2,5];
    var camTarget = [0,0,0];
    var camUp = [0,1,0];
    var lightPos = [5.0, 5.0, 5.0];

    gl.uniform3fv(lightposPtr, lightPos);
    gl.uniform3fv(camposPtr, camPos);

    var viewMatrix = lookAt(camPos, camTarget, camUp);
    sendMathJSMatrix(gl, u_viewPtr, viewMatrix);

    var aspect = gl.canvas.width / gl.canvas.height;
    var projMatrix = createPerspective(45, aspect, 0.1, 100.0);
    sendMathJSMatrix(gl, u_projectionPtr, projMatrix);

    var modelMatrix = matrotY(angle); 
    gl.uniformMatrix4fv(u_modelPtr, false, new Float32Array(modelMatrix));

    //desenha triângulos - executa shaders
    var texPtr = gl.getUniformLocation(prog, "tex");
    for (i = 0; i < objetos.length; i++){ //iterando entre cada objeto
        for (j = 0; j < objetos[i].indexes_triang.length; j++){ //iterando entre cada triangulo
            let tex_code = texSrc.indexOf(objetos[i].list_tex[j]);
            if(tex_code == -1) tex_code = 0; 

            gl.uniform1i(texPtr, tex_code);
            gl.drawArrays(gl.TRIANGLES, objetos[i].indexes_triang[j], 3);
        }   
    }
    angle++;

    requestAnimationFrame(draw);
}
