# BitByBit Academy

Sitio web oficial de BitByBit Academy, construido con Astro, Tailwind CSS y Three.js.

El proyecto presenta la academia, sus proyectos, plataforma, mentores y la iniciativa NEXT: una experiencia educativa de dos dias enfocada en tecnologia, inteligencia artificial, innovacion y construccion de prototipos reales.

## Stack

- Astro 6
- Tailwind CSS 4
- TypeScript
- Three.js
- React
- i18n nativo de Astro con rutas para `es`, `en` y `zh`

## Rutas principales

- `/es` - Home
- `/es/plataforma` - Plataforma
- `/es/proyectos` - Proyectos
- `/es/next` - NEXT
- `/es/mentores` - Mentores
- `/es/mentores/jose-manuel` - Perfil de mentor

El locale por defecto es `es`, pero el sitio tambien genera versiones en ingles y chino:

- `/en/...`
- `/zh/...`

## Desarrollo local

Requisitos:

- Node.js `>=22.12.0`
- npm

Instalacion:

```bash
npm install
```

Servidor de desarrollo:

```bash
npm run dev
```

Astro normalmente levanta el sitio en:

```text
http://localhost:4321
```

Validacion:

```bash
npm run check
```

Build de produccion:

```bash
npm run build
```

Preview del build:

```bash
npm run preview
```

## Estructura

```text
src/
  components/       Componentes reutilizables
  i18n/             Configuracion y helpers de traduccion
  layouts/          Layout base del sitio
  messages/         Textos por idioma y namespace
  pages/            Rutas Astro
  scripts/          Logica interactiva, incluyendo Three.js
  styles/           Estilos globales

public/
  icon.png
  mentors/
  model/
  next/
```

## Contenido e i18n

Los textos viven en `src/messages/{lang}/{namespace}.json`.

Idiomas disponibles:

- `es` - Espanol
- `en` - English
- `zh` - 中文

Namespaces actuales:

- `common`
- `home`
- `platform`
- `projects`
- `mentors`
- `next`

## Notas

Este repositorio todavia conserva el nombre de carpeta `Nexus` por historia del proyecto, pero la identidad actual del sitio es BitByBit Academy.

NEXT vive dentro del ecosistema de BitByBit Academy y tiene su propia pagina, assets y copy.
