import { Pool } from 'pg';

const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

async function listTables() {
  const client = await pool.connect();
  try {
    // Consultar todas las tablas particionadas de subscription
    console.log('Listando tablas de suscripción...');
    
    const query = `
      SELECT tablename, 
             pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'etlprod' 
        AND tablename LIKE 'subscription_part_%'
      ORDER BY tablename;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\nTablas encontradas:\n');
      result.rows.forEach(row => {
        console.log(`Tabla: ${row.tablename}`);
        console.log(`Tamaño: ${row.size}`);
        console.log('------------------------');
      });
    } else {
      console.log('No se encontraron tablas de suscripción');
    }

    // Verificar si hay datos en cada tabla
    for (const row of result.rows) {
      const countQuery = `
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE sub_op_id = 31) as peru_count
        FROM etlprod.${row.tablename}
      `;
      
      const countResult = await client.query(countQuery);
      console.log(`\n${row.tablename}:`);
      console.log(`Total registros: ${countResult.rows[0].total}`);
      console.log(`Registros de Perú: ${countResult.rows[0].peru_count}`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

listTables();
