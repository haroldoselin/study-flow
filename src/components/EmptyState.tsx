import React from 'react';
import { BookOpen, Sparkles, Plus, SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  type: 'no_goals' | 'no_filter_results';
  onOpenCreateModal: () => void;
  onLoadSamples?: () => void;
  onResetFilters?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  onOpenCreateModal,
  onLoadSamples,
  onResetFilters,
}) => {
  if (type === 'no_filter_results') {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mx-auto mb-4">
          <SearchX className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1.5">
          Nenhum objetivo encontrado
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
          Não encontramos nenhum objetivo correspondente à sua busca ou filtro atual.
        </p>
        {onResetFilters && (
          <button
            onClick={onResetFilters}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Limpar filtros e busca</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50/30 border border-indigo-100/80 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-xs">
      <div className="relative w-20 h-20 mx-auto mb-5">
        <div className="w-20 h-20 rounded-3xl bg-indigo-100/80 flex items-center justify-center text-indigo-600 shadow-inner">
          <BookOpen className="w-10 h-10 stroke-[1.75]" />
        </div>
        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
          <Sparkles className="w-4 h-4" />
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
        Comece sua jornada de aprendizado!
      </h3>
      <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-8 leading-relaxed">
        Você ainda não cadastrou nenhum objetivo de estudo. O segredo para aprender bem é quebrar metas grandes em passos simples e com prazos claros.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onOpenCreateModal}
          type="button"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-sm shadow-indigo-600/25 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Cadastrar primeiro objetivo</span>
        </button>

        {onLoadSamples && (
          <button
            onClick={onLoadSamples}
            type="button"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-indigo-700 bg-white hover:bg-indigo-50 border border-indigo-200/90 transition-all cursor-pointer"
          >
            <span>Ver objetivos de exemplo</span>
          </button>
        )}
      </div>

      {/* Beginner friendly tip card */}
      <div className="mt-8 pt-6 border-t border-indigo-100/60 text-left bg-white/70 rounded-xl p-4 border text-xs text-slate-600">
        <div className="font-semibold text-indigo-950 flex items-center gap-1.5 mb-1">
          💡 Dica para iniciantes:
        </div>
        <p className="text-[12px] leading-relaxed text-slate-600">
          Comece com metas curtas (de 3 a 7 dias), como <em>&ldquo;Ler 1 capítulo de introdução&rdquo;</em> ou <em>&ldquo;Assistir 2 videoaulas e resumir as ideias centrais&rdquo;</em>.
        </p>
      </div>
    </div>
  );
};
