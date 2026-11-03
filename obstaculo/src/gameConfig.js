// Medidas y dificultad: todas las posiciones están en unidades del mundo 3D.
export const INICIO = 2
export const META = -64
export const ANCHO_PUENTE = 6.4
export const RADIO_JUGADOR = 0.42
export const VELOCIDAD = 6
export const OBSTACULOS = [
  { id: 1, z: -10, amplitud: 2.35, velocidad: 1.25, fase: 0, radio: 0.66 },
  { id: 2, z: -22, amplitud: 2.35, velocidad: 1.6, fase: 1.8, radio: 0.72 },
  { id: 3, z: -34, amplitud: 2.35, velocidad: 1.35, fase: 3, radio: 0.68 },
  { id: 4, z: -46, amplitud: 2.35, velocidad: 1.85, fase: 0.6, radio: 0.7 },
  { id: 5, z: -56, amplitud: 2.35, velocidad: 1.5, fase: 2.4, radio: 0.72 },
]
export function posicionObstaculo(datos, tiempo) {
  return Math.sin(tiempo * datos.velocidad + datos.fase) * datos.amplitud
}
export function hayChoque(x, z, datos, tiempo) {
  const dx = x - posicionObstaculo(datos, tiempo)
  const dz = z - datos.z
  return dx * dx + dz * dz < (RADIO_JUGADOR + datos.radio) ** 2
}
