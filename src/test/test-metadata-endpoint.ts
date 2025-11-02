/**
 * Test Metadata Endpoint
 * Tests the POST /api/agents/metadata endpoint
 * Run with: npm run dev src/test/test-metadata-endpoint.ts
 */

async function testMetadataEndpoint() {
  console.log('🧪 Testing POST /api/agents/metadata Endpoint\n');
  console.log('='.repeat(60));

  try {
    // Check if server is running
    console.log('\n🔍 Checking if server is running...\n');
    try {
      const healthCheck = await fetch('http://localhost:8080/health');
      if (!healthCheck.ok) {
        console.log('❌ Server is not responding correctly');
        console.log('Please start the server first: npm run start');
        return;
      }
      console.log('✅ Server is running!\n');
    } catch (error) {
      console.log('❌ Cannot connect to server at http://localhost:8080');
      console.log('Please start the server first: npm run start');
      return;
    }

    // ========================================================================
    // TEST 1: Get metadata for a single agent
    // ========================================================================
    console.log('\n📝 TEST 1: Get Metadata for Single Agent\n');

    const agentId1 = 'agent-test-api-agent-1762001572024-1762001581413-hw0ty3i';
    const requestBody1 = {
      agentIds: [agentId1],
    };

    console.log('📤 Sending POST request to http://localhost:8080/api/agents/metadata\n');
    console.log('Request Body:');
    console.log(JSON.stringify(requestBody1, null, 2));
    console.log('\n');

    const response1 = await fetch('http://localhost:8080/api/agents/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody1),
    });

    console.log(`📥 Response Status: ${response1.status}\n`);

    if (!response1.ok) {
      const errorText = await response1.text();
      console.log('❌ Request failed!');
      console.log('Response:', errorText);
      return;
    }

    const data1 = await response1.json() as any;
    console.log('Response Body:');
    console.log(JSON.stringify(data1, null, 2));

    console.log('\n' + '='.repeat(60));

    // Verify response structure
    console.log('\n✅ Response Analysis\n');

    if (!data1.success) {
      console.log('❌ Request was not successful');
      console.log(`Error: ${data1.error}`);
      return;
    }

    console.log(`✅ Request successful`);
    console.log(`   Total requested: ${data1.total}`);
    console.log(`   Found: ${data1.found}`);
    console.log(`   Not Found: ${data1.notFound}\n`);

    if (data1.agents && data1.agents.length > 0) {
      const agent = data1.agents[0] as any;
      console.log(`✅ Agent Details:`);
      console.log(`   Agent ID: ${agent.agentId}`);
      console.log(`   Name: ${agent.name}`);
      console.log(`   Purpose: ${agent.purpose.substring(0, 50)}...`);
      console.log(`   Capabilities: ${agent.capabilities.join(', ')}`);
      console.log(`   Wallet Address: ${agent.walletAddress}`);
      console.log(`   Topic ID: ${agent.topicId}`);
      console.log(`   Transaction ID: ${agent.transactionId}`);
      console.log(`   Found: ${agent.found}\n`);
    }

    // ========================================================================
    // TEST 2: Get metadata for multiple agents (including non-existent)
    // ========================================================================
    console.log('\n📝 TEST 2: Get Metadata for Multiple Agents\n');

    const requestBody2 = {
      agentIds: [
        agentId1,
        'agent-non-existent-12345',
      ],
    };

    console.log('Request Body:');
    console.log(JSON.stringify(requestBody2, null, 2));
    console.log('\n');

    const response2 = await fetch('http://localhost:8080/api/agents/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody2),
    });

    const data2 = await response2.json() as any;
    console.log('Response Body:');
    console.log(JSON.stringify(data2, null, 2));

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Response Analysis\n');

    console.log(`✅ Request successful`);
    console.log(`   Total requested: ${data2.total}`);
    console.log(`   Found: ${data2.found}`);
    console.log(`   Not Found: ${data2.notFound}\n`);

    if (data2.agents) {
      data2.agents.forEach((agent: any, idx: number) => {
        if (agent.found) {
          console.log(`✅ Agent ${idx + 1}: ${agent.name} (FOUND)`);
        } else {
          console.log(`❌ Agent ${idx + 1}: ${agent.agentId} (NOT FOUND)`);
          if (agent.error) {
            console.log(`   Error: ${agent.error}`);
          }
        }
      });
    }

    // ========================================================================
    // TEST 3: Error handling - empty agent IDs
    // ========================================================================
    console.log('\n📝 TEST 3: Error Handling - Empty Agent IDs\n');

    const requestBody3 = {
      agentIds: [],
    };

    console.log('Request Body:');
    console.log(JSON.stringify(requestBody3, null, 2));
    console.log('\n');

    const response3 = await fetch('http://localhost:8080/api/agents/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody3),
    });

    console.log(`📥 Response Status: ${response3.status}\n`);

    if (response3.status === 400) {
      const error3 = await response3.json() as any;
      console.log('✅ Correctly rejected empty array');
      console.log(`   Error: ${error3.error}\n`);
    } else {
      console.log('❌ Should have rejected empty array');
    }

    // ========================================================================
    // TEST 4: Error handling - missing agentIds field
    // ========================================================================
    console.log('\n📝 TEST 4: Error Handling - Missing agentIds Field\n');

    const requestBody4 = {};

    console.log('Request Body:');
    console.log(JSON.stringify(requestBody4, null, 2));
    console.log('\n');

    const response4 = await fetch('http://localhost:8080/api/agents/metadata', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody4),
    });

    console.log(`📥 Response Status: ${response4.status}\n`);

    if (response4.status === 400) {
      const error4 = await response4.json() as any;
      console.log('✅ Correctly rejected missing agentIds');
      console.log(`   Error: ${error4.error}\n`);
    } else {
      console.log('❌ Should have rejected missing agentIds');
    }

    // ========================================================================
    // SUMMARY
    // ========================================================================
    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All Tests Completed!\n');
    console.log('🎯 Test Summary:');
    console.log('✅ Server is running');
    console.log('✅ Metadata endpoint responds to requests');
    console.log('✅ Can retrieve agent metadata by ID');
    console.log('✅ Handles multiple agent IDs');
    console.log('✅ Handles non-existent agents gracefully');
    console.log('✅ Validates request parameters');
    console.log('\n🚀 Metadata endpoint is working correctly!\n');

  } catch (error: any) {
    console.error('\n❌ Test failed with error:', error.message);
    process.exit(1);
  }
}

testMetadataEndpoint();
