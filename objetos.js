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


var objetos = [];

// dimensões
const largura = 5;
const altura = 2.5;
const profundidade = 6;
const espessura = 0.05;

// CHÃO
objetos.push(
    paralelepipedo(
        0, -altura, 0, largura, profundidade, espessura, Array(12).fill("chao.jpg")
    )
);

// TETO
objetos.push(
    paralelepipedo(
        0, altura, 0, largura, profundidade, espessura, Array(12).fill("parede.jpg")
    )
);

// PAREDE FUNDO
objetos.push(
    paralelepipedo(
        0, 0, -profundidade, largura, espessura, altura, Array(12).fill("parede.jpg")
    )
);

// PAREDE FRENTE
objetos.push(
    paralelepipedo(
        0, 0, profundidade, largura, espessura, altura, Array(12).fill("parede.jpg")
    )
);

// PAREDE ESQUERDA
objetos.push(
    paralelepipedo(
        -largura, 0, 0, espessura, profundidade, altura, Array(12).fill("parede.jpg")
    )
);

// PAREDE DIREITA
objetos.push(
    paralelepipedo(
        largura, 0, 0, espessura, profundidade, altura, Array(12).fill("parede.jpg")
    )
);

//moldura lousa
objetos.push(
    paralelepipedo(
        0, 0.1, -5.9, 3.7, 0.08, 0.9, Array(12).fill("cinza.jpg")
    )
);

//lousa
objetos.push(
    paralelepipedo(
        0, 0.1, -5.8, 3.6, 0.03, 0.8, Array(12).fill("lousa.jpg")
    )
);

//mesa professor
objetos.push(
    tampoTrapezioMesa(
        0, -1.19, -3.5, 2.1, 3, 0.7, 0.04, "mesa.jpg"
    )
);

objetos.push(
    paralelepipedo(
        -0.85, -2.0, -3, 0.08, 0.08, 0.84, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0.85, -2.0, -3, 0.08, 0.08, 0.84, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -1.3, -2.0, -4, 0.08, 0.08, 0.84, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        1.3, -2.0, -4, 0.08, 0.08, 0.84, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0, -1.5, -3.02, 0.855, 0.05, 0.3, Array(12).fill("cinza.jpg")
    )
);
//fim mesa professor 

// cadeira professor
let cxp = 0;
let czp = -4.3;

objetos.push(
    paralelepipedo(cxp, -1.75, czp, 0.4, 0.4, 0.05, Array(12).fill("preto.jpg"))
);

objetos.push(
    paralelepipedo(cxp, -1.3, czp - 0.35, 0.4, 0.05, 0.35, Array(12).fill("preto.jpg"))
);

