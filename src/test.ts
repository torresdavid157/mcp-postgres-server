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
    // Verificar la estructura de la tabla
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

  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkTableStructure();
