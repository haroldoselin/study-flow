export type GoalStatus = 'nao_iniciado' | 'em_andamento' | 'concluido';

export interface StudyGoal {
  id: string;
  title: string;
  description: string;
  deadline: string; // formato YYYY-MM-DD
  status: GoalStatus;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type GoalFormData = {
  title: string;
  description: string;
  deadline: string;
  status: GoalStatus;
};

export type FilterStatus = 'todos' | GoalStatus;

export type SortOption = 'prazo_asc' | 'prazo_desc' | 'recentes' | 'alfabetica';

export interface GoalStats {
  total: number;
  naoIniciados: number;
  emAndamento: number;
  concluidos: number;
  taxaConclusao: number; // 0 a 100
  atrasados: number;
}
