import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Info, Plus, Sparkles } from 'lucide-react';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal';
import { EmptyState } from './components/EmptyState';
import { FilterBar } from './components/FilterBar';
import { GoalCard } from './components/GoalCard';
import { GoalFormModal } from './components/GoalFormModal';
import { Header } from './components/Header';
import { StatsSummary } from './components/StatsSummary';
import { storageService } from './services/storageService';
import { FilterStatus, GoalFormData, GoalStats, GoalStatus, SortOption, StudyGoal } from './types/goal';

export default function App() {
  // State
  const [goals, setGoals] = useState<StudyGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<StudyGoal | null>(null);
  const [deletingGoal, setDeletingGoal] = useState<StudyGoal | null>(null);

  // Filters and search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('todos');
  const [sortOption, setSortOption] = useState<SortOption>('prazo_asc');

  // Friendly toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(prev => (prev === message ? null : prev));
    }, 3500);
  };

  // Load goals from storage on component mount
  useEffect(() => {
    let loaded = storageService.getGoals();
    if (loaded.length === 0) {
      loaded = storageService.loadSampleGoals();
    }
    setGoals(loaded);
    setIsLoaded(true);
  }, []);

  // Compute stats
  const stats: GoalStats = useMemo(() => {
    const total = goals.length;
    const naoIniciados = goals.filter(g => g.status === 'nao_iniciado').length;
    const emAndamento = goals.filter(g => g.status === 'em_andamento').length;
    const concluidos = goals.filter(g => g.status === 'concluido').length;
    const taxaConclusao = total > 0 ? Math.round((concluidos / total) * 100) : 0;

    // Calculate overdue (not completed and deadline < today)
    const todayStr = new Date().toISOString().split('T')[0];
    const atrasados = goals.filter(
      g => g.status !== 'concluido' && g.deadline && g.deadline < todayStr
    ).length;

    return {
      total,
      naoIniciados,
      emAndamento,
      concluidos,
      taxaConclusao,
      atrasados,
    };
  }, [goals]);

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      todos: goals.length,
      nao_iniciado: goals.filter(g => g.status === 'nao_iniciado').length,
      em_andamento: goals.filter(g => g.status === 'em_andamento').length,
      concluido: goals.filter(g => g.status === 'concluido').length,
    };
  }, [goals]);

  // Filtered and sorted goals list
  const filteredGoals = useMemo(() => {
    let result = [...goals];

    // Filter by status
    if (statusFilter !== 'todos') {
      result = result.filter(g => g.status === statusFilter);
    }

    // Filter by search query (title or description)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        g =>
          g.title.toLowerCase().includes(term) ||
          (g.description && g.description.toLowerCase().includes(term))
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOption === 'prazo_asc') {
        return (a.deadline || '').localeCompare(b.deadline || '');
      }
      if (sortOption === 'prazo_desc') {
        return (b.deadline || '').localeCompare(a.deadline || '');
      }
      if (sortOption === 'recentes') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortOption === 'alfabetica') {
        return a.title.localeCompare(b.title, 'pt-BR');
      }
      return 0;
    });

    return result;
  }, [goals, statusFilter, searchTerm, sortOption]);

  // Handlers
  const handleOpenCreateModal = () => {
    setEditingGoal(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (goal: StudyGoal) => {
    setEditingGoal(goal);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (formData: GoalFormData) => {
    if (editingGoal) {
      const updated = storageService.updateGoal(editingGoal.id, formData);
      if (updated) {
        setGoals(storageService.getGoals());
        showToast('Objetivo atualizado com sucesso!');
      }
    } else {
      const created = storageService.createGoal(formData);
      setGoals(storageService.getGoals());
      showToast('Novo objetivo cadastrado com sucesso!');
    }
    setIsFormModalOpen(false);
    setEditingGoal(null);
  };

  const handleQuickStatusUpdate = (id: string, newStatus: GoalStatus) => {
    const updated = storageService.updateStatus(id, newStatus);
    if (updated) {
      setGoals(storageService.getGoals());
      if (newStatus === 'concluido') {
        showToast('Parabéns! Objetivo marcado como concluído! 🎉');
      } else {
        showToast('Status atualizado.');
      }
    }
  };

  const handleRequestDelete = (goal: StudyGoal) => {
    setDeletingGoal(goal);
  };

  const handleConfirmDelete = () => {
    if (deletingGoal) {
      storageService.deleteGoal(deletingGoal.id);
      setGoals(storageService.getGoals());
      showToast('Objetivo excluído com sucesso.');
      setDeletingGoal(null);
    }
  };

  const handleLoadSamples = () => {
    const samples = storageService.loadSampleGoals();
    setGoals(samples);
    showToast('Exemplos de objetivos carregados!');
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setStatusFilter('todos');
    setSortOption('prazo_asc');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">Carregando seus objetivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        onLoadSamples={handleLoadSamples}
        totalGoals={stats.total}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Painel de Estatísticas & Contagem */}
        <StatsSummary stats={stats} />

        {/* Barra de Filtros, Pesquisa e Ordenação */}
        {goals.length > 0 && (
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            sortOption={sortOption}
            onSortOptionChange={setSortOption}
            counts={counts}
          />
        )}

        {/* Lista de Objetivos ou Estados Vazios */}
        {goals.length === 0 ? (
          <EmptyState
            type="no_goals"
            onOpenCreateModal={handleOpenCreateModal}
            onLoadSamples={handleLoadSamples}
          />
        ) : filteredGoals.length === 0 ? (
          <EmptyState
            type="no_filter_results"
            onOpenCreateModal={handleOpenCreateModal}
            onResetFilters={handleResetFilters}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-600 px-1">
              <span>
                Exibindo {filteredGoals.length}{' '}
                {filteredGoals.length === 1 ? 'objetivo' : 'objetivos'}
                {statusFilter !== 'todos' ? ` (${statusFilter.replace('_', ' ')})` : ''}
              </span>
              <button
                onClick={handleOpenCreateModal}
                type="button"
                className="text-indigo-600 hover:text-indigo-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Adicionar outro</span>
              </button>
            </div>

            {/* Grid responsivo de cartões */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredGoals.map((goal) => (
                  <GoalCard
                    key={goal.id}
                    goal={goal}
                    onEdit={handleOpenEditModal}
                    onRequestDelete={handleRequestDelete}
                    onUpdateStatus={handleQuickStatusUpdate}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Footer simples e acolhedor */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">StudyFlow</span>
            <span>•</span>
            <span>Seus dados são salvos com segurança no seu navegador</span>
          </div>
          <div className="flex items-center gap-4">
            {goals.length > 0 && (
              <button
                onClick={handleLoadSamples}
                type="button"
                className="text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
                title="Recarregar sugestões de estudo para inspiração"
              >
                Restaurar exemplos
              </button>
            )}
            <span className="text-slate-400">© StudyFlow — Feito para estudantes</span>
          </div>
        </div>
      </footer>

      {/* Modal de Formulário (Cadastrar / Editar) */}
      <GoalFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleFormSubmit}
        editingGoal={editingGoal}
      />

      {/* Modal de Confirmação de Exclusão */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingGoal)}
        goal={deletingGoal}
        onClose={() => setDeletingGoal(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Toast de Notificação */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-medium border border-slate-800"
          >
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
