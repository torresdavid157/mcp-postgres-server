import { Pool } from 'pg';

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

// Función para obtener la fecha de ayer en formato YYYY-MM-DD
function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

async function getYesterdaySubscriptions() {
  const client = await pool.connect();
  try {
    const yesterdayDate = getYesterdayDate();
    console.log(`Buscando suscripciones para la fecha: ${yesterdayDate}\n`);

    // Primero obtenemos la lista de todas las tablas de suscripción
    const tableQuery = `
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE 'subscription_part_%'
      ORDER BY table_schema, table_name;
    `;

    const tables = await client.query(tableQuery);
    console.log(`Encontradas ${tables.rows.length} tablas de suscripción.\n`);

    // Construimos una consulta UNION para buscar en todas las tablas
    // Primero verificamos la estructura de una tabla
    const structureQuery = `
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'subscription_part_0'
      ORDER BY ordinal_position;
    `;
    
    const structure = await client.query(structureQuery);
    console.log('\nEstructura de la tabla subscription_part_0:');
    structure.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type}`);
    });

    // Construir las consultas para cada tabla
    const queries = tables.rows.map(table => `
      SELECT * 
      FROM ${table.table_schema}.${table.table_name}
      WHERE DATE(creation_date) = '${yesterdayDate}'
      AND operator_id = 31
    `);
    
    console.log('Ejecutando consulta para obtener suscripciones...');
    const result = await client.query(fullQuery);

    if (result.rows.length > 0) {
      console.log(`\nSe encontraron ${result.rows.length} suscripciones para la fecha ${yesterdayDate}`);
      console.log('\nPrimeros 5 registros como muestra:');
      result.rows.slice(0, 5).forEach((row, index) => {
        console.log(`\nSuscripción ${index + 1}:`);
        console.log('Fecha de creación:', row.creation_date);
        console.log('MSISDN:', row.msisdn);
        console.log('ID de producto:', row.product_id);
        console.log('Estado:', row.status);
        console.log('ID de suscripción:', row.subscription_id);
        console.log('------------------------');
      });
    } else {
      console.log(`No se encontraron suscripciones para la fecha ${yesterdayDate}`);
    }

  } catch (err) {
    console.error('Error al consultar las suscripciones:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar la consulta de suscripciones
getYesterdaySubscriptions();
