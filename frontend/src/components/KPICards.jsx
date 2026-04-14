import styles from './KPICards.module.css'

export function KPICards({ data }) {
  const este     = data.reduce((s, r) => s + (r.fichas_actual || 0), 0)
  // Anterior: solo las que NO tienen actual (no fueron sobreescritas)
  const anterior = data.reduce((s, r) => s + (r.fichas_actual > 0 ? 0 : (r.fichas_anterior || 0)), 0)
  const total    = este + anterior

  const cards = [
    { label: 'Total fichas', value: total, color: '#3b82f6', bg: '#eff6ff' },
    { label: 'Contrato actual', value: este, color: '#16a34a', bg: '#f0fdf4' },
    { label: 'Contrato anterior', value: anterior, color: '#6b7280', bg: '#f9fafb' },
  ]

  return (
    <div className={styles.grid}>
      {cards.map(c => (
        <div key={c.label} className={styles.card} style={{ borderColor: c.color, background: c.bg }}>
          <span className={styles.label}>{c.label}</span>
          <span className={styles.value} style={{ color: c.color }}>{c.value.toLocaleString('es-CO')}</span>
        </div>
      ))}
    </div>
  )
}
