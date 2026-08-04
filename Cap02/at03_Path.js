const path =require('path')
let arquivo='./at03_Path.js'

console.log('Extensão: ', path.extname(arquivo))
console.log('nome completo: ', path.basename(arquivo))
console.log('Unidade Base: ', path.dirname(arquivo))
console.log('Caminho Absoluto: ', path.resolve(arquivo)) 
