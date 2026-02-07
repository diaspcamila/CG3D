class Objeto {
    constructor(n_vert, list_vert, list_norm, indexes_triang, list_tex){
        this.n_vert = n_vert;                 // número de vértices
        this.list_ver = list_vert;             // vértices + coordenadas de textura
        this.list_norm = list_norm;            // normais
        this.indexes_triang = indexes_triang;  // índices dos triângulos
        this.list_tex = list_tex;              // texturas por triângulo
    }
}

function paralelepipedo(x, y, z, compr, profund, alt, list_tex) {

    let v1 = [x+compr, y+alt, z+profund];
    let v2 = [x+compr, y+alt, z-profund];
    let v3 = [x+compr, y-alt, z+profund];
    let v4 = [x+compr, y-alt, z-profund];
    let v5 = [x-compr, y+alt, z+profund];
    let v6 = [x-compr, y+alt, z-profund];
    let v7 = [x-compr, y-alt, z+profund];
    let v8 = [x-compr, y-alt, z-profund];

    let list_vert = [
        // face +x
        ...v1.concat([1, 0]), ...v2.concat([0, 0]), ...v3.concat([1, 1]), ...v4.concat([0, 1]), ...v2.concat([0, 0]),
        // face +z
        ...v1.concat([0, 0]), ...v3.concat([0, 1]), ...v5.concat([1, 0]), ...v7.concat([1, 1]), ...v3.concat([0, 1]),
        // face +y
        ...v1.concat([0, 1]), ...v2.concat([1, 1]), ...v5.concat([0, 0]), ...v6.concat([1, 0]), ...v2.concat([1, 1]),
        // face -x
        ...v5.concat([0, 0]), ...v6.concat([1, 0]), ...v7.concat([0, 1]), ...v8.concat([1, 1]), ...v6.concat([1, 0]),
        // face -z
        ...v2.concat([1, 0]), ...v4.concat([1, 1]), ...v6.concat([0, 0]), ...v8.concat([0, 1]), ...v4.concat([1, 1]),
        // face -y
        ...v3.concat([0, 1]), ...v4.concat([1, 1]), ...v7.concat([0, 0]), ...v8.concat([1, 0]), ...v4.concat([1, 1])
    ];

    let list_norm = [
        // +x
        1,0,0, 1,0,0, 1,0,0, 1,0,0, 1,0,0,
        // +z
        0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
        // +y
        0,1,0, 0,1,0, 0,1,0, 0,1,0, 0,1,0,
        // -x
        -1,0,0, -1,0,0, -1,0,0, -1,0,0, -1,0,0,
        // -z
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        // -y
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0
    ];

    return new Objeto(
        30,
        list_vert,
        list_norm,
        [0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 25, 27],
        list_tex
    );
}

// =======================
// ====== SALA ===========
// =======================

var objetos = [];

// dimensões
const largura = 5;
const altura = 2.5;
const profundidade = 6;
const espessura = 0.05;

// texturas (12 triângulos)
const texChao   = Array(12).fill("chao.jpg");
const texParede = Array(12).fill("parede.jpg");

// CHÃO
objetos.push(
    paralelepipedo(
        0, -altura, 0,
        largura, profundidade, espessura,
        texChao
    )
);

// TETO
objetos.push(
    paralelepipedo(
        0, altura, 0,
        largura, profundidade, espessura,
        texParede
    )
);

// PAREDE FUNDO
objetos.push(
    paralelepipedo(
        0, 0, -profundidade,
        largura, espessura, altura,
        texParede
    )
);

objetos.push(
    paralelepipedo(
        0, 0.4, -3,   // levemente mais à frente
        2.55,           // um pouco mais larga
        0.08,           // mais espessa
        0.85,           // mais alta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0,     // x (centro da parede)
        0.4,   // y (altura da lousa)
        -2.95, // z (parede da frente)
        2.5,   // largura
        0.05,  // profundidade (bem fininha)
        0.8,   // altura
        [
            "lousa.jpg","lousa.jpg","lousa.jpg",
            "lousa.jpg","lousa.jpg","lousa.jpg",
            "lousa.jpg","lousa.jpg","lousa.jpg",
            "lousa.jpg","lousa.jpg","lousa.jpg"
        ]
    )
);

objetos.push(
    paralelepipedo(
        0,        // x (centralizado)
        -0.6,     // y (altura do tampo)
        -1.8,     // z (frente da lousa)
        1.2,      // largura
        0.5,      // profundidade
        0.04,     // espessura
        Array(12).fill("madeira.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -0.9,     // x
        -1.1,     // y
        -1.8,     // z
        0.04,     // largura
        0.45,     // profundidade
        0.45,     // altura
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0.9,      // x
        -1.1,     // y
        -1.8,     // z
        0.04,
        0.45,
        0.45,
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0,
        -0.7,
        -1.35,    // mais pra frente
        0.83,
        0.05,
        0.1,
        Array(12).fill("madeira.jpg")
    )
);


// PAREDE FRENTE
objetos.push(
    paralelepipedo(
        0, 0, profundidade,
        largura, espessura, altura,
        texParede
    )
);

// PAREDE ESQUERDA
objetos.push(
    paralelepipedo(
        -largura, 0, 0,
        espessura, profundidade, altura,
        texParede
    )
);

// PAREDE DIREITA
objetos.push(
    paralelepipedo(
        largura, 0, 0,
        espessura, profundidade, altura,
        texParede
    )
);

// =======================
// AJUSTES FINAIS (NÃO MEXER)
// =======================

var coords = [];
var vert_count = 0;

for (let i = 0; i < objetos.length; i++){
    coords.push(...objetos[i].list_ver);

    for (let j = 0; j < objetos[i].indexes_triang.length; j++){
        objetos[i].indexes_triang[j] += vert_count;
    }
    vert_count += objetos[i].n_vert;
}

var coordTriangles = new Float32Array(coords);
