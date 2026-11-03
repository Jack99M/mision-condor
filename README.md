# Misión Cóndor

Juego 3D de un nivel: controla una esfera, recorre un puente sobre el agua y llega de A a B esquivando cinco obstáculos móviles.

## Ejecutar

Desde esta carpeta:

```sh
npm install
npm run dev
```

Abre la dirección que muestra Vite. El navegador necesita WebGL. Los sonidos se activan después de pulsar JUGAR.

```sh
npm run build
npm run preview
npm run lint
```

`build` crea la versión de producción en `dist`. La advertencia de tamaño se debe principalmente al motor 3D y no impide generar el juego.

## Controles

- W / flecha arriba: avanzar.
- S / flecha abajo: retroceder.
- A y D / flechas izquierda y derecha: moverse lateralmente.
- P o Escape: pausar y reanudar.
- R: reiniciar la partida, incluyendo el contador de muertes.
- M: volver al menú principal.
- Botón del altavoz: activar o silenciar los efectos.
- En pantallas pequeñas aparecen botones táctiles.

Los choques y las caídas suman una muerte y devuelven la esfera a A. La partida se pausa cuando la ventana pierde el foco. No hay movimiento automático, cronómetro ni niveles adicionales.

## Cómo está organizado

| Archivo | Responsabilidad |
| --- | --- |
| `src/App.jsx` | Monta `Canvas`, conecta componentes y guarda muertes, progreso y estado de la partida. |
| `src/components/Jugador.jsx` | Lee el teclado, mueve la esfera, detecta choques y actualiza la cámara. |
| `src/components/Obstaculo.jsx` | Dibuja y mueve un obstáculo. Se reutiliza cinco veces. |
| `src/components/Marcador.jsx` | Menús, contador, barra de progreso, botones y atajos. |
| `src/components/Escenario.jsx` | Puente, agua, islas, luces y marcas de inicio y meta. |
| `src/gameConfig.js` | Medidas, velocidad y datos de los obstáculos; funciones de movimiento y colisión. |
| `src/sonidos.js` | Efectos de inicio, choque y victoria con Web Audio. |
| `src/App.css` | Estilo arcade de menús y marcador. |

Los componentes y comentarios están en español. El escenario usa figuras básicas y no descarga modelos, fuentes ni texturas.

## Explicación del código

### 1. React guarda lo que muestra la interfaz

`useState` guarda el contador y si estamos en inicio, jugando, pausa o victoria. Cuando cambia un estado, React actualiza los textos o el menú. `useRef` conserva posiciones y tiempo de animación sin volver a dibujar toda la interfaz en cada cuadro.

### 2. Fiber dibuja y anima el mundo

`Canvas`, en `App`, crea la escena 3D. `useFrame`, en `Jugador` y `Obstaculo`, ejecuta la lógica de animación en cada cuadro. Multiplicamos la velocidad por `delta` (segundos entre cuadros) para que el movimiento dependa del tiempo.

### 3. Drei simplifica los controles y algunas figuras

`KeyboardControls` relaciona WASD y flechas con acciones. `useKeyboardControls` permite leerlas en `Jugador`. `RoundedBox` crea las piezas redondeadas del arco y `Html` coloca A y B en el escenario. Estos son usos reales de la segunda librería obligatoria.

### 4. Los obstáculos se mueven con una función seno

`posicionObstaculo` calcula:

```js
Math.sin(tiempo * datos.velocidad + datos.fase) * datos.amplitud
```

La amplitud indica cuánto se desplaza a los lados; la velocidad, qué tan rápido; la fase hace que cada obstáculo comience en una posición diferente. El dibujo y la detección de choques usan exactamente la misma función.

### 5. Los choques usan distancias

`hayChoque` compara la distancia horizontal entre centros con la suma de sus radios. Usa distancias al cuadrado para evitar una raíz cuadrada. Si hay choque, `Jugador` vuelve a A y llama `alMorir`; `App` suma una muerte y reproduce el sonido. No hay motor de física adicional.

### 6. La cámara sigue al jugador

El destino de la cámara queda detrás y por encima de la esfera. `lerp` acerca la cámara suavemente a esa posición. La cámara mira hacia delante del jugador.

### 7. La meta cambia el estado

Cuando el jugador alcanza la coordenada de B, `alGanar` cambia el estado a victoria. Se detiene el movimiento y aparece ¡GANASTE! con el contador final y el botón para volver a jugar.

## Prueba manual para la demostración

1. Pulsar JUGAR y avanzar con W o la flecha arriba.
2. Chocar con un obstáculo: comprobar que aumenta MUERTES y regresa a A.
3. Pulsar P: comprobar que se detienen jugador y obstáculos; reanudar.
4. Esquivar los cinco obstáculos y pasar por el arco B: aparece ¡GANASTE!.
5. Volver a jugar: el contador y el progreso vuelven a cero.
6. Probar el botón de sonido.

## Guion orientativo de defensa (2–3 minutos)

- 0:00–0:45: mostrar el movimiento, un choque con aumento del contador y la victoria.
- 0:45–1:20: mostrar `Canvas` y `useFrame` para explicar Fiber; `KeyboardControls` para explicar Drei.
- 1:20–1:50: explicar la función seno, la distancia para los choques y cómo la cámara sigue al objeto.
- 1:50–2:30: mostrar las ramas, aportes reales y un Pull Request; cada integrante explica su parte.

## Trabajo del equipo y entrega pendiente

Repositorio: [Jack99M/mision-condor](https://github.com/Jack99M/mision-condor).

La entrega se divide en tres commits independientes, preparados desde la misma versión inicial:

| Rama | Contenido |
| --- | --- |
| `jugador` | Movimiento, cámara que sigue al objeto y escenario 3D (`Jugador.jsx` y `Escenario.jsx`). |
| `obstaculo` | Obstáculos móviles, configuración, cálculo de colisiones y sonidos (`Obstaculo.jsx`, `gameConfig.js` y `sonidos.js`). |
| `marcador` | Integración en `App`, contador de muertes, progreso, victoria, menús, estilos y documentación. |

Cada rama contiene únicamente sus archivos; el juego completo requiere integrar las tres. Los archivos se reparten sin solaparse para facilitar la unión. La rama `feature/juego` conserva la versión completa anterior como respaldo.

Después de que cada integrante revise y suba su parte, deben completar los Pull Requests, probar las tres partes juntas en `main` y grabar el video con todos los integrantes. Para la nomenclatura de ramas y el historial de aportes, revisen también las condiciones de la actividad con el docente.
