<template>
  <div class="dashboard p-4">
    <div class="row mb-4">
      <div class="col-12">
        <h1 class="h3 mb-3">Dashboard Overview</h1>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3 mb-3">
        <StatsCard
          title="Total Clients"
          :value="dashboardStats.totalClients"
          icon="fas fa-users"
          color="primary"
          :trend="dashboardStats.clientsTrend"
        />
      </div>
      <div class="col-md-3 mb-3">
        <StatsCard
          title="Active Websites"
          :value="dashboardStats.activeWebsites"
          icon="fas fa-globe"
          color="success"
          :trend="dashboardStats.websitesTrend"
        />
      </div>
      <div class="col-md-3 mb-3">
        <StatsCard
          title="Avg Uptime"
          :value="`${dashboardStats.avgUptime}%`"
          icon="fas fa-chart-line"
          color="info"
          :trend="dashboardStats.uptimeTrend"
        />
      </div>
      <div class="col-md-3 mb-3">
        <StatsCard
          title="Monthly Revenue"
          :value="`$${dashboardStats.monthlyRevenue.toLocaleString()}`"
          icon="fas fa-dollar-sign"
          color="warning"
          :trend="dashboardStats.revenueTrend"
        />
      </div>
    </div>

    <!-- Charts Row -->
    <div class="row mb-4">
      <div class="col-lg-8 mb-3">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">Website Performance Overview</h5>
          </div>
          <div class="card-body">
            <PerformanceChart :data="performanceData" />
          </div>
        </div>
      </div>
      <div class="col-lg-4 mb-3">
        <div class="card h-100">
          <div class="card-header">
            <h5 class="card-title mb-0">Client Status Distribution</h5>
          </div>
          <div class="card-body">
            <ClientStatusChart :data="clientStatusData" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity & Alerts -->
    <div class="row">
      <div class="col-lg-6 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Recent Activity</h5>
            <router-link to="/activity" class="btn btn-sm btn-outline-primary">
              View All
            </router-link>
          </div>
          <div class="card-body">
            <RecentActivity :activities="recentActivities" />
          </div>
        </div>
      </div>
      <div class="col-lg-6 mb-3">
        <div class="card h-100">
          <div class="card-header d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">System Alerts</h5>
            <router-link to="/alerts" class="btn btn-sm btn-outline-danger">
              View All
            </router-link>
          </div>
          <div class="card-body">
            <AlertsList :alerts="systemAlerts" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '@/components/dashboard/StatsCard.vue'
import PerformanceChart from '@/components/charts/PerformanceChart.vue'
import ClientStatusChart from '@/components/charts/ClientStatusChart.vue'
import RecentActivity from '@/components/dashboard/RecentActivity.vue'
import AlertsList from '@/components/dashboard/AlertsList.vue'
import DashboardService from '@/services/DashboardService'

export default defineComponent({
  name: 'Dashboard',
  components: {
    StatsCard,
    PerformanceChart,
    ClientStatusChart,
    RecentActivity,
    AlertsList
  },
  setup() {
    const store = useStore()
    const loading = ref(true)
    
    const dashboardStats = ref({
      totalClients: 0,
      activeWebsites: 0,
      avgUptime: 0,
      monthlyRevenue: 0,
      clientsTrend: { value: 0, direction: 'up' },
      websitesTrend: { value: 0, direction: 'up' },
      uptimeTrend: { value: 0, direction: 'up' },
      revenueTrend: { value: 0, direction: 'up' }
    })
    
    const performanceData = ref([])
    const clientStatusData = ref([])
    const recentActivities = ref([])
    const systemAlerts = ref([])
    
    const loadDashboardData = async () => {
      try {
        loading.value = true
        
        const [statsResponse, performanceResponse, activitiesResponse, alertsResponse] = await Promise.all([
          DashboardService.getStats(),
          DashboardService.getPerformanceData(),
          DashboardService.getRecentActivities(),
          DashboardService.getSystemAlerts()
        ])
        
        dashboardStats.value = statsResponse.data
        performanceData.value = performanceResponse.data
        recentActivities.value = activitiesResponse.data
        systemAlerts.value = alertsResponse.data
        
        // Mock client status data
        clientStatusData.value = [
          { label: 'Active', value: 45, color: '#28a745' },
          { label: 'Inactive', value: 8, color: '#6c757d' },
          { label: 'Suspended', value: 2, color: '#dc3545' }
        ]
        
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        store.dispatch('setError', 'Failed to load dashboard data')
      } finally {
        loading.value = false
      }
    }
    
    onMounted(() => {
      loadDashboardData()
    })
    
    return {
      loading,
      dashboardStats,
      performanceData,
      clientStatusData,
      recentActivities,
      systemAlerts
    }
  }
})
</script>

<style scoped>
.dashboard {
  background-color: #f8f9fa;
  min-height: calc(100vh - 70px);
}

.card {
  border: none;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  transition: box-shadow 0.15s ease-in-out;
}

.card:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.card-header {
  background-color: #fff;
  border-bottom: 1px solid #e9ecef;
  font-weight: 600;
}
</style>