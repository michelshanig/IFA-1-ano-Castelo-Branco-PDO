/**
* ===================================================================
* MUSEU DIGITAL DO PARANÁ - SCRIPT PRINCIPAL E INTERATIVIDADE
* ===================================================================
*/

// ==========================================
// 1. ACESSIBILIDADE E TEMAS
// ==========================================

let tamanhoFonteAtual = 16;

function alterarFonte(delta) {
    tamanhoFonteAtual += delta * 2;
    if (tamanhoFonteAtual < 12) tamanhoFonteAtual = 12;
    if (tamanhoFonteAtual > 24) tamanhoFonteAtual = 24;
    document.documentElement.style.fontSize = tamanhoFonteAtual + 'px';
}

function resetarFonte() {
    tamanhoFonteAtual = 16;
    document.documentElement.style.fontSize = '16px';
}

function alternarTema() {
    const html = document.documentElement;
    const isDark = html.classList.contains('dark');
    const icon = document.getElementById('theme-icon');
    const text = document.getElementById('theme-text');

    if (isDark) {
        html.classList.remove('dark');
        html.setAttribute('data-theme', 'light');
        if (icon) icon.textContent = '☀️';
        if (text) text.textContent = 'Modo Claro';
    } else {
        html.classList.add('dark');
        html.setAttribute('data-theme', 'dark');
        if (icon) icon.textContent = '🌙';
        if (text) text.textContent = 'Modo Escuro';
    }
}

// ==========================================
// UTILITÁRIO: LIMPEZA DE MEMÓRIA THREE.JS
// ==========================================

function descarteMaterial(mat) {
    if (!mat) return;
    if (mat.map) mat.map.dispose();
    if (mat.lightMap) mat.lightMap.dispose();
    if (mat.bumpMap) mat.bumpMap.dispose();
    if (mat.normalMap) mat.normalMap.dispose();
    if (mat.specularMap) mat.specularMap.dispose();
    if (mat.envMap) mat.envMap.dispose();
    mat.dispose();
}

function limparRecursos3D(objeto) {
    if (!objeto) return;
    objeto.traverse((child) => {
        if (child.isMesh) {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(mat => descarteMaterial(mat));
                } else {
                    descarteMaterial(child.material);
                }
            }
        }
    });
    while (objeto.children.length > 0) {
        objeto.remove(objeto.children[0]);
    }
}

// ==========================================
// 2. BANCO DE DADOS DA EXPOSIÇÃO
// ==========================================

const dadosHistoria = [
    {
        titulo: "Guerra do Contestado",
        descricao: "Slide sobre os principais acontecimentos e contextualização desse evento tão importante para o povo Paranaense.",
        descricaoDetalhada: "Esta proposta de pesquisa traz para nós uma breve volta ao passado e aos conflitos que moldaram a nossa sociedade e o povo Paranaense.",
        imagens: [
            "contestado/1.png",
            "contestado/2.png",
            "contestado/3.png",
            "contestado/4.png",
            "contestado/5.png",
            "contestado/6.png",
            "contestado/5.png",
            "contestado/8.png",
            "contestado/9.png",
            "contestado/10.png",
            "contestado/11.png",
        ],
        autor: "Ana T., Henry Frescura e Daniel Rossoni."
    },
    {
        titulo: "Cerco da Lapa.",
        descricao: "Jornal do dia 16 de Fevereiro de 1894.",
        descricaoDetalhada: "Essa é uma representação de jornal da época da revolução federalista, que retrata informações sobre a história e acontecimentos do Cerco da Lapa.",
        imagens: [
            "cerco da lapa-michel/History Newspaper.png",
            "cerco da lapa-michel/History Newspaper (2).png",
        ],
        autor: "Luiza, Maisa e Rafael Huber."
    },
    {
        titulo: "Barão do Cerro Azul.",
        descricao: "Jornal do dia 20 de maio de 1894.",
        descricaoDetalhada: "Essa é uma representação de jornal da época da revolução federalista, que retrata informações sobre a história e vida de Ildefonso Pereira Correia, o Barão do Cerro Azul.",
        imagens: [
            "jornal barão do serro azul-michel/1.png",
            "jornal barão do serro azul-michel/2.png",
        ],
        autor: "Pesquisa Escolar"
    },
    {
        titulo: "Indústrias Paranaenses.",
        descricao: "Industrialização do Estado do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer informações sobre o desenvolvimento industrial do Paraná.",
        imagens: [
            "industrias paranaenses-michel/1.png",
            "industrias paranaenses-michel/2.png",
            "industrias paranaenses-michel/3.png",
            "industrias paranaenses-michel/4.png",
            "industrias paranaenses-michel/5.png",
            "industrias paranaenses-michel/6.png",
            "industrias paranaenses-michel/7.png",
            "industrias paranaenses-michel/8.png",
            "industrias paranaenses-michel/9.png",
            "industrias paranaenses-michel/10.png",
            "industrias paranaenses-michel/11.png",
            "industrias paranaenses-michel/12.png",
            "industrias paranaenses-michel/13.png",
            "industrias paranaenses-michel/14.png",
        ],
        autor: "Tayane Zamperon, Victor Stoll e Danilo Panzenhagen."
    },
    {
        titulo: "Oeste e Sudoeste Paranaense.",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "oeste e sudoeste-michel/1.png",
            "oeste e sudoeste-michel/2.png",
            "oeste e sudoeste-michel/3.png",
            "oeste e sudoeste-michel/4.png",
            "oeste e sudoeste-michel/5.png",
            "oeste e sudoeste-michel/6.png",
            "oeste e sudoeste-michel/7.png",
            "oeste e sudoeste-michel/8.png",
            "oeste e sudoeste-michel/9.png",
            "oeste e sudoeste-michel/10.png",
            "oeste e sudoeste-michel/11.png",
            "oeste e sudoeste-michel/12.png",
            "oeste e sudoeste-michel/13.png",
            "oeste e sudoeste-michel/14.png",
            "oeste e sudoeste-michel/15.png",
            "oeste e sudoeste-michel/16.png",
            "oeste e sudoeste-michel/17.png",
            "oeste e sudoeste-michel/18.png",
            "oeste e sudoeste-michel/19.png",
        ],
        autor: "Tayane Zamperon, Victor Stoll e Danilo Panzenhagen."
    },
    {
        titulo: "Campos Gerais e Centro Oriental Paranaense.",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "campos gerais e centro oriental-michel/1.png",
            "campos gerais e centro oriental-michel/2.png",
            "campos gerais e centro oriental-michel/3.png",
            "campos gerais e centro oriental-michel/4.png",
            "campos gerais e centro oriental-michel/5.png",
            "campos gerais e centro oriental-michel/6.png",
            "campos gerais e centro oriental-michel/7.png",
            "campos gerais e centro oriental-michel/8.png",
            "campos gerais e centro oriental-michel/9.png",
            "campos gerais e centro oriental-michel/10.png",
            "campos gerais e centro oriental-michel/11.png",
            "campos gerais e centro oriental-michel/12.png",
            "campos gerais e centro oriental-michel/13.png",
            "campos gerais e centro oriental-michel/14.png",
            "campos gerais e centro oriental-michel/15.png",
            "campos gerais e centro oriental-michel/16.png",
            "campos gerais e centro oriental-michel/17.png",
            "campos gerais e centro oriental-michel/18.png",
        ],
        autor: "Luiza Binsfiel, Maisa Constantino e Rafael Huber."
    },
    {
        titulo: "Sul e Centro Sul Paranaense.",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "Sul e centro-sul-michel/1.png",
            "Sul e centro-sul-michel/2.png",
            "Sul e centro-sul-michel/3.png",
            "Sul e centro-sul-michel/4.png",
            "Sul e centro-sul-michel/5.png",
            "Sul e centro-sul-michel/6.png",
            "Sul e centro-sul-michel/7.png",
            "Sul e centro-sul-michel/8.png",
            "Sul e centro-sul-michel/9.png",
            "Sul e centro-sul-michel/10.png",
            "Sul e centro-sul-michel/11.png",
            "Sul e centro-sul-michel/12.png",
            "Sul e centro-sul-michel/13.png",
            "Sul e centro-sul-michel/14.png",
            "Sul e centro-sul-michel/15.png",
            "Sul e centro-sul-michel/16.png",
            "Sul e centro-sul-michel/17.png",
        ],
        autor: "Pedro, Pyetro e Sthefanny."
    },
    {
        titulo: "Região Metropolitana de Curitiba e Litoral Paranaense.",
        descricao: "Principais Cidades de cada região do Paraná.",
        descricaoDetalhada: "Essa apresentação busca trazer as principais cidades e suas importâncias de cada região do Paraná.",
        imagens: [
            "rmc e litoral-michel/1.png",
            "rmc e litoral-michel/2.png",
            "rmc e litoral-michel/3.png",
            "rmc e litoral-michel/4.png",
            "rmc e litoral-michel/5.png",
            "rmc e litoral-michel/6.png",
            "rmc e litoral-michel/7.png",
            "rmc e litoral-michel/8.png",
            "rmc e litoral-michel/9.png",
            "rmc e litoral-michel/10.png",
            "rmc e litoral-michel/11.png",
            "rmc e litoral-michel/12.png",
            "rmc e litoral-michel/13.png",
            "rmc e litoral-michel/14.png",
            "rmc e litoral-michel/15.png",
            "rmc e litoral-michel/16.png",
            "rmc e litoral-michel/17.png",
            "rmc e litoral-michel/18.png",
        ],
        autor: "Sabrina Kunzel, Eduardo Panzenhagen e Rafael Frasson."
    }
];

