/**
 * Test Supabase Connection
 * Verifies that Supabase is properly configured and connected
 */

import { supabaseService } from '../services/supabase';

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection\n');
  console.log('='.repeat(60));

  try {
    // Test 1: Get all agents (should work even if empty)
    console.log('\n📋 TEST 1: Fetching all agents from database\n');
    
    const agents = await supabaseService.getAllAgents();
    
    console.log(`✅ Connection successful!`);
    console.log(`   Found ${agents.length} agent(s) in database\n`);

    if (agents.length > 0) {
      console.log('📊 Sample agents:');
      agents.slice(0, 3).forEach((agent, idx) => {
        console.log(`\n${idx + 1}. ${agent.name}`);
        console.log(`   Agent ID: ${agent.agent_id}`);
        console.log(`   Wallet: ${agent.wallet_address}`);
        console.log(`   Topic ID: ${agent.topic_id || 'N/A'}`);
        console.log(`   Created: ${agent.created_at}`);
      });
    } else {
      console.log('ℹ️  No agents found in database yet.');
      console.log('   Create an agent to test the full integration!');
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Supabase Integration Test PASSED!\n');
    console.log('🎉 Your database is ready to use!\n');

  } catch (error: any) {
    console.log('\n' + '='.repeat(60));
    console.log('\n❌ Supabase Integration Test FAILED!\n');
    console.error('Error:', error.message);
    console.log('\n📝 Troubleshooting Steps:\n');
    console.log('1. Check your DATABASE_URL in .env file');
    console.log('2. Make sure you replaced [YOUR-PASSWORD] with actual password');
    console.log('3. Run the migration: npm run migrate');
    console.log('4. Verify Supabase project is active');
    console.log('\nSee SUPABASE_INTEGRATION_GUIDE.md for detailed setup\n');
  }
}

// Run the test
testSupabaseConnection();
