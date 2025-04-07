/***********************************************************************************************************
 Modificações:
 - Contar quantos navios ainda tem no tabuleiro.
 - Exibir o tabuleiro do oponente sem mostrar a localização dos barcos.
 Feitas por: Isabele Caamano (07/04/25)
************************************************************************************************************/

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
        tabuleiro.push(Array(10).fill('~')); // '~' representa água
    }
    return tabuleiro;
}

// Função para posicionar 5 navios no tabuleiro
function posicionarNavios(tabuleiro) {
    let naviosColocados = 0;
    while (naviosColocados < 15) {
        const linha = Math.floor(Math.random() * 10);
        const coluna = Math.floor(Math.random() * 10);
        if (tabuleiro[linha][coluna] === '~') {
            tabuleiro[linha][coluna] = '@'; // '@' representa navio
            naviosColocados++;
        }
    }
}

// Função para mostrar o tabuleiro completo (com navios visíveis)
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

// NOVA: Mostrar o tabuleiro sem revelar navios
function mostrarTabuleiroOculto(tabuleiro) {
    console.log('  A B C D E F G H I J');
    for (let i = 0; i < 10; i++) {
        let linha = `${i} `;
        for (let j = 0; j < 10; j++) {
            const celula = tabuleiro[i][j];
            linha += (celula === '@') ? '~ ' : `${celula} `;
        }
        console.log(linha);
    }
}

// NOVA: Contar navios restantes
function contarNaviosRestantes(tabuleiro) {
    let contador = 0;
    for (let linha of tabuleiro) {
        for (let celula of linha) {
            if (celula === '@') {
                contador++;
            }
        }
    }
    return contador;
}

// Função para fazer uma jogada
function fazerJogada(jogador, tabuleiroOponente) {
    return new Promise((resolve) => {
        rl.question(`${jogador}, qual sua jogada? (ex: A1): `, (entrada) => {
            const colunas = 'ABCDEFGHIJ';
            const letra = entrada.charAt(0).toUpperCase();
            const numero = parseInt(entrada.slice(1), 10);

            const linha = numero;
            const coluna = colunas.indexOf(letra);

            if (coluna === -1 || isNaN(linha) || linha < 0 || linha >= 10) {
                console.log('Jogada inválida. Tente novamente.');
                fazerJogada(jogador, tabuleiroOponente).then(resolve);
            } else {
                if (tabuleiroOponente[linha][coluna] === '@') {
                    console.log('💥 Acertou um navio!');
                    tabuleiroOponente[linha][coluna] = 'V'; // 'V' para navio afundado
                } else if (tabuleiroOponente[linha][coluna] === 'X' || tabuleiroOponente[linha][coluna] === 'V') {
                    console.log('Você já atirou aqui! Tente outro local.');
                    fazerJogada(jogador, tabuleiroOponente).then(resolve);
                    return;
                } else {
                    console.log('🌊 Errou!');
                    tabuleiroOponente[linha][coluna] = 'X'; // 'X' para marca de erro
                }
                resolve();
            }
        });
    });
}

// Verifica se todos os navios foram afundados
function verificarFimDeJogo(tabuleiro) {
    for (let linha of tabuleiro) {
        if (linha.includes('@')) {
            return false;
        }
    }
    return true;
}

// Função principal
async function jogar() {
    const tabuleiroJogador1 = criarTabuleiro();
    const tabuleiroJogador2 = criarTabuleiro();

    posicionarNavios(tabuleiroJogador1);
    posicionarNavios(tabuleiroJogador2);

    let vezJogador1 = true;

    while (true) {
        console.clear();

        console.log('Tabuleiro do Jogador 1 (oculto):');
        mostrarTabuleiroOculto(tabuleiroJogador1);

        console.log('\nTabuleiro do Jogador 2 (oculto):');
        mostrarTabuleiroOculto(tabuleiroJogador2);

        console.log(`\n⛵ Navios restantes - Jogador 1: ${contarNaviosRestantes(tabuleiroJogador1)}`);
        console.log(`⛵ Navios restantes - Jogador 2: ${contarNaviosRestantes(tabuleiroJogador2)}\n`);

        if (vezJogador1) {
            await fazerJogada('Jogador 1', tabuleiroJogador2);
        } else {
            await fazerJogada('Jogador 2', tabuleiroJogador1);
        }

        if (verificarFimDeJogo(tabuleiroJogador1)) {
            console.log('\n🏆 Jogador 2 venceu!');
            break;
        }

        if (verificarFimDeJogo(tabuleiroJogador2)) {
            console.log('\n🏆 Jogador 1 venceu!');
            break;
        }

        vezJogador1 = !vezJogador1;
    }

    rl.close();
}

// Iniciar o jogo
jogar();
