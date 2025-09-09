<template>
  <view class="min-h-screen bg-gray-100">
    <!-- 顶部导航 -->
    <top-nav />
    
    <!-- 页面内容 -->
    <view class="container mx-auto px-4 py-6">
      <text class="text-xl font-bold">志愿填报</text>
      <!-- 志愿填报具体内容 -->
      <view class="mt-6 space-y-6">
        <!-- 填报指南卡片 -->
        <view class="bg-white p-5 rounded-lg shadow-sm" @click="navigateTo('guide', { type: 'application' })">
          <text class="text-base font-medium">志愿填报指南</text>
          <text class="text-gray-500 text-sm block mt-1">包含填报流程、注意事项及常见问题解答</text>
          <view class="flex justify-end mt-3">
            <text class="text-blue-500 text-sm">查看详情 →</text>
          </view>
        </view>
        
        <!-- 专业介绍卡片 -->
        <view class="bg-white p-5 rounded-lg shadow-sm" @click="navigateTo('major-list')">
          <text class="text-base font-medium">专业介绍</text>
          <text class="text-gray-500 text-sm block mt-1">各学院专业设置、培养方案及就业方向</text>
          <view class="flex justify-end mt-3">
            <text class="text-blue-500 text-sm">查看详情 →</text>
          </view>
        </view>
        
        <!-- 历年分数线卡片 -->
        <view class="bg-white p-5 rounded-lg shadow-sm" @click="navigateTo('score-line')">
          <text class="text-base font-medium">历年录取分数线</text>
          <text class="text-gray-500 text-sm block mt-1">近五年各批次、各专业录取分数参考</text>
          <view class="flex justify-end mt-3">
            <text class="text-blue-500 text-sm">查看详情 →</text>
          </view>
        </view>
        
        <!-- 填报时间表 -->
        <view class="bg-blue-50 p-5 rounded-lg border border-blue-100">
          <text class="text-base font-medium text-blue-700">填报时间安排</text>
          <view class="mt-2 space-y-2">
            <view class="flex justify-between">
              <text class="text-sm">提前批志愿填报：</text>
              <text class="text-sm font-medium">6月25日-6月28日</text>
            </view>
            <view class="flex justify-between">
              <text class="text-sm">本科批志愿填报：</text>
              <text class="text-sm font-medium">6月30日-7月5日</text>
            </view>
            <view class="flex justify-between">
              <text class="text-sm">专科批志愿填报：</text>
              <text class="text-sm font-medium">7月8日-7月12日</text>
            </view>
          </view>
        </view>
      </view>
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
    console.log('志愿填报页面加载')
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
.container {
  max-width: 1200rpx;
}
</style>