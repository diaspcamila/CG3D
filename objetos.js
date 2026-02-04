class Objeto {
    constructor(n_vert, list_vert, indexes_triang, list_tex){
        this.n_vert = n_vert; //número de vértices no objeto
        this.list_ver = list_vert; //lista de vértices incluindo o mapeamento de textura (5 números por vértice)
        this.indexes_triang = indexes_triang; //índices da lista de vértices onde começa cada triângulo do modelo (esse e os 2 vértices seguintes serão o triângulo)
        this.list_tex = list_tex; //lista com os nomes das texturas de cada triângulo, na mesma ordem que aparecem na lista de vértices
    }
}

function paralelepipedo(x, y, z, compr, profund, alt, list_text, map_tex) {
    //retorna Objeto com base no input
    return;
}

var objetos = [];
//======OBJETOS:=======

objetos.push(new Objeto( //objeto exemplo 1
    15,

    //Quad1
    [-0.4,  0.4, 0.0, 0.0, 0.0,
    -0.4, -0.4, 0.0, 0.0, 1.0,
    0.4, -0.4, 0.0, 1.0, 1.0,
    0.4,  0.4, 0.0, 1.0, 0.0,
    -0.4,  0.4, 0.0, 0.0, 0.0,
    //Quad 2
    -0.4, -0.4, 0.0, 1.0, 1.0,
    -0.4,  0.4, 0.0, 1.0, 0.0,
    -0.4,  0.4, 1.0, 0.0, 0.0,
    -0.4, -0.4, 1.0, 0.0, 1.0,
    -0.4, -0.4, 0.0, 1.0, 1.0,
    //Quad 3
    0.4, -0.4, 1.0, 1.0, 1.0,
    0.4, -0.4, 0.0, 1.0, 0.0,
    -0.4, -0.4, 0.0, 0.0, 0.0,
    -0.4, -0.4, 1.0, 0.0, 1.0,
    0.4, -0.4, 1.0, 1.0, 1.0],

    [0, 2, 5, 7, 10, 12],

    ["gato.jpg", "gato.jpg", "cachorro.png", "cachorro.png", "gato.jpg", "cachorro.png"]
));

objetos.push(new Objeto( //objeto exemplo 2 (cubo de gatos pequeno)
    30,

    //Quad1
    [-0.2,  0.2, 0.1, 0.0, 0.0,
    -0.2, -0.2, 0.1, 0.0, 1.0,
    0.2, -0.2, 0.1, 1.0, 1.0,
    0.2,  0.2, 0.1, 1.0, 0.0,
    -0.2,  0.2, 0.1, 0.0, 0.0,
    //Quad 2
    -0.2, -0.2, 0.1, 1.0, 1.0,
    -0.2,  0.2, 0.1, 1.0, 0.0,
    -0.2,  0.2, 0.5, 0.0, 0.0,
    -0.2, -0.2, 0.5, 0.0, 1.0,
    -0.2, -0.2, 0.1, 1.0, 1.0,
    //Quad 3
    0.2, -0.2, 0.5, 1.0, 1.0,
    0.2, -0.2, 0.1, 1.0, 0.0,
    -0.2, -0.2, 0.1, 0.0, 0.0,
    -0.2, -0.2, 0.5, 0.0, 1.0,
    0.2, -0.2, 0.5, 1.0, 1.0,
    //Quad4
    0.2,  -0.2, 0.5, 0.0, 0.0,
    0.2, 0.2, 0.5, 0.0, 1.0,
    -0.2, 0.2, 0.5, 1.0, 1.0,
    -0.2,  -0.2, 0.5, 1.0, 0.0,
    0.2,  -0.2, 0.5, 0.0, 0.0,
    //Quad 5
    0.2, 0.2, 0.5, 1.0, 1.0,
    0.2,  -0.2, 0.5, 1.0, 0.0,
    0.2,  -0.2, 0.1, 0.0, 0.0,
    0.2, 0.2, 0.1, 0.0, 1.0,
    0.2, 0.2, 0.5, 1.0, 1.0,
    //Quad 6
    -0.2, 0.2, 0.1, 1.0, 1.0,
    -0.2, 0.2, 0.5, 1.0, 0.0,
    0.2, 0.2, 0.5, 0.0, 0.0,
    0.2, 0.2, 0.1, 0.0, 1.0,
    -0.2, 0.2, 0.1, 1.0, 1.0],

    [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27],

    ["gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg", "gato.jpg"]
));











//ajustes:
var coords = [];
var vert_count = 0;
for (i = 0; i < objetos.length; i++){
    coords.push(...objetos[i].list_ver); //somando os vértices de cada objeto pra lista principal
    for (j = 0; j < objetos[i].indexes_triang.length; j++){
        objetos[i].indexes_triang[j] += vert_count; //corrigindo o índice de triângulo para que ele ainda valer na lista principal
    }
    vert_count += objetos[i].n_vert;
}
var coordTriangles = new Float32Array(coords);//lista com todos os vértices
