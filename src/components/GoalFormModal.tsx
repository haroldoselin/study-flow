import React, { useEffect, useState } from 'react';
import { Calendar, CheckCircle2, Clock, ListTodo, X } from 'lucide-react';
import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: GoalFormData) => void;
  editingGoal?: StudyGoal | null;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
}) => {
  const isEditing = Boolean(editingGoal);

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState<GoalStatus>('nao_iniciado');
  const [errorTitle, setErrorTitle] = useState('');

  // Default deadline: 7 days from today
  const getDefaultDeadline = () => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  };

  // Populate form on open or change
  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setDeadline(editingGoal.deadline || getDefaultDeadline());
      setStatus(editingGoal.status);
    } else {
      setTitle('');
      setDescription('');
      setDeadline(getDefaultDeadline());
      setStatus('nao_iniciado');
    }
    setErrorTitle('');
  }, [editingGoal, isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorTitle('Por favor, informe o título do seu objetivo de estudo.');
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      deadline: deadline || getDefaultDeadline(),
      status,
    });
  };

  // Quick deadline helpers (+days from today)
  const setQuickDeadline = (daysAhead: number) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    setDeadline(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 id="modal-title" className="text-lg font-bold text-slate-900">
              {isEditing ? 'Editar Objetivo de Estudo' : 'Cadastrar Novo Objetivo'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Atualize as informações do seu objetivo de aprendizagem'
                : 'Defina o que você deseja aprender e acompanhe seu progresso'}
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {/* Título */}
          <div>
            <label htmlFor="goal-title" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Título do objetivo <span className="text-rose-500">*</span>
            </label>
            <input
              id="goal-title"
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errorTitle) setErrorTitle('');
              }}
              placeholder="Ex: Aprender laços de repetição em Python"
              maxLength={120}
              className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl focus:outline-hidden focus:ring-2 transition-all ${
                errorTitle
                  ? 'border-rose-400 focus:ring-rose-500/20 focus:border-rose-500'
                  : 'border-slate-300 focus:ring-indigo-500/20 focus:border-indigo-500'
              }`}
              autoFocus
            />
            {errorTitle ? (
              <p className="text-xs text-rose-600 mt-1 font-medium">{errorTitle}</p>
            ) : (
              <p className="text-[11px] text-slate-400 mt-1">
                Seja específico e direto sobre o que quer alcançar.
              </p>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="goal-description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Descrição ou anotações <span className="text-slate-400 font-normal">(opcional)</span>
            </label>
            <textarea
              id="goal-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Assistir aula 3 e 4, fazer exercícios da lista 1 e anotar dúvidas sobre for/while..."
              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Dica: divida em passos menores ou anote os materiais que você vai consultar.
            </p>
          </div>

          {/* Prazo */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="goal-deadline" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Prazo de conclusão <span className="text-rose-500">*</span>
              </label>
            </div>
            <div className="relative">
              <input
                id="goal-deadline"
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 transition-all cursor-pointer"
              />
            </div>

            {/* Quick buttons */}
            <div className="flex items-center gap-1.5 mt-2 flex-wrap">
              <span className="text-[11px] text-slate-400 mr-1">Atalhos:</span>
              <button
                type="button"
                onClick={() => setQuickDeadline(3)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +3 dias
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(7)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +1 semana
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(14)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +2 semanas
              </button>
              <button
                type="button"
                onClick={() => setQuickDeadline(30)}
                className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                +1 mês
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Status atual
            </label>
            <div className="grid grid-cols-3 gap-2">
              {/* Não iniciado */}
              <button
                type="button"
                onClick={() => setStatus('nao_iniciado')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'nao_iniciado'
                    ? 'border-slate-800 bg-slate-800 text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <ListTodo className="w-4 h-4 mb-1" />
                <span>Não iniciado</span>
              </button>

              {/* Em andamento */}
              <button
                type="button"
                onClick={() => setStatus('em_andamento')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'em_andamento'
                    ? 'border-blue-600 bg-blue-600 text-white shadow-xs'
                    : 'border-blue-100 bg-blue-50/60 text-blue-700 hover:bg-blue-100/60'
                }`}
              >
                <Clock className="w-4 h-4 mb-1" />
                <span>Em andamento</span>
              </button>

              {/* Concluído */}
              <button
                type="button"
                onClick={() => setStatus('concluido')}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  status === 'concluido'
                    ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs'
                    : 'border-emerald-100 bg-emerald-50/60 text-emerald-700 hover:bg-emerald-100/60'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mb-1" />
                <span>Concluído</span>
              </button>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-sm shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {isEditing ? 'Salvar Alterações' : 'Cadastrar Objetivo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
