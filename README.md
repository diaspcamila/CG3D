# 🐶 UECE 3D - Passeio do Ceará na P-08

#### Computação Gráfica (2025.3)
#### Universidade Estadual do Ceará (UECE)

## 📖 Sobre o Projeto

O **UECE 3D** é uma aplicação de Computação Gráfica desenvolvida nativamente com a **API WebGL**.

O objetivo do projeto é fazer um passeio virtual uma sala de aula da universidade sob uma perspectiva inusitada: a **visão de um cachorro**. O usuário navega pelo ambiente em primeira pessoa, com altura de câmera ajustada para o nível do chão, podendo interagir com o cenário e observar a aplicação de técnicas fundamentais de renderização 3D.

## ✨ Funcionalidades Principais

* **Renderização 3D:** Utilização de shaders personalizados para desenhar a geometria.
* **Modelo de Iluminação de Phong:** Implementação de luz ambiente, difusa e especular para criar realismo nos materiais.
* **Câmera em Primeira Pessoa:** Controle de visão (Yaw/Pitch) e movimento, com restrição de altura para simular o animal.
* **Texturização:** Mapeamento de texturas para chão, paredes, mesas, lousa e objetos decorativos.
* **Modelagem Procedural:** Construção de objetos complexos (cadeiras, mesas, projetor) através da composição de primitivas (paralelepípedos).
* **Áudio Interativo:** Funcionalidade de "latido" integrada à interface.

## 📂 Estrutura de Arquivos

```text
/
├── index.html       # Tela de título e apresentação da equipe
├── canvas.html      # Tela principal (Canvas WebGL e Shaders)
├── webgl.js         # Lógica principal, loop de renderização e eventos
├── camera.js        # Funções de criação das matrizes de câmera (LookAt, Perspective)
├── objetos.js       # Definição geométrica da cena (Mesas, Sala, Cadeiras)
├── transforms.js    # Funções auxiliares de transformação matricial
├── math.js          # Biblioteca matemática (dependência externa)
├── latido.mp3       # Arquivo de áudio
└── texturas/        # (gato.jpg, cachorro.png, parede.jpg, etc...)

```

## 🚀 Como Executar

Como o projeto carrega texturas e arquivos externos via JavaScript, ele **não funcionará** se aberto diretamente pelo sistema de arquivos (`file://`). É necessário um servidor local.

### Pré-requisitos

* Um navegador moderno com suporte a WebGL (Chrome, Firefox, Edge).
* Python ou Node.js (opcional, para criar o servidor).

### Passo a Passo

1. **Organize os arquivos:** Certifique-se de que todos os `.js`, `.html` e as imagens (texturas) estejam na mesma pasta (ou ajustados conforme a estrutura de diretórios do código).
2. **Inicie um servidor local:**
* **Via Python:**
```bash
python -m http.server 8000

```

* **Via VS Code:** Utilize a extensão *Live Server*.

3. **Acesse:** Abra o navegador em `http://localhost:8000/index.html`.
4. Clique em **"Iniciar"** para entrar na simulação.

## 🎮 Controles

| Tecla / Ação | Função |
| --- | --- |
| **W** | Mover para frente 
| **S** | Mover para trás |
| **A** | Mover para a esquerda (Strafe) |
| **D** | Mover para a direita (Strafe) |
| **Seta Esquerda** | Girar câmera para a esquerda (Yaw) |
| **Seta Direita** | Girar câmera para a direita (Yaw) |
| **Seta Cima** | Olhar para cima (Pitch) |
| **Seta Baixo** | Olhar para baixo (Pitch) |
| **L** | Executa o som `latido.mp3` |

## 🛠️ Detalhes Técnicos e Implementação
### 1. Pipeline Gráfica (Shaders)

O código utiliza **GLSL** (OpenGL Shading Language) embutido no HTML:

* **Vertex Shader (`vertex-shader`):**
* Calcula a posição dos vértices no espaço do mundo multiplicando pela matriz `u_model`.
* Calcula vetores essenciais para iluminação: vetor normal, vetor para a luz (`v_pointToLight`) e vetor para a câmera (`v_pointToCam`).


* **Fragment Shader (`frag-shader`):**
* Implementa o modelo de reflexão de **Phong**.
* Calcula a cor final somando os componentes
* Realiza a amostragem da textura (`texture2D`) baseada nas coordenadas UV.


### 2. Câmera e Matemática (`camera.js` e `transforms.js`)

* Uso da biblioteca `math.js` para operações matriciais complexas.
* **Matriz View:** Gerada pela função `lookAt`, que define a posição do olho (`camPos`), para onde está olhando (`camTarget`) e o vetor "up".
* **Matriz de Projeção:** Utiliza `createPerspective` para gerar o frustum de visão com campo de visão (FOV) de 45 graus.
* **Movimentação:** A câmera possui uma altura fixa (`y = -1.3`) para simular a visão canina. A rotação é calculada via ângulos de Euler (Yaw e Pitch), convertidos para um vetor de direção trigonométrico.

### 3. Modelagem de Objetos (`objetos.js`)

Não foram importados modelos 3D prontos (como .obj ou .fbx). Toda a cena é construída via código:

* **Classe `Objeto`:** Estrutura que armazena vértices, normais e índices.
* **Primitivas:** A função `paralelepipedo` gera os dados de um cuboide, calculando automaticamente as coordenadas de textura e vetores normais para cada face.
* **Cena:** A sala é composta por múltiplos cuboides transformados e posicionados para criar as carteiras, a mesa do professor, paredes, janelas e o ar-condicionado.

### 4. Texturização e Materiais

* O sistema carrega um array de texturas (`texSrc`) de forma assíncrona.
* As texturas são vinculadas (bind) no loop de renderização.
* Tratamento de erro: Se uma textura falhar ou tiver canal alfa inválido, o shader aplica uma cor cinza padrão para debug.
