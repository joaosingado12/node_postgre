import { api } from '../api.js'

  
  const form = document.getElementById('cadastro-form');
  const inputCpf = document.getElementById('cpf');
  const msgErro = document.getElementById('mensagem-erro');
  const msgSucesso = document.getElementById('mensagem-sucesso');
  const btnSubmit = document.getElementById('btn-submit');
  
  // Máscara interativa para formatar o CPF enquanto o usuário digita
  inputCpf.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
    
    if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d)/, '$1.$2');
    if (valor.length > 6) valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    if (valor.length > 9) valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
    
    e.target.value = valor;
  });
  
  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
  
    msgErro.classList.add('oculta');
    msgSucesso.classList.add('oculta');
    btnSubmit.innerText = 'Cadastrando...';
    btnSubmit.disabled = true;
  
    try {
      // Remove os pontos e traços do CPF antes de enviar para caber no db.Char(11)
      const cpfLimpo = inputCpf.value.replace(/\D/g, '');
  
      const dadosCadastro = {
        nome: document.getElementById('nome').value,
        cpf: cpfLimpo,
        email: document.getElementById('email').value,
        telefone: document.getElementById('telefone').value || null,
        whatsapp: document.getElementById('whatsapp').value || null,
        senha: document.getElementById('senha').value
      };
  
      // Apontando para o fluxo do seu controlador genérico
      // Certifique-se de que no seu arquivo de rotas, o POST para /usuarios chame o generic.controller.criar
      const resposta = await api.post('/usuarios', dadosCadastro);
  
      msgSucesso.innerText = 'Cadastro realizado com sucesso! Redirecionando para o login...';
      msgSucesso.classList.remove('oculta');
      
      form.reset();
  
      // Aguarda 2 segundos e redireciona o usuário para fazer login
      setTimeout(() => {
        window.location.href = './index.html';
      }, 2000);
  
    } catch (erro) {
      // Tratamento de erros vindo do generic.controller (ex: CPF já existe)
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