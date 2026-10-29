import React from 'react';
import { CheckCircle2, Clock, ListTodo, TrendingUp, AlertCircle } from 'lucide-react';
import { GoalStats } from '../types/goal';

interface StatsSummaryProps {
  stats: GoalStats;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Painel de Progresso
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              {stats.total === 1 ? '1 objetivo' : `${stats.total} objetivos cadastrados`}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Acompanhe o andamento das suas metas de aprendizagem
          </p>
        </div>

        {/* Motivational pill */}
        {stats.total > 0 && (
          <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/70 self-start sm:self-auto">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {stats.taxaConclusao === 100
                ? 'Incrível! Todos os objetivos foram concluídos! 🎉'
                : stats.taxaConclusao > 50
                ? 'Mais da metade concluída! Continue firme!'
                : stats.taxaConclusao > 0
                ? 'Bom começo! Mantenha a constância.'
                : 'Defina seu foco e inicie o primeiro objetivo!'}
            </span>
          </div>
        )}
      </div>

      {/* Grid de Contadores */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total cadastrados */}
        <div className="bg-slate-50/70 hover:bg-slate-50 transition-colors border border-slate-200/80 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-slate-500 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Total</span>
            <ListTodo className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {stats.total}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            {stats.total === 1 ? 'Objetivo registrado' : 'Objetivos registrados'}
          </div>
        </div>

        {/* Em andamento */}
        <div className="bg-blue-50/50 hover:bg-blue-50 transition-colors border border-blue-100/90 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-blue-600 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Em foco</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
            {stats.emAndamento}
          </div>
          <div className="text-[11px] text-blue-600/80 mt-1">
            {stats.emAndamento === 1 ? 'Em andamento ativo' : 'Em andamento ativos'}
          </div>
        </div>

        {/* Concluídos */}
        <div className="bg-emerald-50/50 hover:bg-emerald-50 transition-colors border border-emerald-100/90 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-emerald-600 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">Concluídos</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-900 tracking-tight">
            {stats.concluidos}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-1">
            {stats.concluidos === 1 ? 'Objetivo finalizado' : 'Objetivos finalizados'}
          </div>
        </div>

        {/* Não iniciados / Pendentes */}
        <div className="bg-amber-50/40 hover:bg-amber-50/70 transition-colors border border-amber-100/90 rounded-xl p-3.5 sm:p-4">
          <div className="flex items-center justify-between text-amber-600 mb-1.5">
            <span className="text-xs font-medium uppercase tracking-wider">A Iniciar</span>
            {stats.atrasados > 0 ? (
              <span className="inline-flex items-center text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                <AlertCircle className="w-3 h-3 mr-0.5" />
                {stats.atrasados} atrasado{stats.atrasados > 1 ? 's' : ''}
              </span>
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            {stats.naoIniciados}
          </div>
          <div className="text-[11px] text-amber-700/80 mt-1">
            {stats.naoIniciados === 1 ? 'Na fila de espera' : 'Na fila de espera'}
          </div>
        </div>
      </div>

      {/* Barra de Progresso Geral */}
      {stats.total > 0 && (
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Taxa de conclusão</span>
            <span className="text-indigo-600 font-bold">{stats.taxaConclusao}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/50">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-emerald-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${stats.taxaConclusao}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
