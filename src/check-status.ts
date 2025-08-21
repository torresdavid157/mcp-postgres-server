import { Pool } from 'pg';

const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

async function findStatusReference() {
  const client = await pool.connect();
  try {
    console.log('Buscando tablas que puedan contener referencia a estados de suscripción...');
    
    // Buscar tablas que puedan contener información de estados
    const tablesQuery = `
      SELECT table_schema, table_name 
      FROM information_schema.tables 
      WHERE table_schema IN ('crm', 'public', 'etlprod')
        AND (
          table_name ILIKE '%status%' 
          OR table_name ILIKE '%state%'
          OR table_name ILIKE '%subscription%'
          OR table_name ILIKE '%catalog%'
          OR table_name ILIKE '%enum%'
          OR table_name ILIKE '%reference%'
        );
    `;
    
    const tables = await client.query(tablesQuery);
    
    console.log('\nTablas encontradas que podrían contener información de estados:');
    for (const table of tables.rows) {
      console.log(`\nExaminando ${table.table_schema}.${table.table_name}:`);
      
      // Obtener las columnas de la tabla
      const columnsQuery = `
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = $1
          AND table_name = $2
          AND (
            column_name ILIKE '%status%'
            OR column_name ILIKE '%state%'
            OR column_name ILIKE '%description%'
            OR column_name ILIKE '%name%'
          );
      `;
      
      const columns = await client.query(columnsQuery, [table.table_schema, table.table_name]);
      
      if (columns.rows.length > 0) {
        console.log('Columnas relevantes encontradas:');
        columns.rows.forEach(col => {
          console.log(`- ${col.column_name} (${col.data_type})`);
        });
        
        // Si encontramos columnas relevantes, intentamos obtener algunos datos
        try {
          const dataQuery = `
            SELECT *
            FROM ${table.table_schema}.${table.table_name}
            LIMIT 5;
          `;
          
          const data = await client.query(dataQuery);
          if (data.rows.length > 0) {
            console.log('\nMuestra de datos:');
            data.rows.forEach(row => {
              console.log(row);
            });
          }
        } catch (err) {
          console.log('No se pudieron obtener datos de muestra.');
        }
      }
    }
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

findStatusReference();
