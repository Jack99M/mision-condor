import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useKeyboardControls } from '@react-three/drei'
import { Vector3 } from 'three'
import { ANCHO_PUENTE, INICIO, META, OBSTACULOS, RADIO_JUGADOR, VELOCIDAD, hayChoque } from '../gameConfig'

export default function Jugador({ partida, tactil, alMorir, alGanar, alAvanzar }) {
  const objeto = useRef()
  const pelota = useRef()
  const posicion = useRef({ x: 0, z: INICIO })
  const invulnerable = useRef(0)
  const ultimoProgreso = useRef(0)
  const camaraDestino = useRef(new Vector3())
  const mirada = useRef(new Vector3(0, 0, -3))
  const destinoMirada = useRef(new Vector3())
  const [, leerTeclas, controlesTeclado] = useKeyboardControls()
  useEffect(() => {
    const limpiar = () => controlesTeclado.setState({ adelante: false, atras: false, izquierda: false, derecha: false })
    window.addEventListener('blur', limpiar)
    return () => window.removeEventListener('blur', limpiar)
  }, [controlesTeclado])

  useFrame(({ camera }, delta) => {
    const dt = Math.min(delta, 0.04)
    const p = posicion.current
    if (partida.current.estado === 'jugando') {
      const teclado = leerTeclas()
      const controles = tactil.current
      let dx = Number(teclado.derecha || controles.derecha) - Number(teclado.izquierda || controles.izquierda)
      let dz = Number(teclado.atras || controles.atras) - Number(teclado.adelante || controles.adelante)
      // Normalizar mantiene la misma velocidad cuando se avanza en diagonal.
      const longitud = Math.hypot(dx, dz)
      if (longitud) { dx /= longitud; dz /= longitud }
      p.x += dx * VELOCIDAD * dt
      p.z = Math.min(INICIO + 1.5, p.z + dz * VELOCIDAD * dt)
      pelota.current.rotation.x += dz * VELOCIDAD * dt / RADIO_JUGADOR
      pelota.current.rotation.z -= dx * VELOCIDAD * dt / RADIO_JUGADOR
      invulnerable.current = Math.max(0, invulnerable.current - dt)
      const caida = Math.abs(p.x) > ANCHO_PUENTE / 2
      const choque = invulnerable.current === 0 && OBSTACULOS.some((o) => hayChoque(p.x, p.z, o, partida.current.tiempo))
      if (caida || choque) {
        p.x = 0
        p.z = INICIO
        invulnerable.current = 0.8
        alMorir(caida ? 'caida' : 'choque')
      } else if (p.z <= META) alGanar()
      const porcentaje = Math.min(100, Math.max(0, Math.round((INICIO - p.z) / (INICIO - META) * 100)))
      if (porcentaje !== ultimoProgreso.current) {
        ultimoProgreso.current = porcentaje
        alAvanzar(porcentaje)
      }
    }
    objeto.current.position.set(p.x, 0.57, p.z)
    objeto.current.visible = invulnerable.current <= 0 || Math.sin(invulnerable.current * 35) > -0.3
    // Interpolación: la cámara se acerca suavemente a su posición detrás del objeto.
    camaraDestino.current.set(p.x * 0.55, 4.8, p.z + 8)
    camera.position.lerp(camaraDestino.current, 1 - Math.exp(-6 * dt))
    destinoMirada.current.set(p.x * 0.35, 0.1, p.z - 5)
    mirada.current.lerp(destinoMirada.current, 1 - Math.exp(-8 * dt))
    camera.lookAt(mirada.current)
  })
  return <group ref={objeto} position={[0, 0.57, INICIO]}>
    <group ref={pelota}>
      <mesh castShadow><sphereGeometry args={[RADIO_JUGADOR, 32, 24]} /><meshStandardMaterial color="#f5bf54" roughness={0.28} metalness={0.35} /></mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.415, 0.035, 8, 40]} /><meshStandardMaterial color="#fff2ca" /></mesh>
      <mesh><torusGeometry args={[0.415, 0.027, 8, 40]} /><meshStandardMaterial color="#9e6529" /></mesh>
    </group>
    <pointLight color="#ffbf59" intensity={0.7} distance={2} />
  </group>
}
