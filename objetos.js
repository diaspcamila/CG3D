class Objeto {
    constructor(n_vert, list_vert, list_norm, indexes_triang, list_tex){
        this.n_vert = n_vert; //número de vértices no objeto
        this.list_ver = list_vert; //lista de vértices incluindo o mapeamento de textura (5 números por vértice)
        this.list_norm = list_norm; //lista de normais para cada vértice, na mesma ordem
        this.indexes_triang = indexes_triang; //índices da lista de vértices onde começa cada triângulo do modelo (esse e os 2 vértices seguintes serão o triângulo)
        this.list_tex = list_tex; //lista com os nomes das texturas de cada triângulo, na mesma ordem que aparecem na lista de vértices
    }
}

function paralelepipedo(x, y, z, compr, profund, alt, list_tex) { //retorna Objeto com base no input
    let v1 = [x+compr, y+alt, z+profund];
    let v2 = [x+compr, y+alt, z-profund];
    let v3 = [x+compr, y-alt, z+profund];
    let v4 = [x+compr, y-alt, z-profund];
    let v5 = [x-compr, y+alt, z+profund];
    let v6 = [x-compr, y+alt, z-profund];
    let v7 = [x-compr, y-alt, z+profund];
    let v8 = [x-compr, y-alt, z-profund];

    let list_vert = [
        ...v1.concat([1, 0]), ...v2.concat([0, 0]), ...v3.concat([1, 1]), ...v4.concat([0, 1]), ...v2.concat([0, 0]), //face +x
        ...v1.concat([0, 0]), ...v3.concat([0, 1]), ...v5.concat([1, 0]), ...v7.concat([1, 1]), ...v3.concat([0, 1]), //face +z
        ...v1.concat([0, 1]), ...v2.concat([1, 1]), ...v5.concat([0, 0]), ...v6.concat([1, 0]), ...v2.concat([1, 1]), //face +y
        ...v5.concat([0, 0]), ...v6.concat([1, 0]), ...v7.concat([0, 1]), ...v8.concat([1, 1]), ...v6.concat([1, 0]), //face -x
        ...v2.concat([1, 0]), ...v4.concat([1, 1]), ...v6.concat([0, 0]), ...v8.concat([0, 1]), ...v4.concat([1, 1]), //face -z
        ...v3.concat([0, 1]), ...v4.concat([1, 1]), ...v7.concat([0, 0]), ...v8.concat([1, 0]), ...v4.concat([1, 1])  //face -y
    ]
    let list_norm = [
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0
    ]
    return new Objeto(30, list_vert, list_norm, [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27], list_tex);
}

var objetos = [];
//======OBJETOS:=======

//objeto exemplo 1: cubo de gatos
//ordem das texturas: face +x, face +z, face +y, face -x, face -z, face -y
objetos.push(paralelepipedo(0, -1, 0, 1, 1, 0.1,["gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg"]));
objetos.push(paralelepipedo(1, -0.5, 1, 0.1, 0.1, 0.5,["gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg"]));
objetos.push(paralelepipedo(-1, -0.5, -1, 0.1, 0.1, 0.5,["gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg","gato.jpg"]));

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
