'use client'

import type { ReactNode } from 'react'

export default function AdminProvider({ children }: { children: ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@1,600;1,700&family=Nunito:wght@400;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <style>{`
        body, input, button, select, textarea, label, p, span, a, li, td, th, div {
          font-family: 'Nunito', sans-serif !important;
        }

        /* Botón Crear en vistas de lista */
        a.list-create-new-doc__create-new-button {
          background: #c13584 !important;
          color: #fff !important;
          padding: 8px 20px !important;
          border-radius: 8px !important;
          font-size: 12px !important;
          font-weight: 800 !important;
          letter-spacing: 0.04em !important;
          border: none !important;
          text-decoration: none !important;
          transition: background 0.2s !important;
        }

        a.list-create-new-doc__create-new-button:hover {
          background: #8e1d5f !important;
          color: #fff !important;
        }

        a.list-create-new-doc__create-new-button .btn__label {
          color: #fff !important;
        }
      `}</style>
      {children}
    </>
  )
}
