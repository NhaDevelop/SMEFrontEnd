import { defineEventHandler, readBody, getQuery } from 'h3'
import { db } from '~/server/utils/db'
import { storage } from '~/server/utils/storage'

// Simple in-memory storage for preferences if not adding to db.ts directly
// For mock backend, we can just use storage directly or attach to user
export default defineEventHandler(async (event) => {
    const method = event.node.req.method
    const query = getQuery(event)
    const userId = query.userId as string

    if (!userId) {
        return { error: 'userId required' }
    }

    const data = storage.get() as any
    if (!data.preferences) {
        data.preferences = {}
    }

    if (method === 'GET') {
        const userPrefs = data.preferences[userId]
        if (!userPrefs) {
            // Return default
            return {
                digestEnabled: true,
                digestFrequency: 'Weekly',
                digestDay: 'Monday',
                digestTime: '09:00',
                quietHoursEnabled: true,
                quietStart: '22:00',
                quietEnd: '08:00',
                email: '',
                // In a real app we'd map these to the actual groups, 
                // for our mock we just let the frontend send/receive the whole object
                notificationGroups: null 
            }
        }
        return userPrefs
    }

    if (method === 'POST') {
        const body = await readBody(event)
        
        data.preferences[userId] = {
            ...data.preferences[userId],
            ...body,
            updatedAt: new Date().toISOString()
        }
        
        storage.save(data)
        
        return { success: true, preferences: data.preferences[userId] }
    }
})
