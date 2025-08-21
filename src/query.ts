import { Pool } from 'pg';

const pool = new Pool({
  host: '10.180.214.23',
  port: 5432,
  database: 'entel_db',
  user: 'twt_reader',
  password: 'Timwe._123'
});

interface Subscription {
  sub_id: string;
  sub_msisdn: string;
  sub_start_date: Date;
  sub_status: string;
}

async function getPeruSubscriptions() {
  const client = await pool.connect();
  try {
    // Obtener fecha de ayer
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log(`\nBuscando suscripciones de Perú para la fecha: ${yesterdayStr}`);

    // Primero obtener el conteo por estado
    const countQuery = `
      SELECT 
        sub_status,
        COUNT(*) as total
      FROM crm.subscription
      WHERE sub_op_id = 31
        AND DATE(sub_start_date) = $1
      GROUP BY sub_status
      ORDER BY sub_status;
    `;

    console.log('\nConteo por estado:');
    const countResult = await client.query(countQuery, [yesterdayStr]);
    countResult.rows.forEach(row => {
      console.log(`Estado ${row.sub_status}: ${row.total} suscripciones`);
    });

    // Luego la consulta principal para el CSV
    const query = `
      SELECT 
        sub_id,
        sub_msisdn,
        sub_start_date,
        sub_status
      FROM crm.subscription
      WHERE sub_op_id = 31
        AND DATE(sub_start_date) = $1
      ORDER BY sub_start_date DESC;
    `;

    console.log('\nEjecutando consulta...');
    const result = await client.query<Subscription>(query, [yesterdayStr]);
    
    if (result.rows.length > 0) {
      console.log(`\nEncontrados ${result.rows.length} registros.`);
      
      // Crear el contenido del CSV
      const csvContent = ['ID,MSISDN,Fecha de inicio,Estado'];
      
      result.rows.forEach(row => {
        csvContent.push(`${row.sub_id},${row.sub_msisdn},${row.sub_start_date.toISOString()},${row.sub_status}`);
      });
      
      // Guardar en archivo
      const fs = require('fs');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const outputPath = `./suscripciones_peru_${yesterdayStr}_${timestamp}.csv`;
      
      fs.writeFileSync(outputPath, csvContent.join('\n'));
      console.log(`\nLos datos han sido guardados en: ${outputPath}`);
    } else {
      console.log(`No se encontraron suscripciones para la fecha ${yesterdayStr}`);
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    await pool.end();
  }
}

// Ejecutar la consulta
getPeruSubscriptions();
