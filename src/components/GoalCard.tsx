import React from 'react';
import { motion } from 'motion/react';
import { Calendar, CheckCircle2, ChevronDown, Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import { GoalStatus, StudyGoal } from '../types/goal';
import { getDeadlineInfo, STATUS_CONFIG } from '../utils/formatters';

interface GoalCardProps {
  goal: StudyGoal;
  onEdit: (goal: StudyGoal) => void;
  onRequestDelete: (goal: StudyGoal) => void;
  onUpdateStatus: (id: string, newStatus: GoalStatus) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({
  goal,
  onEdit,
  onRequestDelete,
  onUpdateStatus,
}) => {
  const statusCfg = STATUS_CONFIG[goal.status];
  const deadlineInfo = getDeadlineInfo(goal.deadline, goal.status);
  const isConcluido = goal.status === 'concluido';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between p-5 hover:shadow-md ${
        isConcluido
          ? 'border-emerald-200/70 bg-gradient-to-b from-white to-emerald-50/20'
          : deadlineInfo.isOverdue
          ? 'border-rose-200/90 hover:border-rose-300'
          : 'border-slate-200/90 hover:border-indigo-200'
      }`}
    >
      <div>
        {/* Top bar: Status badge & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {/* Status selector badge */}
          <div className="relative inline-flex items-center">
            <label htmlFor={`status-${goal.id}`} className="sr-only">Alterar status</label>
            <div
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusCfg.badgeBg} ${statusCfg.badgeText} ${statusCfg.badgeBorder}`}
            >
              <span className={`w-2 h-2 rounded-full ${statusCfg.dotColor}`} />
              <span>{statusCfg.label}</span>
              <ChevronDown className="w-3 h-3 opacity-60 ml-0.5 pointer-events-none" />
            </div>

            {/* Native transparent select over badge for accessible instant switching */}
            <select
              id={`status-${goal.id}`}
              value={goal.status}
              onChange={(e) => onUpdateStatus(goal.id, e.target.value as GoalStatus)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              title="Clique para alterar status rapidamente"
            >
              <option value="nao_iniciado">Não iniciado</option>
              <option value="em_andamento">Em andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(goal)}
              type="button"
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Editar objetivo"
              aria-label={`Editar ${goal.title}`}
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onRequestDelete(goal)}
              type="button"
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Excluir objetivo"
              aria-label={`Excluir ${goal.title}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`text-base font-bold text-slate-900 leading-snug tracking-tight mb-2 ${
            isConcluido ? 'line-through text-slate-500' : ''
          }`}
        >
          {goal.title}
        </h3>

        {/* Description */}
        {goal.description ? (
          <p
            className={`text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4 line-clamp-4 ${
              isConcluido ? 'text-slate-400' : ''
            }`}
          >
            {goal.description}
          </p>
        ) : (
          <p className="text-xs text-slate-400 italic mb-4">Sem descrição detalhada.</p>
        )}
      </div>

      {/* Card Footer: Deadline & Quick Toggle */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto text-xs">
        {/* Deadline indicator */}
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium border text-[11px] sm:text-xs ${deadlineInfo.colorClass}`}
          title={`Prazo final: ${goal.deadline}`}
        >
          <Calendar className="w-3.5 h-3.5 shrink-0" />
          <span>{deadlineInfo.text}</span>
        </div>

        {/* Mark as completed fast-action toggle */}
        <button
          onClick={() =>
            onUpdateStatus(goal.id, isConcluido ? 'em_andamento' : 'concluido')
          }
          type="button"
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors cursor-pointer ${
            isConcluido
              ? 'text-emerald-700 bg-emerald-100/60 hover:bg-emerald-200/60'
              : 'text-slate-600 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
          title={isConcluido ? 'Reabrir objetivo' : 'Marcar como concluído'}
        >
          <CheckCircle2 className={`w-3.5 h-3.5 ${isConcluido ? 'text-emerald-600' : 'text-slate-400'}`} />
          <span>{isConcluido ? 'Concluído' : 'Concluir'}</span>
        </button>
      </div>
    </motion.div>
  );
};
