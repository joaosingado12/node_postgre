const calc = require('./calculadora')
let {soma, sub, mult, div} = calc.calculadora //Desestruturação de um objeto
console.log(soma(10, 25))
console.log(soma(100, 205))
console.log(sub(100, 20))
console.log(mult(8, 7))
console.log(div(100, 20))
console.log(div(100, 0))



/* 
Funções ES5
function soma(n1, n2){
    return parseInt(n1) + parseInt(n2)
}
function sub(n1, n2){
    return parseInt(n1) - parseInt(n2)
}
function mult(n1, n2){
    return parseInt(n1) * parseInt(n2)
}
function div(n1, n2){
    return n2==0?"Não é possível dividir por 0.": parseInt(n1) / parseInt(n2)
}


Funções ES6
let soma = (n1, n2)=>parseInt(n1) + parseInt(n2)
let sub=(n1, n2)=>parseInt(n1) - parseInt(n2)
let mult=(n1, n2)=>parseInt(n1) * parseInt(n2)
let div=(n1, n2)=>{
    if (n2==0){
        return "Não é possível dividir por 0."
    }
    return parseInt(n1) / parseInt(n2)
    //return n2==0?"Não é possível dividir por 0.": parseInt(n1) / parseInt(n2)
}

*/