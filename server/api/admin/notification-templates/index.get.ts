import { defineEventHandler } from 'h3'
import pkg from 'pg'
const { Pool } = pkg

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
})

export default defineEventHandler(async (event) => {
    try {
        const result = await pool.query('SELECT * FROM notification_templates ORDER BY created_at DESC')
        return result.rows
    } catch (error: any) {
        console.error('Error fetching notification templates:', error)
        throw createError({
            statusCode: 500,
            statusMessage: 'Failed to fetch notification templates'
        })
    }
})
