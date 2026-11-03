import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html, RoundedBox } from '@react-three/drei'
import { ANCHO_PUENTE, META } from '../gameConfig'

const ISLAS = [[-13, -4, 4], [15, -18, 5], [-15, -29, 6], [13, -43, 4], [-12, -57, 4], [12, -71, 5], [-26, -76, 10], [29, -90, 12]]

function Palmera({ posicion, escala = 1 }) {
  return <group position={posicion} scale={escala} rotation={[0, posicion[0], -0.12]}>
    <mesh position={[0, 1.4, 0]} castShadow><cylinderGeometry args={[0.1, 0.19, 2.8, 7]} /><meshStandardMaterial color="#97734e" /></mesh>
    {Array.from({ length: 6 }, (_, i) => <group key={i} position={[0, 2.8, 0]} rotation={[0, i * Math.PI / 3, 0]}>
      <mesh position={[0.65, 0.05, 0]} rotation={[0, 0, -0.25]} castShadow scale={[1, 0.18, 0.45]}><sphereGeometry args={[0.9, 5, 4]} /><meshStandardMaterial color={i % 2 ? '#52755b' : '#739165'} flatShading /></mesh>
    </group>)}
  </group>
}

export default function Escenario({ partida, avanzarTiempo }) {
  const agua = useRef()
  useFrame((_, delta) => {
    avanzarTiempo(Math.min(delta, 0.04))
    agua.current.position.y = -0.58 + Math.sin(partida.current.tiempo * 0.6) * 0.025
  }, -2)
  return <>
    <color attach="background" args={['#c6ded7']} />
    <fog attach="fog" args={['#c6ded7', 38, 115]} />
    <hemisphereLight args={['#fff4dc', '#457e76', 2.2]} />
    <directionalLight position={[-12, 23, -25]} intensity={3} castShadow shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-42} shadow-camera-right={42} shadow-camera-top={75} shadow-camera-bottom={-75}
      shadow-camera-far={140} shadow-normalBias={0.04} />
    <mesh ref={agua} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.58, -40]} receiveShadow>
      <planeGeometry args={[400, 400]} /><meshStandardMaterial color="#479b99" roughness={0.32} metalness={0.25} />
    </mesh>
    {/* Reflejos sencillos: todo el escenario usa geometrías, sin imágenes externas. */}
    {Array.from({ length: 100 }, (_, i) => <mesh key={`agua-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[Math.sin(i * 31) * 52, -0.49, 15 - i * 1.2]}>
      <planeGeometry args={[0.4 + (i % 5) * 0.6, 0.025]} /><meshBasicMaterial color="#abd5c7" transparent opacity={0.3} />
    </mesh>)}
    <mesh position={[0, -0.12, -30]} receiveShadow><boxGeometry args={[ANCHO_PUENTE, 0.32, 73]} /><meshStandardMaterial color="#796b56" /></mesh>
    {Array.from({ length: 122 }, (_, i) => <mesh key={`tabla-${i}`} position={[0, 0.07, 6 - i * 0.6]} receiveShadow>
      <boxGeometry args={[ANCHO_PUENTE, 0.13, 0.56]} /><meshStandardMaterial color={['#cfbd98', '#c6b48f', '#d8c7a3', '#bfad8b'][i % 4]} roughness={0.94} />
    </mesh>)}
    {[-1, 1].map((lado) => <group key={lado}>
      <mesh position={[lado * 3.13, 0.16, -30]}><boxGeometry args={[0.12, 0.12, 73]} /><meshStandardMaterial color="#eee0ba" /></mesh>
      {Array.from({ length: 19 }, (_, i) => <mesh key={i} position={[lado * 3.43, -0.35, 5 - i * 4]} castShadow><cylinderGeometry args={[0.12, 0.16, 1.7, 7]} /><meshStandardMaterial color="#6e6853" /></mesh>)}
    </group>)}
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.145, 2]}><planeGeometry args={[6.1, 3]} /><meshStandardMaterial color="#459b8c" /></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.146, META]}><planeGeometry args={[6.1, 3]} /><meshStandardMaterial color="#edc064" /></mesh>
    <Html position={[-2, 0.2, 2]} center distanceFactor={10} zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}><span className="rotulo-3d inicio-3d">A</span></Html>
    <group position={[0, 0, META - 0.5]}>
      {[-2.75, 2.75].map((x) => <RoundedBox key={x} args={[0.24, 4, 0.28]} radius={0.06} position={[x, 2, 0]} castShadow><meshStandardMaterial color="#32574e" /></RoundedBox>)}
      <RoundedBox args={[5.9, 0.65, 0.3]} position={[0, 4, 0]} radius={0.08}><meshStandardMaterial color="#eac276" /></RoundedBox>
      <Html position={[0, 4.8, 0]} center distanceFactor={25} zIndexRange={[1, 0]} style={{ pointerEvents: 'none' }}><span className="rotulo-3d meta-3d">B · META</span></Html>
      {Array.from({ length: 12 }, (_, i) => <mesh key={i} position={[-2.6 + i * 0.47, 3.95, 0.17]}><boxGeometry args={[0.22, 0.3, 0.02]} /><meshStandardMaterial color={i % 2 ? '#fff2d0' : '#32574e'} /></mesh>)}
    </group>
    {ISLAS.map(([x, z, tamano], i) => <group key={i} position={[x, -0.7, z]}>
      <mesh scale={[1.3, 0.3, 1]} receiveShadow><sphereGeometry args={[tamano, 12, 8]} /><meshStandardMaterial color="#c8bd90" flatShading /></mesh>
      <mesh position={[0, 0.2, 0]} scale={[1.1, 0.25, 0.8]}><sphereGeometry args={[tamano, 10, 8]} /><meshStandardMaterial color="#83966e" flatShading /></mesh>
      <Palmera posicion={[0, tamano * 0.28, 0]} escala={1.1 + i % 3 * 0.3} />
      <Palmera posicion={[2, tamano * 0.22, 1]} escala={0.8} />
      <mesh position={[-2, 0.65, 0.5]} castShadow><dodecahedronGeometry args={[0.85, 0]} /><meshStandardMaterial color="#9caa9b" flatShading /></mesh>
    </group>)}
  </>
}
