import { Pool } from 'pg';

const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

async function checkSubscriptions() {
  const client = await pool.connect();
  try {
    // Consulta simple para verificar datos
    console.log('Consultando suscripciones de Perú...');
    
    const query = `
      SELECT sub_id, sub_msisdn, cdate, sub_status
      FROM etlprod.subscription_part_0
      WHERE sub_op_id = 31
      ORDER BY cdate DESC
      LIMIT 5;
    `;
    
    const result = await client.query(query);
    
    if (result.rows.length > 0) {
      console.log(`\nEncontrados ${result.rows.length} registros:\n`);
      result.rows.forEach((row, i) => {
        console.log(`Registro ${i + 1}:`);
        console.log(`ID: ${row.sub_id}`);
        console.log(`MSISDN: ${row.sub_msisdn}`);
        console.log(`Fecha: ${row.cdate}`);
        console.log(`Estado: ${row.sub_status}`);
        console.log('------------------------');
      });
    } else {
      console.log('No se encontraron registros de Perú');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

checkSubscriptions();