// ARRAY DE GEOGRAFIA ESTRUTURADO PARA O LIVRO INTERATIVO
const dadosGeografia = [
    {
        capitulo: "Capítulo I",
        paginaEsq: "Pág. 02",
        paginaDir: "Pág. 03",
        titulo: "A Orografia e os Três Planaltos Paranaenses",
        subtitulo: "Da Serra do Mar ao Rio Paraná",
        epigrafe: "«O relevo paranaense degrau a degrau se revela, do litoral altivo às terras férteis do oeste.»",
        descricao: "A geomorfologia do Paraná é dividida em três grandes patamares topográficos. Partindo da majestosa Serra do Mar (Morro do Anhangava, Pico do Paraná), descemos para o Primeiro Planalto (Bacia de Curitiba), avançamos pelo Segundo Planalto (Campos Gerais com a Escarpela Devoniana) até atingirmos o Terceiro Planalto (Planalto de Guarapuava/Trapp), dominado pelas rochas basálticas.",
        imagem: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 1.1 — Vista dos vales e elevações da Serra do Mar Paranaense.",
        autor: "Atlas Geográfico & Histórico do Paraná",
        notasRodape: "Fonte: Instituto Água e Terra (IAT) • Levantamento Topográfico do Estado"
    },
    {
        capitulo: "Capítulo II",
        paginaEsq: "Pág. 04",
        paginaDir: "Pág. 05",
        titulo: "Hidrografia: Bacias e Quedas D'Água",
        subtitulo: "As Artérias Fluviais do Território Paranaense",
        epigrafe: "«Águas que cortam o basalto, alimentando a vida e gerando a força motriz do estado.»",
        descricao: "O estado possui uma das redes hidrográficas mais ricas do Brasil, pertencente quase totalmente à Bacia do Rio Paraná. O Rio Iguaçu, maior rio nativo, percorre o estado de leste a oeste até desaguar nas Cataratas do Iguaçu. O Rio Tibagi destaca-se pela importância no Segundo e Terceiro planaltos, enquanto Itaipu aproveita o potencial hidroelétrico do Rio Paraná.",
        imagem: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 2.1 — As majestosas Cataratas do Iguaçu no extremo oeste.",
        autor: "Departamento de Cartografia & Geografia",
        notasRodape: "Mapeamento Hidrográfico • Comitê de Bacias Hidrográficas do Paraná"
    },
    {
        capitulo: "Capítulo III",
        paginaEsq: "Pág. 06",
        paginaDir: "Pág. 07",
        titulo: "Clima Subtropical e Dinâmica Atmosférica",
        subtitulo: "Transição Térmica entre Cfa e Cfb",
        epigrafe: "«Terra onde as quatro estações dialogam entre a geada do inverno e o calor do verão.»",
        descricao: "Devido à sua posição astronômica cortada pelo Trópico de Capricórnio, o Paraná é uma zona de transição climática. Nas áreas mais elevadas (acima de 800m), predomina o clima Cfb (verões brandos e geadas frequentes no inverno). Nas regiões mais baixas do Norte, Oeste e Litoral, domina o clima Cfa (verões quentes e umidade pluvial bem distribuída).",
        imagem: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 3.1 — Formação de nevoeiro característico nas manhãs de inverno no planalto.",
        autor: "Estudos Climatológicos do Sul do Brasil",
        notasRodape: "Simepar • Instituto Nacional de Meteorologia (INMET)"
    },
    {
        capitulo: "Capítulo IV",
        paginaEsq: "Pág. 08",
        paginaDir: "Pág. 09",
        titulo: "Mata das Araucárias e Fitogeografia",
        subtitulo: "A Floresta Ombrófila Mista e a Fauna Nativa",
        epigrafe: "«Sob a copa imponente dos pinheirais, guarda-se a herança ancestral da biodiversidade.»",
        descricao: "A Floresta Ombrófila Mista é o bioma folclórico e ecológico mais marcante do Paraná. A Araucaria angustifolia (Pinheiro-do-Paraná) forma um dossel único associado a espécies como a Erva-Mate e a Imbuia. A gralha-azul atua como dispersora natural do pinhão, símbolo de simbiose indispensável para a preservação ambiental.",
        imagem: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 4.1 — Araucária angustifolia centenária nos campos do Primeiro Planalto.",
        autor: "Herbário & Pesquisa Botânica",
        notasRodape: "Conservação Ambiental • Livro Vermelho da Flora Ameaçada"
    },
    {
        capitulo: "Capítulo V",
        paginaEsq: "Pág. 10",
        paginaDir: "Pág. 11",
        titulo: "Terra Roxa, Solos e a Vocação Agrícola",
        subtitulo: "Pedologia e a Ocupação Geoeconômica",
        epigrafe: "«Do basalto decomposto brota o solo fértil que alimentou cidades e movimentou o progresso.»",
        descricao: "Os solos chamados de 'Terra Roxa' (derivação do italiano rosso, vermelho) são fruto do intemperismo das rochas vulcânicas (derrames de basalto). Essa altíssima fertilidade natural impulsionou o ciclo do café a partir da década de 1930 no Norte Pioneiro e hoje sustenta o cinturão da soja, milho e agronegócio no estado.",
        imagem: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 5.1 — Campos cultivados sobre o rico solo de Terra Roxa paranaense.",
        autor: "Cátedra de Geologia & Pedologia",
        notasRodape: "Embrapa Florestas • Secretaria da Agricultura do Paraná (SEAB)"
    },
    {
        capitulo: "Capítulo VI",
        paginaEsq: "Pág. 12",
        paginaDir: "Pág. 13",
        titulo: "O Litoral Paranaense e o Complexo Estuarino",
        subtitulo: "Baías, Manguezais e a Costa de Paranaguá",
        epigrafe: "«Encontro entre o oceano Atlântico e a serra verdejante, berço da povoação paranaense.»",
        descricao: "O litoral paranaense possui cerca de 100 km de extensão, abrigando as Baías de Paranaguá e Guaratuba. É marcado por manguezais, ecossistemas de restinga e praias oceânicas (Matinhos, Caiobá, Pontal do Paraná), além da histórica Ilha do Mel, unindo preservação da Mata Atlântica com o Porto de Paranaguá.",
        imagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        legendaImagem: "Fig. 6.1 — Encontro do estuário e faixa costeira no Litoral Paranaense.",
        autor: "Geografia Marítima e Estuarina",
        notasRodape: "Centro de Estudos do Mar (CEM-UFPR) • Portos do Paraná"
    }
];

const dadosArte = [
    {
        titulo: "Primeiras Artes Artistas: Região Metropolitana e Litoral.",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Literal e Região Metropolitana - Artes e artistas/1.png",
            "Literal e Região Metropolitana - Artes e artistas/2.png",
            "Literal e Região Metropolitana - Artes e artistas/3.png",
            "Literal e Região Metropolitana - Artes e artistas/4.png",
            "Literal e Região Metropolitana - Artes e artistas/5.png",
            "Literal e Região Metropolitana - Artes e artistas/6.png",
            "Literal e Região Metropolitana - Artes e artistas/7.png",
            "Literal e Região Metropolitana - Artes e artistas/8.png",
            "Literal e Região Metropolitana - Artes e artistas/9.png",
            "Literal e Região Metropolitana - Artes e artistas/10.png",
        ],
        autor: "Sabrina, Eduardo e Rafael."
    },
    {
        titulo: "Artes e artistas: Oeste e Sudoeste Paranaense.",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Oeste e Sudoeste Paranaense - Artes e artistas/1.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/2.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/3.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/4.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/5.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/6.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/7.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/8.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/9.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/10.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/11.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/12.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/13.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/14.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/15.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/16.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/17.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/18.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/19.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/20.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/21.png",
            "Oeste e Sudoeste Paranaense - Artes e artistas/22.png",
        ],
        autor: "Tayane, Victor e Danilo"
    },
    {
        titulo: "Artes e Artistas: Região Centro Oriental e Campos Gerais.",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/1.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/2.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/3.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/4.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/5.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/6.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/7.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/8.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/9.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/10.jpg",
            "Região Centro Oriental e Campos Gerais - Artes e Artistas/12.jpg",
        ],
        autor: "Maisa, Rafael H. e Luiza."
    },
    {
        titulo: "Artes e artistas: Sul e Centro-sul.",
        descricao: "Slide sobre os principais nomes da arte paranaense que influenciaram a cultura desta região.",
        descricaoDetalhada: "Esta proposta de pesquisa e produção de slides teve como objetivo analisar e conhecer as artes e artistas pioneiros em cada região do Paraná e como estes influenciaram a cultura até os dias de hoje.",
        imagens: [
           "Sul e Centro-sul - Artes e artistas/1.png",
           "Sul e Centro-sul - Artes e artistas/2.png",
           "Sul e Centro-sul - Artes e artistas/3.png",
           "Sul e Centro-sul - Artes e artistas/4.png",
           "Sul e Centro-sul - Artes e artistas/5.png",
           "Sul e Centro-sul - Artes e artistas/6.png",
           "Sul e Centro-sul - Artes e artistas/7.png",
           "Sul e Centro-sul - Artes e artistas/8.png",
           "Sul e Centro-sul - Artes e artistas/9.png",
           "Sul e Centro-sul - Artes e artistas/10.png",
        ],
        autor: "Pedro, Pyetro e Sthefanny."
    }
];

