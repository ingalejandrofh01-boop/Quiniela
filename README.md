# 🏆 Quiniela Mundial 26

Quiniela diaria entre amigos para el Mundial 2026 (Canadá · México ·
Estados Unidos). Todo corre en un solo archivo HTML, pensado para
subirse a **GitHub Pages**, con:

- Registro de participantes con avatar interno (generado en SVG, sin
  fotos ni servicios externos).
- Los 104 partidos del torneo (72 de grupos ya armados con equipos
  reales; los 32 de eliminatoria se van llenando conforme se define
  el bracket).
- Pronósticos en tiempo real (Firebase): nadie ve el pronóstico de
  los demás hasta que el partido arranca.
- **Ganador del día**: se corona a quien más puntos sacó cada día,
  además de la tabla general acumulada.
- Quinielas extra (bono): campeón, subcampeón, goleador, equipo
  revelación.
- Resultados reales sincronizables con un clic desde un panel de
  Admin (usa la API gratuita de football-data.org).
- Héroe 3D con el balón oficial "Trionda" (Three.js).

No necesitas servidor propio: Firebase hace de base de datos en
tiempo real y GitHub Pages sirve el archivo. Todo gratis.

---

## 1. Crea tu proyecto de Firebase (gratis, ~5 min)

1. Ve a **https://console.firebase.google.com** → "Agregar proyecto".
   Dale el nombre que quieras (ej. `quiniela-mundial-26`) y termina
   el asistente (puedes desactivar Google Analytics, no se usa).
2. En el menú lateral entra a **Authentication → Comenzar** → pestaña
   *Sign-in method* → habilita **Correo electrónico/contraseña**.
3. Entra a **Firestore Database → Crear base de datos** → modo
   **producción** → elige la región más cercana a tu grupo.
4. En el ícono de engranaje (⚙️) → **Configuración del proyecto** →
   baja hasta "Tus apps" → clic en el ícono `</>` (Web) → registra la
   app (no necesitas hosting de Firebase) → copia el objeto
   `firebaseConfig` que te muestra.

## 2. Configura `index.html`

Abre el archivo y busca, casi al inicio del `<script type="module">`,
el bloque:

```js
const firebaseConfig = {
  apiKey: "REEMPLAZA_CON_TU_API_KEY",
  ...
};
```

Reemplázalo completo por el que copiaste de Firebase.

## 3. Pega las reglas de seguridad

Abre **Firestore Database → Reglas** en Firebase Console y pega el
contenido completo de `firestore.rules` (incluido en esta carpeta).
Esto es lo que garantiza que nadie pueda leer el pronóstico de otro
antes de que el partido arranque, y que solo el admin pueda tocar
resultados. Dale **Publicar**.

## 4. Vuélvete admin

1. Sube el `index.html` a algún lado temporal (o ábrelo localmente
   con `python3 -m http.server` en esta carpeta) y **regístrate**
   como cualquier participante.
2. En Firebase Console → **Authentication → Users**, copia tu **User
   UID**.
3. Pégalo en dos lugares:
   - En `index.html`, dentro de `CONFIG.ADMIN_UIDS: ["..."]`.
   - En `firestore.rules`, dentro de `isAdmin()` (y vuelve a
     publicar las reglas).
4. Recarga la página: ahora verás una pestaña extra **⚙️ Admin**.
5. Entra a Admin → botón **"Inicializar partidos"** (una sola vez,
   carga los 104 partidos a la base de datos).

## 5. Activa la sincronización de resultados (opcional pero recomendado)

1. Crea una cuenta gratis en **https://www.football-data.org/client/register**.
2. Te llega por correo un token. Pégalo en `index.html`:
   ```js
   FOOTBALL_DATA_TOKEN: "tu-token-aquí",
   ```
3. Desde el panel **Admin → Sincronizar ahora**, la app jala los
   resultados reales de la fase de grupos y actualiza los partidos
   automáticamente. Puedes darle clic cuando quieras (después de
   cada jornada, por ejemplo) — no hace falta dejarlo corriendo solo,
   es manual a propósito para que tú controles cuándo se publican
   los resultados oficiales.
4. La fase eliminatoria (octavos en adelante) hay que irla armando a
   mano desde **Admin → "Definir un cruce de eliminatoria"** una vez
   que el bracket real se conoce (a partir del 27-28 de junio),
   porque depende de quién quede primero/segundo de cada grupo y de
   los 8 mejores terceros — FIFA libera esos cruces hasta que termina
   la fase de grupos.

## 6. Sube todo a GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser público o privado
   si tienes plan que lo permita con Pages).
2. Sube `index.html` a la raíz del repo (el `firestore.rules` y este
   `README.md` puedes subirlos también, no afectan el sitio).
3. Ve a **Settings → Pages** → en "Source" elige la rama `main` y
   carpeta `/ (root)` → Guardar.
4. En un par de minutos tu quiniela estará viva en
   `https://tu-usuario.github.io/tu-repo/`.
5. Comparte el link con tus amigos para que se registren.

---

## Cómo se reparten los puntos

| Acierto | Puntos |
|---|---|
| Marcador exacto | 5 |
| Solo el resultado (quién gana / empate) | 2 |
| Ninguno | 0 |

**Ganador del día**: se suman los puntos de todos los partidos
jugados ese día; quien tenga más, gana el día (empates comparten la
corona 👑). La tabla general acumula puntos de todos los días + los
bonos.

**Bonos** (se cierran el 28 de junio por default, configurable en
`CONFIG.BONUS_LOCK`):

| Bono | Puntos |
|---|---|
| Campeón del Mundial | 30 |
| Subcampeón | 15 |
| Bota de Oro (goleador) | 15 |
| Equipo revelación | 10 |

Todos estos valores están al inicio del `<script>` en `CONFIG` —
cámbialos como quieras antes de lanzar la quiniela (después de que
alguien empiece a pronosticar, mejor no tocarlos para que sea justo).

---

## Cosas que debes saber

- **Horarios**: para los partidos de fase de grupos, la fecha es la
  oficial de FIFA; la hora exacta de cada partido todavía no estaba
  confirmada equipo-por-equipo al armar esta app, así que se usa una
  hora aproximada. Corrígela desde el panel Admin si hace falta
  (botón "Corregir un resultado a mano" también te deja ver/editar
  cada partido).
- **Fase eliminatoria**: arranca vacía a propósito (no se inventan
  cruces) — la llenas tú desde el Admin conforme FIFA confirma los
  enfrentamientos reales.
- **football-data.org gratis** cubre el Mundial pero tiene límite de
  10 solicitudes por minuto; el botón "Sincronizar" hace una sola
  llamada, así que no hay problema de límite con uso normal.
- Todo el avatar es SVG generado en el momento — no se sube ninguna
  imagen ni se usa ningún servicio externo de avatares.
