# Radar · Observación — Hockey España

App para que los seleccionadores y asistentes de las selecciones nacionales registren lo que observan del **Radar de Desarrollo Individual** de su grupo desde el móvil. Sustituye al formulario de Google.

Los 20 ítems, la escala y la rúbrica salen de la *Guía de Observación v5* del Hub Técnico. La app no inventa criterio: lo lleva dentro.

## Vocabulario

El Radar es una herramienta de **seguimiento y acompañamiento**, no de puntuación. La app, la lista y los archivos usan el mismo lenguaje que la Guía de Observación:

| Decimos | No decimos |
|---|---|
| observar, situar un ítem en su nivel | valorar, evaluar, puntuar |
| observación, registro de observación | valoración, evaluación |
| observador | evaluador |
| nivel (Prioridad de mejora · A mejorar · Competente · Fortaleza) | nota, puntuación |
| sin situar (un ítem que aún no se ha visto lo suficiente) | sin valorar |

## Cómo funciona

1. El Área de Alto Rendimiento prepara la actividad (pantalla **Actividad**): fecha, grupo, categoría, rol de quien la recibe y lista de deportistas (`ID, Nombre` por línea). Genera un código.
2. El técnico pega ese código una vez. Su móvil ya recuerda el grupo.
3. Sitúa cada ítem observado en su nivel, en los ejes técnico, táctico-decisional y mindset. Los que no ha visto se quedan sin situar. El físico no se observa: se mide con tests.
4. Entrega: **descarga del CSV o del JSON**, y, si está configurado, **envío a la lista de SharePoint** con su propia cuenta de Microsoft.

Se guarda en el dispositivo según se toca, también sin cobertura. Se puede instalar en la pantalla de inicio.

## Publicar

GitHub Pages desde la rama principal, carpeta raíz. No hace falta compilar nada.

Al subir una versión nueva, **sube `VERSION` en `sw.js`** (`radar-v1` → `radar-v2`). Si no, los móviles que ya la tengan instalada seguirán con la versión antigua.

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La app entera |
| `items.json` | Los 20 ítems con su rúbrica completa. Fuente: Guía de Observación v5 |
| `config.js` | Datos de Entra y SharePoint. Vacío = la app funciona sin envío |
| `sw.js` | Caché sin conexión |
| `manifest.webmanifest`, `icon-*.png` | Instalación en el móvil |
| `fonts/` | Fuentes corporativas y escudo |

## Envío a SharePoint (opcional)

Mientras `config.js` esté vacío, la app funciona y se entrega por archivo. Para encender el envío hacen falta tres cosas de quien administre el M365 de la RFEH:

**1. Registro de aplicación en Entra ID**
- Tipo: **SPA** (aplicación de página única).
- Redirect URI: la URL exacta de Pages, por ejemplo `https://USUARIO.github.io/radar-hockey-espana/`.
- Permiso **delegado** de Microsoft Graph: `Sites.ReadWrite.All`, con consentimiento del administrador.
- Delegado quiere decir que la app actúa como la persona: cada técnico solo ve y escribe lo que SharePoint le permita. Los permisos por equipo se ponen en SharePoint, no en la app.

**2. La lista de SharePoint. Ya está creada (21/11/2026).**

- Sitio: **HOCKEY ESPAÑA AR · DATOS Y SEGUIMIENTO** — `https://365rfeh.sharepoint.com/sites/HockeyEspanaAR-Datos`. Sitio privado solo para datos de deportistas; nunca se invita a federaciones territoriales.
- Lista: **Radar · Observación** (nombre interno `RadarObservacion`), con permisos por elemento: cada técnico lee y edita solo lo que ha creado; los propietarios del sitio lo ven todo.
- Las columnas tienen un nombre interno fijo (el de la tabla) y un nombre visible legible («01 · Pasar»). El nombre interno no cambia aunque se renombre un ítem del Radar. Los niveles se llaman `Nivel01`…`Nivel20` y no `N01`…`N20` porque SharePoint altera los nombres que parecen celdas de Excel.

| Columna | Tipo |
|---|---|
| `ActividadId`, `Actividad`, `Grupo`, `Categoria` | Texto |
| `Fecha`, `Actualizado` | Fecha y hora |
| `Deportista`, `DeportistaId` | Texto |
| `Observador`, `Rol` | Texto |
| `Nivel01` … `Nivel20` | Número (1 a 4; vacío = sin situar) |
| `ComentarioTecnico`, `ComentarioTactico`, `ComentarioMindset` | Varias líneas |
| `RasgoDiferencial`, `Especializacion` | Texto |
| `Payload` | Varias líneas (copia íntegra en JSON, por si algún día cambia el esquema) |

**3. Confirmar que los invitados pueden escribir** en ese sitio, no solo leer.

El registro ya existe (21/11/2026): se llama «Radar · Observación», lo creó César con su cuenta y su `clientId` está en `config.js` junto al resto de datos. Si se cambia la dirección de la app, hay que cambiar también la URI de redirección en ese registro.

Cada envío **añade filas nuevas**, no sobrescribe: el Área de Alto Rendimiento se queda con la más reciente por deportista y observador, usando `Actualizado`. Así queda rastro de lo que mandó cada uno.

Si no quieres nombres de deportistas en la lista, pon `enviarNombres: false` y solo viajará el ID.

## Fuentes corporativas

`fonts/` lleva REDSTICK, Config Alt Black y Config Alt Text. **Si el repositorio es público, comprueba antes la licencia**: publicarlas en Pages las deja descargables por cualquiera. Si la licencia no lo permite, borra los tres archivos y la app cae sola a una tipografía de sustitución sin romper nada.

## Pendiente

- Variante de porteros y porteras: comparten escala y Mindset, pero sus ítems de técnico y táctico son propios y esa guía aún no está escrita.
- Mapeo al formato de importación de Kitman Labs: tabla de equivalencias `Nivel01`…`Nivel20` → nombres de Kitman, y confirmar con qué identificador casa Kitman a los deportistas antes de la primera actividad real.
