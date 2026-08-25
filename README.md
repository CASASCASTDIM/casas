# Menú interno de propiedades — CASTDIM

Página HTML de uso interno con el listado de todos los desarrollos, modelos y
sus links en [landea.com.mx](https://landea.com.mx/), para uso del equipo de
Telemarketing.

> ⚠ Uso exclusivamente interno. No compartir con clientes ni personas externas.

## Uso

Abre [`index.html`](index.html) directamente en el navegador (doble clic), o
publícalo con **GitHub Pages** (Settings → Pages → branch `main` / carpeta
raíz) para tener un link compartible con el equipo.

## Estructura del proyecto

```
menu-interno-castdim/
├── index.html              # la página completa (HTML + CSS + JS en un solo archivo)
├── README.md
└── assets/
    └── logos/
        ├── castdim.png         # logo usado en el header
        ├── icon-triangulos.png # ícono usado en el footer
        ├── terram.png          # logos de encabezado por desarrollo
        ├── sotavento.png
        ├── avante.png
        ├── lanka.png
        ├── ankara.png
        ├── torretolosa.png     # próximamente
        └── variantes/          # variantes de logos entregadas por diseño,
                                 # no usadas en la página, disponibles a futuro
```

## Actualizar links o modelos

Todo el contenido vive en el arreglo `DATA` (y `PROXIMAMENTE`) dentro del
`<script>` al final de `index.html`. Cada modelo tiene:

- `modelo`: nombre corto del modelo/casa
- `nombre`: nombre completo mostrado en la tarjeta
- `href`: link a la página del modelo (dejar `""` si aún no existe)

No se requiere tocar el HTML ni el CSS para agregar o corregir un link.

## Agregar un nuevo desarrollo o logo

1. Coloca el logo en `assets/logos/` con un nombre corto en minúsculas
   (ej. `nuevo-desarrollo.png`), sin espacios ni mayúsculas.
2. Agrega un nuevo objeto al arreglo `DATA` (o `PROXIMAMENTE`) referenciando
   `assets/logos/nuevo-desarrollo.png`.
