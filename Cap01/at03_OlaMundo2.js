/* 
    Executar o primeiro script "Oá mundo!" e utilizar o modulo interno 'readline' 
    para ler entradas no console.
    Objetivos: 
        - Executar o primeiro script no note.js. 
        - Importar e utilizar um modulo;
        - Observar o comportamento da programação assíncrona; 
    modulo. 
*/

//require tem como função realizar a importação de modulos.
const readline = require('readline')
//readline é um modulo capaz de receber entradas do console de forma assíncrona
const rl = readline.createInterface({ 
    input: process.stdin,
    output: process.stdout
})
//console.log é utilizado para exibir mensagens no console
console.log('Olá Mundo!')
//A função question mostra uma mensagem e captura a string digitada.
rl.question('Qual é seu nome?\n', nome=>{
    console.log(`Olá ${nome}!`)
    rl.close()
})
console.log('Olá node!')