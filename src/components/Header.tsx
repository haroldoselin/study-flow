import React from 'react';
import { BookOpenCheck, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onLoadSamples: () => void;
  totalGoals: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onLoadSamples, totalGoals }) => {
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpenCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Study<span className="text-indigo-600">Flow</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Iniciantes
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium line-clamp-1">
              Organize seus objetivos de estudo com foco e calma
            </p>
          </div>
        </div>

        {/* CTA Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadSamples}
            type="button"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/80 hover:bg-indigo-100 border border-indigo-200/70 transition-colors cursor-pointer"
            title="Recarregar dados de demonstração recomendados para estudantes"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Dados de Demonstração</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/20 transition-all duration-150 transform hover:-translate-y-0.5 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer"
            title="Cadastrar um novo objetivo de estudo"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden xs:inline">Novo Objetivo</span>
            <span className="xs:hidden">Criar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
