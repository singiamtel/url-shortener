# URL Shortener

Aplicación web para acortar URLs. Funciona como API en express, y también sirve una interfaz muy simple para utilizarlo. Utiliza Mysql para almacenar los slugs

## Instalación

Clona el repositorio, ejecuta `npm install` y crea un archivo .env en la raíz del proyecto. 

Este archivo debe contener como mínimo:
- DB_HOST: Host de la base de datos
- DB_USER: Nombre de usuario para la base de datos. También acepta `DB_PASS` para la contraseña

También es necesario crear una base de datos y una tabla en mysql para la aplicación. El nombre por defecto es "urlshort"

Esto se puede hacer con el archivo `db.sql`