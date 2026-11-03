import { useEffect } from 'react'

function Icono({ nombre }) {
  const formas = {
    sonido: <><path d="M11 5 6 9H3v6h3l5 4Z" /><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" /></>,
    silencio: <><path d="M11 5 6 9H3v6h3l5 4Z" /><path d="m16 9 5 6m0-6-5 6" /></>,
    pausa: <><path d="M8 5v14M16 5v14" /></>,
  }
  return <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{formas[nombre]}</svg>
}

// Decoración del menú: siluetas simples, dibujadas con SVG.
function IslaMenu() {
  return <svg className="isla-menu" viewBox="0 0 440 80" aria-hidden="true">
    <path d="M0 76 55 39 94 58 154 5 212 56 272 22 327 60 390 36 440 76Z" fill="#126b72" />
    {[50, 360, 400].map((x, i) => <g key={x} transform={`translate(${x} ${i === 1 ? 21 : 33}) scale(${i === 1 ? 0.8 : 0.6})`} fill="#258f94">
      <path d="M-4 65Q5 28 0 0L7 0Q17 32 6 65Z" />
      <path d="M3 4Q-29-24-52 5Q-21-4 3 4M3 4Q-34-4-35 29Q-15 7 3 4M3 4Q-12-36 7-43Q5-16 3 4M3 4Q35-24 51 3Q22-4 3 4M3 4Q33-1 37 29Q17 8 3 4" />
    </g>)}
  </svg>
}

export default function Marcador({ estado, muertes, progreso, silencio, aviso, comenzar, menuPrincipal, alternarPausa, alternarSonido, tactil }) {
  const inicio = estado === 'inicio'
  const pausa = estado === 'pausa'
  const victoria = estado === 'victoria'
  useEffect(() => {
    function atajos(event) {
      if (event.key.startsWith('Arrow')) event.preventDefault()
      if (event.repeat) return
      const tecla = event.key.toLowerCase()
      if ((tecla === 'p' || tecla === 'escape') && (estado === 'jugando' || pausa)) alternarPausa()
      if (tecla === 'r' && !inicio) comenzar()
      if (tecla === 'm' && !inicio) menuPrincipal()
    }
    window.addEventListener('keydown', atajos)
    return () => window.removeEventListener('keydown', atajos)
  }, [estado, inicio, pausa, comenzar, menuPrincipal, alternarPausa])

  return <>
    <header className="hud">
      <div className="contador" aria-label="Contador de muertes"><span>MUERTES</span><strong data-testid="muertes">{muertes}</strong></div>
      <div className="recorrido">
        <strong className="nivel">NIVEL 1</strong>
        <div className="ruta"><b>A</b><div className="barra" role="progressbar" aria-label="Progreso del recorrido" aria-valuenow={progreso} aria-valuemin={0} aria-valuemax={100}>
          <div style={{ width: `${progreso}%` }} /><span style={{ left: `${progreso}%` }} />
        </div><b>B</b></div>
      </div>
      <div className="acciones">
        <button className="boton-icono" onClick={alternarSonido} aria-label={silencio ? 'Activar sonido' : 'Silenciar sonido'} title={silencio ? 'Activar sonido' : 'Silenciar sonido'} aria-pressed={silencio}><Icono nombre={silencio ? 'silencio' : 'sonido'} /></button>
        {!inicio && !victoria && <button className="boton-icono" onClick={alternarPausa} aria-label={pausa ? 'Reanudar' : 'Pausar'} title="Pausar (P)"><Icono nombre="pausa" /></button>}
      </div>
    </header>

    {estado === 'jugando' && <>
      {aviso && <div className="aviso" role="status">{aviso}</div>}
      <div className="ayuda"><div><kbd>W</kbd><span> / </span><kbd>↑</kbd></div><div><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd><span> / </span><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd></div><span>MOVERSE</span></div>
      <div className="tactil" aria-label="Controles táctiles">
        {[['izquierda', '←'], ['adelante', '↑'], ['atras', '↓'], ['derecha', '→']].map(([direccion, letra]) => <button key={direccion} aria-label={`Mover ${direccion}`}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); tactil.current[direccion] = true }}
          onPointerUp={() => { tactil.current[direccion] = false }} onPointerCancel={() => { tactil.current[direccion] = false }} onLostPointerCapture={() => { tactil.current[direccion] = false }}>{letra}</button>)}
      </div>
      <div className="atajo-pausa">PAUSA <kbd>P</kbd></div>
    </>}

    {(inicio || pausa || victoria) && <div className={`capa-modal ${inicio ? 'capa-inicio' : ''}`}>
      <section className="panel-menu" role="dialog" aria-modal="true" aria-labelledby="titulo-menu">
        <IslaMenu />
        <h1 id="titulo-menu">{inicio ? <>MISIÓN<br /><span>CÓNDOR</span></> : pausa ? '¡PAUSADO!' : '¡GANASTE!'}</h1>
        {inicio && <p className="instrucciones">Llega de <b>A</b> a <b>B</b> sin chocar.<br />Muévete con WASD o las flechas.</p>}
        {victoria && <p className="resultado">MUERTES: <strong>{muertes}</strong></p>}
        <div className="botones-menu">
          {inicio ? <>
            <button className="boton-menu azul" onClick={comenzar}>JUGAR <span>▶</span></button>
            <button className="boton-menu verde" onClick={alternarSonido}>SONIDO: {silencio ? 'NO' : 'SÍ'}<Icono nombre={silencio ? 'silencio' : 'sonido'} /></button>
          </> : <>
            <button className="boton-menu azul" onClick={pausa ? alternarPausa : comenzar}>{pausa ? 'REANUDAR' : 'VOLVER A JUGAR'}<span>{pausa ? '(P)' : '(R)'}</span></button>
            {pausa && <button className="boton-menu verde" onClick={comenzar}>REINICIAR<span>(R)</span></button>}
            <button className="boton-menu rosa" onClick={menuPrincipal}>MENÚ PRINCIPAL<span>(M)</span></button>
          </>}
        </div>
      </section>
    </div>}
  </>
}
