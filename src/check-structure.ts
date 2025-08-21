import { Pool } from 'pg';

const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

async function checkTableStructure() {
  const client = await pool.connect();
  try {
    console.log('Consultando estructura de la tabla crm.subscription...');
    
    const query = `
      SELECT column_name, data_type, character_maximum_length
      FROM information_schema.columns
      WHERE table_schema = 'crm'
        AND table_name = 'subscription'
      ORDER BY ordinal_position;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log('\nColumnas encontradas:\n');
      result.rows.forEach(col => {
        console.log(`Columna: ${col.column_name}`);
        console.log(`Tipo: ${col.data_type}`);
        if (col.character_maximum_length) {
          console.log(`Longitud máxima: ${col.character_maximum_length}`);
        }
        console.log('------------------------');
      });
    } else {
      console.log('No se encontró la tabla crm.subscription');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTableStructure();
