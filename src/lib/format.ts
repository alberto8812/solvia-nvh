export function formatDate(iso: string, month: 'short' | 'long' = 'short'): string {
  // Append a local time-of-day so date-only strings ("2026-06-15") parse in the
  // browser's local timezone instead of UTC — otherwise negative-offset zones
  // display the previous day.
  return new Intl.DateTimeFormat('es-AR', { day: 'numeric', month, year: 'numeric' }).format(
    new Date(`${iso}T00:00:00`),
  )
}
