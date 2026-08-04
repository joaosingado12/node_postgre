import { useEffect, useState } from 'react'
import { Trash2, Edit2, Users } from 'lucide-react'
import api from '../services/api'

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([])
  const [form, setForm] = useState({ nome: '', cpf: '', email: '', telefone: '', whatsapp: '', senha: '' })
  const [editandoId, setEditandoId] = useState(null)

  const carregarUsuarios = () => {
    api.get('/usuarios').then(res => setUsuarios(res.data)).catch(err => console.error(err))
  }

  useEffect(() => { carregarUsuarios() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, form)
      } else {
        await api.post('/usuarios', form)
      }
      
      setForm({ nome: '', cpf: '', email: '', telefone: '', whatsapp: '', senha: '' })
      setEditandoId(null)
      carregarUsuarios()
    } catch (error) {
      alert("Falha. Verifique se o CPF ou E-mail já estão em uso.")
    }
  }

  const handleEdit = (user) => {
    setEditandoId(user.id)
    setForm({ 
      nome: user.nome, 
      cpf: user.cpf, 
      email: user.email, 
      telefone: user.telefone || '', 
      whatsapp: user.whatsapp || '', 
      senha: '' 
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Atenção: A exclusão do usuário apagará também os pets dele. Continuar?")) {
      await api.delete(`/usuarios/${id}`)
      carregarUsuarios()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          {editandoId ? 'Editar Perfil' : 'Novo Usuário'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo</label>
            <input type="text" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">E-mail</label>
            <input type="email" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">CPF (Somente números)</label>
            <input type="text" required maxLength="11"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Telefone</label>
              <input type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">WhatsApp</label>
              <input type="text"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} />
            </div>
          </div>
          {!editandoId && (
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Senha de Acesso</label>
              <input type="password" required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={form.senha} onChange={e => setForm({...form, senha: e.target.value})} />
            </div>
          )}
          
          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold mt-2 shadow-sm">
            {editandoId ? 'Salvar Alterações' : 'Cadastrar Perfil'}
          </button>
          
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setForm({nome:'', cpf:'', email:'', telefone:'', whatsapp:'', senha:''}) }} 
              className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-semibold mt-2 transition-colors">
              Cancelar Edição
            </button>
          )}
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Controle de Usuários</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">ID</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Usuário</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Contato</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-slate-500">#{user.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">{user.nome}</div>
                  <div className="text-xs text-slate-500">{user.email}</div>
                  <div className="text-xs text-slate-400">CPF: {user.cpf}</div>
                </td>
                <td className="py-3 px-4 text-sm text-slate-600">{user.whatsapp || user.telefone || 'Sem contato'}</td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(user)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}