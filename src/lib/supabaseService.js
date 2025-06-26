// Supabase Service - Centralized data management
import { supabase } from './supabase'

export class SupabaseService {
  constructor() {
    this.userId = 'u-2731d592-dd8e-488f-bf22-2f57e348a4d2' // Demo user ID
  }

  // Generic CRUD operations
  async create(table, data) {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert({ ...data, user_id: this.userId })
        .select()
        .single()

      if (error) throw error
      return result
    } catch (error) {
      console.error(`Error creating ${table}:`, error)
      throw error
    }
  }

  async getAll(table, filters = {}) {
    try {
      let query = supabase
        .from(table)
        .select('*')
        .eq('user_id', this.userId)

      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error(`Error fetching ${table}:`, error)
      return []
    }
  }

  async getById(table, id) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .eq('user_id', this.userId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error fetching ${table} by ID:`, error)
      return null
    }
  }

  async update(table, id, updates) {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .eq('user_id', this.userId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error(`Error updating ${table}:`, error)
      throw error
    }
  }

  async delete(table, id) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)
        .eq('user_id', this.userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error(`Error deleting ${table}:`, error)
      throw error
    }
  }

  // Activity logging
  async logActivity(action, entityType, entityId, description, metadata = {}) {
    try {
      await supabase
        .from('activity_logs_crm2024')
        .insert({
          user_id: this.userId,
          action,
          entity_type: entityType,
          entity_id: entityId,
          description,
          metadata
        })
    } catch (error) {
      console.error('Error logging activity:', error)
    }
  }
}

export const supabaseService = new SupabaseService()
export default supabaseService