import styles from './KPICards.module.css'

export function KPICards({ data }) {
  const total = data.reduce((s, r) => s + (r.cantidad_fichas || 0), 0)
  const este = data
    .filter(r => r.contrato?.toLowerCase() === 'este')
    .reduce((s, r) => s + (r.cantidad_fichas || 0), 0)
  const anterior = data
    .filter(r => r.contrato?.toLowerCase() === 'anterior')
    .reduce((s, r) => s + (r.cantidad_fichas || 0), 0)

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
