const calculadora = {
    soma:(n1, n2)=>parseInt(n1) + parseInt(n2),
    sub:(n1, n2)=>parseInt(n1) - parseInt(n2),
    mult:(n1, n2)=>parseInt(n1) * parseInt(n2),
    div:(n1, n2)=>{
        if (n2==0){
            return "Não é possível dividir por 0."
        }
        return parseInt(n1) / parseInt(n2)
        //return n2==0?"Não é possível dividir por 0.": parseInt(n1) / parseInt(n2)
    }
}
export default calculadora