const trabalhosAlunos = [
    {
        id: 't1',
        titulo: 'As regiões Oeste e Sudoeste em traços e cores',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Os alunos analisaram as características e particularidades culturais, históricas e geográficas de cada região do Paraná, influenciados pelos principais artistas plásticos paranaenses. Produziram retratos utilizando bases e riscadores alternativos, tendo como foco a produção sustentável.',
        autor: 'Tayane, Victor e Danilo.',
        disciplina: 'Arte / História / Geografia.',
        imagem: 'Produção artísticas-ingridi/As regiões Oeste e Sudoeste em traços e cores_.jpg',
        lon: 0, lat: 0
    },
    {
        id: 't2',
        titulo: 'As araucárias',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Victor',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/As araucárias - Victor_.jpg',
        lon: 36, lat: 0
    },
    {
        id: 't3',
        titulo: 'Do litoral à metrópole',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Os alunos analisaram as características e particularidades culturais, históricas e geográficas de cada região do Paraná, influenciados pelos principais artistas plásticos paranaenses. Produziram retratos utilizando bases e riscadores alternativos, tendo como foco a produção sustentável.',
        autor: 'Trabalho Coletivo (Sabrina, Rafael e Eduardo)',
        disciplina: 'Arte / História / Geografia.',
        imagem: 'Produção artísticas-ingridi/Do litoral à metrópole_.jpg',
        lon: 72, lat: 0
    },
    {
        id: 't4',
        titulo: 'Infância na lavoura',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Luiza',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG_20260903_102822.jpg',
        lon: 108, lat: 0
    },
    {
        id: 't5',
        titulo: 'O cafezal',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais e papel machê.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais e papel machê para moldura.',
        autor: 'Pyetro',
        disciplina: 'Artes',
        imagem: 'Produção artísticas-ingridi/O Cafezal - Pyetro.png',
        lon: 144, lat: 0
    },
    {
        id: 't6',
        titulo: 'Costumes e tradições',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Eduardo',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG_20260903_102805.jpg',
        lon: 180, lat: 0
    },
    {
        id: 't7',
        titulo: 'Mateando ao sol',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com pigmentos naturais.',
        autor: 'Rafael Huber',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG_20260902_083851.jpg',
        lon: 216, lat: 0
    },
    {
        id: 't8',
        titulo: 'Tradição entre Araucárias',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Sabrina',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG_20260902_083837.jpg',
        lon: 252, lat: 0
    },
    {
        id: 't9',
        titulo: 'Amanhecer',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Danilo',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG_20260902_083827.jpg',
        lon: 288, lat: 0
    },
    {
        id: 't10',
        titulo: 'Um olhar sobre os Campos gerais paranaenses',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        descricaoDetalhada: 'Trabalho prático integrando Arte, História e Geografia. Os alunos analisaram as características e particularidades culturais, históricas e geográficas de cada região do Paraná, influenciados pelos principais artistas plásticos paranaenses. Produziram retratos utilizando bases e riscadores alternativos, tendo como foco a produção sustentável.',
        autor: 'Trabalho Coletivo (Luiza, Rafael H. e Maisa)',
        disciplina: 'História / Arte / Geografia',
        imagem: 'Produção artísticas-ingridi/Um olhar sobre os Campos gerais paranaenses_.jpg',
        lon: 324, lat: 0
    },
    {
        id: 't11',
        titulo: 'Café nacional',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Sthefanny',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG20260902114137.jpg',
        lon: 288, lat: 0
    },
    {
        id: 't12',
        titulo: 'Preservando a tradição',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Rafael Frasson',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG20260902082909.jpg',
        lon: 288, lat: 0
    },
    {
        id: 't13',
        titulo: 'O chimarrão',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses com uso de tintas naturais.',
        autor: 'Maisa',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG20260902082805.jpg',
        lon: 288, lat: 0
    },
    {
        id: 't14',
        titulo: 'Peroba: Texturas do tempo',
        descricao: 'Representação tridimensional e tátil dos símbolos paranaenses.',
        descricaoDetalhada: 'Representação tridimensional e tátil dos símbolos paranaenses. Elementos básicos da arte.',
        autor: 'Professora Ingridi',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/IMG20260824110034.jpg',
        lon: 288, lat: 0
    },
    {
        id: 't15',
        titulo: 'Campo de araucárias',
        descricao: 'Produções artísticas com material alternativo e foco na sustentabilidade.',
        autor: 'Trabalho Coletivo (Pedro, Pyetro e Sthefanny)',
        disciplina: 'Arte',
        imagem: 'Produção artísticas-ingridi/Campo de araucárias_.jpg',
        lon: 288, lat: 0
    }
];

// Obras expostas na Árvore do Café
const obrasCafe = [
    {
        id: 'c1',
        titulo: 'O Cafezal - Ouro Verde',
        descricao: 'Estudo em pintura sobre a expansão cafeeira no Norte do Paraná.',
        descricaoDetalhada: 'Obra focada na representação do ciclo do café, da terra roxa às colheitas do Norte Pioneiro.',
        autor: 'Pyetro (8º Ano A)',
        disciplina: 'Arte / História',
        imagem: 'Mariana 1.jpg'
    },
    {
        id: 'c2',
        titulo: 'Traços e Cores do Sudoeste',
        descricao: 'Expressão visual das paisagens cafeeiras e agrícolas.',
        descricaoDetalhada: 'Nos anos 50 e 60, o café se tornou a alma do Noroeste do Paraná. A terra fértil e o clima favorável atraíram milhares de famílias.',
        autor: 'Post de Campo Mourão D',
        disciplina: 'Arte',
        imagem: 'marina5.jpg'
    },
    {
        id: 'c3',
        titulo: 'As Araucárias no Cafezal',
        descricao: 'Integração da flora nativa com a cultura cafeeira.',
        descricaoDetalhada: 'Pintura que harmoniza o símbolo das araucárias com os campos cultivados.',
        autor: 'Victor (7º Ano B)',
        disciplina: 'Arte / Geografia',
        imagem: 'Mariana 2.jpg'
    },
    {
        id: 'c4',
        titulo: 'Do Litoral à Metrópole',
        descricao: 'Rota de escoamento do café ao Porto de Paranaguá.',
        descricaoDetalhada: 'Em meio ao cafezal, no município de Tomazina, lembra-se das tristes cenas da grande geada de 1975.',
        autor: 'Acervo Museu Histórico',
        disciplina: 'História',
        imagem: 'mariana 6.jpg'
    },
    {
        id: 'c5',
        titulo: 'Infância na Lavoura',
        descricao: 'Retrato do cotidiano rural nas plantações históricas.',
        descricaoDetalhada: 'Pintura tátil representando as memórias e o trabalho agrícola paranaense.',
        autor: 'Luiza',
        disciplina: 'Arte',
        imagem: 'Mariana 3.jpg'
    },
    {
        id: 'c6',
        titulo: 'Costumes e Tradições',
        descricao: 'A vida no campo e a convivência nas fazendas de café.',
        descricaoDetalhada: 'O Norte do Paraná é a principal região produtora de café no Estado, produzindo grãos premiados internacionalmente.',
        autor: 'Foto: Feito no Paraná/divulgação',
        disciplina: 'Arte',
        imagem: 'mariana7.jpg'
    },
    {
        id: 'c7',
        titulo: 'Café Nacional',
        descricao: 'Pigmentação natural derivada dos próprios grãos de café.',
        descricaoDetalhada: 'Experiência tátil com tinta ecológica extraída da torra do café.',
        autor: 'Sthefanny',
        disciplina: 'Arte',
        imagem: 'Mariana 4.jpg'
    },
    {
        id: 'c8',
        titulo: 'Café do Norte Pioneiro',
        descricao: 'Combinação da madeira das tulhas com elementos da natureza.',
        descricaoDetalhada: 'O Café do Norte Pioneiro obteve o registro de Indicação Geográfica (IG) pelo INPI.',
        autor: 'AEN',
        disciplina: 'Arte',
        imagem: 'mariana8.jpg'
    }
];

// ==========================================
// 3. MOTOR DO LIVRO INTERATIVO (GEOGRAFIA)
// ==========================================

let paginaLivroAtual = 0;

