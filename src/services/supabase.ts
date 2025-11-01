/**
 * Supabase Service
 * Service to store and retrieve agent data from Supabase using direct PostgreSQL connection
 */

import { Pool, QueryResult } from 'pg';
import { supabaseConfig } from '../core/config/index';

export interface AgentRecord {
  id?: number;
  agent_id: string;
  name: string;
  purpose: string;
  capabilities: string[];
  wallet_address: string;
  evm_address?: string;
  topic_id?: string;
  created_at?: string;
  updated_at?: string;
}

class SupabaseService {
  private pool: Pool | null = null;

  /**
   * Initialize PostgreSQL connection pool
   */
  private getPool(): Pool {
    if (!this.pool) {
      if (!supabaseConfig.databaseUrl) {
        throw new Error('Database configuration is missing. Please set DATABASE_URL in environment variables.');
      }
      this.pool = new Pool({
        connectionString: supabaseConfig.databaseUrl,
        ssl: {
          rejectUnauthorized: false, // Required for Supabase
        },
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
    return this.pool;
  }

  /**
   * Store agent data in Supabase
   */
  async storeAgent(agentData: Omit<AgentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AgentRecord> {
    const pool = this.getPool();
    try {
      const query = `
        INSERT INTO agents (agent_id, name, purpose, capabilities, wallet_address, evm_address, topic_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const values = [
        agentData.agent_id,
        agentData.name,
        agentData.purpose,
        agentData.capabilities,
        agentData.wallet_address,
        agentData.evm_address || null,
        agentData.topic_id || null,
      ];

      const result: QueryResult = await pool.query(query, values);
      
      console.log('✅ Agent stored in Supabase successfully');
      return result.rows[0] as AgentRecord;
    } catch (error: any) {
      console.error('Failed to store agent in Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Get agent by agent_id
   */
  async getAgent(agentId: string): Promise<AgentRecord | null> {
    const pool = this.getPool();
    try {
      const query = 'SELECT * FROM agents WHERE agent_id = $1';
      const result: QueryResult = await pool.query(query, [agentId]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0] as AgentRecord;
    } catch (error: any) {
      console.error('Failed to get agent from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Get all agents
   */
  async getAllAgents(): Promise<AgentRecord[]> {
    const pool = this.getPool();
    try {
      const query = 'SELECT * FROM agents ORDER BY created_at DESC';
      const result: QueryResult = await pool.query(query);

      return result.rows as AgentRecord[];
    } catch (error: any) {
      console.error('Failed to get agents from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Update agent data
   */
  async updateAgent(agentId: string, updates: Partial<AgentRecord>): Promise<AgentRecord> {
    const pool = this.getPool();
    try {
      // Build dynamic SET clause
      const setFields: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;

      if (updates.name !== undefined) {
        setFields.push(`name = $${paramCounter++}`);
        values.push(updates.name);
      }
      if (updates.purpose !== undefined) {
        setFields.push(`purpose = $${paramCounter++}`);
        values.push(updates.purpose);
      }
      if (updates.capabilities !== undefined) {
        setFields.push(`capabilities = $${paramCounter++}`);
        values.push(updates.capabilities);
      }
      if (updates.wallet_address !== undefined) {
        setFields.push(`wallet_address = $${paramCounter++}`);
        values.push(updates.wallet_address);
      }
      if (updates.evm_address !== undefined) {
        setFields.push(`evm_address = $${paramCounter++}`);
        values.push(updates.evm_address);
      }
      if (updates.topic_id !== undefined) {
        setFields.push(`topic_id = $${paramCounter++}`);
        values.push(updates.topic_id);
      }

      if (setFields.length === 0) {
        throw new Error('No fields to update');
      }

      values.push(agentId);
      const query = `
        UPDATE agents 
        SET ${setFields.join(', ')}
        WHERE agent_id = $${paramCounter}
        RETURNING *
      `;

      const result: QueryResult = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error(`Agent with id ${agentId} not found`);
      }

      return result.rows[0] as AgentRecord;
    } catch (error: any) {
      console.error('Failed to update agent in Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Delete agent
   */
  async deleteAgent(agentId: string): Promise<void> {
    const pool = this.getPool();
    try {
      const query = 'DELETE FROM agents WHERE agent_id = $1';
      await pool.query(query, [agentId]);

      console.log('✅ Agent deleted from Supabase successfully');
    } catch (error: any) {
      console.error('Failed to delete agent from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Close the connection pool
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
