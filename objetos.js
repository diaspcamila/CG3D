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

function tampoTrapezioMesa(x, y, z, larguraFrente, larguraTras, profund, esp, textura) {

    // y cima e baixo
    let yC = y + esp;
    let yB = y - esp;

    // z frente e trás
    let zF = z + profund;
    let zT = z - profund;

    // x frente (mais largo)
    let xf = larguraFrente / 2;
    let xt = larguraTras / 2;

    // ===== VÉRTICES =====
    let v1 = [ x+xf, yC, zF]; // frente direita cima
    let v2 = [ x-xf, yC, zF]; // frente esquerda cima
    let v3 = [ x+xt, yC, zT]; // trás direita cima
    let v4 = [ x-xt, yC, zT]; // trás esquerda cima

    let v5 = [ x+xf, yB, zF];
    let v6 = [ x-xf, yB, zF];
    let v7 = [ x+xt, yB, zT];
    let v8 = [ x-xt, yB, zT];

    let list_vert = [
        // TAMPO (cima)
        ...v1.concat([1,0]), ...v2.concat([0,0]), ...v3.concat([1,1]),
        ...v2.concat([0,0]), ...v4.concat([0,1]), ...v3.concat([1,1]),

        // FUNDO
        ...v5.concat([1,0]), ...v7.concat([1,1]), ...v6.concat([0,0]),
        ...v6.concat([0,0]), ...v7.concat([1,1]), ...v8.concat([0,1]),

        // FRENTE
        ...v1.concat([1,0]), ...v5.concat([1,1]), ...v2.concat([0,0]),
        ...v2.concat([0,0]), ...v5.concat([1,1]), ...v6.concat([0,1]),

        // TRÁS
        ...v3.concat([1,0]), ...v4.concat([0,0]), ...v7.concat([1,1]),
        ...v4.concat([0,0]), ...v8.concat([0,1]), ...v7.concat([1,1]),

        // LADO DIREITO
        ...v1.concat([0,0]), ...v3.concat([1,0]), ...v5.concat([0,1]),
        ...v5.concat([0,1]), ...v3.concat([1,0]), ...v7.concat([1,1]),

        // LADO ESQUERDO
        ...v2.concat([1,0]), ...v6.concat([1,1]), ...v4.concat([0,0]),
        ...v4.concat([0,0]), ...v6.concat([1,1]), ...v8.concat([0,1]),
    ];

    let list_norm = Array(36).fill(0).flatMap(() => [0,1,0]);

    let indexes = [];
    for(let i=0;i<36;i+=3) indexes.push(i);

    return new Objeto(
        36,
        list_vert,
        list_norm,
        indexes,
        Array(12).fill(textura)
    );
}

function carteiraAluno(cx, cz){
    objetos.push(
        paralelepipedo(cx, -1.8, cz, 0.35, 0.35, 0.03, Array(12).fill("preto.jpg"))
    );

    objetos.push(
        paralelepipedo(cx, -1.35, cz + 0.27, 0.35, 0.05, 0.2, Array(12).fill("preto.jpg"))
    );

    objetos.push(
        paralelepipedo(cx + 0.15, -1.5, cz-0.15, 0.3, 0.2, 0.02, Array(12).fill("mesa.jpg"))
    );

    objetos.push(
        paralelepipedo(cx + 0.35, -1.65, cz, 0.02, 0.02, 0.15, Array(12).fill("preto.jpg"))
    );

    objetos.push(
        paralelepipedo(cx + 0.35, -1.65, cz-0.15, 0.02, 0.02, 0.15, Array(12).fill("preto.jpg"))
    );

    // pernas
    objetos.push(paralelepipedo(cx - 0.25, -2, cz + 0.25, 0.03, 0.03, 0.46, Array(12).fill("cinza.jpg")));
    objetos.push(paralelepipedo(cx + 0.25, -2, cz + 0.25, 0.03, 0.03, 0.46, Array(12).fill("cinza.jpg")));
    objetos.push(paralelepipedo(cx - 0.25, -2.2, cz - 0.25, 0.03, 0.03, 0.41, Array(12).fill("cinza.jpg")));
    objetos.push(paralelepipedo(cx + 0.25, -2.2, cz - 0.25, 0.03, 0.03, 0.41, Array(12).fill("cinza.jpg")));
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
        0, 0.1, -5.9,   // levemente mais à frente
        3.7,           // um pouco mais larga
        0.08,           // mais espessa
        0.9,           // mais alta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0,     // x (centro da parede)
        0.1,   // y (altura da lousa)
        -5.8, // z (parede da frente)
        3.6,   // largura
        0.03,  // profundidade (bem fininha)
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
    tampoTrapezioMesa(
        0,        // x
        -1.19,       // y
        -3.5,     // z (perto do quadro)
        2.1,      // largura da frente
        3,      // largura de trás
        0.7,      // profundidade
        0.04,     // espessura
        "mesa.jpg"
    )
);