function renderizarPaginaLivro() {
    const item = dadosGeografia[paginaLivroAtual];
    const pagEsq = document.getElementById('livro-pagina-esq');
    const pagDir = document.getElementById('livro-pagina-dir');
    const container = document.getElementById('livro-container');
    const btnPrev = document.getElementById('btn-livro-prev');
    const btnNext = document.getElementById('btn-livro-next');
    const indicador = document.getElementById('livro-indicador-pagina');

    if (!item || !pagEsq || !pagDir) return;

    // Efeito visual de virada
    if (container) {
        container.classList.remove('animar-virada');
        void container.offsetWidth; // Trigger reflow
        container.classList.add('animar-virada');
    }

    // Render Página Esquerda (Conteúdo Editorial)
    pagEsq.innerHTML = `
        <div class="space-y-4">
            <div class="border-b border-[#D4C4A8] dark:border-zinc-800 pb-2 flex justify-between items-center">
                <span class="font-serif italic text-xs font-bold text-[#7A1C1C] dark:text-amber-400 uppercase tracking-wider">${item.capitulo}</span>
                <span class="font-serif text-[11px] text-stone-500 font-bold">${item.paginaEsq}</span>
            </div>

            <h3 class="font-serif font-bold text-2xl md:text-3xl text-[#3D2314] dark:text-stone-100 leading-tight">
                ${item.titulo}
            </h3>

            <p class="font-serif italic text-xs md:text-sm text-stone-600 dark:text-stone-400 font-medium">
                ${item.subtitulo}
            </p>

            ${item.epigrafe ? `
                <blockquote class="font-serif italic text-xs text-[#7A1C1C] dark:text-amber-200 bg-[#EFECE6]/80 dark:bg-zinc-800/60 p-3 rounded-lg border-l-4 border-[#C59B27] my-3 leading-relaxed">
                    ${item.epigrafe}
                </blockquote>
            ` : ''}

            <p class="font-serif text-xs md:text-sm text-stone-800 dark:text-stone-200 leading-relaxed first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 first-letter:text-[#7A1C1C] dark:first-letter:text-amber-400">
                ${item.descricao}
            </p>
        </div>

        <div class="pt-4 mt-4 border-t border-[#E2D8C3] dark:border-zinc-800 text-[10px] font-serif text-stone-500 flex justify-between items-center">
            <span>${item.autor}</span>
            <span>Atlas Geográfico</span>
        </div>
    `;

    // Render Página Direita (Ilustração & Notas)
    pagDir.innerHTML = `
        <div class="space-y-4 flex-1 flex flex-col justify-between">
            <div class="border-b border-[#D4C4A8] dark:border-zinc-800 pb-2 flex justify-end items-center">
                <span class="font-serif text-[11px] text-stone-500 font-bold">${item.paginaDir}</span>
            </div>

            <!-- Moldura de Foto de Livro -->
            <div class="border-2 border-[#C59B27]/50 p-1.5 bg-white dark:bg-zinc-900 rounded-lg shadow-md img-zoom-container cursor-pointer" onclick="abrirGaleria(['${item.imagem}'], '${item.titulo}', '${item.descricao}', '${item.autor}', 'Geografia')">
                <div class="aspect-video overflow-hidden rounded relative">
                    <img src="${item.imagem}" alt="${item.titulo}" class="w-full h-full object-cover img-zoom filter sepia-[0.1] contrast-105">
                    <span class="absolute bottom-1 right-1 bg-[#3D2314]/90 text-[#C59B27] text-[9px] font-serif px-2 py-0.5 rounded border border-[#C59B27]/30">
                        🔍 Ampliar
                    </span>
                </div>
            </div>

            <p class="font-serif italic text-[11px] text-stone-600 dark:text-stone-400 text-center px-2">
                ${item.legendaImagem || ''}
            </p>

            <div class="bg-[#EFECE6]/60 dark:bg-zinc-900/80 p-3 rounded-lg border border-[#D4C4A8] dark:border-zinc-800">
                <p class="font-serif text-[11px] text-stone-600 dark:text-stone-400 leading-tight">
                    <strong class="text-[#7A1C1C] dark:text-amber-400 font-bold">Nota de Rodapé:</strong> ${item.notasRodape}
                </p>
            </div>
        </div>

        <div class="pt-4 mt-4 border-t border-[#E2D8C3] dark:border-zinc-800 text-[10px] font-serif text-stone-400 text-right">
            Paraná • Geografia & Relevo
        </div>
    `;

    // Atualização dos botões
    if (btnPrev) btnPrev.disabled = (paginaLivroAtual === 0);
    if (btnNext) btnNext.disabled = (paginaLivroAtual === dadosGeografia.length - 1);
    if (indicador) indicador.textContent = `Capítulo ${paginaLivroAtual + 1} de ${dadosGeografia.length}`;
}

function folhearLivro(delta) {
    const novaPag = paginaLivroAtual + delta;
    if (novaPag >= 0 && novaPag < dadosGeografia.length) {
        paginaLivroAtual = novaPag;
        renderizarPaginaLivro();
    }
}

// ==========================================
// 4. CARREGAMENTO GERAL DAS SEÇÕES
// ==========================================

const colecaoDados = {
    historia: { dados: dadosHistoria, tag: 'História' },
    arte: { dados: dadosArte, tag: 'Arte' },
    trabalhos: { dados: trabalhosAlunos, tag: 'Trabalho de Aluno' }
};

function criarCardHtml(item, tag, categoria, index) {
    const listaImagens = (item.imagens && item.imagens.length > 0)
        ? item.imagens
        : [item.imagem || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80"];
    const qtdFotos = listaImagens.length;

    return `
        <div class="bg-white dark:bg-zinc-900 border border-[#D4C4A8] dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div class="img-zoom-container relative aspect-video cursor-pointer" onclick="abrirGaleriaPorIndice('${categoria}', ${index})">
                <img src="${listaImagens[0]}" alt="${item.titulo}" class="w-full h-full object-cover img-zoom" loading="lazy">
                ${qtdFotos > 1 ? `
                    <span class="absolute bottom-2 right-2 bg-stone-900/80 text-[#C59B27] text-[10px] font-serif font-bold px-2 py-1 rounded-md border border-[#C59B27]/30 shadow">
                        📷 ${qtdFotos} fotos
                    </span>
                ` : ''}
            </div>
            <div class="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                    <span class="text-[10px] font-serif font-bold uppercase tracking-wider text-[#7A1C1C] dark:text-amber-400">${tag}</span>
                    <h3 class="font-serif font-bold text-base leading-snug mt-1 text-stone-900 dark:text-stone-100">${item.titulo}</h3>
                    <p class="text-xs text-stone-600 dark:text-stone-400 mt-2 line-clamp-3">${item.descricao}</p>
                </div>
                <div class="text-[11px] text-[#4A2E1B] dark:text-amber-200/80 font-serif font-semibold pt-2 border-t border-[#E2D8C3] dark:border-zinc-800">
                    ${item.autor}
                </div>
            </div>
        </div>
    `;
}

function carregarSecoes() {
    const render = (idContainer, categoria) => {
        const el = document.getElementById(idContainer);
        const grupo = colecaoDados[categoria];
        if (el && grupo) {
            el.innerHTML = grupo.dados.map((item, index) => criarCardHtml(item, grupo.tag, categoria, index)).join('');
        }
    };

    render('grid-historia', 'historia');
    render('grid-arte', 'arte');
    render('grid-trabalhos', 'trabalhos');

    // Inicializar o livro de Geografia
    renderizarPaginaLivro();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', carregarSecoes);
} else {
    carregarSecoes();
}

// ==========================================
// 5. LIGHTBOX / APRESENTADOR DE SLIDES EXPANDIDO
// ==========================================

let galeriaImagensAtual = [];
let indiceSlideAtual = 0;

function abrirGaleriaPorIndice(categoria, index) {
    const grupo = colecaoDados[categoria];
    if (!grupo) return;
    const item = grupo.dados[index];
    if (!item) return;

    const listaImagens = (item.imagens && item.imagens.length > 0) ? item.imagens : [item.imagem];
    abrirGaleria(listaImagens, item.titulo, item.descricaoDetalhada || item.descricao, item.autor, grupo.tag);
}

function abrirGaleria(listaImagens, titulo, descDetalhada, autor, tag, indiceInicial = 0) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    galeriaImagensAtual = Array.isArray(listaImagens) ? listaImagens : [listaImagens];
    indiceSlideAtual = indiceInicial;

    document.getElementById('lightbox-title').textContent = titulo;
    document.getElementById('lightbox-desc').textContent = descDetalhada;
    document.getElementById('lightbox-autor').textContent = autor;
    document.getElementById('lightbox-tag').textContent = tag;

    const btnPrev = document.getElementById('btn-prev-slide');
    const btnNext = document.getElementById('btn-next-slide');
    if (btnPrev && btnNext) {
        if (galeriaImagensAtual.length <= 1) {
            btnPrev.classList.add('hidden');
            btnNext.classList.add('hidden');
        } else {
            btnPrev.classList.remove('hidden');
            btnNext.classList.remove('hidden');
        }
    }

    renderizarThumbnails();
    atualizarExibicaoSlide();

    lightbox.classList.remove('hidden');
    setTimeout(() => {
        lightbox.classList.remove('opacity-0');
        lightbox.classList.add('opacity-100');
    }, 10);
    document.body.style.overflow = 'hidden';
}

function renderizarThumbnails() {
    const containerThumbs = document.getElementById('lightbox-thumbs');
    if (!containerThumbs) return;

    if (galeriaImagensAtual.length <= 1) {
        containerThumbs.parentElement.classList.add('hidden');
        return;
    }

    containerThumbs.parentElement.classList.remove('hidden');
    containerThumbs.innerHTML = galeriaImagensAtual.map((imgSrc, idx) => `
        <button onclick="irParaSlide(${idx})" class="w-14 h-14 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${idx === indiceSlideAtual ? 'border-[#C59B27] scale-105 shadow-md ring-2 ring-[#C59B27]/50' : 'border-transparent opacity-60 hover:opacity-100'}">
            <img src="${imgSrc}" class="w-full h-full object-cover">
        </button>
    `).join('');
}

