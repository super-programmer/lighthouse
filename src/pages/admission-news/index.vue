<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <top-nav />
    
    <!-- 页面内容 -->
    <view class="container mx-auto px-4 py-6">
      <text class="text-xl font-bold">招生动态</text>
      <!-- 页面具体内容 -->
    </view>
    
    <!-- 底部组件 -->
    <footer 
      @show-agreement="navigateTo('agreement')"
      @show-privacy="navigateTo('privacy')"
      @contact-us="navigateTo('contact')"
    />
  </view>
</template>

<script>
import TopNav from '@/components/TopNav.vue'
import Footer from '@/components/Footer.vue'

export default {
  components: {
    TopNav,
    Footer
  },
  onLoad() {
    // 页面初始化逻辑
    console.log('招生动态页面加载')
  },
  methods: {
    navigateTo(page, params = {}) {
      // 复用导航逻辑（与index.vue保持一致）
      let url = `/${page}`
      const queryParams = Object.entries(params)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&')
      
      if (queryParams) {
        url += `?${queryParams}`
      }
      
      uni.navigateTo({ url })
    }
  }
}
</script>

<style scoped>
/* 页面专属样式 */
</style>