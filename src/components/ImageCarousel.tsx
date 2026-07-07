'use client'

import { useEffect, useState } from 'react'

interface Props {
  images: string[]
  height: number | string
  alt?: string
}

export default function ImageCarousel({ images, height, alt = '' }: Props) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [images.length])

  if (images.length === 0) return null

  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      {images.map((src, i) => (
        <div
          key={src}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
          }}
        >
          {/* Fondo difuminado */}
          <img
            src={src}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'blur(18px)',
              transform: 'scale(1.12)',
              opacity: 0.75,
            }}
          />

          {/* Capa oscura sobre el fondo */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'rgba(30, 8, 18, 0.45)',
            }}
          />

          {/* Imagen principal nítida */}
          <img
            src={src}
            alt={`${alt} ${i + 1}`}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      ))}

      {images.length > 1 && (
        <div
          style={{
            position: 'absolute',
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 8,
            zIndex: 10,
          }}
        >
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === current ? '#fff' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
