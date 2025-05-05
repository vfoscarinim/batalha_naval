// Função para criar um tabuleiro 10x10 vazio
function criarTabuleiro() {
    const tabuleiro = [];
    for (let i = 0; i < 10; i++) {
        tabuleiro.push(Array(10).fill('~'));  // '~' representa água
    }
    return tabuleiro;
}

// Função para posicionar 5 navios no tabuleiro
function posicionarNavios(tabuleiro) {
    let naviosColocados = 0;
    while (naviosColocados < 5) {  // 5 navios por jogador
        const linha = Math.floor(Math.random() * 10);
        const coluna = Math.floor(Math.random() * 10);
        if (tabuleiro[linha][coluna] === '~') {
            tabuleiro[linha][coluna] = '@';  // '@' representa navio
            naviosColocados++;
        }
    }
}

// Função para mostrar o tabuleiro no HTML
function mostrarTabuleiro(tabuleiro, idTabuleiro) {
    const grid = document.getElementById(idTabuleiro);
    grid.innerHTML = ''; // Limpa o tabuleiro anterior

    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const div = document.createElement('div');
            div.dataset.linha = i;
            div.dataset.coluna = j;
            if (tabuleiro[i][j] === '@') {
                div.classList.add('ship');
            } else if (tabuleiro[i][j] === 'V') {
                div.classList.add('hit');
            } else if (tabuleiro[i][j] === 'X') {
                div.classList.add('miss');
            }
            div.addEventListener('click', () => fazerJogada(i, j));
            grid.appendChild(div);
        }
    }
}

// Função para fazer uma jogada
function fazerJogada(linha, coluna) {
    const turno = document.getElementById('turno').innerText;
    const jogador = turno === 'Vez do Jogador 1' ? 1 : 2;
    const oponente = jogador === 1 ? tabuleiroJogador2 : tabuleiroJogador1;

    if (oponente[linha][coluna] === '@') {
        alert(`Jogador ${jogador} acertou um navio!`);
        oponente[linha][coluna] = 'V'; // 'V' para navio afundado
    } else {
        alert(`Jogador ${jogador} errou!`);
        oponente[linha][coluna] = 'X'; // 'X' para erro
    }

    mostrarTabuleiro(tabuleiroJogador1, 'tabuleiro1Grid');
    mostrarTabuleiro(tabuleiroJogador2, 'tabuleiro2Grid');
    verificarFimDeJogo();
    alternarTurno();
}

// Função para verificar se o jogo terminou
function verificarFimDeJogo() {
    if (verificarTabuleiro(tabuleiroJogador1)) {
        document.getElementById('status').innerText = 'Jogador 2 venceu!';
    } else if (verificarTabuleiro(tabuleiroJogador2)) {
        document.getElementById('status').innerText = 'Jogador 1 venceu!';
    }
}

// Função para verificar se todos os navios de um jogador foram afundados
function verificarTabuleiro(tabuleiro) {
    return tabuleiro.every(linha => linha.every(celula => celula !== '@'));
}

// Alternar turno
function alternarTurno() {
    const turno = document.getElementById('turno');
    turno.innerText = turno.innerText === 'Vez do Jogador 1' ? 'Vez do Jogador 2' : 'Vez do Jogador 1';
}

// Inicializar o jogo
let tabuleiroJogador1 = criarTabuleiro();
let tabuleiroJogador2 = criarTabuleiro();
posicionarNavios(tabuleiroJogador1);
posicionarNavios(tabuleiroJogador2);

mostrarTabuleiro(tabuleiroJogador1, 'tabuleiro1Grid');
mostrarTabuleiro(tabuleiroJogador2, 'tabuleiro2Grid');
