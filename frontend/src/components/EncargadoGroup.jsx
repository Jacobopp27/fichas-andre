import styles from './EncargadoGroup.module.css'

export function EncargadoGroup({ data }) {
  // Agrupar por encargado
  const grupos = data.reduce((acc, row) => {
    const key = row.encargado || '— Sin encargado'
    if (!acc[key]) acc[key] = { municipios: [], total: 0 }
    acc[key].municipios.push(row)
    acc[key].total += (row.fichas_actual || 0) + (row.fichas_anterior || 0)
    return acc
  }, {})

  const sorted = Object.entries(grupos).sort((a, b) => b[1].total - a[1].total)

  if (sorted.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Por encargado</h2>
      <div className={styles.grid}>
        {sorted.map(([encargado, { municipios, total }]) => {
          const sinAsignar = encargado === '— Sin encargado'
          return (
            <div key={encargado} className={`${styles.card} ${sinAsignar ? styles.cardWarning : ''}`}>
              <div className={styles.cardHeader}>
                <span className={styles.encargado}>{encargado}</span>
                <span className={styles.total}>{total.toLocaleString('es-CO')} fichas</span>
              </div>
              <ul className={styles.list}>
                {municipios.map((m, i) => {
                  const esActual = m.contrato?.toLowerCase() === 'este'
                  return (
                    <li key={i} className={styles.item}>
                      <span className={m.fichas_actual > 0 && m.fichas_anterior > 0 ? styles.dotAmbos : m.fichas_actual > 0 ? styles.dotActual : styles.dotAnterior} />
                      <span className={styles.municipio}>{m.municipio || '—'}</span>
                      <span className={styles.sub}>{m.subregion}</span>
                      <span className={styles.cant}>{((m.fichas_actual || 0) + (m.fichas_anterior || 0)).toLocaleString('es-CO')}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </section>
  )
}
