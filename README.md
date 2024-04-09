# Taxi24 API

## Instrucciones

Taxi24 es una nueva startup que quiere revolucionar la industria del transporte proporcionando 
una solución de marca blanca existentes. Prácticamente, construirán un conjunto de APIs que otras compañías puedan utilizar para gestionar su flota de pasajeros. Les gustaría que les ayudaras a construir estas APIs.

### Limitaciones tecnológicas

• En la fábrica digital, actualmente tenemos una arquitectura de microservicios con servicios 
escritos  en su mayoría en frameworks para microservicios.

• Un único servicio en el lenguaje Node JS que exponga varios endpoints REST (ver página 
siguiente). Preferentemente NestJS y typescript.

• Puedes usar la base de datos que quieras (recomendamos usar Postgres o en MongoDB).

• Deberá incluir un archivo README que contenga instrucciones para que podamos ejecutar 
la solución en nuestras máquinas.

## Tecnologías utilizadas

* [NestJS](https://nestjs.com/)
* [TypeORM](https://typeorm.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/)

## Requerimientos cumplidos

* Utilización de tecnologías solicitadas.
* Uso de patrones conocidos para el desarrollo de REST.
* Modelo de datos claro.
* Creación de Endpoints solicitados.
* Instrucciones en archivo README para la ejecución de la solución en las máquinas del evaluador.
* Cumplimiento de los requerimientos dentro de la fecha límite (< 1 semana).

## Requerimientos adicionales cumplidos

* Pruebas unitarias.
* Pruebas E2E.
* Principios de Clean Architecture (Separación de Intereses, Principio de Inversión de Dependencias, Principio de Responsabilidad Única, Abstracción, etc.).
* Implementación de migraciones de base de datos para la creación del modelo de base de datos inicial y fácil actualización de este.
* Endpoints adicionales para la creación de registros.
* Endpoint adicional para generación de archivo PDF con el contenido de la factura después de completado un viaje.
* Documentación de los Endpoints utilizando la librería Swagger.
* Estructura escalable de directorios del proyecto para mejorar la facilidad de comprensión del código.
* Dockerización del proyecto.

## Ejecución de la solución

### Con Docker

[Instalar Docker](https://www.docker.com/products/docker-desktop/)

Entrar al directorio base del proyecto.

Inicializar los contenedores.

```sh
docker-compose up
```

El proyecto estará corriendo en [http://localhost:3000/](http://localhost:3000/)

### Sin Docker

[Instalar Node.js Versión 20.3.1](https://nodejs.org/dist/v20.3.1/node-v20.3.1-x64.msi)

Instalar NPM Versión 10.5.1

```sh
npm install npm@10.5.1 -g
```

Entrar al directorio base del proyecto.

Crear archivo `.env` con las credenciales de su base de datos en PostgreSQL. Puede utilizar el archivo `.env.example` como ejemplo. Debe tener una base de datos llamada 'taxi-24-db' creada.

```yaml
# Database
DB_HOST=""
DB_PORT=""
DB_USERNAME=""
DB_PASSWORD=""
DB_DATABASE="taxi-24-db"
```

Instalar dependencias del proyecto.

```sh
npm install
```

Actualizar la base de datos a partir de las migraciones.

```sh
npm run update-database
```

Inicializar el proyecto.

```sh
npm start
```

El proyecto estará corriendo en [http://localhost:3000/](http://localhost:3000/)

## Documentación de endpoints

Puede ver la documentación de los endpoints con Swagger en [http://localhost:3000/api/](http://localhost:3000/api/)

## Pruebas

Ejecutar pruebas unitarias.

```sh
npm run test
```

Ejecutar pruebas e2e.

```sh
npm run test:e2e
```