// ===== PÉ FRENTE ESQUERDA =====
objetos.push(
    paralelepipedo(
        -0.85,   // x
        -2.0,    // y
        -3,    // z (frente)
        0.08,    // largura (mais fino)
        0.08,    // profundidade
        0.84,     // altura
        Array(12).fill("cinza.jpg")
    )
);

// ===== PÉ FRENTE DIREITA =====
objetos.push(
    paralelepipedo(
        0.85,
        -2.0,
        -3,
        0.08,
        0.08,
        0.84,
        Array(12).fill("cinza.jpg")
    )
);

// ===== PÉ TRÁS ESQUERDA =====
objetos.push(
    paralelepipedo(
        -1.3,
        -2.0,
        -4,    // z (trás)
        0.08,
        0.08,
        0.84,
        Array(12).fill("cinza.jpg")
    )
);

// ===== PÉ TRÁS DIREITA =====
objetos.push(
    paralelepipedo(
        1.3,
        -2.0,
        -4,
        0.08,
        0.08,
        0.84,
        Array(12).fill("cinza.jpg")
    )
);


objetos.push(
    paralelepipedo(
        0,
        -1.5,
        -3.02,    // mais pra frente
        0.855,
        0.05,
        0.3,
        Array(12).fill("cinza.jpg")
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

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        -1,    // y → metade da altura da porta
        4.5,     // z → posição ao longo da parede
        0.05,     // espessura (parede)
        0.6,      // largura da porta
        2,      // altura da porta
        Array(12).fill("madeira.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        -1,    // y → metade da altura da porta
        3.29,     // z → posição ao longo da parede
        0.05,     // espessura (parede)
        0.6,      // largura da porta
        2,      // altura da porta
        Array(12).fill("cinza.jpg")
    )
);

// =======================
// CADEIRA DO PROFESSOR
// =======================
let cxp = 0;
let czp = -4.3;

// assento
objetos.push(
    paralelepipedo(cxp, -1.75, czp, 0.4, 0.4, 0.05, Array(12).fill("preto.jpg"))
);

// encosto
objetos.push(
    paralelepipedo(cxp, -1.3, czp - 0.35, 0.4, 0.05, 0.35, Array(12).fill("preto.jpg"))
);

// pernas
objetos.push(paralelepipedo(cxp - 0.3, -2.2, czp + 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp + 0.3, -2.2, czp + 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp - 0.3, -2.2, czp - 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp + 0.3, -2.2, czp - 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));


// =======================
// COMPUTADOR (MESA)
// =======================

// base
objetos.push(
    paralelepipedo(
        0.2,        // x
        -1.13,       // y (em cima da mesa)
        -3.65,       // z
        0.35,
        0.2,
        0.02,
        Array(12).fill("cinza.jpg")
    )
);

// monitor
objetos.push(
    paralelepipedo(
        0.2,
        -0.9,
        -3.45,
        0.35,
        0.02,
        0.25,
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0.2,
        -0.9,
        -3.47,
        0.3,
        0.01,
        0.2,
        Array(12).fill("cachorro.png")
    )
);

// =======================
// PROJETOR
// =======================
objetos.push(
    paralelepipedo(
        -0.5,
        -1.05,
        -3.25,
        0.25,
        0.18,
        0.08,
        [
            "parede.jpg","parede.jpg", 
            "parede.jpg","parede.jpg", 
            "parede.jpg","parede.jpg", 
            "parede.jpg","parede.jpg",
            "projetor.jpg","projetor.jpg", 
            "parede.jpg","parede.jpg"  
        ]
    )
);


objetos.push(
    paralelepipedo(
        -4.8,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        3.29,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.35,      // largura da porta
        0.45,      // altura da porta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.79,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        3.29,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.3,      // largura da porta
        0.4,      // altura da porta
        Array(12).fill("jan-porta.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.65,    // x → parede esquerda
        1.2,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.03,     // espessura (parede)
        6,      // largura da porta
        0.03,      // altura da porta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -5.1,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -4.2,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -3.3,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -2.4,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -1.5,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        -0.6,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        0.6,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        1.5,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        2.4,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        3.3,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        4.2,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        1.67,    // y → metade da altura da porta
        5.1,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.4,      // largura da porta
        0.27,      // altura da porta
        Array(12).fill("jan-cima.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.91,    // x → parede esquerda
        1.8,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        6,      // largura da porta
        0.4,      // altura da porta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.8,    // x → parede esquerda
        -0.8,    // y → metade da altura da porta
        3.7,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.08,      // largura da porta
        0.18,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.75,    // x → parede esquerda
        0,    // y → metade da altura da porta
        5.8,     // z → posição ao longo da parede
        0.2,     // espessura (parede)
        0.2,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9,    // x → parede esquerda
        2.25,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.02,     // espessura (parede)
        6,      // largura da porta
        0.3,      // altura da porta
        Array(12).fill("coluna.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.75,    // x → parede esquerda
        0,    // y → metade da altura da porta
        -5.8,     // z → posição ao longo da parede
        0.2,     // espessura (parede)
        0.2,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0, 
        2.2, 
        -5.8,   // levemente mais à frente
        5,           // um pouco mais larga
        0.21,           // mais espessa
        0.25,           // mais alta
        Array(12).fill("coluna.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0, 
        2.2, 
        5.9,   // levemente mais à frente
        5,           // um pouco mais larga
        0.1,           // mais espessa
        0.25,           // mais alta
        Array(12).fill("coluna.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0, 
        2.2, 
        0,   // levemente mais à frente
        5,           // um pouco mais larga
        0.21,           // mais espessa
        0.25,           // mais alta
        Array(12).fill("coluna.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        0,    // y → metade da altura da porta
        5.9,     // z → posição ao longo da parede
        0.1,     // espessura (parede)
        1,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        0,    // y → metade da altura da porta
        -5.8,     // z → posição ao longo da parede
        0.1,     // espessura (parede)
        1,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        0,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.1,     // espessura (parede)
        0.2,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        -1.6,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.11,     // espessura (parede)
        6,      // largura da porta
        0.9,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        0,    // y → metade da altura da porta
        2.6,     // z → posição ao longo da parede
        0.1,     // espessura (parede)
        0.8,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.85,    // x → parede esquerda
        0,    // y → metade da altura da porta
        -2.6,     // z → posição ao longo da parede
        0.1,     // espessura (parede)
        0.8,      // largura da porta
        3,      // altura da porta
        Array(12).fill("parede.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.45,    // x → parede esquerda
        1.8,    // y → metade da altura da porta
        0,     // z → posição ao longo da parede
        0.03,     // espessura (parede)
        6,      // largura da porta
        0.03,      // altura da porta
        Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.75,    // x → parede esquerda
        1.5,    // y → metade da altura da porta
        -2.6,     // z → posição ao longo da parede
        0.3,     // espessura (parede)
        0.75,      // largura da porta
        0.25,      // altura da porta
        Array(12).fill("arcondicionado.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.9,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        -1,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.8,      // largura da porta
        1,      // altura da porta
        Array(12).fill("janela.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.9,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        -4,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.8,      // largura da porta
        1,      // altura da porta
        Array(12).fill("janela.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.9,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        1,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.8,      // largura da porta
        1,      // altura da porta
        Array(12).fill("janela.jpg")
    )
);

objetos.push(
    paralelepipedo(
        4.9,    // x → parede esquerda
        0.2,    // y → metade da altura da porta
        4.1,     // z → posição ao longo da parede
        0.01,     // espessura (parede)
        0.8,      // largura da porta
        1,      // altura da porta
        Array(12).fill("janela.jpg")
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

let colunasX = [-2.5, 0, 2.5];
let filasZ   = [5, 3, 1, -1];

for(let f = 0; f < filasZ.length; f++){
    for(let c = 0; c < colunasX.length; c++){
        carteiraAluno(colunasX[c], filasZ[f]);
    }
}

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
