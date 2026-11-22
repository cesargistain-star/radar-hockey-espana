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

## Instalación en el móvil

Al abrir el enlace en el navegador de un móvil, la app muestra un aviso para instalarla: en Android, un botón «Instalar»; en iPhone, los pasos de Safari (compartir › Añadir a pantalla de inicio), porque Apple no permite el botón. En el ordenador no aparece.

En iPhone la app del icono y Safari guardan sus datos por separado: tras instalar hay que abrirla una vez desde el icono con conexión y cargar ahí la actividad. En esa primera apertura la app confirma cuándo está lista para trabajar sin cobertura.

## Lista de deportistas copiada de Kitman

Kitman no deja exportar la lista de deportistas de un grupo, pero el usuario se ve en pantalla. En **Actividad › Preparar una actividad › Pegar la lista copiada de Kitman** se pega la tabla copiada de la pantalla y la app localiza qué columna es el usuario y cuál el nombre (se pueden corregir a mano), deja desmarcar a quien no vaya en la convocatoria y pasa el resultado a la lista de deportistas.

- Admite tabla con tabuladores, separada por comas o punto y coma, y el caso en que cada casilla queda en una línea.
- Comprueba que cada usuario se parece a su nombre y marca «revisa» los que no, para detectar filas descolocadas.
- Todo ocurre en el dispositivo. Si lo pegado no se entiende, el botón «Copiar la forma de lo pegado (sin nombres)» da un texto con la estructura y ninguna letra real, para pedir soporte.
- Formato real de Kitman (visto el 23/11/2026 por su forma, sin nombres): cada deportista ocupa varias líneas; el nombre va solo en una línea y debajo, con tabuladores, el usuario, la posición, el equipo y la fecha de creación; después, las etiquetas. La app lo lee como registros y no muestra selectores de columna.

## Archivo para Kitman

En **Ajustes › Área de Alto Rendimiento › Preparar archivo para Kitman**. Genera un CSV con el formato del archivo de importación de Kitman: una fila por deportista, primera columna `KUserName` (el usuario de Kitman) y una columna por ítem con el sufijo ` - Import`, separado por comas.

- **El ID del deportista al preparar la actividad tiene que ser su usuario de Kitman.** Es lo que casa cada fila con su perfil.
- **Regla:** media entre el seleccionador y su asistente. De cada observador se toma su envío más reciente por deportista. Los envíos con otro rol, o sin rol, no entran y la pantalla lo avisa.
- Un ítem que nadie ha situado queda en blanco. Si los observadores no coinciden, la casilla lleva decimales (2.5).
- La pantalla avisa de las casillas con dos o más niveles de diferencia entre observadores, porque la media lo tapa.
- La fecha no va en el archivo: se indica en Kitman al importar.
- El nombre de cada columna sale del campo `kitman` de `items.json`; el sufijo, la columna clave y los roles, de `kitman` en `config.js`.
- Dos orígenes: la lista de SharePoint (hace falta una cuenta propietaria del sitio para ver los envíos de todos) o lo que hay en el propio dispositivo (un solo observador, sin media).

## Fuentes corporativas

`fonts/` lleva REDSTICK, Config Alt Black y Config Alt Text. **Si el repositorio es público, comprueba antes la licencia**: publicarlas en Pages las deja descargables por cualquiera. Si la licencia no lo permite, borra los tres archivos y la app cae sola a una tipografía de sustitución sin romper nada.

## Pendiente

- Variante de porteros y porteras: comparten escala y Mindset, pero sus ítems de técnico y táctico son propios y esa guía aún no está escrita.
- Lectura de la lista desde «Preparar archivo para Kitman»: escrita pero sin probar contra SharePoint hasta que llegue el consentimiento de administrador en Entra.
