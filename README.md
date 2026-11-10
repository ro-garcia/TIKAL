# TIKAL — Ciudad maya entre selva

Abre `index.html` en Chrome o Edge y desplázate. Si descargaste el ZIP, extráelo antes de abrir la página. El proyecto es estático y los archivos de la escena y las fuentes se cargan localmente.

## Integración

El MP3 aportado se incluye en `assets/ambiente-selva.mp3`. El ambiente sonoro se reproduce en bucle y la página no muestra controles. Si el navegador bloquea el inicio automático, el sonido se activa tras la primera interacción admitida.

| Archivo | Componente |
|---|---|
| `assets/selva.mp4` | Video de fondo a pantalla completa. 1344 × 768 px, 6,592 s. El movimiento procede de la luz y la atmósfera de la selva. |
| `assets/selva-poster.jpg` | Fotograma del MP4 a 0,1 s, a resolución original. Respalda el fondo durante la carga o si falla la reproducción. |
| `assets/jaguar.png` | Sujeto intermedio, 1538 × 1023 px con transparencia. Se escala y recorta alrededor de la mirada. |
| `assets/follaje.png` | Primer plano, 1659 × 948 px con transparencia. Enmarca al sujeto y queda por debajo de la marca. |
| `assets/fonts/` | Instrument Serif y Manrope distribuidas localmente con sus licencias OFL. |

La órbita usa seis fotos de los adjuntos, optimizadas en WebP y guardadas en `assets/orbit/`. El archivo de flora repetido es idéntico al primero y se usa una sola vez.

Cada foto orbital lleva un título y un dato breve a su lado. El texto acompaña el movimiento y se orienta según el espacio disponible. Los textos se editan en `assets/brand.config.js`.

En móvil, la órbita compacta muestra las fotos solas. Durante el tramo ampliado aparece un único texto al pie, asociado a la foto que pasa por el foco.

El templo recortado del PNG adjunto ocupa el centro de la órbita compacta en móvil. Se desvanece durante el tramo ampliado.

En móvil, «Avistamiento de aves», «Felinos de Tikal», «Selva de Petén» y «Fauna impresionante» activan un GIF que cruza por detrás de las fotos. Los fondos claros del tapir y los pizotes se funden con la escena blanca. La animación respeta la preferencia de movimiento reducido.

En «Flora de Tikal», la vegetación aparece con un ascenso suave detrás de las fotos y se funde con el fondo blanco.

En «Conservación», el tucán cruza la franja superior de izquierda a derecha con margen en ambos bordes.

Las imágenes aportadas son ilustrativas. Su procedencia no se presenta como registro fotográfico del parque. Los textos sobre Tikal se basan en el [Centro del Patrimonio Mundial de la UNESCO](https://whc.unesco.org/en/list/64/), la [guía de Visit Guatemala](https://visitguatemala.gt/sitios-arqueologicos/tikal/), la [reseña de CONAP](https://conap.gob.gt/67-aniversario-del-parque-nacional-tikal-y-parque-nacional-naciones-unidas/) y el [Plan Maestro del parque](https://conap.gob.gt/wp-content/uploads/2019/08/PM-Parque-Nacional-Tikal_Vigente.pdf).

| Posición | Foto y recorte |
|---|---|
| 01 | Jaguar. El recorte mantiene la mirada en el centro. |
| 02 | Huellas. El encuadre prioriza la impresión más marcada, a la derecha. |
| 03 | Selva. El recorte central conserva las capas de niebla y dosel. |
| 04 | Flora. El centro del recorte se desplaza hacia la bromelia. |
| 05 | Conservación. El recorte incluye la cámara trampa y a la persona que la ajusta. |
| 06 | Fauna. La cabeza y el cuerpo de la guacamaya guían el encuadre. |

Los puntos focales se editan en `assets/brand.config.js`. La foto de huellas conserva su resolución original de 640 × 425 px. Su detalle puede verse más suave en el círculo expandido. Completa `ctaHref` con el destino autorizado. El control superior conserva la silueta observada y queda desactivado hasta confirmar su función.

## Comparación visual

Se contrastaron estados visuales con 15 muestras del [GIF original de Shamoni](https://motionsites.ai/assets/hero-shamoni-preview-DfbPWZl9.gif) de 800 × 591 px. Los tiempos del GIF y el progreso de scroll se registran por separado.

| Estado | Comparación |
|---|---|
| Apertura | Se conserva el rostro dominante, el primer plano vegetal y la marca serif inferior izquierda. La palabra en mayúsculas ocupa menos ancho que la marca original al conservar las proporciones de los glifos. El jaguar y el follaje son capas estáticas sobre video. En el original se mueve también el sujeto. |
| Revelado | Se observa la abertura central inclinada, el interior vertical y la entrada del texto con desenfoque. La máscara se ensancha en pantallas estrechas para cubrir las esquinas al concluir. |
| Órbita | Las seis fotos llenan los círculos durante el aumento de tamaño, el desplazamiento lateral, el paso por el foco y el recorte en los bordes. Shamoni utiliza un fondo azul uniforme en los seis círculos. En TIKAL, el color y el contraste varían con cada foto de campo. |
| Cierre | Se recupera la superficie blanca completa y reaparecen la marca pequeña, el control superior, el texto y el CTA. La posición angular depende del scroll acumulado y de la deriva. |

Se capturaron nueve estados de scroll en Chrome a 1440 × 900 y 390 × 844, desde 0 hasta 1. También se verificaron tres posiciones al invertir el scroll y el modo de movimiento reducido. Durante la prueba, la escena permaneció fija, cargaron los recursos, hubo seis posiciones orbitales y no aparecieron errores de JavaScript ni desbordamiento horizontal. La referencia disponible es una grabación de escritorio, por lo que el resultado móvil se comprobó contra las reglas responsive del prototipo.

## Archivos editables

- `index.html` contiene la escena y el texto editorial.
- `shamoni.css` conserva la geometría base de la skill.
- `jaguar.css` define las fuentes locales, la composición de los archivos y los ajustes responsive.
- `scroll-timeline.js` aplica las curvas de máscara, órbita y texto.
- `assets/brand.config.js` contiene las rutas y los puntos focales de la órbita, junto con el destino del CTA.

