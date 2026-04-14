import styles from './Filters.module.css'

export function Filters({ data, filters, onChange }) {
  const encargados = [...new Set(data.map(r => r.encargado).filter(Boolean))].sort()

  const meses = [...new Set(
    data.map(r => r.mes_realizacion).filter(Boolean)
  )].sort((a, b) => {
    const ORDER = ["Enero","Febrero","Marzo","Abril","Mayo","Junio",
                   "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"]
    return ORDER.indexOf(a) - ORDER.indexOf(b)
  })

  const anios = [...new Set(
    data.map(r => r.anio_realizacion).filter(Boolean)
  )].sort()

  const hasActive = filters.contrato || filters.encargado || filters.mes
    || filters.anio || filters.municipio || filters.publicada || filters.tieneFichas

  return (
    <div className={styles.bar}>
      {/* Buscador municipio */}
      <div className={styles.group}>
        <label className={styles.label}>Municipio</label>
        <input
          className={styles.search}
          type="text"
          placeholder="Buscar municipio..."
          value={filters.municipio}
          onChange={e => onChange({ ...filters, municipio: e.target.value })}
        />
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Contrato</label>
        <select className={styles.select} value={filters.contrato}
          onChange={e => onChange({ ...filters, contrato: e.target.value })}>
          <option value="">Todos</option>
          <option value="este">Actual</option>
          <option value="anterior">Anterior</option>
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Encargado</label>
        <select className={styles.select} value={filters.encargado}
          onChange={e => onChange({ ...filters, encargado: e.target.value })}>
          <option value="">Todos</option>
          {encargados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Mes realización</label>
        <select className={styles.select} value={filters.mes}
          onChange={e => onChange({ ...filters, mes: e.target.value })}>
          <option value="">Todos</option>
          {meses.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Año realización</label>
        <select className={styles.select} value={filters.anio}
          onChange={e => onChange({ ...filters, anio: e.target.value })}>
          <option value="">Todos</option>
          {anios.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Publicada</label>
        <select className={styles.select} value={filters.publicada}
          onChange={e => onChange({ ...filters, publicada: e.target.value })}>
          <option value="">Todas</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      <div className={styles.group}>
        <label className={styles.label}>Fichas</label>
        <select className={styles.select} value={filters.tieneFichas}
          onChange={e => onChange({ ...filters, tieneFichas: e.target.value })}>
          <option value="">Todas</option>
          <option value="con">Con fichas</option>
          <option value="sin">Sin fichas</option>
        </select>
      </div>

      {hasActive && (
        <button className={styles.clear}
          onClick={() => onChange({ contrato:'', encargado:'', mes:'', anio:'', municipio:'', publicada:'', tieneFichas: '' })}>
          Limpiar filtros
        </button>
      )}
    </div>
  )
}
