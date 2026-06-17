'use client'

type Props = {
  cellData: boolean
}

export default function InStockCell({ cellData }: Props) {
  return (
    <span
      style={{
        padding: '2px 10px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 600,
        backgroundColor: cellData ? '#d1fae5' : '#fee2e2',
        color: cellData ? '#065f46' : '#991b1b',
        textAlign: 'center',
      }}
    >
      {cellData ? 'Disponible' : 'Agotado'}
    </span>
  )
}
