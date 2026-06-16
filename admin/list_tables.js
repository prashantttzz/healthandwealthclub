const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.sxojtfykjtdzhkmchnce:bablaSupabase%4031@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  await client.connect();
  const res = await client.query(`
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `);
  console.log(JSON.stringify(res.rows.map(r => r.table_name)));
  await client.end();
}
run();