function atualizarExibicaoSlide() {
    const imgEl = document.getElementById('lightbox-img');
    const contadorEl = document.getElementById('lightbox-contador');

    if (imgEl && galeriaImagensAtual.length > 0) {
        imgEl.style.opacity = '0.3';
        setTimeout(() => {
            imgEl.src = galeriaImagensAtual[indiceSlideAtual];
            imgEl.style.opacity = '1';
        }, 150);
    }

    if (contadorEl) {
        contadorEl.textContent = `${indiceSlideAtual + 1} / ${galeriaImagensAtual.length}`;
    }

    renderizarThumbnails();
}

function mudarSlide(delta) {
    if (galeriaImagensAtual.length === 0) return;
    indiceSlideAtual = (indiceSlideAtual + delta + galeriaImagensAtual.length) % galeriaImagensAtual.length;
    atualizarExibicaoSlide();
}

function irParaSlide(index) {
    if (index >= 0 && index < galeriaImagensAtual.length) {
        indiceSlideAtual = index;
        atualizarExibicaoSlide();
    }
}

function fecharLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    lightbox.classList.remove('opacity-100');
    lightbox.classList.add('opacity-0');
    setTimeout(() => {
        lightbox.classList.add('hidden');
    }, 300);
    document.body.style.overflow = 'auto';

    if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
    }
}

function alternarTelaCheia() {
    const elem = document.getElementById('lightbox-container') || document.documentElement;
    if (!document.fullscreenElement) {
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || lightbox.classList.contains('hidden')) return;

    if (e.key === 'ArrowRight') {
        mudarSlide(1);
    } else if (e.key === 'ArrowLeft') {
        mudarSlide(-1);
    } else if (e.key === 'Escape') {
        fecharLightbox();
    } else if (e.key === 'f' || e.key === 'F') {
        alternarTelaCheia();
    }
});

// ==========================================
// 6. SALA VIRTUAL 3D REALISTA (GALERIA CÚBICA)
// ==========================================
let cena, camera, renderizador, grupoQuadros, raycaster, mouse;
let interagindo = false;
let mouseX = 0, mouseY = 0, lon = 0, lat = 0, latOnDown = 0, lonOnDown = 0;
let startX = 0, startY = 0;
let animacaoId = null;
let fovAlvo = 65;
let lonAlvo = 0, latAlvo = 0;

function criarTexturaPiso() {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 512;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#2A1810';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#1A0E0A';
    ctx.lineWidth = 4;
    for (let i = 0; i < 512; i += 64) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(12, 12);
    return texture;
}

function initSala3D() {
    const container = document.getElementById('tour-canvas-container');
    if (!container) return;

    if (renderizador) {
        noRedimensionamento();
        return;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    cena = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(fovAlvo, container.clientWidth / container.clientHeight, 1, 2000);
    camera.target = new THREE.Vector3(0, 0, 0);

    renderizador = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizador.setSize(container.clientWidth, container.clientHeight);
    renderizador.shadowMap.enabled = true;
    renderizador.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizador.toneMapping = THREE.ACESFilmicToneMapping;
    renderizador.toneMappingExposure = 0.85;
    container.appendChild(renderizador.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xfff5e6, 0.35);
    cena.add(luzAmbiente);

    const luzTeto = new THREE.HemisphereLight(0xffffff, 0x332211, 0.45);
    cena.add(luzTeto);

    const largura = 800, altura = 300, profundidade = 800;

    const geoPiso = new THREE.PlaneGeometry(largura, profundidade);
    const matPiso = new THREE.MeshStandardMaterial({
        map: criarTexturaPiso(),
        roughness: 0.25,
        metalness: 0.1
    });
    const piso = new THREE.Mesh(geoPiso, matPiso);
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -altura / 2;
    piso.receiveShadow = true;
    cena.add(piso);

    const geoTeto = new THREE.PlaneGeometry(largura, profundidade);
    const matTeto = new THREE.MeshStandardMaterial({ color: 0xF5F2EB, roughness: 0.9 });
    const teto = new THREE.Mesh(geoTeto, matTeto);
    teto.rotation.x = Math.PI / 2;
    teto.position.y = altura / 2;
    cena.add(teto);

    const matParede = new THREE.MeshStandardMaterial({ color: 0xE5DFD3, roughness: 0.85 });
    const criarParede = (w, h, x, y, z, rotY) => {
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matParede);
        mesh.position.set(x, y, z);
        mesh.rotation.y = rotY;
        mesh.receiveShadow = true;
        cena.add(mesh);
    };

    criarParede(largura, altura, 0, 0, -profundidade / 2, 0);
    criarParede(largura, altura, 0, 0, profundidade / 2, Math.PI);
    criarParede(profundidade, altura, -largura / 2, 0, 0, Math.PI / 2);
    criarParede(profundidade, altura, largura / 2, 0, 0, -Math.PI / 2);

    const matRodape = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.4 });
    const geoRodapeL = new THREE.BoxGeometry(largura, 12, 4);
    const r1 = new THREE.Mesh(geoRodapeL, matRodape); r1.position.set(0, -altura/2 + 6, -profundidade/2 + 2); cena.add(r1);
    const r2 = new THREE.Mesh(geoRodapeL, matRodape); r2.position.set(0, -altura/2 + 6, profundidade/2 - 2); cena.add(r2);

    grupoQuadros = new THREE.Group();
    cena.add(grupoQuadros);

    container.addEventListener('mousedown', (e) => {
        interagindo = true;
        mouseX = e.clientX; mouseY = e.clientY;
        startX = e.clientX; startY = e.clientY;
        lonOnDown = lon; latOnDown = lat;
    });

    container.addEventListener('mousemove', (e) => {
        if (interagindo) {
            lonAlvo = (mouseX - e.clientX) * 0.15 + lonOnDown;
            latAlvo = (e.clientY - mouseY) * 0.15 + latOnDown;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (interagindo) {
            interagindo = false;
            if (Math.hypot(e.clientX - startX, e.clientY - startY) < 6) {
                checarCliqueObra(e);
            }
        }
    });

    window.addEventListener('resize', noRedimensionamento);
    montarObrasEPlacas3D();
}

function montarObrasEPlacas3D() {
    limparRecursos3D(grupoQuadros);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const raioMural = 390;
    const passoAngulo = 360 / trabalhosAlunos.length;

    trabalhosAlunos.forEach((item, index) => {
        const grupoArte = new THREE.Group();
      
        const geoMoldura = new THREE.BoxGeometry(116, 86, 6);
        const matMoldura = new THREE.MeshStandardMaterial({ color: 0xC59B27, metalness: 0.6, roughness: 0.3 });
        const meshMoldura = new THREE.Mesh(geoMoldura, matMoldura);
        meshMoldura.castShadow = true;

        const geoTela = new THREE.PlaneGeometry(104, 74);
        const matTela = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.2 });
        const meshTela = new THREE.Mesh(geoTela, matTela);
        meshTela.position.z = 3.2;

        const geoPlaca = new THREE.BoxGeometry(35, 18, 2);
        const matPlaca = new THREE.MeshStandardMaterial({ color: 0xFAF8F5, roughness: 0.5 });
        const meshPlaca = new THREE.Mesh(geoPlaca, matPlaca);
        meshPlaca.position.set(0, -56, 1);

        meshMoldura.userData = item;
        meshTela.userData = item;

        grupoArte.add(meshMoldura);
        grupoArte.add(meshTela);
        grupoArte.add(meshPlaca);

        const anguloDeg = index * passoAngulo;
        const rad = THREE.MathUtils.degToRad(anguloDeg);

        grupoArte.position.x = raioMural * Math.sin(rad);
        grupoArte.position.y = 10;
        grupoArte.position.z = raioMural * Math.cos(rad);
        grupoArte.lookAt(0, 10, 0);

        const spot = new THREE.SpotLight(0xFFF0DD, 1.2);
        spot.position.set(grupoArte.position.x * 0.7, 130, grupoArte.position.z * 0.7);
        spot.target = grupoArte;
        spot.angle = Math.PI / 6;
        spot.penumbra = 0.4;
        spot.castShadow = true;
        spot.shadow.mapSize.width = 1024;
        spot.shadow.mapSize.height = 1024;
        cena.add(spot);

        grupoQuadros.add(grupoArte);

        const urlImagem3D = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : item.imagem;
        loader.load(urlImagem3D, (tex) => {
            matTela.map = tex;
            matTela.needsUpdate = true;
        });
    });
}

function focarObraMaisProxima() {
    if (!trabalhosAlunos || trabalhosAlunos.length === 0) return;
    const lonNorm = ((lon % 360) + 360) % 360;
    let obraMaisProxima = trabalhosAlunos[0];
    let menorDiferenca = 360;

    trabalhosAlunos.forEach(obra => {
        const dif = Math.abs((obra.lon || 0) - lonNorm);
        if (dif < menorDiferenca) {
            menorDiferenca = dif;
            obraMaisProxima = obra;
        }
    });

    lonAlvo = obraMaisProxima.lon || 0;
    latAlvo = 0;
}

