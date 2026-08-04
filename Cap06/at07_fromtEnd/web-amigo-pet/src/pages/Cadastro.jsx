import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function Cadastro() {
  const [form, setForm] = useState({ nome: '', email: '', cpf: '', senha: '' });
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', form);
      setSucesso(true);
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      setErro(err.response?.data?.erro || 'Falha no cadastro. Verifique os dados informados.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-200 w-full max-w-md">
        
        <div className="mb-6 flex flex-col items-center">
          <div className="bg-indigo-100 p-3 rounded-full mb-3 text-indigo-600">
            <UserPlus className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Crie sua Conta</h2>
          <p className="text-slate-500 text-sm">Registro público de novos usuários</p>
        </div>

        {erro && <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium border border-red-200 text-center">{erro}</div>}
        {sucesso && <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium border border-green-200 text-center">Cadastro realizado com sucesso! Redirecionando...</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nome Completo</label>
            <input type="text" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">E-mail</label>
            <input type="email" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">CPF (Somente números)</label>
            <input type="text" required maxLength="11"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Senha de Acesso</label>
            <input type="password" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
          </div>
          
          <button type="submit" disabled={sucesso} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold mt-4 transition-colors disabled:opacity-50">
            Finalizar Cadastro
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition font-medium">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Login
          </Link>
        </div>

      </div>
    </div>
  );
}