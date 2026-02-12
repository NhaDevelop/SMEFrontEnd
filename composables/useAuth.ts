export const useAuth = () => {
    const authStore = useAuthStore()
    const router = useRouter()

    const login = async (credentials: any) => {
        await authStore.login(credentials)
        if (authStore.user?.role === 'ADMIN') router.push('/admin')
        else if (authStore.user?.role === 'INVESTOR') router.push('/investor')
        else router.push('/sme')
    }

    const logout = async () => {
        await authStore.logout()
        router.push('/')
    }

    return {
        user: computed(() => authStore.user),
        isAuthenticated: computed(() => authStore.isAuthenticated),
        loading: computed(() => authStore.loading),
        error: computed(() => authStore.error),
        role: computed(() => authStore.role),
        login,
        logout
    }
}
