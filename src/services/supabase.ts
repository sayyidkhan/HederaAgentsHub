/**
 * Supabase Service
 * Service to store and retrieve agent data from Supabase using Supabase client
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
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
  private client: SupabaseClient | null = null;

  /**
   * Initialize Supabase client
   */
  private getClient(): SupabaseClient {
    if (!this.client) {
      if (!supabaseConfig.supabaseUrl || !supabaseConfig.supabaseAnonKey) {
        throw new Error('Supabase configuration is missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in environment variables.');
      }
      this.client = createClient(supabaseConfig.supabaseUrl, supabaseConfig.supabaseAnonKey);
    }
    return this.client;
  }

  /**
   * Store agent data in Supabase
   */
  async storeAgent(agentData: Omit<AgentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<AgentRecord> {
    const client = this.getClient();
    try {
      const { data, error } = await client
        .from('agents')
        .insert({
          agent_id: agentData.agent_id,
          name: agentData.name,
          purpose: agentData.purpose,
          capabilities: agentData.capabilities,
          wallet_address: agentData.wallet_address,
          evm_address: agentData.evm_address || null,
          topic_id: agentData.topic_id || null,
        })
        .select()
        .single();

      if (error) throw error;
      
      console.log('✅ Agent stored in Supabase successfully');
      return data as AgentRecord;
    } catch (error: any) {
      console.error('Failed to store agent in Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Get agent by agent_id
   */
  async getAgent(agentId: string): Promise<AgentRecord | null> {
    const client = this.getClient();
    try {
      const { data, error } = await client
        .from('agents')
        .select('*')
        .eq('agent_id', agentId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }

      return data as AgentRecord;
    } catch (error: any) {
      console.error('Failed to get agent from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Get all agents
   */
  async getAllAgents(): Promise<AgentRecord[]> {
    const client = this.getClient();
    try {
      const { data, error } = await client
        .from('agents')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []) as AgentRecord[];
    } catch (error: any) {
      console.error('Failed to get agents from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Update agent data
   */
  async updateAgent(agentId: string, updates: Partial<AgentRecord>): Promise<AgentRecord> {
    const client = this.getClient();
    try {
      const updateData: any = {};

      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.purpose !== undefined) updateData.purpose = updates.purpose;
      if (updates.capabilities !== undefined) updateData.capabilities = updates.capabilities;
      if (updates.wallet_address !== undefined) updateData.wallet_address = updates.wallet_address;
      if (updates.evm_address !== undefined) updateData.evm_address = updates.evm_address;
      if (updates.topic_id !== undefined) updateData.topic_id = updates.topic_id;

      if (Object.keys(updateData).length === 0) {
        throw new Error('No fields to update');
      }

      const { data, error } = await client
        .from('agents')
        .update(updateData)
        .eq('agent_id', agentId)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error(`Agent with id ${agentId} not found`);

      return data as AgentRecord;
    } catch (error: any) {
      console.error('Failed to update agent in Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Delete agent
   */
  async deleteAgent(agentId: string): Promise<void> {
    const client = this.getClient();
    try {
      const { error } = await client
        .from('agents')
        .delete()
        .eq('agent_id', agentId);

      if (error) throw error;

      console.log('✅ Agent deleted from Supabase successfully');
    } catch (error: any) {
      console.error('Failed to delete agent from Supabase:', error.message);
      throw error;
    }
  }

  /**
   * Close the Supabase client (not needed, but kept for compatibility)
   */
  async close(): Promise<void> {
    // Supabase client doesn't need explicit closing
    this.client = null;
  }
}

// Export singleton instance
export const supabaseService = new SupabaseService();
