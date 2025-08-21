# MCP PostgreSQL Server

Servidor para consultas de suscripciones en PostgreSQL, desarrollado con Node.js y TypeScript.

## Descripción

Este proyecto proporciona una interfaz para consultar datos de suscripciones en una base de datos PostgreSQL, específicamente diseñado para obtener información de suscripciones en Perú.

## Características

- Conexión a base de datos PostgreSQL
- Consultas de suscripciones filtradas por fecha y país
- Exportación de resultados a CSV
- Verificación de estructura de base de datos
- Listado de tablas y análisis de datos

## Requisitos

- Node.js
- TypeScript
- PostgreSQL
- Acceso a la base de datos 'entel_db'

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/torresdavid157/mcp-postgres-server.git
```

2. Instalar dependencias:
```bash
cd mcp-postgres-server
npm install
```

## Scripts Disponibles

- `query.ts`: Consulta principal de suscripciones
- `check-structure.ts`: Verifica la estructura de las tablas
- `check-status.ts`: Verifica estados de suscripciones
- `list-tables.ts`: Lista las tablas disponibles
- `check.ts`: Realiza verificaciones básicas de conexión

## Uso

Para ejecutar la consulta principal y obtener suscripciones:

```bash
npx ts-node src/query.ts
```

Esto generará un archivo CSV con los resultados en el formato:
```
ID,MSISDN,Fecha de inicio,Estado
```

## Configuración de Base de Datos

La conexión está configurada para:
- Host: 10.180.214.23
- Puerto: 5432
- Base de datos: entel_db
- Esquema: crm
- Tabla principal: subscription

## Estructura de Datos

Las consultas principales utilizan los siguientes campos:
- `sub_id`: ID de la suscripción
- `sub_msisdn`: Número de teléfono
- `sub_start_date`: Fecha de inicio
- `sub_status`: Estado de la suscripción
- `sub_op_id`: ID del operador (31 para Perú)

## Contribuir

Si deseas contribuir al proyecto:
1. Haz un Fork del repositorio
2. Crea una rama para tu feature
3. Haz commit de tus cambios
4. Crea un Pull Request

## Notas de Seguridad

- Las credenciales de base de datos deben manejarse de forma segura
- Se recomienda usar variables de entorno para configuraciones sensibles
- Los archivos CSV generados contienen información sensible y deben manejarse apropiadamente
