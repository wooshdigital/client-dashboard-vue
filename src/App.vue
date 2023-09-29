<template>
  <div id="app" class="min-vh-100">
    <Sidebar v-if="isAuthenticated" />
    <div :class="{ 'main-content': isAuthenticated, 'full-width': !isAuthenticated }">
      <Navbar v-if="isAuthenticated" />
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from 'vuex'
import Sidebar from '@/components/layout/Sidebar.vue'
import Navbar from '@/components/layout/Navbar.vue'

export default defineComponent({
  name: 'App',
  components: {
    Sidebar,
    Navbar
  },
  setup() {
    const store = useStore()
    
    const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
    
    return {
      isAuthenticated
    }
  }
})
</script>

<style>
#app {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
}

.main-content {
  margin-left: 250px;
  min-height: 100vh;
}

.full-width {
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
