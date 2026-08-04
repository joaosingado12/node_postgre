import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Pencil, Trash2, PlusCircle, AlertCircle } from 'lucide-react';

export default function AdminPets() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({ nome: '', especie: '', raca: '', tamanho: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    carregarPets();
  }, []);

  const carregarPets = async () => {
    try {
      // Alterado para /pet (singular) para acionar a rota genérica protegida /:tabela
      const response = await api.get('/pet');
      setPets(response.data);
    } catch (error) {
      setErro('Erro ao carregar a lista de pets.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        // Alterado para /pet
        await api.put(`/pet/${editandoId}`, form);
      } else {
        // Alterado para /pet
        await api.post('/pet', form);
      }
      
      setForm({ nome: '', especie: '', raca: '', tamanho: '' });
      setEditandoId(null);
      setErro('');
      carregarPets();
    } catch (error) {
      setErro(error.response?.data?.erro || 'Erro ao processar a transação.');
    }
  };

  const handleEditar = (pet) => {
    setForm({ 
      nome: pet.nome, 
      especie: pet.especie, 
      raca: pet.raca, 
      tamanho: pet.tamanho 
    });
    setEditandoId(pet.id);
    window.scrollTo(0, 0);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Atenção: Tem certeza que deseja remover este registro permanentemente?')) {
      try {
        // Alterado para /pet
        await api.delete(`/pet/${id}`);
        setErro('');
        carregarPets();
      } catch (error) {
        setErro(error.response?.data?.erro || 'Permissão negada para exclusão.');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Pets</h1>
      </div>

      {erro && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-red-700 text-sm font-medium">{erro}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Painel do Formulário */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 sticky top-24">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" />
              {editandoId ? 'Atualizar Pet' : 'Novo Cadastro'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Pet</label>
                <input type="text" required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Espécie (Ex: Cachorro, Gato)</label>
                <input type="text" required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.especie} onChange={e => setForm({...form, especie: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Raça</label>
                <input type="text" required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.raca} onChange={e => setForm({...form, raca: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tamanho</label>
                <select required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={form.tamanho} onChange={e => setForm({...form, tamanho: e.target.value})}>
                  <option value="">Selecione...</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button type="submit" className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold transition-colors">
                  {editandoId ? 'Salvar Alterações' : 'Cadastrar Pet'}
                </button>
                {editandoId && (
                  <button type="button" onClick={() => { setEditandoId(null); setForm({ nome: '', especie: '', raca: '', tamanho: '' }); }} className="bg-slate-200 text-slate-700 px-4 rounded-lg hover:bg-slate-300 font-bold transition-colors">
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Lista de Pets */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-sm font-semibold text-slate-600">Identificação</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Espécie/Raça</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Porte</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {pets.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-slate-500">
                        Nenhum pet encontrado ou cadastrado em sua conta.
                      </td>
                    </tr>
                  ) : (
                    pets.map(pet => (
                      <tr key={pet.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800">{pet.nome}</td>
                        <td className="p-4 text-slate-600">
                          <span className="block text-sm">{pet.especie}</span>
                          <span className="block text-xs text-slate-400">{pet.raca}</span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {pet.tamanho}
                          </span>
                        </td>
                        <td className="p-4 flex justify-end gap-2">
                          <button onClick={() => handleEditar(pet)} className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Editar">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleExcluir(pet.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Excluir">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}