objetos.push(paralelepipedo(cxp - 0.3, -2.2, czp + 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp + 0.3, -2.2, czp + 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp - 0.3, -2.2, czp - 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
objetos.push(paralelepipedo(cxp + 0.3, -2.2, czp - 0.3, 0.04, 0.04, 0.45, Array(12).fill("cinza.jpg")));
//fim cadeira professor

//computador
objetos.push(
    paralelepipedo(
        0.2, -1.13, -3.65, 0.35, 0.2, 0.02, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0.2, -0.9, -3.45, 0.35, 0.02, 0.25, Array(12).fill("cinza.jpg")
    )
);

objetos.push(
    paralelepipedo(
        0.2, -0.9, -3.47, 0.3, 0.01, 0.2, Array(12).fill("cachorro.png")
    )
);
//fim computador

//projetor
objetos.push(
    paralelepipedo(
        -0.5, -1.05, -3.25, 0.25, 0.18, 0.08,
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

//porta
objetos.push(
    paralelepipedo(
        -4.9, -1, 4.5, 0.05, 0.6, 2, Array(12).fill("madeira.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.9, -1, 3.29, 0.05, 0.6, 2, Array(12).fill("mesa.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.8, 0.2, 3.29, 0.01, 0.35, 0.45, Array(12).fill("mesa.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.79, 0.2, 3.29, 0.01, 0.3, 0.4, Array(12).fill("jan-porta.jpg")
    )
);

objetos.push(
    paralelepipedo(
        -4.8, -0.8, 3.7, 0.01, 0.09, 0.2, Array(12).fill("macaneta.jpg")
    )
);
//fim porta


//cabos
objetos.push(
    paralelepipedo(
        -4.65, 1.2, 0, 0.03, 6, 0.03, Array(12).fill("cinza.jpg")
    )
);
objetos.push(
    paralelepipedo(
        4.45, 1.8, 0, 0.03, 6, 0.03, Array(12).fill("cinza.jpg")
    )
);

//janelas cima
const zs = [-5.1, -4.2, -3.3, -2.4, -1.5, -0.6, 0.6, 1.5, 2.4, 3.3, 4.2, 5.1];

zs.forEach(z => {
    objetos.push(
        paralelepipedo(
            -4.9, 1.67, z, 0.01, 0.4, 0.27, Array(12).fill("jan-cima.jpg")
        )
    );
});

objetos.push(
    paralelepipedo(
        -4.91, 1.8, 0, 0.01, 6, 0.4, Array(12).fill("cinza.jpg")
    )
);
//fim janelas cima

//colunas
objetos.push(paralelepipedo(-4.75, 0, 5.8, 0.2, 0.2, 3, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(-4.9, 2.25, 0, 0.02, 6, 0.3, Array(12).fill("coluna.jpg")));
objetos.push(paralelepipedo(-4.75, 0, -5.8, 0.2, 0.2, 3, Array(12).fill("parede.jpg")));

objetos.push(paralelepipedo(0, 2.2, -5.8, 5, 0.21, 0.25, Array(12).fill("coluna.jpg")));
objetos.push(paralelepipedo(0, 2.2, 5.9, 5, 0.1, 0.25, Array(12).fill("coluna.jpg")));
objetos.push(paralelepipedo(0, 2.2, 0, 5, 0.21, 0.25, Array(12).fill("coluna.jpg")));

objetos.push(paralelepipedo(4.85, 0, 5.9, 0.1, 1, 3, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(4.85, 0, -5.8, 0.1, 1, 3, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(4.85, 0, 0, 0.1, 0.2, 3, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(4.85, -1.6, 0, 0.11, 6, 0.9, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(4.85, 0, 2.6, 0.1, 0.8, 3, Array(12).fill("parede.jpg")));
objetos.push(paralelepipedo(4.85, 0, -2.6, 0.1, 0.8, 3, Array(12).fill("parede.jpg")));
//fim colunas

//ar condicionado
objetos.push(
    paralelepipedo(
        4.75, 1.5, -2.6, 0.3, 0.75, 0.25, Array(12).fill("arcondicionado.jpg")
    )
);

//janelas
[-1, -4, 1, 4.1].forEach(z => {
    objetos.push(paralelepipedo(4.9, 0.2, z, 0.01, 0.8, 1, Array(12).fill("janela.jpg")));
});

[
    [-1, -0.68],
    [-4.1, -0.68],
    [1, -0.68],
    [4.15, -0.68]
].forEach(([z, y]) => {
    objetos.push(paralelepipedo(4.7, y, z, 0.1, 0.8, 0.04, Array(12).fill("coluna.jpg")));
});
//fim janelas

//lampadas
let colunasX = [-2.5, 0, 2.5];
let filasZ   = [5, 3, 1, -1];

for(let f = 0; f < filasZ.length; f++){
    for(let c = 0; c < colunasX.length; c++){
        carteiraAluno(colunasX[c], filasZ[f]);
    }
}
let luzesX = [-2.5, 0.0, 2.5]; 
let luzesZ = [-3.0, 3.0];   
let yLuz = 2.2;

for (let z of luzesZ) {      
    for (let x of luzesX) { 
        objetos.push(
            paralelepipedo(
                x, yLuz, z, 0.6, 0.15, 0.04, Array(12).fill("cinza.jpg")
            )
        );
        objetos.push(
            paralelepipedo(
                x, yLuz - 0.05, z, 0.45, 0.1, 0.02, Array(12).fill("luz.jpg")
            )
        );
    }
}

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
