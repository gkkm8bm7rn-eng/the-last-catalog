import { useEffect, useState } from 'react'

export default function Gallery({ item }) {
  const [index, setIndex] = useState(0)

  useEffect(() => setIndex(0), [item.id])

  const go = (direction) => {
    setIndex((current) => (current + direction + item.slides.length) % item.slides.length)
  }

  const slide = item.slides[index]

  return (
    <section className="gallery" aria-label={`Галерея: ${item.title}`}>
      <div className={`gallery-frame gallery-frame-${item.id}`}>
        <div className="gallery-placeholder">
          <span className="eyebrow">ОБЪЕКТ {item.id} · КАДР {String(index + 1).padStart(2, '0')}</span>
          <strong>{slide.label}</strong>
          <p>{slide.note}</p>
          <small>Финальное самостоятельное изображение будет добавлено после отдельного визуального прогона.</small>
        </div>
        <button className="gallery-arrow gallery-arrow-left" onClick={() => go(-1)} aria-label="Предыдущее изображение">←</button>
        <button className="gallery-arrow gallery-arrow-right" onClick={() => go(1)} aria-label="Следующее изображение">→</button>
      </div>
      <div className="gallery-nav">
        <span>{String(index + 1).padStart(2, '0')} / {String(item.slides.length).padStart(2, '0')}</span>
        <div className="gallery-dots">
          {item.slides.map((s, i) => (
            <button key={s.label} className={i === index ? 'active' : ''} onClick={() => setIndex(i)} aria-label={`Кадр ${i + 1}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
