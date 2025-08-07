'use client';

import { useState } from 'react';
import { Search, Edit, MessageCircle, Trash2, Plus, Settings, Inbox } from 'lucide-react';

// Dados mockados dos corretores - será substituído pela integração com Supabase futuramente
const corretoresMockados = [
  {
    id: 1,
    nome: 'Carlos Silva',
    email: 'carlos.silva@imobiliaria.com',
    telefone: '(11) 99999-1234',
    whatsapp: '(11) 99999-1234',
    imobiliaria: 'Imobiliária Prime',
    regiao: 'Zona Sul - SP',
    especialidade: 'Apartamentos de Alto Padrão',
    comissao: '3%',
    status: 'ativo',
    ultimoContato: '2024-01-15',
    totalVendas: 12,
    observacoes: 'Excelente relacionamento, muito proativo'
  },
  {
    id: 2,
    nome: 'Ana Santos',
    email: 'ana.santos@realtygroup.com.br',
    telefone: '(11) 98888-5678',
    whatsapp: '(11) 98888-5678',
    imobiliaria: 'Realty Group',
    regiao: 'Zona Oeste - SP',
    especialidade: 'Casas e Sobrados',
    comissao: '2.5%',
    status: 'ativo',
    ultimoContato: '2024-01-12',
    totalVendas: 8,
    observacoes: 'Especialista em imóveis familiares'
  },
  {
    id: 3,
    nome: 'Roberto Lima',
    email: 'roberto.lima@maxiMoving.com',
    telefone: '(11) 97777-9012',
    whatsapp: '(11) 97777-9012',
    imobiliaria: 'Maxi Moving',
    regiao: 'Centro - SP',
    especialidade: 'Imóveis Comerciais',
    comissao: '4%',
    status: 'ativo',
    ultimoContato: '2024-01-10',
    totalVendas: 15,
    observacoes: 'Foco em investimentos comerciais'
  },
  {
    id: 4,
    nome: 'Mariana Costa',
    email: 'mariana.costa@homeplus.com.br',
    telefone: '(11) 96666-3456',
    whatsapp: '(11) 96666-3456',
    imobiliaria: 'Home Plus',
    regiao: 'Zona Norte - SP',
    especialidade: 'Apartamentos Econômicos',
    comissao: '2%',
    status: 'inativo',
    ultimoContato: '2023-12-20',
    totalVendas: 5,
    observacoes: 'Sem contato recente'
  },
  {
    id: 5,
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@luxuryrealty.com',
    telefone: '(11) 95555-7890',
    whatsapp: '(11) 95555-7890',
    imobiliaria: 'Luxury Realty',
    regiao: 'Zona Sul - SP',
    especialidade: 'Imóveis de Luxo',
    comissao: '5%',
    status: 'ativo',
    ultimoContato: '2024-01-14',
    totalVendas: 20,
    observacoes: 'Top performer, excelente network'
  }
];

export default function CorretoresPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [filtroRegiao, setFiltroRegiao] = useState('todas');

  // Filtros aplicados
  const corretoresFiltrados = corretoresMockados.filter(corretor => {
    const matchSearch = corretor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       corretor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       corretor.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filtroStatus === 'todos' || corretor.status === filtroStatus;
    
    const matchRegiao = filtroRegiao === 'todas' || corretor.regiao === filtroRegiao;

    return matchSearch && matchStatus && matchRegiao;
  });

  // Estatísticas
  const totalCorretores = corretoresMockados.length;
  const corretoresAtivos = corretoresMockados.filter(c => c.status === 'ativo').length;
  const totalVendasGeral = corretoresMockados.reduce((sum, c) => sum + c.totalVendas, 0);

  // Obter regiões únicas para o filtro
  const regioes = [...new Set(corretoresMockados.map(c => c.regiao))];

  const getStatusBadge = (status: string) => {
    return status === 'ativo' 
      ? 'bg-green-100 text-green-800 border border-green-200'
      : 'bg-gray-100 text-gray-600 border border-gray-200';
  };

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Corretores</h1>
            <p className="text-sm text-slate-600 mt-1">
              Gerenciamento de relacionamento com corretores parceiros
            </p>
          </div>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Adicionar Corretor</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <div className="flex space-x-6">
          <div className="text-center">
            <div className="text-2xl font-semibold text-slate-900">{totalCorretores}</div>
            <div className="text-sm text-slate-600">Total de Corretores</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-green-600">{corretoresAtivos}</div>
            <div className="text-sm text-slate-600">Ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-semibold text-blue-600">{totalVendasGeral}</div>
            <div className="text-sm text-slate-600">Total de Vendas</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="px-6 py-4 bg-white border-b border-slate-200">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Busca */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por nome, email ou imobiliária..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Filtro Status */}
          <div>
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="todos">Todos os Status</option>
              <option value="ativo">Ativos</option>
              <option value="inativo">Inativos</option>
            </select>
          </div>

          {/* Filtro Região */}
          <div>
            <select
              value={filtroRegiao}
              onChange={(e) => setFiltroRegiao(e.target.value)}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="todas">Todas as Regiões</option>
              {regioes.map(regiao => (
                <option key={regiao} value={regiao}>{regiao}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="flex-1 overflow-auto">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Corretor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Imobiliária
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Especialidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {corretoresFiltrados.map((corretor) => (
                <tr key={corretor.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-slate-900">{corretor.nome}</div>
                      <div className="text-sm text-slate-500">{corretor.regiao}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{corretor.email}</div>
                    <div className="text-sm text-slate-500">{formatarTelefone(corretor.telefone)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{corretor.imobiliaria}</div>
                    <div className="text-sm text-slate-500">Comissão: {corretor.comissao}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{corretor.especialidade}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{corretor.totalVendas} vendas</div>
                    <div className="text-sm text-slate-500">Último contato: {new Date(corretor.ultimoContato).toLocaleDateString('pt-BR')}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(corretor.status)}`}>
                      {corretor.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        className="text-blue-600 hover:text-blue-900 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-green-600 hover:text-green-900 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </button>
                      <button 
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mensagem quando não há resultados */}
        {corretoresFiltrados.length === 0 && (
          <div className="text-center py-12">
            <Inbox className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-slate-900">Nenhum corretor encontrado</h3>
            <p className="mt-1 text-sm text-slate-500">Tente ajustar os filtros de busca.</p>
          </div>
        )}
      </div>
    </div>
  );
}