//********************************************** BATALHA NAVAL **********************************************//
const readline = require('readline');

// Configuração do terminal para entrada de dados
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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

// Função para mostrar o tabuleiro
function mostrarTabuleiro(tabuleiro) {
    console.log('  A B C D E F G H I J');
    for (let i = 0; i < 10; i++) {
        let linha = `${i} `;
        for (let j = 0; j < 10; j++) {
            linha += `${tabuleiro[i][j]} `;
        }
        console.log(linha);
    }
}

// Função para fazer uma jogada
function fazerJogada(jogador, tabuleiroOponente) {
    return new Promise((resolve) => {
        rl.question(`${jogador}, qual sua jogada? (ex: A1): `, (jogada) => {
            const colunas = 'ABCDEFGHIJ';
            const letra = jogada.charAt(0).toUpperCase();
            const numero = parseInt(jogada.charAt(1), 10);
            
            const linha = numero;
            const coluna = colunas.indexOf(letra);

            if (coluna === -1 || linha < 0 || linha >= 10) {
                console.log('Jogada inválida. Tente novamente.');
                fazerJogada(jogador, tabuleiroOponente).then(resolve); // Chama novamente até obter uma jogada válida
            } else {
                if (tabuleiroOponente[linha][coluna] === '@') {
                    console.log('Acertou um navio!');
                    tabuleiroOponente[linha][coluna] = 'V';  // 'V' para indicar navio afundado
                } else {
                    console.log('Errou!');
                    tabuleiroOponente[linha][coluna] = 'X';  // 'X' para marca de erro
                }
                resolve();
            }
        });
    });
}

// Função para verificar se todos os navios foram afundados
function verificarFimDeJogo(tabuleiro) {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (tabuleiro[i][j] === '@') {  // Verifica se ainda existe navio ('@')
                return false;
            }
        }
    }
    return true;  // Se não houver mais navios, o jogo terminou
}

// Função principal para rodar o jogo
async function jogar() {
    const tabuleiroJogador1 = criarTabuleiro();
    const tabuleiroJogador2 = criarTabuleiro();

    // Posicionar navios em ambos os tabuleiros
    posicionarNavios(tabuleiroJogador1);
    posicionarNavios(tabuleiroJogador2);

    let vezJogador1 = true;

    while (true) {
        console.clear();
        
        console.log('Tabuleiro do Jogador 1:');
        mostrarTabuleiro(tabuleiroJogador1);
        console.log('\nTabuleiro do Jogador 2:');
        mostrarTabuleiro(tabuleiroJogador2);

        // Alterna entre os jogadores
        if (vezJogador1) {
            await fazerJogada('Jogador 1', tabuleiroJogador2);
        } else {
            await fazerJogada('Jogador 2', tabuleiroJogador1);
        }

        // Verificar se alguém venceu
        if (verificarFimDeJogo(tabuleiroJogador1)) {
            console.log('Jogador 2 venceu!');
            break;
        }

        if (verificarFimDeJogo(tabuleiroJogador2)) {
            console.log('Jogador 1 venceu!');
            break;
        }

        vezJogador1 = !vezJogador1;  // Alternar entre jogadores
    }

    rl.close();
}

// Iniciar o jogo
jogar();

