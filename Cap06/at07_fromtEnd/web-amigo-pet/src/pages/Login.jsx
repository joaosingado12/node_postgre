import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom' // Adicionado o Link aqui
import { PawPrint } from 'lucide-react'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await api.post('/login', { email, senha })
      sessionStorage.setItem('@AmigoPet:token', response.data.token)
      navigate('/admin/pets')
    } catch (err) {
      setErro('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-indigo-100 p-4 rounded-full mb-3">
            <PawPrint className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Acesso Restrito</h2>
          <p className="text-slate-500 text-sm mt-1">Informe suas credenciais para continuar</p>
        </div>

        {erro && (
          <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-lg mb-5 text-sm text-center font-medium">
            {erro}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input 
              type="email" 
              required
              placeholder="admin@amigopet.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={email} 
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha</label>
            <input 
              type="password" 
              required
              placeholder="••••••••"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={senha} 
              onChange={e => setSenha(e.target.value)}
            />
          </div>
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 transition font-bold mt-2 shadow-sm">
            Entrar no Sistema
          </button>
        </form>

        {/* Link para a rota pública de cadastro adicionado aqui */}
        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-600">
            Ainda não possui uma conta?{' '}
            <Link to="/cadastro" className="text-indigo-600 font-bold hover:text-indigo-800 hover:underline">
              Cadastre-se aqui
            </Link>
          </p>
        </div>
        
      </div>
    </div>
  )
}