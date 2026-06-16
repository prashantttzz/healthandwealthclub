const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres.sxojtfykjtdzhkmchnce:bablaSupabase%4031@aws-1-eu-central-1.pooler.supabase.com:6543/postgres?pgbouncer=true'
});

async function run() {
  await client.connect();
  
  const tablesToTruncate = [
    'customer',
    'customer_group',
    'customer_address',
    'customer_account_holder',
    'order',
    'order_address',
    'order_change',
    'order_claim',
    'order_exchange',
    'order_fulfillment',
    'order_item',
    'order_summary',
    'order_transaction',
    'cart',
    'cart_address',
    'cart_line_item',
    'payment_collection',
    'payment',
    'payment_session',
    'fulfillment',
    'fulfillment_address',
    'fulfillment_item',
    'fulfillment_label',
    'reservation_item',
    'return',
    'refund',
    'capture',
  ];

  try {
    await client.query('BEGIN');
    const query = `TRUNCATE TABLE ${tablesToTruncate.map(t => `"${t}"`).join(', ')} CASCADE;`;
    console.log('Executing:', query);
    await client.query(query);
    await client.query('COMMIT');
    console.log('Successfully cleared all customer, order, and reservation data.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error clearing data:', error);
  } finally {
    await client.end();
  }
}
run();
