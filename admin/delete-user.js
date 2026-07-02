const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://postgres.sxojtfykjtdzhkmchnce:bablaSupabase%4031@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true' });
client.connect().then(async () => {
  try {
    await client.query("DELETE FROM \"user\" WHERE email = 'muhsalem16@gmail.com'");
    const res = await client.query("SELECT auth_identity_id FROM provider_identity WHERE entity_id = 'muhsalem16@gmail.com'");
    if (res.rows.length > 0) {
      for (const row of res.rows) {
        await client.query("DELETE FROM provider_identity WHERE auth_identity_id = $1", [row.auth_identity_id]);
        await client.query("DELETE FROM auth_identity WHERE id = $1", [row.auth_identity_id]);
      }
    }
    console.log('deleted');
  } catch (e) {
    console.error(e);
  } finally {
    client.end();
  }
}).catch(console.error);
