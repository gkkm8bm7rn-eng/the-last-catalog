import { useEffect, useRef, useState } from 'react'

const assetUrl = (file) => `${import.meta.env.BASE_URL}images/${file}`

export default function Gallery({ item }) {
  const [index, setIndex] = useState(0)
  const touchStart = useRef(null)

  useEffect(() => setIndex(0), [item.id])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowLeft') setIndex((current) => (current - 1 + item.slides.length) % item.slides.length)
      if (event.key === 'ArrowRight') setIndex((current) => (current + 1) % item.slides.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [item.slides.length])

  const go = (direction) => {
    setIndex((current) => (current + direction + item.slides.length) % item.slides.length)
  }

  const onTouchStart = (event) => {
    touchStart.current = event.changedTouches[0]?.clientX ?? null
  }

  const onTouchEnd = (event) => {
    if (touchStart.current == null) return
    const end = event.changedTouches[0]?.clientX ?? touchStart.current
    const delta = end - touchStart.current
    touchStart.current = null
    if (Math.abs(delta) < 44) return
    go(delta > 0 ? -1 : 1)
  }

  const slide = item.slides[index]

  return (
    <section className="gallery" aria-label={`Галерея: ${item.title}`}>
      <div
        className={`gallery-frame gallery-frame-${item.id}`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slide.ready ? (
          <img className="gallery-image" src={assetUrl(slide.file)} alt={slide.alt} />
        ) : (
          <div className="gallery-placeholder">
            <span className="eyebrow">ОБЪЕКТ {item.id} · КАДР {String(index + 1).padStart(2, '0')}</span>
            <strong>{slide.label}</strong>
            <p>{slide.note}</p>
            <small>Здесь будет самостоятельный финальный кадр — без нарезки коллажа и соседних фрагментов.</small>
          </div>
        )}

        <div className="gallery-counter" aria-hidden="true">
          {String(index + 1).padStart(2, '0')} / {String(item.slides.length).padStart(2, '0')}
        </div>
        <button className="gallery-arrow gallery-arrow-left" onClick={() => go(-1)} aria-label="Предыдущее изображение">←</button>
        <button className="gallery-arrow gallery-arrow-right" onClick={() => go(1)} aria-label="Следующее изображение">→</button>
      </div>

      <div className="gallery-nav">
        <span>{slide.label}</span>
        <div className="gallery-dots" aria-label="Выбор изображения">
          {item.slides.map((s, i) => (
            <button
              key={s.file}
              className={i === index ? 'active' : ''}
              onClick={() => setIndex(i)}
              aria-label={`${s.label}, кадр ${i + 1}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
