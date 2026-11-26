const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
});

const monthYearFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric'
});

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit'
});

/** Data curta, por exemplo `25 de nov. de 2026`. */
export function formatDate(date: Date | string) {
  return dateFormatter.format(new Date(date));
}

/** Mês e ano, por exemplo `novembro de 2026`. */
export function formatMonthYear(date: Date | string) {
  return monthYearFormatter.format(new Date(date));
}

/** Data e hora, por exemplo `25 de nov. de 2026, 20:30`. */
export function formatDateTime(date: Date | string) {
  return dateTimeFormatter.format(new Date(date));
}
