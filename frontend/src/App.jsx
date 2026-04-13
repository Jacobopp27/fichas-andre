import { useState, useMemo } from 'react'
import { useFichas } from './hooks/useFichas'
import { KPICards } from './components/KPICards'
import { Filters } from './components/Filters'
import { FichasTable } from './components/FichasTable'
import { EncargadoGroup } from './components/EncargadoGroup'
import styles from './App.module.css'

const INITIAL_FILTERS = { contrato: '', encargado: '', mes: '', anio: '', municipio: '', publicada: '', soloRepetidos: false }

const _isSi = v => {
  const s = (v ?? '').toLowerCase().trim()
  return s === 'si' || s === 'sí' || s === 'yes' || s === 'x' || s === '1' || s === 'true' || s === '✔' || s === '✓'
}

export default function App() {
  const { data, loading, error, lastUpdated, refetch } = useFichas()
  const [filters, setFilters] = useState(INITIAL_FILTERS)

  const filtered = useMemo(() => {
    // Pre-calcular municipios repetidos (aparecen más de una vez)
    const conteoMun = data.reduce((acc, r) => {
      acc[r.municipio] = (acc[r.municipio] || 0) + 1
      return acc
    }, {})

    return data.filter(row => {
      if (filters.contrato && row.contrato?.toLowerCase() !== filters.contrato) return false
      if (filters.encargado && row.encargado !== filters.encargado) return false
      if (filters.mes && row.mes_realizacion !== filters.mes) return false
      if (filters.anio && row.anio_realizacion !== filters.anio) return false
      if (filters.municipio) {
        const q = filters.municipio.toLowerCase()
        if (!row.municipio?.toLowerCase().includes(q)) return false
      }
      if (filters.publicada === 'si' && !_isSi(row.publicada)) return false
      if (filters.publicada === 'no' && _isSi(row.publicada)) return false
      if (filters.soloRepetidos && conteoMun[row.municipio] <= 1) return false
      return true
    })
  }, [data, filters])

  const sinRealizacion = data.filter(r => !r.mes_realizacion).length
  const sinEncargado = data.filter(r => !r.encargado).length

  return (
    <div className={styles.root}>
      {/* HEADER */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div>
            <h1 className={styles.title}>Dashboard Fichas</h1>
            <p className={styles.subtitle}>Seguimiento de fichas por municipio y encargado</p>
          </div>
          <div className={styles.headerRight}>
            <div className={styles.liveBadge}>
              <span className={styles.liveDot} />
              En vivo
            </div>
            {lastUpdated && (
              <span className={styles.lastUpdated}>
                Actualizado {lastUpdated.toLocaleTimeString('es-CO')}
              </span>
            )}
            <button className={styles.refreshBtn} onClick={refetch} title="Actualizar ahora">
              ↻
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {/* ALERTAS GLOBALES */}
        {(sinRealizacion > 0 || sinEncargado > 0) && (
          <div className={styles.alerts}>
            {sinRealizacion > 0 && (
              <div className={styles.alertItem}>
                <span className={styles.alertIcon}>⚠</span>
                <strong>{sinRealizacion}</strong> fila{sinRealizacion > 1 ? 's' : ''} sin mes de realización
              </div>
            )}
            {sinEncargado > 0 && (
              <div className={styles.alertItem}>
                <span className={styles.alertIcon}>⚠</span>
                <strong>{sinEncargado}</strong> fila{sinEncargado > 1 ? 's' : ''} sin encargado asignado
              </div>
            )}
          </div>
        )}

        {/* ERROR DE CONEXIÓN */}
        {error && (
          <div className={styles.errorBanner}>
            <strong>Error al conectar con el backend:</strong> {error}
            {error.includes('ACCESS_TOKEN') || error.includes('ITEM_ID') ? (
              <span> — Configura las variables en <code>backend/.env</code></span>
            ) : null}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className={styles.loadingBar}>
            <div className={styles.loadingPulse} />
            Conectando con OneDrive...
          </div>
        )}

        {/* KPIs */}
        {!loading && <KPICards data={filtered} />}

        {/* FILTROS */}
        {!loading && (
          <Filters data={data} filters={filters} onChange={setFilters} />
        )}

        {/* TABLA */}
        {!loading && (
          <>
            <div className={styles.tableHeader}>
              <h2 className={styles.sectionTitle}>Detalle por municipio</h2>
              <span className={styles.rowCount}>{filtered.length} registros</span>
            </div>
            <FichasTable data={filtered} />
          </>
        )}

        {/* POR ENCARGADO */}
        {!loading && <EncargadoGroup data={filtered} />}
      </main>
    </div>
  )
}
