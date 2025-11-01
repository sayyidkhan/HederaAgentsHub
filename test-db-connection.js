/**
 * Test Database Connection
 * Quick script to verify Supabase/PostgreSQL connection
 */

const { Pool } = require('pg');
require('dotenv').config();

async function testConnection() {
  console.log('🔍 Testing Database Connection...\n');

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL is not set in .env file');
    console.error('Please add DATABASE_URL to your .env file\n');
    process.exit(1);
  }

  console.log('📋 Connection Details:');
  // Parse URL to show (without exposing password)
  const url = new URL(process.env.DATABASE_URL.replace('postgresql+asyncpg://', 'postgresql://'));
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port}`);
  console.log(`   Database: ${url.pathname.slice(1)}`);
  console.log(`   User: ${url.username}`);
  console.log('');

  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL.replace('postgresql+asyncpg://', 'postgresql://'),
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log('🔌 Attempting to connect...');
    const client = await pool.connect();
    console.log('✅ Connection successful!\n');

    // Test query - Get PostgreSQL version
    console.log('📊 Running test queries...');
    const versionResult = await client.query('SELECT version()');
    console.log(`   PostgreSQL Version: ${versionResult.rows[0].version.split(',')[0]}`);

    // Check if agents table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'agents'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('   ✅ "agents" table exists');

      // Get table info
      const tableInfo = await client.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'agents'
        ORDER BY ordinal_position
      `);

      console.log(`   📋 Table has ${tableInfo.rows.length} columns:`);
      tableInfo.rows.forEach(col => {
        console.log(`      - ${col.column_name} (${col.data_type})`);
      });

      // Count agents
      const countResult = await client.query('SELECT COUNT(*) FROM agents');
      console.log(`   📊 Total agents in database: ${countResult.rows[0].count}`);

    } else {
      console.log('   ⚠️  "agents" table does NOT exist');
      console.log('   Run: npm run migrate to create the table');
    }

    client.release();
    console.log('\n✅ Database connection test completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Database connection test failed!\n');
    console.error('Error:', error.message);
    
    if (error.code) {
      console.error('Error Code:', error.code);
    }

    console.error('\n💡 Troubleshooting tips:');
    console.error('   1. Verify DATABASE_URL in .env is correct');
    console.error('   2. Check your Supabase project is active (not paused)');
    console.error('   3. Verify your database password is correct');
    console.error('   4. Ensure you have network access to Supabase\n');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run the test
testConnection();
