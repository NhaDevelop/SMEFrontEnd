import { defineEventHandler } from 'h3'
import { db } from '~/server/utils/db'

export default defineEventHandler((event) => {
  return db.reportLogs.findAll()
})