function checarCliqueObra(e) {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !grupoQuadros) return;
    const rect = container.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(grupoQuadros.children, true);

    if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        if (data && data.titulo) {
            const listaImagens = (data.imagens && data.imagens.length > 0) ? data.imagens : [data.imagem];
            abrirGaleria(listaImagens, data.titulo, data.descricaoDetalhada || data.descricao, data.autor, data.disciplina || 'Trabalho de Aluno');
        }
    }
}

function noRedimensionamento() {
    const container = document.getElementById('tour-canvas-container');
    if (!container || !camera || !renderizador) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderizador.setSize(container.clientWidth, container.clientHeight);
}

function animar3D() {
    animacaoId = requestAnimationFrame(animar3D);

    if (!interagindo) {
        lonAlvo += 0.04;
    }

    lon += (lonAlvo - lon) * 0.05;
    lat += (latAlvo - lat) * 0.05;
    camera.fov += (fovAlvo - camera.fov) * 0.05;
    camera.updateProjectionMatrix();

    lat = Math.max(-45, Math.min(45, lat));

    const phi = THREE.MathUtils.degToRad(90 - lat);
    const theta = THREE.MathUtils.degToRad(lon);

    camera.target.x = 500 * Math.sin(phi) * Math.cos(theta);
    camera.target.y = 500 * Math.cos(phi);
    camera.target.z = 500 * Math.sin(phi) * Math.sin(theta);
    camera.lookAt(camera.target);

    renderizador.render(cena, camera);
}

function abrirTourVirtual() {
    const modal = document.getElementById('tour-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        initSala3D();
        noRedimensionamento();
        if (!animacaoId) animar3D();
    }, 50);
    document.body.style.overflow = 'hidden';
}

function fecharTourVirtual() {
    const modal = document.getElementById('tour-modal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');

        if (animacaoId) {
            cancelAnimationFrame(animacaoId);
            animacaoId = null;
        }
        if (cena) {
            limparRecursos3D(cena);
            cena = null;
        }
        if (renderizador) {
            renderizador.dispose();
            if (renderizador.domElement) {
                renderizador.domElement.remove();
            }
            renderizador = null;
        }
        camera = null;
        grupoQuadros = null;
    }, 300);

    document.body.style.overflow = 'auto';
}

// ==========================================
// 7. SALA VIRTUAL 3D: GALERIA COM ÁRVORE DAS ARTES
// ==========================================

let cenaArvore, cameraArvore, renderizadorArvore, grupoArvore, raycasterArvore, mouseArvore;
let interagindoArvore = false;
let mouseXArvore = 0, mouseYArvore = 0, lonArvore = 0, latArvore = 0, latOnDownArvore = 0, lonOnDownArvore = 0;
let startXArvore = 0, startYArvore = 0;
let animacaoIdArvore = null;
let fovAlvoArvore = 65;
let lonAlvoArvore = 0, latAlvoArvore = 0;
let quadrosPendurados = [];
let pontasDosGalhosDeCafe = [];

let estadoPlacaCafe = {
    titulo: "Pé de Café",
    descricao: "Coffea arabica • Símbolo da riqueza agrícola e patrimônio cultural do Paraná"
};
let meshTelaPlacaCafe = null;

const CONFIG_GALERIA_CLASSICA = {
    corParede: 0x2A3A35,
    corBoiserie: 0x1E2B27,
    corPiso: 0x3D2314,
    corRodape: 0x1A120B,
    corTeto: 0xF5F2EB,
    corLuzGaleria: 0xFFF2A3,
    intensidadeSpotlight: 0.8,
    larguraSala: 1000,
    alturaSala: 420,
    profundidadeSala: 1000,
    alturaRodape: 24,
    larguraMolduraBoiserie: 160,
    alturaMolduraBoiserie: 220,
    raioGalhos: 210,
    alturaTronco: 240,
    grossuraTronco: 28,
    comprimentoCorda: 50,
    corTronco: 0x28170D,
    corFolhas: 0x1E361A,
    corCorda: 0xC59B27,
    velocidadeBalanco: 0.0015,
    amplitudebalanco: 0.04
};

function gerarTexturaPlaca(titulo, descricao) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 512, 300);
    grad.addColorStop(0, '#FAF8F5');
    grad.addColorStop(1, '#EFE8DA');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 300);

    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 12;
    ctx.strokeRect(8, 8, 496, 284);

    ctx.strokeStyle = '#7A1C1C';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, 476, 264);

    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A1C1C';
    ctx.fillText('☕  EXPOSIÇÃO BOTÂNICA & ARTE  ☕', 256, 52);

    ctx.beginPath();
    ctx.moveTo(60, 68);
    ctx.lineTo(452, 68);
    ctx.strokeStyle = '#C59B27';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 36px Georgia, serif';
    ctx.fillStyle = '#3D2314';
    ctx.fillText(titulo || 'Pé de Café', 256, 120);

    ctx.font = 'italic 18px Georgia, serif';
    ctx.fillStyle = '#5A3D28';

    const palavras = (descricao || '').split(' ');
    let linha = '';
    let y = 165;
    const maxLargura = 420;
    const alturaLinha = 24;

    for (let n = 0; n < palavras.length; n++) {
        const testeLinha = linha + palavras[n] + ' ';
        const metricas = ctx.measureText(testeLinha);
        if (metricas.width > maxLargura && n > 0) {
            ctx.fillText(linha, 256, y);
            linha = palavras[n] + ' ';
            y += alturaLinha;
        } else {
            linha = testeLinha;
        }
    }
    ctx.fillText(linha, 256, y);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}

function abrirModalInfoPlaca() {
    const modal = document.getElementById('modal-info-placa');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
    }, 10);
}

function fecharModalInfoPlaca() {
    const modal = document.getElementById('modal-info-placa');
    if (!modal) return;
    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 200);
}

function initSalaArvore3D() {
    const container = document.getElementById('arvore-canvas-container');
    if (!container) return;

    if (renderizadorArvore) {
        noRedimensionamentoArvore();
        return;
    }

    raycasterArvore = new THREE.Raycaster();
    mouseArvore = new THREE.Vector2();
    cenaArvore = new THREE.Scene();

    cenaArvore.fog = new THREE.FogExp2(0x111815, 0.0008);

    cameraArvore = new THREE.PerspectiveCamera(fovAlvoArvore, container.clientWidth / container.clientHeight, 1, 2000);
    cameraArvore.target = new THREE.Vector3(0, 40, 0);

    renderizadorArvore = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderizadorArvore.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderizadorArvore.setSize(container.clientWidth, container.clientHeight);
    renderizadorArvore.shadowMap.enabled = true;
    renderizadorArvore.shadowMap.type = THREE.PCFSoftShadowMap;
    renderizadorArvore.toneMapping = THREE.ACESFilmicToneMapping;
    renderizadorArvore.toneMappingExposure = 1.1;
    container.appendChild(renderizadorArvore.domElement);

    const luzAmbiente = new THREE.AmbientLight(0xFFE8C5, 0.7);
    cenaArvore.add(luzAmbiente);

    const luzLustreCentral = new THREE.PointLight(CONFIG_GALERIA_CLASSICA.corLuzGaleria, 1.8, 800);
    luzLustreCentral.position.set(0, CONFIG_GALERIA_CLASSICA.alturaSala - 120, 0);
    luzLustreCentral.castShadow = true;
    cenaArvore.add(luzLustreCentral);

    grupoArvore = new THREE.Group();
    cenaArvore.add(grupoArvore);

    construirRecintoElegante();
    construirArvoreCentral();
    construirPlacaCafeStand();
    montarObrasNasPontas();

    container.addEventListener('mousedown', (e) => {
        interagindoArvore = true;
        mouseXArvore = e.clientX; mouseYArvore = e.clientY;
        startXArvore = e.clientX; startYArvore = e.clientY;
        lonOnDownArvore = lonArvore; latOnDownArvore = latArvore;
    });

    container.addEventListener('mousemove', (e) => {
        if (interagindoArvore) {
            lonAlvoArvore = (mouseXArvore - e.clientX) * 0.15 + lonOnDownArvore;
            latAlvoArvore = (e.clientY - mouseYArvore) * 0.15 + latOnDownArvore;
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (interagindoArvore) {
            interagindoArvore = false;
            if (Math.hypot(e.clientX - startXArvore, e.clientY - startYArvore) < 6) {
                checarCliqueObraArvore(e);
            }
        }
    });

    window.addEventListener('resize', noRedimensionamentoArvore);
}

function construirRecintoElegante() {
    const W = CONFIG_GALERIA_CLASSICA.larguraSala;
    const H = CONFIG_GALERIA_CLASSICA.alturaSala;
    const D = CONFIG_GALERIA_CLASSICA.profundidadeSala;

    const matParede = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corParede, roughness: 0.7 });
    const matBoiserie = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corBoiserie, roughness: 0.5 });
    const matMadeiraEscura = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corRodape, roughness: 0.4 });

    const geoPiso = new THREE.PlaneGeometry(W, D);
    const matPiso = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corPiso, roughness: 0.3, metalness: 0.1 });
    const piso = new THREE.Mesh(geoPiso, matPiso);
    piso.rotation.x = -Math.PI / 2;
    piso.position.y = -100;
    piso.receiveShadow = true;
    cenaArvore.add(piso);

    const geoTeto = new THREE.PlaneGeometry(W, D);
    const matTeto = new THREE.MeshStandardMaterial({ color: CONFIG_GALERIA_CLASSICA.corTeto, roughness: 0.9 });
    const teto = new THREE.Mesh(geoTeto, matTeto);
    teto.rotation.x = Math.PI / 2;
    teto.position.y = -100 + H;
    cenaArvore.add(teto);

    const criarParedeClassica = (largura, x, z, rotY) => {
        const grupoParede = new THREE.Group();

        const meshP = new THREE.Mesh(new THREE.PlaneGeometry(largura, H), matParede);
        meshP.receiveShadow = true;
        grupoParede.add(meshP);

        const geoRodape = new THREE.BoxGeometry(largura, CONFIG_GALERIA_CLASSICA.alturaRodape, 8);
        const rodape = new THREE.Mesh(geoRodape, matMadeiraEscura);
        rodape.position.set(0, -H / 2 + CONFIG_GALERIA_CLASSICA.alturaRodape / 2, 4);
        grupoParede.add(rodape);

        const geoCimalha = new THREE.BoxGeometry(largura, 18, 12);
        const cimalha = new THREE.Mesh(geoCimalha, matMadeiraEscura);
        cimalha.position.set(0, H / 2 - 9, 6);
        grupoParede.add(cimalha);

        const qtdQuadros = 4;
        const espacamento = largura / (qtdQuadros + 1);
        const wB = CONFIG_GALERIA_CLASSICA.larguraMolduraBoiserie;
        const hB = CONFIG_GALERIA_CLASSICA.alturaMolduraBoiserie;
        const eB = 3;

        for (let i = 1; i <= qtdQuadros; i++) {
            const posX = -largura / 2 + (i * espacamento);
            const posY = 10;

            const geoH = new THREE.BoxGeometry(wB, 6, eB);
            const bSup = new THREE.Mesh(geoH, matBoiserie); bSup.position.set(posX, posY + hB / 2, eB);
            const bInf = new THREE.Mesh(geoH, matBoiserie); bInf.position.set(posX, posY - hB / 2, eB);

            const geoV = new THREE.BoxGeometry(6, hB, eB);
            const bEsq = new THREE.Mesh(geoV, matBoiserie); bEsq.position.set(posX - wB / 2, posY, eB);
            const bDir = new THREE.Mesh(geoV, matBoiserie); bDir.position.set(posX + wB / 2, posY, eB);

            grupoParede.add(bSup); grupoParede.add(bInf);
            grupoParede.add(bEsq); grupoParede.add(bDir);
        }

        grupoParede.position.set(x, -100 + H / 2, z);
        grupoParede.rotation.y = rotY;
        cenaArvore.add(grupoParede);
    };

    criarParedeClassica(W, 0, -D / 2, 0);
    criarParedeClassica(W, 0, D / 2, Math.PI);
    criarParedeClassica(D, -W / 2, 0, Math.PI / 2);
    criarParedeClassica(D, W / 2, 0, -Math.PI / 2);
}

