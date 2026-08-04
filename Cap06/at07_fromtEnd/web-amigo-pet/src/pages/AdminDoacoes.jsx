import { useEffect, useState } from 'react'
import { Trash2, Edit2, HeartHandshake } from 'lucide-react'
import api from '../services/api'

export default function AdminDoacoes() {
  const [doacoes, setDoacoes] = useState([])
  const [form, setForm] = useState({ id_pet: '', id_cli_interesse: '', data_interesse: '', data_doacao: '', status: 'Em Análise' })
  const [editandoId, setEditandoId] = useState(null)

  const carregarDoacoes = () => {
    api.get('/doacoes').then(res => setDoacoes(res.data)).catch(err => console.error(err))
  }

  useEffect(() => { carregarDoacoes() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = { 
        ...form, 
        id_pet: Number(form.id_pet), 
        id_cli_interesse: form.id_cli_interesse ? Number(form.id_cli_interesse) : null,
        data_interesse: form.data_interesse ? new Date(form.data_interesse).toISOString() : null,
        data_doacao: form.data_doacao ? new Date(form.data_doacao).toISOString() : null
      }

      if (editandoId) {
        await api.put(`/doacoes/${editandoId}`, payload)
      } else {
        await api.post('/doacoes', payload)
      }
      
      setForm({ id_pet: '', id_cli_interesse: '', data_interesse: '', data_doacao: '', status: 'Em Análise' })
      setEditandoId(null)
      carregarDoacoes()
    } catch (error) {
      alert("Erro ao tramitar processo. IDs inválidos.")
    }
  }

  const handleEdit = (doacao) => {
    setEditandoId(doacao.id)
    setForm({ 
      id_pet: doacao.id_pet, 
      id_cli_interesse: doacao.id_cli_interesse || '', 
      data_interesse: doacao.data_interesse ? doacao.data_interesse.split('T')[0] : '', 
      data_doacao: doacao.data_doacao ? doacao.data_doacao.split('T')[0] : '', 
      status: doacao.status || 'Em Análise'
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Deseja apagar permanentemente este registro de processo?")) {
      await api.delete(`/doacoes/${id}`)
      carregarDoacoes()
    }
  }

  const renderStatusBadge = (status) => {
    switch(status) {
      case 'Concluído': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">Concluído</span>
      case 'Cancelado': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">Cancelado</span>
      default: return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold">Em Análise</span>
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Formulário */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-indigo-600" />
          {editandoId ? 'Editar Processo' : 'Novo Processo'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">ID do Pet</label>
            <input type="number" required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.id_pet} onChange={e => setForm({...form, id_pet: e.target.value})} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">ID do Adotante (Opcional)</label>
            <input type="number"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={form.id_cli_interesse} onChange={e => setForm({...form, id_cli_interesse: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Data Início</label>
              <input type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                value={form.data_interesse} onChange={e => setForm({...form, data_interesse: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Data Final</label>
              <input type="date"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700"
                value={form.data_doacao} onChange={e => setForm({...form, data_doacao: e.target.value})} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Situação</label>
            <select 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-slate-700"
              value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
              <option value="Em Análise">Em Análise</option>
              <option value="Concluído">Concluído</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 font-bold mt-2 shadow-sm">
            {editandoId ? 'Atualizar Trâmite' : 'Gravar Adoção'}
          </button>
          
          {editandoId && (
            <button type="button" onClick={() => { setEditandoId(null); setForm({id_pet:'', id_cli_interesse:'', data_interesse:'', data_doacao:'', status:'Em Análise'}) }} 
              className="w-full bg-slate-100 text-slate-700 py-2.5 rounded-lg hover:bg-slate-200 font-semibold mt-2 transition-colors">
              Cancelar
            </button>
          )}
        </form>
      </div>

      {/* Tabela de Listagem */}
      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Trâmites de Adoção</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-y border-slate-200">
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">ID</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Vinculação</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600">Situação</th>
              <th className="py-3 px-4 text-sm font-semibold text-slate-600 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {doacoes.map(doc => (
              <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-slate-500">#{doc.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-800">Pet #{doc.id_pet}</div>
                  <div className="text-xs text-slate-500">
                    Adotante: {doc.id_cli_interesse ? `#${doc.id_cli_interesse}` : 'Pendente'}
                  </div>
                </td>
                <td className="py-3 px-4">
                  {renderStatusBadge(doc.status)}
                </td>
                <td className="py-3 px-4 flex justify-end gap-2">
                  <button onClick={() => handleEdit(doc)} className="p-2 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors">
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