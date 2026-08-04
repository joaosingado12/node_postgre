const readline = require('readline-sync');

// Recebendo um texto
const nome = readline.question('Qual é o seu nome? ');
console.log(`Olá, ${nome}!`);

// Recebendo um número inteiro
const idade = readline.questionInt('Qual é a sua idade? ');
console.log(`Você tem ${idade} anos.`);

// Recebendo um número decimal
const altura = readline.questionFloat('Qual é a sua altura em metros? ');
console.log(`Sua altura é ${altura} metros.`);

// Recebendo uma escolha entre opções
const opcoes = ['Maçã', 'Banana', 'Laranja'];
const indiceEscolhido = readline.keyInSelect(opcoes, 'Escolha uma fruta: ');
console.log(`Você escolheu: ${opcoes[indiceEscolhido]}`);