function construirArvoreCentral() {
    pontasDosGalhosDeCafe = [];

    const matTronco = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.85 });
    const matFolhas = new THREE.MeshStandardMaterial({
        color: 0x143818,
        roughness: 0.3,
        metalness: 0.1,
        flatShading: true
    });
    const matCafeMaduro = new THREE.MeshStandardMaterial({ color: 0x9E0C0C, roughness: 0.2, metalness: 0.1 });
    const matCafeVerde = new THREE.MeshStandardMaterial({ color: 0x486B28, roughness: 0.3 });

    const altTronco = CONFIG_GALERIA_CLASSICA.alturaTronco;

    const geoTronco = new THREE.CylinderGeometry(10, 22, altTronco, 12);
    const tronco = new THREE.Mesh(geoTronco, matTronco);
    tronco.position.y = -100 + (altTronco / 2);
    tronco.castShadow = true;
    grupoArvore.add(tronco);

    const geoClusterFolhas = new THREE.DodecahedronGeometry(20, 1);
    const geoGraoCafe = new THREE.SphereGeometry(3, 8, 8);

    const camadas = 5;
    const galhosPorCamada = 6;

    for (let i = 0; i < camadas; i++) {
        const alturaCamada = -100 + (altTronco * 0.35) + (i * (altTronco * 0.6 / camadas));
        const raioCamada = 140 - (i * 20);

        for (let j = 0; j < galhosPorCamada; j++) {
            const angulo = (j * (Math.PI * 2 / galhosPorCamada)) + (i * 0.4);

            const posX = Math.sin(angulo) * raioCamada;
            const posZ = Math.cos(angulo) * raioCamada;
            const posY = alturaCamada;

            const pontoInicio = new THREE.Vector3(0, posY - 8, 0);
            const pontoMedio = new THREE.Vector3(posX * 0.5, posY + 12, posZ * 0.5);
            const pontoFim = new THREE.Vector3(posX, posY + 4, posZ);

            const curvaGalho = new THREE.CatmullRomCurve3([pontoInicio, pontoMedio, pontoFim]);
            const geoGalho = new THREE.TubeGeometry(curvaGalho, 10, 3, 8, false);
            const meshGalho = new THREE.Mesh(geoGalho, matTronco);
            meshGalho.castShadow = true;
            grupoArvore.add(meshGalho);

            const folhagem = new THREE.Mesh(geoClusterFolhas, matFolhas);
            folhagem.position.set(posX, posY + 4, posZ);
            folhagem.scale.set(1.5, 0.5, 1.5);
            folhagem.rotation.y = Math.random() * Math.PI;
            folhagem.castShadow = true;
            grupoArvore.add(folhagem);

            const quantidadeFrutos = 8;
            for (let k = 0; k < quantidadeFrutos; k++) {
                const ehMaduro = Math.random() > 0.2;
                const matFruto = ehMaduro ? matCafeMaduro : matCafeVerde;
                const fruto = new THREE.Mesh(geoGraoCafe, matFruto);

                const offsetX = (Math.random() - 0.5) * 18;
                const offsetY = (Math.random() - 0.5) * 10 - 4;
                const offsetZ = (Math.random() - 0.5) * 18;

                fruto.position.set(posX + offsetX, posY + offsetY, posZ + offsetZ);
                fruto.scale.set(1, 1.2, 1);
                fruto.castShadow = true;
                grupoArvore.add(fruto);
            }

            pontasDosGalhosDeCafe.push({
                posicao: pontoFim.clone(),
                angulo: angulo
            });
        }
    }
}

function construirPlacaCafeStand() {
    const grupoPlaca = new THREE.Group();
    grupoPlaca.name = "placaInformativa";
    grupoPlaca.userData = { isPlaca: true };

    grupoPlaca.position.set(120, -100, 250);
    grupoPlaca.rotation.y = -Math.PI / 6;

    const matBase = new THREE.MeshStandardMaterial({ color: 0x3D2314, roughness: 0.4 });
    const matAste = new THREE.MeshStandardMaterial({ color: 0xC59B27, metalness: 0.7, roughness: 0.3 });
    const matMoldura = new THREE.MeshStandardMaterial({ color: 0x7A1C1C, roughness: 0.5 });

    const geoBase = new THREE.BoxGeometry(35, 6, 25);
    const meshBase = new THREE.Mesh(geoBase, matBase);
    meshBase.position.y = 3;
    meshBase.castShadow = true;
    meshBase.userData = { isPlaca: true };
    grupoPlaca.add(meshBase);

    const geoHaste = new THREE.CylinderGeometry(1.8, 1.8, 45, 12);
    const meshHaste = new THREE.Mesh(geoHaste, matAste);
    meshHaste.position.y = 28;
    meshHaste.castShadow = true;
    meshHaste.userData = { isPlaca: true };
    grupoPlaca.add(meshHaste);

    const grupoPainel = new THREE.Group();
    grupoPainel.position.set(0, 50, 0);
    grupoPainel.rotation.x = -Math.PI / 8;

    const geoMolduraPlaca = new THREE.BoxGeometry(64, 40, 4);
    const meshMolduraPlaca = new THREE.Mesh(geoMolduraPlaca, matMoldura);
    meshMolduraPlaca.castShadow = true;
    meshMolduraPlaca.name = "placaInformativa";
    meshMolduraPlaca.userData = { isPlaca: true };
    meshMolduraPlaca.renderOrder = 10;
    grupoPainel.add(meshMolduraPlaca);

    const geoTelaPlaca = new THREE.PlaneGeometry(60, 36);
    const matTelaPlaca = new THREE.MeshStandardMaterial({
        map: gerarTexturaPlaca(estadoPlacaCafe.titulo, estadoPlacaCafe.descricao),
        roughness: 0.2
    });
    meshTelaPlacaCafe = new THREE.Mesh(geoTelaPlaca, matTelaPlaca);
    meshTelaPlacaCafe.position.z = 2.2;
    meshTelaPlacaCafe.name = "placaInformativa";
    meshTelaPlacaCafe.userData = { isPlaca: true };
    meshTelaPlacaCafe.renderOrder = 11;
    grupoPainel.add(meshTelaPlacaCafe);

    grupoPlaca.add(grupoPainel);
    grupoArvore.add(grupoPlaca);
}

