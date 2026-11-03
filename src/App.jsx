import { useCallback, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { KeyboardControls } from '@react-three/drei'
import Escenario from './components/Escenario'
import Jugador from './components/Jugador'
import Obstaculo from './components/Obstaculo'
import Marcador from './components/Marcador'
import { OBSTACULOS } from './gameConfig'
import { iniciarAudio, sonido, silenciarAudio } from './sonidos'
import './App.css'

const TECLAS = [
  { name: 'adelante', keys: ['ArrowUp', 'KeyW'] },
  { name: 'atras', keys: ['ArrowDown', 'KeyS'] },
  { name: 'izquierda', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'derecha', keys: ['ArrowRight', 'KeyD'] },
]

export default function App() {
  const [estado, setEstado] = useState('inicio')
  const [muertes, setMuertes] = useState(0)
  const [progreso, setProgreso] = useState(0)
  const [silencio, setSilencio] = useState(false)
  const [aviso, setAviso] = useState('')
  const [sesion, setSesion] = useState(0)
  const [error3D, setError3D] = useState(false)
  // Estado compartido para la animación, sin actualizar React en cada cuadro.
  const partida = useRef({ estado: 'inicio', tiempo: 0 })
  const tactil = useRef({ adelante: false, atras: false, izquierda: false, derecha: false })
  const temporizador = useRef(null)
  const avanzarTiempo = useCallback((delta) => {
    if (partida.current.estado === 'jugando') partida.current.tiempo += delta
  }, [])

  function cambiarEstado(nuevo) {
    partida.current.estado = nuevo
    setEstado(nuevo)
  }
  function menuPrincipal() {
    cambiarEstado('inicio')
    setMuertes(0)
    setProgreso(0)
    setAviso('')
    clearTimeout(temporizador.current)
    partida.current.tiempo = 0
    setSesion((n) => n + 1)
  }
  useEffect(() => {
    function perderFoco() {
      if (partida.current.estado === 'jugando') {
        partida.current.estado = 'pausa'
        setEstado('pausa')
      }
      Object.keys(tactil.current).forEach((tecla) => { tactil.current[tecla] = false })
    }
    window.addEventListener('blur', perderFoco)
    return () => {
      window.removeEventListener('blur', perderFoco)
      clearTimeout(temporizador.current)
    }
  }, [])
  function comenzar() {
    iniciarAudio()
    sonido('inicio')
    setMuertes(0)
    setProgreso(0)
    setAviso('')
    clearTimeout(temporizador.current)
    partida.current.tiempo = 0
    setSesion((n) => n + 1)
    cambiarEstado('jugando')
  }
  const morir = useCallback((causa) => {
    setMuertes((n) => n + 1)
    setProgreso(0)
    sonido('choque')
    setAviso(causa === 'caida' ? '¡Al agua! Vuelve a intentarlo.' : '¡Choque! Otra oportunidad desde A.')
    clearTimeout(temporizador.current)
    temporizador.current = setTimeout(() => setAviso(''), 2200)
  }, [])
  const ganar = useCallback(() => {
    partida.current.estado = 'victoria'
    setEstado('victoria')
    setProgreso(100)
    setAviso('')
    sonido('victoria')
  }, [])
  function alternarPausa() {
    if (estado === 'jugando') cambiarEstado('pausa')
    else if (estado === 'pausa') cambiarEstado('jugando')
  }
  function alternarSonido() {
    iniciarAudio()
    silenciarAudio(!silencio)
    setSilencio(!silencio)
  }

  return <main className="juego">
    <KeyboardControls map={TECLAS}>
      <div className="lienzo" aria-label="Recorrido 3D sobre el agua, del punto A al punto B">
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 4.8, 10], fov: 55, near: 0.1, far: 180 }}
          onCreated={({ gl }) => gl.domElement.addEventListener('webglcontextlost', (event) => {
            event.preventDefault()
            setError3D(true)
            partida.current.estado = 'pausa'
          })} fallback={<div className="error-3d">Tu navegador necesita WebGL para mostrar el juego.</div>}>
          <Escenario partida={partida} avanzarTiempo={avanzarTiempo} />
          {OBSTACULOS.map((datos) => <Obstaculo key={datos.id} datos={datos} partida={partida} />)}
          <Jugador key={sesion} partida={partida} tactil={tactil} alMorir={morir} alGanar={ganar} alAvanzar={setProgreso} />
        </Canvas>
      </div>
    </KeyboardControls>
    <Marcador estado={estado} muertes={muertes} progreso={progreso} silencio={silencio} aviso={aviso}
      comenzar={comenzar} menuPrincipal={menuPrincipal} alternarPausa={alternarPausa} alternarSonido={alternarSonido} tactil={tactil} />
    {error3D && <div className="capa-modal"><section className="tarjeta-modal"><h2>Se interrumpió la escena 3D</h2><p>Recarga la página para volver a jugar.</p><button className="boton-principal" onClick={() => window.location.reload()}>Recargar</button></section></div>}
  </main>
}
