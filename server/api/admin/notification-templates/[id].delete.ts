import { defineEventHandler } from 'h3'
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

    try {
        const result = await pool.query('DELETE FROM notification_templates WHERE id = $1 RETURNING id', [id])
        
        if (result.rows.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Template not found'
            })
        }
        
        return { success: true, id: result.rows[0].id }
    } catch (error: any) {
        console.error(`Error deleting notification template ${id}:`, error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to delete notification template'
        })
    }
})