function montarObrasNasPontas() {
    quadrosPendurados = [];
    if (!obrasCafe || obrasCafe.length === 0) return;

    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');

    const matCorda = new THREE.MeshStandardMaterial({ 
        color: CONFIG_GALERIA_CLASSICA.corCorda, 
        metalness: 0.6, 
        roughness: 0.2 
    });
    const matHasteSuporte = new THREE.MeshStandardMaterial({
        color: 0x3D2314,
        roughness: 0.7
    });

    const totalObras = obrasCafe.length;
    const passoAngulo = (Math.PI * 2) / totalObras;
    const raioAncoragem = 220;

    obrasCafe.forEach((item, index) => {
        const anguloObra = (index * passoAngulo) + 0.2;

        const dirX = Math.sin(anguloObra);
        const dirZ = Math.cos(anguloObra);

        const camadaIdx = (index % 3) + 1;
        const alturaGalhoBase = -100 + (CONFIG_GALERIA_CLASSICA.alturaTronco * 0.35) + (camadaIdx * (CONFIG_GALERIA_CLASSICA.alturaTronco * 0.6 / 5));

        const pontoOrigem = new THREE.Vector3(dirX * 60, alturaGalhoBase + 10, dirZ * 60);

        const pontoAncoragem = new THREE.Vector3(
            dirX * raioAncoragem,
            alturaGalhoBase + (index % 2 === 0 ? 15 : 0),
            dirZ * raioAncoragem
        );

        const curvaHaste = new THREE.CatmullRomCurve3([
            new THREE.Vector3(dirX * 20, alturaGalhoBase, dirZ * 20),
            pontoOrigem,
            new THREE.Vector3(dirX * (raioAncoragem * 0.65), alturaGalhoBase + 8, dirZ * (raioAncoragem * 0.65)),
            pontoAncoragem
        ]);
        const geoHaste = new THREE.TubeGeometry(curvaHaste, 12, 2.2, 8, false);
        const meshHaste = new THREE.Mesh(geoHaste, matHasteSuporte);
        meshHaste.castShadow = true;
        grupoArvore.add(meshHaste);

        const grupoPendulo = new THREE.Group();
        grupoPendulo.position.copy(pontoAncoragem);

        const comprimentoCorda = 42;
        const geoCorda = new THREE.CylinderGeometry(0.8, 0.8, comprimentoCorda, 8);
        const meshCorda = new THREE.Mesh(geoCorda, matCorda);
        meshCorda.position.y = -comprimentoCorda / 2;
        grupoPendulo.add(meshCorda);

        const geoMoldura = new THREE.BoxGeometry(80, 60, 4);
        const matMoldura = new THREE.MeshStandardMaterial({ color: 0x8C6D2B, metalness: 0.7, roughness: 0.3 });
        const meshMoldura = new THREE.Mesh(geoMoldura, matMoldura);
        meshMoldura.position.y = -comprimentoCorda - 30;

        const geoTela = new THREE.PlaneGeometry(72, 52);
        const matTela = new THREE.MeshStandardMaterial({ side: THREE.DoubleSide, roughness: 0.2 });
        const meshTela = new THREE.Mesh(geoTela, matTela);
        meshTela.position.set(0, -comprimentoCorda - 30, 2.2);

        meshMoldura.userData = item;
        meshTela.userData = item;

        grupoPendulo.add(meshMoldura);
        grupoPendulo.add(meshTela);

        grupoPendulo.lookAt(
            pontoAncoragem.x + dirX * 100, 
            grupoPendulo.position.y - comprimentoCorda - 30, 
            pontoAncoragem.z + dirZ * 100
        );

        const spot = new THREE.SpotLight(CONFIG_GALERIA_CLASSICA.corLuzGaleria, CONFIG_GALERIA_CLASSICA.intensidadeSpotlight);
        spot.position.set(pontoAncoragem.x * 1.2, pontoAncoragem.y + 35, pontoAncoragem.z * 1.2);
        spot.target = meshTela;
        spot.angle = Math.PI / 6;
        cenaArvore.add(spot);

        grupoArvore.add(grupoPendulo);

        quadrosPendurados.push({ grupo: grupoPendulo, offsetTempo: index * 1.5 });

        const urlImagem3D = (item.imagens && item.imagens.length > 0) ? item.imagens[0] : item.imagem;
        loader.load(urlImagem3D, (tex) => {
            matTela.map = tex;
            matTela.needsUpdate = true;
        });
    });
}

function animarArvore3D() {
    animacaoIdArvore = requestAnimationFrame(animarArvore3D);

    const tempo = Date.now() * CONFIG_GALERIA_CLASSICA.velocidadeBalanco;

    quadrosPendurados.forEach((item) => {
        item.grupo.rotation.z = Math.sin(tempo + item.offsetTempo) * CONFIG_GALERIA_CLASSICA.amplitudebalanco;
        item.grupo.rotation.x = Math.cos(tempo * 0.8 + item.offsetTempo) * (CONFIG_GALERIA_CLASSICA.amplitudebalanco * 0.5);
    });

    if (!interagindoArvore) {
        lonAlvoArvore += 0.03;
    }

    lonArvore += (lonAlvoArvore - lonArvore) * 0.05;
    latArvore += (latAlvoArvore - latArvore) * 0.05;

    latArvore = Math.max(-18, Math.min(28, latArvore));

    cameraArvore.fov += (fovAlvoArvore - cameraArvore.fov) * 0.05;
    cameraArvore.updateProjectionMatrix();

    const phi = THREE.MathUtils.degToRad(90 - latArvore);
    const theta = THREE.MathUtils.degToRad(lonArvore);

    const raioOrbita = 410;

    let posX = raioOrbita * Math.sin(phi) * Math.sin(theta);
    let posY = raioOrbita * Math.cos(phi) + 20;
    let posZ = raioOrbita * Math.sin(phi) * Math.cos(theta);

    const margemParede = (CONFIG_GALERIA_CLASSICA.larguraSala / 2) - 80;
    const alturaMinima = -60;
    const alturaMaxima = CONFIG_GALERIA_CLASSICA.alturaSala - 120;

    cameraArvore.position.x = Math.max(-margemParede, Math.min(margemParede, posX));
    cameraArvore.position.y = Math.max(alturaMinima, Math.min(alturaMaxima, posY));
    cameraArvore.position.z = Math.max(-margemParede, Math.min(margemParede, posZ));

    cameraArvore.lookAt(0, 20, 0);

    renderizadorArvore.render(cenaArvore, cameraArvore);
}

function checarCliqueObraArvore(e) {
    const container = document.getElementById('arvore-canvas-container');
    if (!container || !cameraArvore || !grupoArvore) return;

    const rect = container.getBoundingClientRect();
    mouseArvore.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
    mouseArvore.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

    raycasterArvore.setFromCamera(mouseArvore, cameraArvore);
    const intersects = raycasterArvore.intersectObjects(grupoArvore.children, true);

    if (intersects.length > 0) {
        const hitObj = intersects[0].object;

        if (hitObj.userData && hitObj.userData.isPlaca) {
            abrirModalInfoPlaca();
            return;
        }

        const data = hitObj.userData;
        if (data && data.titulo) {
            const listaImagens = (data.imagens && data.imagens.length > 0) ? data.imagens : [data.imagem];
            abrirGaleria(listaImagens, data.titulo, data.descricaoDetalhada || data.descricao, data.autor, data.disciplina || 'Trabalho de Aluno');
        }
    }
}

function noRedimensionamentoArvore() {
    const container = document.getElementById('arvore-canvas-container');
    if (!container || !cameraArvore || !renderizadorArvore) return;
    cameraArvore.aspect = container.clientWidth / container.clientHeight;
    cameraArvore.updateProjectionMatrix();
    renderizadorArvore.setSize(container.clientWidth, container.clientHeight);
}

function abrirTourArvoreVirtual() {
    const modal = document.getElementById('arvore-modal');
    if (!modal) return;
    modal.classList.remove('hidden');
    setTimeout(() => {
        modal.classList.remove('opacity-0');
        modal.classList.add('opacity-100');
        initSalaArvore3D();
        noRedimensionamentoArvore();
        if (!animacaoIdArvore) animarArvore3D();
    }, 50);
    document.body.style.overflow = 'hidden';
}

function fecharTourArvoreVirtual() {
    const modal = document.getElementById('arvore-modal');
    if (!modal) return;

    modal.classList.remove('opacity-100');
    modal.classList.add('opacity-0');

    setTimeout(() => {
        modal.classList.add('hidden');

        if (animacaoIdArvore) {
            cancelAnimationFrame(animacaoIdArvore);
            animacaoIdArvore = null;
        }
        if (cenaArvore) {
            limparRecursos3D(cenaArvore);
            cenaArvore = null;
        }
        if (renderizadorArvore) {
            renderizadorArvore.dispose();
            if (renderizadorArvore.domElement) {
                renderizadorArvore.domElement.remove();
            }
            renderizadorArvore = null;
        }
        cameraArvore = null;
        grupoArvore = null;
        quadrosPendurados = [];
        meshTelaPlacaCafe = null;
    }, 300);

    document.body.style.overflow = 'auto';
}