import { GoalStatus } from '../types/goal';

export interface StatusConfig {
  label: string;
  shortLabel: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  dotColor: string;
  activeColor: string;
}

export const STATUS_CONFIG: Record<GoalStatus, StatusConfig> = {
  nao_iniciado: {
    label: 'Não iniciado',
    shortLabel: 'Pendente',
    badgeBg: 'bg-slate-100',
    badgeText: 'text-slate-700',
    badgeBorder: 'border-slate-200',
    dotColor: 'bg-slate-400',
    activeColor: 'bg-slate-800 text-white',
  },
  em_andamento: {
    label: 'Em andamento',
    shortLabel: 'Em foco',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700',
    badgeBorder: 'border-blue-200',
    dotColor: 'bg-blue-500 animate-pulse',
    activeColor: 'bg-blue-600 text-white',
  },
  concluido: {
    label: 'Concluído',
    shortLabel: 'Feito',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700',
    badgeBorder: 'border-emerald-200',
    dotColor: 'bg-emerald-500',
    activeColor: 'bg-emerald-600 text-white',
  },
};

/**
 * Formata a data (YYYY-MM-DD) para formato amigável brasileiro (ex: 15 de nov. de 2026).
 */
export function formatDateBR(dateString: string): string {
  if (!dateString) return 'Sem prazo';
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return dateString;

    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Retorna o cálculo relativo do prazo em relação à data atual.
 */
export function getDeadlineInfo(dateString: string, status: GoalStatus): {
  text: string;
  isOverdue: boolean;
  isToday: boolean;
  isUrgent: boolean;
  colorClass: string;
} {
  if (!dateString) {
    return {
      text: 'Sem data',
      isOverdue: false,
      isToday: false,
      isUrgent: false,
      colorClass: 'text-slate-500',
    };
  }

  if (status === 'concluido') {
    return {
      text: `Concluído (${formatDateBR(dateString)})`,
      isOverdue: false,
      isToday: false,
      isUrgent: false,
      colorClass: 'text-emerald-600',
    };
  }

  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    const daysAgo = Math.abs(diffDays);
    return {
      text: daysAgo === 1 ? 'Atrasado há 1 dia' : `Atrasado há ${daysAgo} dias`,
      isOverdue: true,
      isToday: false,
      isUrgent: true,
      colorClass: 'text-rose-700 bg-rose-50 border-rose-200',
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Prazo termina hoje',
      isOverdue: false,
      isToday: true,
      isUrgent: true,
      colorClass: 'text-amber-700 bg-amber-50 border-amber-200',
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Termina amanhã',
      isOverdue: false,
      isToday: false,
      isUrgent: true,
      colorClass: 'text-amber-600 bg-amber-50/70 border-amber-200',
    };
  }

  if (diffDays <= 3) {
    return {
      text: `Faltam ${diffDays} dias`,
      isOverdue: false,
      isToday: false,
      isUrgent: false,
      colorClass: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    };
  }

  return {
    text: formatDateBR(dateString),
    isOverdue: false,
    isToday: false,
    isUrgent: false,
    colorClass: 'text-slate-600 bg-slate-50 border-slate-200',
  };
}
