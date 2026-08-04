/*
    Modulo url recupera dados passados na string de uma url
*/
const url = require('url')
let uri = 'https://www.google.com/search?q=nodejs&rlz=1C1GCEU_pt-PTBR1198BR1198'
let partUrl = new url.URL(uri)
console.log('Domínio: ', partUrl.host)
console.log('Caminho ou Rota: ', partUrl.pathname)
console.log('Query String: ', partUrl.search)
console.log('Apenas parâmetro: ', partUrl.searchParams)
console.log('Valor do parâmetro q: ', partUrl.searchParams.get('q'))
console.log('Valor do parâmetro rlz: ', partUrl.searchParams.get('rlz'))
