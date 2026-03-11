import fs from 'node:fs'
import path from 'node:path'

const DB_DIR = '.data'
const DB_FILE = path.join(DB_DIR, 'sme_frontend_db.json')
export const UPLOADS_DIR = path.join(DB_DIR, 'uploads')

export const storage = {
    get: () => {
        try {
            if (!fs.existsSync(DB_DIR)) {
                fs.mkdirSync(DB_DIR, { recursive: true })
            }
            if (!fs.existsSync(DB_FILE)) {
                return { assessments: [], responses: [], templates: [], programs: [], questions: [], goals: [], documents: [], messages: [], audit_logs: [], notifications: [], settings: null, program_comments: [], sectors: [] }
            }
            const content = fs.readFileSync(DB_FILE, 'utf-8')
            const parsed = JSON.parse(content)
            
            return {
                assessments: parsed.assessments || [],
                responses: parsed.responses || [],
                templates: parsed.templates || [],
                programs: parsed.programs || [],
                questions: parsed.questions || [],
                goals: parsed.goals || [],
                documents: parsed.documents || [],
                registrations: parsed.registrations || [],
                messages: parsed.messages || [],
                audit_logs: parsed.audit_logs || [],
                notifications: parsed.notifications || [],
                settings: parsed.settings || null,
                program_comments: parsed.program_comments || [],
                sectors: parsed.sectors || []
            }
        } catch (e) {
            console.warn('[Storage] Failed to read storage:', e)
            return { assessments: [], responses: [], templates: [], programs: [], questions: [], goals: [], documents: [], registrations: [], messages: [], audit_logs: [], notifications: [], settings: null, program_comments: [], sectors: [] }
        }
    },
    save: (data: { assessments?: any[], responses?: any[], templates?: any[], programs?: any[], questions?: any[], goals?: any[], documents?: any[], registrations?: any[], messages?: any[], audit_logs?: any[], notifications?: any[], settings?: any, program_comments?: any[], sectors?: any[] }) => {
        try {
            if (!fs.existsSync(DB_DIR)) {
                fs.mkdirSync(DB_DIR, { recursive: true })
            }
            
            // Merge with existing
            const existing = storage.get()
            const newData = {
                assessments: data.assessments || existing.assessments || [],
                responses: data.responses || existing.responses || [],
                templates: data.templates || existing.templates || [],
                programs: data.programs || existing.programs || [],
                questions: data.questions || existing.questions || [],
                goals: data.goals || existing.goals || [],
                documents: data.documents || existing.documents || [],
                registrations: data.registrations || existing.registrations || [],
                messages: data.messages || existing.messages || [],
                audit_logs: data.audit_logs || existing.audit_logs || [],
                notifications: data.notifications || existing.notifications || [],
                settings: data.settings !== undefined ? data.settings : existing.settings || null,
                program_comments: data.program_comments || existing.program_comments || [],
                sectors: data.sectors || existing.sectors || []
            }
            
            fs.writeFileSync(DB_FILE, JSON.stringify(newData, null, 2))
            return true
        } catch (e) {
            console.error('[Storage] Failed to save storage:', e)
            return false
        }
    }
}
