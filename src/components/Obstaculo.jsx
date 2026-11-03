import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { posicionObstaculo } from '../gameConfig'

export default function Obstaculo({ datos, partida }) {
  const objeto = useRef()
  const anillo = useRef()
  useFrame(() => {
    objeto.current.position.x = posicionObstaculo(datos, partida.current.tiempo)
    anillo.current.rotation.y = partida.current.tiempo * 1.5
  })
  return <group position={[0, 0, datos.z]}>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.145, 0]}><planeGeometry args={[6.25, 0.065]} /><meshBasicMaterial color="#db876c" /></mesh>
    {[-3.55, 3.55].map((x) => <group key={x} position={[x, 0, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow><cylinderGeometry args={[0.13, 0.16, 1.5, 8]} /><meshStandardMaterial color="#254d48" /></mesh>
      <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.19, 12, 12]} /><meshStandardMaterial color="#ff8462" emissive="#ff6840" emissiveIntensity={0.7} /></mesh>
    </group>)}
    <group ref={objeto} position={[0, 0.82, 0]}>
      <mesh castShadow><icosahedronGeometry args={[datos.radio, 1]} /><meshStandardMaterial color="#e86f50" roughness={0.5} flatShading /></mesh>
      <group ref={anillo}><mesh rotation={[0.4, 0, 0.2]}><torusGeometry args={[datos.radio + 0.12, 0.035, 8, 32]} /><meshStandardMaterial color="#ffd9b5" metalness={0.5} roughness={0.3} /></mesh></group>
    </group>
  </group>
}
