import { useEffect, useMemo, useState } from 'react'
import Gallery from './components/Gallery'
import { catalog, getObject } from './data/catalog'
import './styles.css'

const readRoute = () => window.location.hash.replace(/^#\/?/, '') || 'home'

function navigate(route) {
  window.location.hash = route === 'home' ? '' : `/${route}`
}

function Header() {
  return (
    <header className="site-header">
      <button className="brand" onClick={() => navigate('home')}>ПОСЛЕДНИЙ КАТАЛОГ</button>
      <span className="year">2026</span>
      <button className="cart" type="button">СОХРАНЕНО (0)</button>
    </header>
  )
}

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-meta">КОЛЛЕКЦИЯ · РЕДКИЕ ЧЕЛОВЕЧЕСКИЕ СОСТОЯНИЯ</div>
        <h1>ПОСЛЕДНИЙ<br />КАТАЛОГ</h1>
        <p>Каталог того, что ещё можно потерять.</p>
        <button className="primary" onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })}>ОТКРЫТЬ КАТАЛОГ</button>
      </section>

      <section className="manifesto">
        <p>Некоторые вещи становятся ценными только тогда, когда перестают быть обычными.</p>
      </section>

      <section className="catalog-grid" id="catalog">
        {catalog.map((item) => (
          <button key={item.id} className={`catalog-card card-${item.id}`} onClick={() => navigate(`object/${item.id}`)}>
            <div className="catalog-visual"><span>{item.id}</span></div>
            <div className="catalog-card-copy">
              <span className="eyebrow">ОБЪЕКТ {item.id}</span>
              <h2>{item.title}</h2>
              <p>{item.category}</p>
            </div>
          </button>
        ))}
      </section>

      <footer className="catalog-index" aria-label="Нумерация объектов">
        <button onClick={() => navigate('object/001')}>001</button>
        <button onClick={() => navigate('object/002')}>002</button>
        <button onClick={() => navigate('object/003')}>003</button>
        <button className="secret-gap" onClick={() => navigate('object/004')} aria-label="Объект 004">004</button>
        <button onClick={() => navigate('object/005')}>005</button>
        <button onClick={() => navigate('object/006')}>006</button>
      </footer>
    </main>
  )
}

function Product({ item }) {
  const [saved, setSaved] = useState(false)
  const currentIndex = catalog.findIndex((x) => x.id === item.id)
  const prev = catalog[currentIndex - 1]
  const next = catalog[currentIndex + 1]

  return (
    <main className="product-page">
      <button className="back" onClick={() => navigate('home')}>← КАТАЛОГ</button>
      <div className="product-layout">
        <Gallery item={item} />
        <section className="product-copy">
          <span className="eyebrow">ОБЪЕКТ {item.id}</span>
          <h1>{item.title}</h1>
          <p className="category">{item.category}</p>
          <p className="statement">{item.statement}</p>
          <p className="description">{item.description}</p>

          <dl className="specs">
            <div><dt>Индекс редкости</dt><dd>{item.rarity} / 100</dd></div>
            <div><dt>Наличие</dt><dd>{item.availability}</dd></div>
            <div><dt>Условия хранения</dt><dd>{item.storage}</dd></div>
          </dl>

          <button className={`primary product-action ${saved ? 'saved' : ''}`} onClick={() => setSaved((v) => !v)}>
            {saved ? 'СОХРАНЕНО' : item.action.toUpperCase()}
          </button>
        </section>
      </div>
      <nav className="product-nav">
        {prev ? <button onClick={() => navigate(`object/${prev.id}`)}>← {prev.id} {prev.title}</button> : <span />}
        {next ? <button onClick={() => navigate(`object/${next.id}`)}>{next.id} {next.title} →</button> : <button className="object-004-reveal" onClick={() => navigate('object/004')}>004</button>}
      </nav>
    </main>
  )
}

function Secret004() {
  return (
    <main className="secret-page">
      <button className="back secret-back" onClick={() => navigate('home')}>← КАТАЛОГ</button>
      <section className="mirror-room" aria-label="Объект 004 — место автора">
        <div className="mirror" />
        <div className="secret-plinth"><span>ОБЪЕКТ 004</span></div>
        <div className="director-chair" aria-hidden="true">
          <div className="chair-back">МЕСТО АВТОРА<br /><span>004</span></div>
          <div className="chair-seat" />
          <div className="chair-leg leg-a" />
          <div className="chair-leg leg-b" />
        </div>
      </section>
      <div className="secret-caption">
        <span>ОБЪЕКТ 004</span>
        <span>МЕСТО АВТОРА</span>
      </div>
    </main>
  )
}

export default function App() {
  const [route, setRoute] = useState(readRoute())

  useEffect(() => {
    const onHash = () => {
      setRoute(readRoute())
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const page = useMemo(() => {
    if (route === 'object/004') return <Secret004 />
    if (route.startsWith('object/')) {
      const item = getObject(route.split('/')[1])
      if (item) return <Product item={item} />
    }
    return <Home />
  }, [route])

  return <><Header />{page}</>
}
