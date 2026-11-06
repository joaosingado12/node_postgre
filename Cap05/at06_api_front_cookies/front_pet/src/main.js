// 1. Configuração Global do Axios
// Isso garante que todas as requisições enviem e recebam cookies automaticamente
const api = axios.create({
  baseURL: 'http://localhost:3000/', // Substitua pela porta do seu Express
  withCredentials: true // ESSENCIAL: Permite que o cookie HttpOnly seja salvo e enviado
});

// Capturando elementos do DOM
const form = document.getElementById('login-form');
const inputEmail = document.getElementById('email');
const inputSenha = document.getElementById('senha');
const msgErro = document.getElementById('mensagem-erro');
const msgSucesso = document.getElementById('mensagem-sucesso');
const btnSubmit = document.getElementById('btn-submit');

// 2. Evento de submissão do formulário
form.addEventListener('submit', async (evento) => {
  evento.preventDefault(); // Impede o recarregamento da página

  // Limpa mensagens anteriores e muda o botão para estado de "carregando"
  msgErro.classList.add('oculta');
  msgSucesso.classList.add('oculta');
  btnSubmit.innerText = 'Autenticando...';
  btnSubmit.disabled = true;

  try {
    // 3. Fazendo a requisição POST para o seu AuthController
    const resposta = await api.post('/login', {
      email: inputEmail.value,
      senha: inputSenha.value
    });

    // Se chegar aqui, o Express retornou 200 OK
    // O cookie já foi salvo pelo navegador automaticamente neste momento!
    
    msgSucesso.innerText = `Bem-vindo, ${resposta.data.usuario.nome}! Redirecionando...`;
    msgSucesso.classList.remove('oculta');

    // 4. Redirecionamento (Simulado após 2 segundos)
    setTimeout(() => {
      // window.location.href = '/dashboard.html';
      console.log('Redirecionando para área interna...');
    }, 2000);

  } catch (erro) {
    // O Axios captura códigos 400, 401, 500 automaticamente e cai no catch
    if (erro.response && erro.response.data) {
      msgErro.innerText = erro.response.data.erro; // Exibe o erro do back-end
    } else {
      msgErro.innerText = 'Erro ao conectar com o servidor.';
    }
    msgErro.classList.remove('oculta');
  } finally {
    // Restaura o botão independente de sucesso ou falha
    btnSubmit.innerText = 'Entrar no sistema';
    btnSubmit.disabled = false;
  }
});