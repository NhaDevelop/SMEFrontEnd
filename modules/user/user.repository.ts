export class AdminRepository {
  async getUsersData(): Promise<any> {
    return await $fetch('/api/admin/users')
  }

  async getProgramsData(): Promise<any> {
    return await $fetch('/api/admin/programs')
  }

  async createProgram(programData: any): Promise<any> {
    return await $fetch('/api/admin/programs', {
      method: 'POST',
      body: programData
    })
  }
}
