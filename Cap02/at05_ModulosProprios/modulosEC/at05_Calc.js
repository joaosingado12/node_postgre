import calc from './calculadora.js'
let {soma, sub, mult, div} = calc //Desestruturação de um objeto

console.log(soma(10, 25))
console.log(soma(100, 205))
console.log(sub(100, 20))
console.log(mult(8, 7))
console.log(div(100, 20))
console.log(div(100, 0))
