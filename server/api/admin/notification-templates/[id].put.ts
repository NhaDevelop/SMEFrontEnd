import { defineEventHandler, readBody } from 'h3'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    if (!id) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Template ID is required'
        })
    }

    const body = await readBody(event)
    
    // We only update the fields that are provided
    try {
        // Fetch existing logic
        const existingResult = await pool.query('SELECT * FROM notification_templates WHERE id = $1', [id])
        if (existingResult.rows.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Template not found'
            })
        }
        
        const existing = existingResult.rows[0]

        // Prepare the update query dynamically based on provided fields
        const updates: string[] = []
        const values: any[] = []
        let paramIndex = 1

        const updatableFields = ['name', 'type', 'trigger_event', 'subject', 'body', 'is_active']
        
        for (const field of updatableFields) {
            if (body[field] !== undefined) {
                updates.push(`${field} = $${paramIndex}`)
                values.push(body[field])
                paramIndex++
            }
        }
        
        // Update the updated_at timestamp
        updates.push(`updated_at = CURRENT_TIMESTAMP`)

        // If nothing to update, just return existing
        if (updates.length === 1) { // Only updated_at is in there
           return existing
        }

        values.push(id) // Add ID for the WHERE clause
        
        const query = `
            UPDATE notification_templates 
            SET ${updates.join(', ')} 
            WHERE id = $${paramIndex} 
            RETURNING *
        `
        
        const result = await pool.query(query, values)
        return result.rows[0]
        
    } catch (error: any) {
        console.error(`Error updating notification template ${id}:`, error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to update notification template'
        })
    }
})
