import { GoalFormData, GoalStatus, StudyGoal } from '../types/goal';

const STORAGE_KEY = 'studyflow_goals_v1';

// Helper to generate dynamic relative dates (today, +2 days, etc.) so dates always look fresh
const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const INITIAL_SAMPLE_GOALS: StudyGoal[] = [
  {
    id: 'mock-1',
    title: 'Aprender Lógica de Programação: laços de repetição (for e while)',
    description: 'Assistir às videoaulas do Módulo 2 e praticar 5 exercícios de contadores, acumuladores e repetição condicional.',
    deadline: getRelativeDate(2),
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-2',
    title: 'Resolver 15 exercícios de Funções de 1º e 2º Grau',
    description: 'Fazer a lista de Matemática preparatória, anotando o cálculo de raízes e a determinação do vértice da parábola.',
    deadline: getRelativeDate(0), // Prazo termina hoje!
    status: 'em_andamento',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-3',
    title: 'Criar mapa mental de Citologia: organelas e membrana',
    description: 'Esquematizar transportes ativo e passivo, osmose e a função dos ribossomos para a prova de Biologia.',
    deadline: getRelativeDate(5),
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-4',
    title: 'Leitura do guia: Organização de rotina com método Pomodoro',
    description: 'Aprender a planejar blocos de 25 minutos de estudo com pausas ativas e higiene mental para não perder o foco.',
    deadline: getRelativeDate(-1),
    status: 'concluido',
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'mock-5',
    title: 'Vocabulário essencial em Inglês: 30 termos mais usados',
    description: 'Montar flashcards de repetição espaçada com pronúncia, contexto e exemplos de uso em frases reais.',
    deadline: getRelativeDate(9),
    status: 'nao_iniciado',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const storageService = {
  /**
   * Obtém todos os objetivos salvos no localStorage.
   * Caso seja o primeiro acesso (sem chave salva ou lista vazia inicial), inicializa com dados mock para demonstração.
   */
  getGoals(): StudyGoal[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        // Inicializa com dados de demonstração no primeiro acesso
        this.saveGoals(INITIAL_SAMPLE_GOALS);
        return [...INITIAL_SAMPLE_GOALS];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return [];
    } catch (error) {
      console.error('Erro ao carregar objetivos do localStorage:', error);
      return [];
    }
  },

  /**
   * Salva a lista completa de objetivos no localStorage.
   */
  saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Erro ao salvar objetivos no localStorage:', error);
    }
  },

  /**
   * Cadastra um novo objetivo de estudo.
   */
  createGoal(formData: GoalFormData): StudyGoal {
    const newGoal: StudyGoal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const currentGoals = this.getGoals();
    const updatedGoals = [newGoal, ...currentGoals];
    this.saveGoals(updatedGoals);
    return newGoal;
  },

  /**
   * Edita os dados de um objetivo existente.
   */
  updateGoal(id: string, formData: GoalFormData): StudyGoal | null {
    const currentGoals = this.getGoals();
    const index = currentGoals.findIndex(g => g.id === id);

    if (index === -1) {
      return null;
    }

    const updatedGoal: StudyGoal = {
      ...currentGoals[index],
      title: formData.title.trim(),
      description: formData.description.trim(),
      deadline: formData.deadline,
      status: formData.status,
      updatedAt: new Date().toISOString(),
    };

    currentGoals[index] = updatedGoal;
    this.saveGoals(currentGoals);
    return updatedGoal;
  },

  /**
   * Atualiza unicamente o status de um objetivo.
   */
  updateStatus(id: string, status: GoalStatus): StudyGoal | null {
    const currentGoals = this.getGoals();
    const index = currentGoals.findIndex(g => g.id === id);

    if (index === -1) {
      return null;
    }

    const updatedGoal: StudyGoal = {
      ...currentGoals[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    currentGoals[index] = updatedGoal;
    this.saveGoals(currentGoals);
    return updatedGoal;
  },

  /**
   * Exclui um objetivo pelo identificador.
   */
  deleteGoal(id: string): boolean {
    const currentGoals = this.getGoals();
    const filtered = currentGoals.filter(g => g.id !== id);

    if (filtered.length === currentGoals.length) {
      return false;
    }

    this.saveGoals(filtered);
    return true;
  },

  /**
   * Popula ou restaura o armazenamento com os objetivos mock de demonstração.
   */
  loadSampleGoals(): StudyGoal[] {
    this.saveGoals(INITIAL_SAMPLE_GOALS);
    return [...INITIAL_SAMPLE_GOALS];
  },

  /**
   * Limpa todos os dados armazenados.
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error);
    }
  },
};
