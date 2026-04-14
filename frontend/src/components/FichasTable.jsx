import styles from './FichasTable.module.css'

function PublicadaBadge({ value }) {
  const v = (value ?? '').toLowerCase().trim()
  const isSi = v === 'si' || v === 'sí' || v === 'yes' || v === 'x' || v === '1' || v === 'true' || v === '✔' || v === '✓'
  if (!value) return <span className={styles.missing}>—</span>
  return <span className={isSi ? styles.badgePublicadaSi : styles.badgePublicadaNo}>{isSi ? 'Sí' : 'No'}</span>
}

function Fichas({ count, mes, anio, esActual }) {
  if (!count && !mes) return <span className={styles.missing}>—</span>
  return (
    <div className={styles.fichasCell}>
      <span className={esActual ? styles.countActual : styles.countAnterior}>
        {(count || 0).toLocaleString('es-CO')}
      </span>
      {mes && (
        <span className={styles.mesAnio}>
          {mes}{anio && <span className={styles.anio}> {anio}</span>}
        </span>
      )}
    </div>
  )
}

export function FichasTable({ data }) {
  if (data.length === 0) {
    return <div className={styles.empty}>No hay filas para mostrar con los filtros actuales.</div>
  }

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Municipio</th>
            <th>Subregión</th>
            <th>Tipo</th>
            <th>Encargado</th>
            <th className={styles.colActual}>Fichas actual</th>
            <th className={styles.colAnterior}>Fichas anterior</th>
            <th className={styles.right}>Total</th>
            <th>Publicada</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const total = (row.fichas_actual || 0) + (row.fichas_anterior || 0)
            const sinEncargado = !row.encargado
            const tieneAmbos = row.fichas_actual > 0 && row.fichas_anterior > 0

            return (
              <tr key={i} className={tieneAmbos ? styles.rowAmbos : row.fichas_actual > 0 ? styles.rowActual : styles.rowAnterior}>
                <td className={styles.bold}>
                  {row.municipio || '—'}
                  {tieneAmbos && <span className={styles.badgeRepetido}>2 contratos</span>}
                </td>
                <td>{row.subregion || '—'}</td>
                <td><span className={styles.tipo}>{row.tipo_ficha || '—'}</span></td>
                <td>
                  {row.encargado || <span className={styles.missing}>Sin asignar</span>}
                  {sinEncargado && <span className={styles.alertBadge}>⚠</span>}
                </td>
                <td className={styles.colActual}>
                  <Fichas count={row.fichas_actual} mes={row.mes_actual} anio={row.anio_actual} esActual={true} />
                </td>
                <td className={styles.colAnterior}>
                  <Fichas count={row.fichas_anterior} mes={row.mes_anterior} anio={row.anio_anterior} esActual={false} />
                </td>
                <td className={styles.right}>
                  <strong className={total > 0 ? styles.totalPositivo : styles.totalCero}>
                    {total.toLocaleString('es-CO')}
                  </strong>
                </td>
                <td><PublicadaBadge value={row.publicada} /></td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={4} className={styles.footLabel}>Total</td>
            <td className={`${styles.colActual} ${styles.footValue}`}>
              {data.reduce((s, r) => s + (r.fichas_actual || 0), 0).toLocaleString('es-CO')}
            </td>
            <td className={`${styles.colAnterior} ${styles.footValue}`}>
              {data.reduce((s, r) => s + (r.fichas_anterior || 0), 0).toLocaleString('es-CO')}
            </td>
            <td className={`${styles.right} ${styles.footValue}`}>
              {data.reduce((s, r) => s + (r.fichas_actual || 0) + (r.fichas_anterior || 0), 0).toLocaleString('es-CO')}
            </td>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
