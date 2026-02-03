var angle = 0

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

    alert("Erro de compilaÃ§Ã£o: " + gl.getShaderInfoLog(shader));

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

    var canvas = document.getElementById("glcanvas1");

    var gl = getGL(canvas);
    if(gl)
    {
        //Inicializa shaders
        var vtxShSrc = document.getElementById("vertex-shader").text;
        var fragShSrc = document.getElementById("frag-shader").text;

        var vtxShader = createShader(gl, gl.VERTEX_SHADER, vtxShSrc);
        var fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragShSrc);
        var prog = createProgram(gl, vtxShader, fragShader);

        gl.useProgram(prog);

        //Inicializa Ã¡rea de desenho: viewport e cor de limpeza; limpa a tela
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 1);
        gl.enable( gl.BLEND );
        gl.blendFunc( gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA );

    }
    //Define coordenadas dos triÃ¢ngulos
    var coordTriangles = new Float32Array([
        -0.5,  -0.5, 1.0, 0.0, 0.0, 1.0,
        0.5,  -0.5, 0.0, 1.0, 0.0, 1.0,
        0.0,   1.0, 0.0, 0.0, 1.0, 1.0,
        -1.0,   0.0, 1.0, 1.0, 0.0, 0.7,
        1.0,   0.0, 1.0, 0.0, 1.0, 0.7,
        0.0,   0.5, 0.0, 1.0, 1.0, 0.7
    ]);

    //Cria buffer na GPU e copia coordenadas para ele
    var bufPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufPtr);
    gl.bufferData(gl.ARRAY_BUFFER, coordTriangles, gl.STATIC_DRAW);

    //Pega ponteiro para o atributo "position" do vertex shader
    var positionPtr = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(positionPtr);
    //Especifica a cÃ³pia dos valores do buffer para o atributo
    gl.vertexAttribPointer(positionPtr,
                           2,        //quantidade de dados em cada processamento
                           gl.FLOAT, //tipo de cada dado (tamanho)
    false,    //nÃ£o normalizar
    6*4,      //tamanho do bloco de dados a processar em cada passo
    //0 indica que o tamanho do bloco Ã© igual a tamanho
    //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
    0         //salto inicial (em bytes)
    );

    var colorPtr = gl.getAttribLocation(prog, "color");
    gl.enableVertexAttribArray(colorPtr);
    //Especifica a cÃ³pia dos valores do buffer para o atributo
    gl.vertexAttribPointer(colorPtr,
                           4,        //quantidade de dados em cada processamento
                           gl.FLOAT, //tipo de cada dado (tamanho)
    false,    //nÃ£o normalizar
    6*4,      //tamanho do bloco de dados a processar em cada passo
    //0 indica que o tamanho do bloco Ã© igual a tamanho
    //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
    2*4       //salto inicial (em bytes)
    );


    gl.clear( gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    var normals = new Float32Array([
        //Quad 1
        					0, 0, 1,
        					0, 0, 1,
        					0, 0, 1,
        					0, 0, 1,
        					0, 0, 1,
        					
        					//Quad 2
        					1, 0, 0,
        					1, 0, 0,
        					1, 0, 0,
        					1, 0, 0,
        					1, 0, 0,
        					
        					//Quad 3
        					0, 1, 0,
        					0, 1, 0,
        					0, 1, 0,
        					0, 1, 0,
        					0, 1, 0
    ]);

    //Cria buffer na GPU e copia coordenadas para ele
    var bufnormalPtr = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufnormalPtr);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        
    //Pega ponteiro para o atributo "position" do vertex shader
    var normalPtr = gl.getAttribLocation(prog, "normal");
    gl.enableVertexAttribArray(normalPtr);
    //Especifica a cópia dos valores do buffer para o atributo
    gl.vertexAttribPointer(normalPtr, 
      					   3,        //quantidade de dados em cada processamento
       					   gl.FLOAT, //tipo de cada dado (tamanho)
       					   false,    //não normalizar
       					   0,      //tamanho do bloco de dados a processar em cada passo
       					             //0 indica que o tamanho do bloco é igual a tamanho
       					             //lido (2 floats, ou seja, 2*4 bytes = 8 bytes)
       					   0         //salto inicial (em bytes)
       					  );
        					  
    var lightDirectionPtr = gl.getUniformLocation(prog, "lightDirection");
    gl.uniform3fv(lightDirectionPtr, [0, 0, -1]/*[-0.2, -1, -0.7]*/);
        
    var lightColorPtr = gl.getUniformLocation(prog, "lightColor");
    gl.uniform3fv(lightColorPtr, [1, 1, 1]);
        
    var lightposPtr = gl.getUniformLocation(prog, "lightpos");
    gl.uniform3fv(lightposPtr, [0.25, 0.0, 0.5]);
        
    var camposPtr = gl.getUniformLocation(prog, "campos");
    gl.uniform3fv(camposPtr, campos);
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
