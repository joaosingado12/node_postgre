import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Search } from 'lucide-react';
import api from '../services/api';

export default function Home() {
  const [pets, setPets] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // Busca TODOS os pets na rota pública, ignorando as travas de usuário
    api.get('/vitrine')
      .then(response => {
        setPets(response.data);
        setCarregando(false);
      })
      .catch(error => {
        console.error("Erro ao carregar a vitrine", error);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      
      {/* Hero Section */}
      <section className="bg-indigo-600 rounded-3xl p-10 sm:p-16 text-center text-white shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight">
            Encontre seu novo melhor amigo
          </h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto mb-8">
            Nossa vitrine de adoção conecta você a pets que precisam de um lar. 
            Crie sua conta e comece o processo de adoção hoje mesmo!
          </p>
          {!sessionStorage.getItem('@AmigoPet:token') && (
            <Link to="/cadastro" className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-indigo-50 hover:scale-105 transition-all">
              Quero Adotar
            </Link>
          )}
        </div>
      </section>

      {/* Vitrine de Pets */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            Disponíveis para Adoção
          </h2>
        </div>

        {carregando ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Search className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">Nenhum pet cadastrado no sistema no momento.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {pets.map(pet => (
              <div key={pet.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                <div className="h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                  {/* Imagem Placeholder - Em um cenário real, viria do banco de dados */}
                  <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${pet.nome}&backgroundColor=c7d2fe`} alt="Pet Avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                    {pet.tamanho}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-1">{pet.nome}</h3>
                  <p className="text-sm text-slate-500 font-medium mb-4">{pet.especie} • {pet.raca}</p>
                  <div className="mt-auto pt-4 border-t border-slate-100">
                    <button className="w-full bg-indigo-50 text-indigo-700 py-2 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors">
                      Demonstrar Interesse
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

    </div>
  );
}