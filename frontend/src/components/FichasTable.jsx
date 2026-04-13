import styles from './FichasTable.module.css'

function AlertBadge({ text }) {
  return <span className={styles.alertBadge}>{text}</span>
}

function PublicadaBadge({ value }) {
  const v = (value ?? '').toLowerCase().trim()
  const isSi = v === 'si' || v === 'sí' || v === 'yes' || v === 'x' || v === '1' || v === 'true' || v === '✔' || v === '✓'
  if (!value) return <span className={styles.missing}>—</span>
  return (
    <span className={isSi ? styles.badgePublicadaSi : styles.badgePublicadaNo}>
      {isSi ? 'Sí' : 'No'}
    </span>
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
            <th>Mes asignación</th>
            <th>Realización</th>
            <th>Contrato</th>
            <th className={styles.right}>Cant. fichas</th>
            <th>Publicada</th>
            <th>Alertas</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const esActual = row.contrato?.toLowerCase() === 'este'
            const sinMes = !row.mes_realizacion
            const sinEncargado = !row.encargado

            return (
              <tr key={i} className={esActual ? styles.rowActual : styles.rowAnterior}>
                <td className={styles.bold}>{row.municipio || '—'}</td>
                <td>{row.subregion || '—'}</td>
                <td><span className={styles.tipo}>{row.tipo_ficha || '—'}</span></td>
                <td>
                  {row.encargado || <span className={styles.missing}>Sin asignar</span>}
                </td>
                <td>{row.mes_asignacion || '—'}</td>
                <td>
                  {row.mes_realizacion
                    ? <>{row.mes_realizacion}{row.anio_realizacion && <span className={styles.anio}> {row.anio_realizacion}</span>}</>
                    : <span className={styles.missing}>Pendiente</span>
                  }
                </td>
                <td>
                  <span className={esActual ? styles.badgeActual : styles.badgeAnterior}>
                    {esActual ? 'Actual' : 'Anterior'}
                  </span>
                </td>
                <td className={styles.right}>
                  <strong>{(row.cantidad_fichas || 0).toLocaleString('es-CO')}</strong>
                </td>
                <td><PublicadaBadge value={row.publicada} /></td>
                <td>
                  {sinMes && <AlertBadge text="Sin mes realización" />}
                  {sinEncargado && <AlertBadge text="Sin encargado" />}
                </td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={7} className={styles.footLabel}>Total</td>
            <td className={`${styles.right} ${styles.footValue}`}>
              {data.reduce((s, r) => s + (r.cantidad_fichas || 0), 0).toLocaleString('es-CO')}
            </td>
            <td colSpan={2} />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
