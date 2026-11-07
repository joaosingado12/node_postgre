import { api } from '../api.js';

// 1. Verificação instantânea: tem alguém logado no LocalStorage?
const usuarioString = localStorage.getItem('usuario');

if (!usuarioString) {
  // Se não encontrar os dados, o usuário digitou a URL direto sem logar.
  // Mandamos ele de volta para a tela de login.
  window.location.href = './login.html'; // Atualizado para o seu novo nome de arquivo!
} else {
  // Se achou, converte a string de volta para Objeto e exibe o nome
  const usuario = JSON.parse(usuarioString);
  document.getElementById('nome-usuario').innerText = usuario.nome;
}

// 2. Função de Logout
const btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener('click', async () => {
  try {
    // Faremos uma chamada para a API destruir o cookie (explicado na próxima sugestão)
    await api.post('/logout'); 
  } catch (error) {
    console.warn("Erro ao deslogar na API, forçando saída local...");
  } finally {
    // Independente do que o back-end disser, limpamos o LocalStorage e mandamos pro login
    localStorage.removeItem('usuario');
    window.location.href = './login.html';
  }
});

// 3. (Opcional) Teste de Rota Protegida 
// Esse código prova que o Cookie HttpOnly está funcionando
async function buscarPetsProtegidos() {
  try {
    // Como a rota genérica é dinâmica, chamamos os pets do usuário logado
    // Se o cookie não estiver lá, o back-end retornará erro 401
    const resposta = await api.get('/pets'); 
    
    const listaPets = document.getElementById('lista-pets');
    listaPets.innerHTML = ''; // Limpa o "Carregando..."
    
    if (resposta.data.length === 0) {
      listaPets.innerHTML = '<li>Você não possui pets cadastrados.</li>';
      return;
    }

    resposta.data.forEach(pet => {
      listaPets.innerHTML += `<li>🐾 <strong>${pet.nome}</strong> - ${pet.especie} (${pet.raca})</li>`;
    });

  } catch (erro) {
    if (erro.response && erro.response.status === 401) {
      alert("Sua sessão expirou. Por favor, faça login novamente.");
      localStorage.removeItem('usuario');
      window.location.href = './login.html';
    } else {
      document.getElementById('lista-pets').innerHTML = '<li>Erro ao carregar os dados.</li>';
    }
  }
}

// Inicia a busca de dados na API assim que a página abre
buscarPetsProtegidos();