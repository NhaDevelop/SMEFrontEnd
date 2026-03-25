/**
 * admin/index.ts — Backward-compatible barrel export for admin stores
 *
 * Existing pages that import `useAdminStore` from `~/stores/admin.store`
 * will continue to work. Over time, pages can be updated to import
 * the specific focused store they need for better tree-shaking and clarity.
 *
 * Usage going forward (preferred, per focused domain):
 *   import { useAdminUsersStore }    from '~/stores/admin/admin.users.store'
 *   import { useAdminProgramsStore } from '~/stores/admin/admin.programs.store'
 *   import { useAdminFrameworkStore } from '~/stores/admin/admin.framework.store'
 *   import { useAdminReportsStore }  from '~/stores/admin/admin.reports.store'
 */
export { useAdminUsersStore }    from './admin.users.store'
export { useAdminProgramsStore } from './admin.programs.store'
export { useAdminFrameworkStore } from './admin.framework.store'
export { useAdminReportsStore }  from './admin.reports.store'
