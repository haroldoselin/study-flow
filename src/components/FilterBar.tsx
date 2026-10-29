import React from 'react';
import { ArrowUpDown, Filter, Search, X } from 'lucide-react';
import { FilterStatus, SortOption } from '../types/goal';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  counts: {
    todos: number;
    nao_iniciado: number;
    em_andamento: number;
    concluido: number;
  };
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortOptionChange,
  counts,
}) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3.5">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 justify-between">
        {/* Barra de Pesquisa */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por título ou descrição..."
            className="w-full pl-10 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
              title="Limpar busca"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Seletor de Ordenação */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0 w-full md:w-auto">
          <label htmlFor="sort-select" className="text-xs font-medium text-slate-500 flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ordenar:</span>
          </label>
          <select
            id="sort-select"
            value={sortOption}
            onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
            className="w-full md:w-auto text-xs font-medium bg-slate-50 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer"
          >
            <option value="prazo_asc">Prazo mais próximo</option>
            <option value="prazo_desc">Prazo mais distante</option>
            <option value="recentes">Mais recentes primeiro</option>
            <option value="alfabetica">Ordem alfabética (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Abas de Filtro por Status */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 no-scrollbar border-t border-slate-100">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1 shrink-0">
          <Filter className="w-3 h-3" />
          Filtros:
        </span>

        <button
          onClick={() => onStatusFilterChange('todos')}
          type="button"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'todos'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70'
          }`}
        >
          Todos <span className="opacity-75 font-normal">({counts.todos})</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('em_andamento')}
          type="button"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'em_andamento'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-blue-50/70 text-blue-700 hover:bg-blue-100/70 border border-blue-100'
          }`}
        >
          Em andamento <span className="opacity-75 font-normal">({counts.em_andamento})</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('nao_iniciado')}
          type="button"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'nao_iniciado'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100/80 text-slate-700 hover:bg-slate-200/70'
          }`}
        >
          Não iniciados <span className="opacity-75 font-normal">({counts.nao_iniciado})</span>
        </button>

        <button
          onClick={() => onStatusFilterChange('concluido')}
          type="button"
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            statusFilter === 'concluido'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50/70 text-emerald-700 hover:bg-emerald-100/70 border border-emerald-100'
          }`}
        >
          Concluídos <span className="opacity-75 font-normal">({counts.concluido})</span>
        </button>
      </div>
    </div>
  );
};
