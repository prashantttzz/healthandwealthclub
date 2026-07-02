const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sxojtfykjtdzhkmchnce:bablaSupabase%4031@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });
client.connect().then(async () => {
  try {
    const res = await client.query("SELECT * FROM auth_identity");
    console.log(JSON.stringify(res.rows, null, 2));
    const res2 = await client.query("SELECT * FROM provider_identity");
    console.log(JSON.stringify(res2.rows, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    client.end();
  }
}).catch(console.error);
