import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import { PawPrint, LogOut, Home as HomeIcon, Users, HeartHandshake, ShieldAlert } from 'lucide-react';

// Importação das páginas
import Home from './pages/Home';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import AdminPets from './pages/AdminPets';
import AdminUsuarios from './pages/AdminUsuarios';
import AdminDoacoes from './pages/AdminDoacoes';

// Componente de Proteção de Rotas Privadas (Guarda de Rota)
function RotaProtegida({ children }) {
  const token = sessionStorage.getItem('@AmigoPet:token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Componente de Layout Shell (Barra Superior e Menu Mobile)
function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const temToken = sessionStorage.getItem('@AmigoPet:token');

  const handleSair = () => {
    sessionStorage.removeItem('@AmigoPet:token');
    navigate('/login');
  };

  const baseLinkClass = "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Barra de Navegação Superior (Desktop) */}
      <header className="bg-indigo-600 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl tracking-tight hover:opacity-90 transition">
              <PawPrint className="w-6 h-6" />
              <span>Amigo Pet</span>
            </Link>

            <nav className="hidden md:flex items-center gap-2">
              <Link 
                to="/" 
                className={`${baseLinkClass} ${location.pathname === '/' ? 'bg-indigo-700 text-white shadow-sm' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}
              >
                <HomeIcon className="w-4 h-4" />
                Vitrine
              </Link>
              
              <Link 
                to="/admin/usuarios" 
                className={`${baseLinkClass} ${location.pathname === '/admin/usuarios' ? 'bg-indigo-700 text-white shadow-sm' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}
              >
                <Users className="w-4 h-4" />
                Usuários
              </Link>
              
              <Link 
                to="/admin/pets" 
                className={`${baseLinkClass} ${location.pathname === '/admin/pets' ? 'bg-indigo-700 text-white shadow-sm' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}
              >
                <PawPrint className="w-4 h-4" />
                Pets
              </Link>
              
              <Link 
                to="/admin/doacoes" 
                className={`${baseLinkClass} ${location.pathname === '/admin/doacoes' ? 'bg-indigo-700 text-white shadow-sm' : 'text-indigo-100 hover:bg-indigo-500 hover:text-white'}`}
              >
                <HeartHandshake className="w-4 h-4" />
                Adoções
              </Link>
            </nav>

            <div className="flex items-center gap-4">
              {temToken ? (
                <button 
                  onClick={handleSair}
                  className="flex items-center gap-2 bg-indigo-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 shadow-sm"
                >
                  Entrar no Sistema
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Menu de Navegação Inferior Fixo (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50 shadow-lg">
        <Link to="/" className={`flex flex-col items-center text-xs ${location.pathname === '/' ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>
          <HomeIcon className="w-5 h-5 mb-0.5" />
          Vitrine
        </Link>
        <Link to="/admin/usuarios" className={`flex flex-col items-center text-xs ${location.pathname === '/admin/usuarios' ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>
          <Users className="w-5 h-5 mb-0.5" />
          Usuários
        </Link>
        <Link to="/admin/pets" className={`flex flex-col items-center text-xs ${location.pathname === '/admin/pets' ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>
          <PawPrint className="w-5 h-5 mb-0.5" />
          Pets
        </Link>
        <Link to="/admin/doacoes" className={`flex flex-col items-center text-xs ${location.pathname === '/admin/doacoes' ? 'text-indigo-600 font-semibold' : 'text-slate-500'}`}>
          <HeartHandshake className="w-5 h-5 mb-0.5" />
          Adoções
        </Link>
      </nav>

      {/* Área de Injeção de Conteúdo */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 mb-16 md:mb-0">
        {children}
      </main>

    </div>
  );
}

// Gerenciador Central de Rotas (SPA)
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Layout><Home /></Layout>} />
        
        {/* Rotas Administrativas Privadas */}
        <Route path="/admin/usuarios" element={
          <RotaProtegida>
            <Layout><AdminUsuarios /></Layout>
          </RotaProtegida>
        } />

        <Route path="/admin/pets" element={
          <RotaProtegida>
            <Layout><AdminPets /></Layout>
          </RotaProtegida>
        } />

        <Route path="/admin/doacoes" element={
          <RotaProtegida>
            <Layout><AdminDoacoes /></Layout>
          </RotaProtegida>
        } />

        {/* Fallback de Rota Inexistente (404) */}
        <Route path="*" element={
          <Layout>
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ShieldAlert className="w-16 h-16 text-slate-400 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800 mb-1">Página não encontrada</h2>
              <p className="text-slate-500 mb-6">O endereço inserido não corresponde a nenhuma rota mapeada no ecossistema.</p>
              <Link to="/" className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition">
                Voltar para o Início
              </Link>
            </div>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}