// Web Audio sintetiza efectos sin descargar archivos de sonido.
let contexto
let silencio = false
export function iniciarAudio() {
  const Audio = window.AudioContext || window.webkitAudioContext
  if (!Audio) return
  contexto ??= new Audio()
  if (contexto.state === 'suspended') contexto.resume().catch(() => {})
}
export function silenciarAudio(valor) { silencio = valor }
export function sonido(tipo) {
  if (!contexto || silencio || contexto.state !== 'running') return
  const notas = tipo === 'victoria' ? [523, 659, 784, 1047] : tipo === 'choque' ? [180, 95] : [440, 660]
  notas.forEach((frecuencia, i) => {
    const oscilador = contexto.createOscillator()
    const volumen = contexto.createGain()
    const inicio = contexto.currentTime + i * 0.13
    oscilador.type = tipo === 'choque' ? 'triangle' : 'sine'
    oscilador.frequency.setValueAtTime(frecuencia, inicio)
    volumen.gain.setValueAtTime(0, inicio)
    volumen.gain.linearRampToValueAtTime(0.16, inicio + 0.015)
    volumen.gain.exponentialRampToValueAtTime(0.001, inicio + 0.3)
    oscilador.connect(volumen)
    volumen.connect(contexto.destination)
    oscilador.start(inicio)
    oscilador.stop(inicio + 0.32)
  })
}
