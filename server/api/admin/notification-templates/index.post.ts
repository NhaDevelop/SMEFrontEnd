import { defineEventHandler, readBody } from 'h3'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    
    // Basic validation
    if (!body.name || !body.type || !body.trigger_event || !body.body) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Missing required fields'
        })
    }

    try {
        const query = `
            INSERT INTO notification_templates (name, type, trigger_event, subject, body, is_active)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `
        const values = [
            body.name, 
            body.type, 
            body.trigger_event, 
            body.subject || null, 
            body.body, 
            body.is_active ?? true
        ]
        
        const result = await pool.query(query, values)
        return result.rows[0]
        
    } catch (error: any) {
        console.error('Error creating notification template:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to create notification template'
        })
    }
})
