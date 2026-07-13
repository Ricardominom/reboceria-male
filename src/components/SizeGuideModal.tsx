'use client'

export default function SizeGuideModal({
  sizes,
  notes,
  onClose,
}: {
  sizes: { label: string; dimensions?: string | null; description?: string | null }[]
  notes?: string | null
  onClose: () => void
}) {
  return (
    <div className="size-guide-overlay" onClick={onClose}>
      <div className="size-guide-modal" onClick={(e) => e.stopPropagation()}>
        <div className="size-guide-header">
          <h2 className="size-guide-title">Guía de tallas</h2>
          <button className="size-guide-close" onClick={onClose} aria-label="Cerrar">
            ✕
          </button>
        </div>

        {notes && <p className="size-guide-notes">{notes}</p>}

        {sizes.length > 0 ? (
          <div className="size-guide-table-wrap">
            <table className="size-guide-table">
              <thead>
                <tr>
                  <th>Talla</th>
                  <th>Dimensiones</th>
                  <th>Ideal para</th>
                </tr>
              </thead>
              <tbody>
                {sizes.map((s, i) => (
                  <tr key={i}>
                    <td>
                      <strong>{s.label}</strong>
                    </td>
                    <td>{s.dimensions ?? '—'}</td>
                    <td>{s.description ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="size-guide-empty">Guía de tallas próximamente.</p>
        )}
      </div>
    </div>
  )
}
