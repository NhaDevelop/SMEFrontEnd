<template>
  <div class="min-h-screen flex">
    <!-- Left Panel - IRIP Branding -->
    <div class="hidden lg:flex lg:w-1/2 bg-navy-900 text-white p-12 flex-col justify-between">
      <div>
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-12">
          <div class="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
            <ChartBarSquareIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold">IRIP</h1>
            <p class="text-sm text-gray-400">Investment Readiness Platform</p>
          </div>
        </div>

        <!-- Main Heading -->
        <div class="mb-8">
          <h2 class="text-4xl font-bold mb-4 leading-tight">
            Measure, Track & Improve<br />Investment Readiness
          </h2>
          <p class="text-gray-300 text-lg">
            A comprehensive platform to assess SME investment readiness across 8 key pillars, 
            identify gaps, and track progress towards investor readiness.
          </p>
        </div>

        <!-- 8 Pillars Grid -->
        <div class="grid grid-cols-2 gap-4">
          <div 
            v-for="pillar in pillars" 
            :key="pillar"
            class="flex items-center gap-2 text-sm"
          >
            <div class="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
            <span class="text-gray-300">{{ pillar }}</span>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="text-sm text-gray-500">
        © 2024 Investment Readiness Intelligence Platform
      </div>
    </div>

    <!-- Right Panel - Role Selection -->
    <div class="flex-1 flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex items-center gap-3 mb-8">
          <div class="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
            <ChartBarSquareIcon class="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 class="text-xl font-bold text-gray-900">IRIP</h1>
            <p class="text-sm text-gray-600">Investment Readiness Platform</p>
          </div>
        </div>

        <!-- Welcome Text -->
        <div class="mb-8">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p class="text-gray-600">Select your role to access the platform</p>
        </div>

        <!-- Role Cards -->
        <div class="space-y-4">
          <RoleCard
            role="sme_user"
            title="SME User"
            description="Access your investment readiness dashboard and improvement actions"
            icon-color="cyan"
            @select="handleRoleSelect"
          />

          <RoleCard
            role="investor"
            title="Investor / Program"
            description="View portfolio overview, compare SMEs, and analyze opportunities"
            icon-color="green"
            @select="handleRoleSelect"
          />

          <RoleCard
            role="administrator"
            title="Administrator"
            description="Manage users, programs, and assessment framework settings"
            icon-color="purple"
            @select="handleRoleSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ChartBarSquareIcon } from '@heroicons/vue/24/solid'
import RoleCard from '@/components/RoleCard.vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

export default {
  name: 'LandingPage',
  components: {
    ChartBarSquareIcon,
    RoleCard
  },
  setup() {
    const userStore = useUserStore()
    const router = useRouter()

    const pillars = [
      'Team & Leadership',
      'Business Model',
      'Market & Traction',
      'Financial Readiness',
      'Operations',
      'Legal & Governance',
      'Digital Maturity',
      'Growth & Scalability'
    ]

    const handleRoleSelect = (role) => {
      userStore.login(role)
      
      // Navigate based on role
      if (role === 'sme_user') {
        router.push('/dashboard')
      } else if (role === 'investor') {
        // Future: investor dashboard
        router.push('/dashboard')
      } else if (role === 'administrator') {
        // Future: admin dashboard
        router.push('/dashboard')
      }
    }

    return {
      pillars,
      handleRoleSelect
    }
  }
}
</script>
