// Configuração Global do Axios (Mesma do main.js)
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Ajuste para a sua rota base
    withCredentials: true
});

const form = document.getElementById('cadastro-form');
const msgErro = document.getElementById('mensagem-erro');
const msgSucesso = document.getElementById('mensagem-sucesso');
const btnSubmit = document.getElementById('btn-submit');

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    msgErro.classList.add('oculta');
    msgSucesso.classList.add('oculta');
    btnSubmit.innerText = 'Cadastrando...';
    btnSubmit.disabled = true;

    try {
        // Montando o payload com os valores dos inputs
        const dadosCadastro = {
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value,
            telefone: document.getElementById('telefone').value || null, // Trata os opcionais
            whatsapp: document.getElementById('whatsapp').value || null,
            senha: document.getElementById('senha').value
        };

        // Chamada POST para a sua API Express
        const resposta = await api.post('/usuarios', dadosCadastro);

        msgSucesso.innerText = 'Cadastro realizado! Redirecionando para o login...';
        msgSucesso.classList.remove('oculta');

        // Limpa o formulário
        form.reset();

        // Redireciona para a tela de login após 2 segundos
        setTimeout(() => {
            window.location.href = './index.html';
        }, 2000);

    } catch (erro) {
        if (erro.response && erro.response.data) {
            msgErro.innerText = erro.response.data.erro;
        } else {
            msgErro.innerText = 'Erro ao conectar com o servidor.';
        }
        msgErro.classList.remove('oculta');
    } finally {
        btnSubmit.innerText = 'Finalizar Cadastro';
        btnSubmit.disabled = false;
    }
});